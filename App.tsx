import React, { useState } from 'react';
import { ChessBoard } from './components/ChessBoard';
import { InfoPanel } from './components/InfoPanel';
import { PromotionModal } from './components/PromotionModal';
import { GameOverModal } from './components/GameOverModal';
import { HelpModal } from './components/HelpModal';
import { PeerRoomPanel } from './components/PeerRoomPanel';
import { useChessGame } from './hooks/useChessGame';
import { usePeerRoom } from './hooks/usePeerRoom';
import { RotateCcw, Play, CircleHelp, ArrowUpDown, Trash2, Lightbulb } from 'lucide-react';
import { Square } from 'chess.js';

const App: React.FC = () => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const {
    game,
    gameState,
    lastMove,
    pendingPromotion,
    orientation,
    showMoveHelp,
    handleMove,
    finalizePromotion,
    resetGame,
    clearSavedGame,
    handleLoadFen,
    undoMove,
    toggleOrientation,
    setBoardOrientation,
    toggleMoveHelp,
    setPendingPromotion,
  } = useChessGame();

  const peerRoom = usePeerRoom({
    currentFen: gameState.fen,
    onRemoteFen: handleLoadFen,
    onRoleSelected: setBoardOrientation,
  });

  const canMoveOnline = !peerRoom.isConnected
    || (peerRoom.myRole === 'white' && gameState.turn === 'w')
    || (peerRoom.myRole === 'black' && gameState.turn === 'b');

  const handleBoardMove = (from: Square, to: Square) => {
    if (!canMoveOnline) return;

    const nextFen = handleMove(from, to);
    if (nextFen) {
      peerRoom.sendMoveSync(nextFen);
    }
  };

  const handlePromotionSelect = (promotionPiece: 'q' | 'r' | 'b' | 'n') => {
    if (!canMoveOnline) return;

    const nextFen = finalizePromotion(promotionPiece);
    if (nextFen) {
      peerRoom.sendMoveSync(nextFen);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center pt-8">
        
        {/* Left Column: Board & Controls */}
        <div className="w-full lg:flex-1 flex flex-col gap-6">
          
          <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200 gap-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white">
                 <Play size={24} fill="white" />
               </div>
               <div>
                 <h1 className="text-xl font-bold leading-tight">Easy Chess Room</h1>
                 <p className="text-xs text-slate-500">Gioco locale nel browser</p>
               </div>
             </div>
             
             <div className="flex gap-2">
                <button 
                  onClick={() => setIsHelpOpen(true)}
                  className="px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-transparent hover:border-slate-200"
                  title="Come funziona"
                >
                  <CircleHelp size={18} />
                  <span className="hidden sm:inline">Guida</span>
                </button>
                <div className="w-px h-8 bg-slate-200 mx-1"></div>
                <button 
                  onClick={toggleOrientation}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex flex-col items-center gap-1"
                  title="Ruota scacchiera"
                >
                  <ArrowUpDown size={20} />
                </button>
                <button
                  onClick={toggleMoveHelp}
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold border ${
                    showMoveHelp
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-transparent hover:border-slate-200'
                  }`}
                  title={showMoveHelp ? 'Disattiva aiuto mosse' : 'Attiva aiuto mosse'}
                  aria-pressed={showMoveHelp}
                >
                  <Lightbulb size={18} />
                  <span className="hidden sm:inline">Aiuto mosse</span>
                  <span className="text-[10px] uppercase tracking-wide">{showMoveHelp ? 'On' : 'Off'}</span>
                </button>
                <button 
                  onClick={undoMove}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex flex-col items-center gap-1"
                  title="Annulla mossa"
                >
                  <RotateCcw size={20} />
                </button>
                <button
                  onClick={clearSavedGame}
                  className="p-2 text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex flex-col items-center gap-1"
                  title="Cancella salvataggio locale e nuova partita"
                >
                  <Trash2 size={20} />
                </button>
                <button 
                  onClick={resetGame}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm active:transform active:scale-95"
                >
                  Nuova partita
                </button>
             </div>
          </div>

          <div className="w-full relative">
            <ChessBoard 
              game={game} 
              fen={gameState.fen} 
              onMove={handleBoardMove}
              lastMove={lastMove}
              orientation={orientation}
              isGameOver={gameState.isGameOver}
              showMoveHelp={showMoveHelp}
              canMove={canMoveOnline}
            />
          </div>

          <div className="text-center text-xs text-slate-400">
            Trascina i pezzi o seleziona due caselle. Regole gestite da chess.js.
          </div>
        </div>

        {/* Right Column: Info Panel */}
        <div className="w-full lg:w-auto">
          <div className="mb-4">
            <PeerRoomPanel
              connectionStatus={peerRoom.connectionStatus}
              isConnected={peerRoom.isConnected}
              roomName={peerRoom.roomName}
              selfId={peerRoom.selfId}
              peerIds={peerRoom.peerIds}
              whitePlayerId={peerRoom.whitePlayerId}
              blackPlayerId={peerRoom.blackPlayerId}
              myRole={peerRoom.myRole}
              notice={peerRoom.notice}
              onJoinRoom={peerRoom.joinPeerRoom}
              onLeaveRoom={peerRoom.leavePeerRoom}
              onClaimRole={peerRoom.claimRole}
            />
          </div>
          <InfoPanel 
            gameState={gameState} 
            onCopy={handleCopy} 
            copiedType={copiedType}
            onLoadFen={handleLoadFen}
          />
        </div>

      </div>

      {/* Modals */}
      {pendingPromotion && (
        <PromotionModal 
          color={pendingPromotion.color} 
          onSelect={handlePromotionSelect} 
          onCancel={() => setPendingPromotion(null)} 
        />
      )}

      {/* Game Over Modal */}
      {(gameState.isCheckmate || gameState.isDraw) && (
        <GameOverModal 
          gameState={gameState} 
          onRestart={resetGame} 
        />
      )}

      {/* Help Modal */}
      {isHelpOpen && (
        <HelpModal onClose={() => setIsHelpOpen(false)} />
      )}
    </div>
  );
};

export default App;
