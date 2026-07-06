import React, { useEffect, useState } from 'react';
import { LogIn, LogOut, Radio, UserRound, UsersRound } from 'lucide-react';
import { OnlineRole, PeerConnectionStatus } from '../types';

interface PeerRoomPanelProps {
  connectionStatus: PeerConnectionStatus;
  isConnected: boolean;
  roomName: string;
  selfId: string;
  peerIds: string[];
  whitePlayerId: string | null;
  blackPlayerId: string | null;
  myRole: OnlineRole;
  notice: string | null;
  onJoinRoom: (roomName: string) => boolean;
  onLeaveRoom: () => void;
  onClaimRole: (role: 'white' | 'black') => void;
}

const LAST_ROOM_KEY = 'easy-chess-room:last-peer-room';

const shortPeerId = (peerId: string | null) => {
  if (!peerId) return 'Libero';
  return `${peerId.slice(0, 6)}...${peerId.slice(-4)}`;
};

const roleLabel = (role: OnlineRole) => {
  if (role === 'white') return 'Bianco';
  if (role === 'black') return 'Nero';
  if (role === 'spectator') return 'Spettatore';
  return 'Offline';
};

const statusLabel = (status: PeerConnectionStatus) => {
  if (status === 'connected') return 'Connesso';
  if (status === 'connecting') return 'Connessione...';
  if (status === 'error') return 'Errore';
  return 'Offline';
};

export const PeerRoomPanel: React.FC<PeerRoomPanelProps> = ({
  connectionStatus,
  isConnected,
  roomName,
  selfId,
  peerIds,
  whitePlayerId,
  blackPlayerId,
  myRole,
  notice,
  onJoinRoom,
  onLeaveRoom,
  onClaimRole,
}) => {
  const [roomInput, setRoomInput] = useState(() => window.localStorage.getItem(LAST_ROOM_KEY) || '');
  const whiteTakenByOther = Boolean(whitePlayerId && whitePlayerId !== selfId);
  const blackTakenByOther = Boolean(blackPlayerId && blackPlayerId !== selfId);

  useEffect(() => {
    if (roomName) setRoomInput(roomName);
  }, [roomName]);

  const handleJoin = () => {
    const joined = onJoinRoom(roomInput);
    if (joined) {
      window.localStorage.setItem(LAST_ROOM_KEY, roomInput.trim());
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-2 font-bold text-slate-800">
            <Radio size={18} className="shrink-0 text-blue-600" />
            Modalità stanza peer-to-peer
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Sperimentale: sincronizza la posizione tramite FEN.
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-bold ${
          isConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {statusLabel(connectionStatus)}
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={roomInput}
          onChange={(event) => setRoomInput(event.target.value)}
          disabled={isConnected}
          className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          placeholder="Nome stanza"
        />
        {isConnected ? (
          <button
            onClick={onLeaveRoom}
            className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            <LogOut size={16} />
            Esci
          </button>
        ) : (
          <button
            onClick={handleJoin}
            className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <LogIn size={16} />
            Entra
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
          <div className="text-slate-500">Il tuo ruolo</div>
          <div className="font-bold text-slate-800">{roleLabel(myRole)}</div>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
          <div className="text-slate-500">Peer connessi</div>
          <div className="font-bold text-slate-800">{peerIds.length}</div>
        </div>
      </div>

      {isConnected && (
        <>
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <UserRound size={14} className="shrink-0" />
            <span>Il tuo ID:</span> <span className="min-w-0 break-all font-mono text-slate-700">{shortPeerId(selfId)}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => onClaimRole('white')}
              disabled={whiteTakenByOther}
              className="min-h-16 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="text-sm font-bold text-slate-800">Gioca come Bianco</div>
              <div className="text-xs text-slate-500 mt-1">{shortPeerId(whitePlayerId)}</div>
            </button>
            <button
              onClick={() => onClaimRole('black')}
              disabled={blackTakenByOther}
              className="min-h-16 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="text-sm font-bold text-slate-800">Gioca come Nero</div>
              <div className="text-xs text-slate-500 mt-1">{shortPeerId(blackPlayerId)}</div>
            </button>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-500">
            <UsersRound size={14} className="mt-0.5 shrink-0" />
            Spettatori e peer extra possono vedere la partita ma non muovere.
          </div>
        </>
      )}

      {notice && (
        <div className="text-xs text-slate-600 bg-blue-50 border border-blue-100 rounded-lg p-2">
          {notice}
        </div>
      )}
    </div>
  );
};
