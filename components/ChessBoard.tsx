import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { PIECE_SVGS } from '../constants';

interface ChessBoardProps {
  game: Chess;
  fen: string; // Used to trigger re-renders
  onMove: (from: Square, to: Square) => void;
  lastMove: { from: Square; to: Square } | null;
  orientation?: 'white' | 'black';
  isGameOver: boolean;
  showMoveHelp: boolean;
  canMove: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({ game, fen, onMove, lastMove, orientation = 'white', isGameOver, showMoveHelp, canMove }) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [draggedSquare, setDraggedSquare] = useState<Square | null>(null);

  // Reset selection when FEN changes (move made externally or internally)
  useEffect(() => {
    setSelectedSquare(null);
    setPossibleMoves([]);
  }, [fen]);

  const getPieceAt = (square: Square) => {
    return game.get(square);
  };

  const handleSquareClick = (square: Square) => {
    if (isGameOver || !canMove) return;

    // If clicking a square we can move to, do the move
    if (selectedSquare && possibleMoves.includes(square)) {
      onMove(selectedSquare, square);
      return;
    }

    const piece = getPieceAt(square);
    
    // If clicking our own piece, select it
    if (piece && piece.color === game.turn()) {
      if (selectedSquare === square) {
        // Deselect if clicking same piece
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else {
        setSelectedSquare(square);
        const moves = game.moves({ square: square, verbose: true });
        setPossibleMoves(moves.map(m => m.to as Square));
      }
    } else {
      // Clicking empty square or enemy piece without valid move
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  // --- Drag and Drop Handlers ---

  const handleDragStart = (e: React.DragEvent, square: Square) => {
    if (isGameOver || !canMove) {
      e.preventDefault();
      return;
    }

    const piece = getPieceAt(square);
    if (!piece || piece.color !== game.turn()) {
      e.preventDefault();
      return;
    }
    setDraggedSquare(square);
    
    // Visual feedback for mobile/desktop
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', square);
    
    // Highlight possible moves immediately on drag start
    const moves = game.moves({ square: square, verbose: true });
    setPossibleMoves(moves.map(m => m.to as Square));
    setSelectedSquare(square);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSquare: Square) => {
    e.preventDefault();
    if (isGameOver) return;

    const fromSquare = e.dataTransfer.getData('text/plain') as Square;
    
    // Need to verify source because dragging external text could trigger this
    if (fromSquare && fromSquare.length === 2) {
      onMove(fromSquare, targetSquare);
    }
    
    setDraggedSquare(null);
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  const handleDragEnd = () => {
    setDraggedSquare(null);
    // Don't clear selection immediately in case they missed the drop, allows click-to-move fallback
  };

  // Generate the board grid
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  if (orientation === 'black') {
    files.reverse();
    ranks.reverse();
  }

  return (
    <div className={`mx-auto aspect-square w-full max-w-[min(600px,calc(100vw-1rem))] select-none touch-none overflow-hidden rounded-lg border-2 border-slate-700 shadow-xl sm:border-4 ${isGameOver ? 'opacity-90 grayscale-[20%]' : ''}`}>
      <div className="grid grid-cols-8 grid-rows-8 h-full">
        {ranks.map((rank, rIndex) => 
          files.map((file, fIndex) => {
            const square = `${file}${rank}` as Square;
            const isLight = (rIndex + fIndex) % 2 === 0;
            const piece = getPieceAt(square);
            const isSelected = selectedSquare === square;
            const isLastMoveFrom = lastMove?.from === square;
            const isLastMoveTo = lastMove?.to === square;
            const isPossibleMove = possibleMoves.includes(square);
            const isCheckSquare = piece?.type === 'k' && piece?.color === game.turn() && game.inCheck();

            // Dynamic Styling
            let bgClass = isLight ? 'bg-[#ebecd0]' : 'bg-[#779556]'; // Standard Green/Cream
            
            if (isLastMoveFrom || isLastMoveTo) {
               bgClass = isLight ? 'bg-yellow-200' : 'bg-yellow-600'; // Highlight last move
            }
            
            if (isSelected) {
               bgClass = 'bg-[#bbc15e]'; // Highlight selected
            }

            if (isCheckSquare) {
               bgClass = 'bg-red-400 radial-gradient(circle, rgba(255,0,0,0.8) 0%, rgba(255,0,0,0) 70%)';
            }

            return (
              <div
                key={square}
                className={`relative w-full h-full flex items-center justify-center ${bgClass} ${isGameOver || !canMove ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => handleSquareClick(square)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, square)}
              >
                {/* Coordinates (optional, only show on edges) */}
                {fIndex === 0 && (
                   <span className={`absolute left-0.5 top-0.5 text-[8px] font-bold sm:left-1 sm:text-[10px] ${isLight ? 'text-[#779556]' : 'text-[#ebecd0]'}`}>
                     {rank}
                   </span>
                )}
                {rIndex === 7 && (
                   <span className={`absolute bottom-0.5 right-0.5 text-[8px] font-bold sm:right-1 sm:text-[10px] ${isLight ? 'text-[#779556]' : 'text-[#ebecd0]'}`}>
                     {file}
                   </span>
                )}

                {/* Legal move indicators, visible only when move help is enabled. */}
                {showMoveHelp && isPossibleMove && !piece && !isGameOver && (
                  <div className="pointer-events-none absolute h-2.5 w-2.5 rounded-full bg-slate-900/25 shadow-sm sm:h-3 sm:w-3" />
                )}
                {showMoveHelp && isPossibleMove && piece && !isGameOver && (
                   <div className="pointer-events-none absolute inset-[10%] rounded-full border-4 border-slate-900/20 shadow-inner sm:border-[5px]" />
                )}

                {/* The Piece */}
                {piece && (
                  <div
                    className={`w-[90%] h-[90%] transition-transform 
                      ${draggedSquare === square ? 'opacity-0' : 'opacity-100'} 
                      ${!isGameOver && canMove && piece.color === game.turn() ? 'cursor-grab active:cursor-grabbing hover:scale-105' : ''}
                    `}
                    draggable={!isGameOver && canMove}
                    onDragStart={(e) => handleDragStart(e, square)}
                    onDragEnd={handleDragEnd}
                  >
                     {PIECE_SVGS[`${piece.color}${piece.type.toUpperCase()}`]}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
