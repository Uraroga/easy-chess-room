import React from 'react';
import { Color } from 'chess.js';
import { PIECE_SVGS } from '../constants';

interface PromotionModalProps {
  color: Color;
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
  onCancel: () => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ color, onSelect, onCancel }) => {
  const pieces = ['q', 'r', 'b', 'n'] as const;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4">
        <h3 className="text-xl font-bold text-center mb-6 text-gray-800">Scegli la promozione</h3>
        <div className="flex justify-between gap-2">
          {pieces.map((p) => (
            <button
              key={p}
              onClick={() => onSelect(p)}
              className="w-16 h-16 p-2 bg-gray-50 hover:bg-blue-100 border-2 border-transparent hover:border-blue-500 rounded-lg transition-all flex items-center justify-center"
            >
              <div className="w-full h-full">
                {PIECE_SVGS[`${color}${p.toUpperCase()}`]}
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          className="mt-6 w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
        >
          Annulla
        </button>
      </div>
    </div>
  );
};
