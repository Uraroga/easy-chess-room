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
    <div className="min-h-screen overflow-x-hidden bg-slate-100 px-2 py-3 font-sans text-slate-900 sm:p-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 pt-2 sm:gap-6 sm:pt-6 lg:flex-row lg:items-start lg:justify-center lg:gap-8">
        
        {/* Left Column: Board & Controls */}
        <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-6 lg:flex-1">
          
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 md:flex-row md:flex-wrap md:items-center md:justify-between">
             <div className="flex min-w-0 items-center gap-3">
               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white">
                 <Play size={24} fill="white" />
               </div>
               <div className="min-w-0">
                 <h1 className="truncate text-lg font-bold leading-tight sm:text-xl">Easy Chess Room</h1>
                 <p className="text-xs text-slate-500">Gioco locale nel browser</p>
               </div>
             </div>
             
             <div className="flex w-full min-w-0 flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:items-center md:justify-end">
                <div className="flex min-w-0 flex-wrap gap-2">
                  <button 
                    onClick={() => setIsHelpOpen(true)}
                    className="flex min-h-10 items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-200 hover:bg-slate-100"
                    title="Come funziona"
                  >
                    <CircleHelp size={18} />
                    <span>Guida</span>
                  </button>
                  <div className="mx-1 hidden h-8 w-px bg-slate-200 md:block"></div>
                  <button 
                    onClick={toggleOrientation}
                    className="flex min-h-10 min-w-10 items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    title="Ruota scacchiera"
                  >
                    <ArrowUpDown size={20} />
                  </button>
                  <button
                    onClick={toggleMoveHelp}
                    className={`flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
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
                    className="flex min-h-10 min-w-10 items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    title="Annulla mossa"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button
                    onClick={clearSavedGame}
                    className="flex min-h-10 min-w-10 items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
                    title="Cancella salvataggio locale e nuova partita"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <button 
                  onClick={resetGame}
                  className="min-h-11 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 active:scale-95 md:min-h-10 md:w-auto"
                >
                  Nuova partita
                </button>
             </div>
          </div>

          <div className="lg:hidden">
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

          <div className="relative w-full min-w-0">
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

          <div className="px-2 text-center text-xs text-slate-400">
            Trascina i pezzi o seleziona due caselle. Regole gestite da chess.js.
          </div>
        </div>

        {/* Right Column: Info Panel */}
        <div className="w-full min-w-0 lg:w-80 lg:shrink-0">
          <div className="mb-4 hidden lg:block">
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
