import React from 'react';
import { GameState } from '../types';
import { Trophy, RefreshCcw, Handshake } from 'lucide-react';

interface GameOverModalProps {
  gameState: GameState;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ gameState, onRestart }) => {
  const { isCheckmate, isDraw, turn } = gameState;

  if (!isCheckmate && !isDraw) return null;

  const winner = isCheckmate ? (turn === 'w' ? 'Nero' : 'Bianco') : null;
  const title = isCheckmate ? "Scacco matto" : "Partita conclusa";
  const subtitle = isCheckmate 
    ? `Vince il ${winner}.` 
    : "La partita è finita in patta.";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all scale-100">
        
        <div className="flex justify-center mb-6">
          {isCheckmate ? (
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center border-4 border-yellow-200">
              <Trophy size={40} className="text-yellow-600" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-4 border-gray-200">
              <Handshake size={40} className="text-gray-600" />
            </div>
          )}
        </div>

        <h2 className="text-3xl font-black text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-600 mb-8 text-lg">{subtitle}</p>

        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
        >
          <RefreshCcw size={20} />
          Nuova partita
        </button>
      </div>
    </div>
  );
};
