import React, { useState } from 'react';
import { GameState } from '../types';
import { Copy, ClipboardCheck, ArrowDownToLine, AlertCircle, Coffee, Download } from 'lucide-react';

interface InfoPanelProps {
  gameState: GameState;
  onCopy: (text: string, type: string) => void;
  copiedType: string | null;
  onLoadFen: (fen: string) => boolean;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ gameState, onCopy, copiedType, onLoadFen }) => {
  const { turn, inCheck, isCheckmate, isDraw, fen, history, uciHistory, pgn } = gameState;
  const [importFen, setImportFen] = useState('');
  const [fenError, setFenError] = useState<string | null>(null);

  const handleFenSubmit = () => {
    if (!importFen.trim()) return;
    
    const success = onLoadFen(importFen.trim());
    if (success) {
      setImportFen('');
      setFenError(null);
    } else {
      setFenError('FEN non valido. Controlla la stringa incollata.');
    }
  };

  const sideToMove = turn === 'w' ? 'Bianco' : 'Nero';
  const winner = turn === 'w' ? 'Nero' : 'Bianco';
  let statusText = `Tocca al ${sideToMove}`;
  let statusColor = "bg-blue-100 text-blue-800 border-blue-200";

  if (isCheckmate) {
    statusText = `Scacco matto. Vince il ${winner}`;
    statusColor = "bg-red-100 text-red-800 border-red-200";
  } else if (inCheck) {
    statusText = `${sideToMove} sotto scacco`;
    statusColor = "bg-orange-100 text-orange-800 border-orange-200";
  } else if (isDraw) {
    statusText = "Patta";
    statusColor = "bg-gray-100 text-gray-800 border-gray-200";
  }

  const buildExportText = () => {
    return [
      'Easy Chess Room',
      '',
      `FEN corrente:`,
      fen,
      '',
      'Cronologia mosse (SAN):',
      history.length ? history.join(' ') : 'Nessuna mossa.',
      '',
      'Cronologia mosse (UCI):',
      uciHistory.length ? uciHistory.join(' ') : 'Nessuna mossa.',
      '',
      'PGN:',
      pgn || 'PGN non disponibile per posizioni importate solo da FEN.',
    ].join('\n');
  };

  const downloadGame = () => {
    const blob = new Blob([buildExportText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'easy-chess-room.txt';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const CopyButton = ({ text, type, label }: { text: string, type: string, label: string }) => (
    <button
      onClick={() => onCopy(text, type)}
      className="flex min-h-9 items-center justify-center gap-2 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
      title={`Copia ${label}`}
    >
      {copiedType === type ? <ClipboardCheck size={14} className="text-green-600" /> : <Copy size={14} />}
      {label}
    </button>
  );

  return (
    <div className="flex h-full w-full min-w-0 flex-col gap-4">
      {/* Game Status */}
      <div className={`p-4 rounded-xl border-l-4 shadow-sm ${statusColor}`}>
        <h2 className="text-base font-bold sm:text-lg">{statusText}</h2>
      </div>

      {/* History */}
      <div className="flex min-h-[220px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:min-h-[250px]">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50 p-3">
          <h3 className="font-semibold text-slate-700">Cronologia mosse</h3>
          <div className="flex gap-2">
            <CopyButton text={history.join(" ")} type="SAN" label="SAN" />
            <CopyButton text={uciHistory.join(" ")} type="UCI" label="UCI" />
          </div>
        </div>
        <div className="max-h-[260px] flex-1 overflow-y-auto p-0 sm:max-h-[300px]">
           {history.length === 0 ? (
             <div className="flex items-center justify-center h-full text-slate-400 italic text-sm">
               Nessuna mossa
             </div>
           ) : (
            <table className="w-full table-fixed text-left text-sm">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                <tr>
                  <th className="w-12 px-3 py-2 sm:w-16 sm:px-4">#</th>
                  <th className="px-3 py-2 sm:px-4">Bianco</th>
                  <th className="px-3 py-2 sm:px-4">Nero</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono text-xs text-slate-400 sm:px-4">{i + 1}.</td>
                    <td className="break-words px-3 py-2 font-medium text-slate-700 sm:px-4">{history[i * 2]}</td>
                    <td className="break-words px-3 py-2 font-medium text-slate-700 sm:px-4">{history[i * 2 + 1] || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
           )}
        </div>
      </div>

      {/* FEN Display */}
      <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase">FEN corrente</h3>
          <CopyButton text={fen} type="FEN" label="Copia" />
        </div>
        <div className="select-all break-all rounded border border-slate-200 bg-slate-100 p-2 font-mono text-xs text-slate-600">
          {fen}
        </div>
      </div>

      {/* FEN Import */}
      <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Importa FEN</h3>
        <textarea 
          className="mb-2 w-full min-w-0 resize-none rounded border border-slate-300 p-2 font-mono text-xs outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Incolla qui una stringa FEN..."
          value={importFen}
          onChange={(e) => {
            setImportFen(e.target.value);
            if(fenError) setFenError(null);
          }}
        />
        {fenError && (
          <div className="mb-2 flex items-center gap-1 text-xs text-red-600 font-medium animate-fadeIn">
            <AlertCircle size={14} />
            {fenError}
          </div>
        )}
        <button 
          onClick={handleFenSubmit}
          disabled={!importFen.trim()}
          className="flex min-h-10 w-full items-center justify-center gap-2 rounded bg-blue-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <ArrowDownToLine size={16} />
          Applica FEN
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <button
          onClick={downloadGame}
          className="flex min-h-10 w-full items-center justify-center gap-2 rounded bg-slate-800 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-900"
        >
          <Download size={16} />
          Scarica partita .txt
        </button>
      </div>

      {/* Donation Button */}
      <a 
        href="https://paypal.me/uraroga"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-center text-sm font-bold text-amber-800 shadow-sm transition-colors hover:bg-amber-100"
      >
        <Coffee size={18} className="text-amber-600 group-hover:scale-110 transition-transform" />
        Offri un caffè a uraroga
      </a>

      <p className="text-[10px] text-slate-400 text-center px-2">
        La modalità locale funziona nel browser. La stanza online è sperimentale e non usa backend dedicato.
      </p>
    </div>
  );
};
