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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Radio size={18} className="text-blue-600" />
            Modalità stanza peer-to-peer
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Sperimentale: sincronizza la posizione tramite FEN.
          </p>
        </div>
        <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${
          isConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {statusLabel(connectionStatus)}
        </span>
      </div>

      <div className="flex gap-2">
        <input
          value={roomInput}
          onChange={(event) => setRoomInput(event.target.value)}
          disabled={isConnected}
          className="min-w-0 flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100"
          placeholder="Nome stanza"
        />
        {isConnected ? (
          <button
            onClick={onLeaveRoom}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <LogOut size={16} />
            Esci
          </button>
        ) : (
          <button
            onClick={handleJoin}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
          >
            <LogIn size={16} />
            Entra
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
          <div className="text-slate-500">Il tuo ruolo</div>
          <div className="font-bold text-slate-800">{roleLabel(myRole)}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
          <div className="text-slate-500">Peer connessi</div>
          <div className="font-bold text-slate-800">{peerIds.length}</div>
        </div>
      </div>

      {isConnected && (
        <>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <UserRound size={14} />
            Il tuo ID: <span className="font-mono text-slate-700">{shortPeerId(selfId)}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => onClaimRole('white')}
              disabled={whiteTakenByOther}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-left transition-colors"
            >
              <div className="text-sm font-bold text-slate-800">Gioca come Bianco</div>
              <div className="text-xs text-slate-500 mt-1">{shortPeerId(whitePlayerId)}</div>
            </button>
            <button
              onClick={() => onClaimRole('black')}
              disabled={blackTakenByOther}
              className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-left transition-colors"
            >
              <div className="text-sm font-bold text-slate-800">Gioca come Nero</div>
              <div className="text-xs text-slate-500 mt-1">{shortPeerId(blackPlayerId)}</div>
            </button>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <UsersRound size={14} />
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
