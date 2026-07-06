import { useCallback, useEffect, useRef, useState } from 'react';
import { joinRoom, selfId, type MessageAction, type Room } from 'trystero';
import { OnlineColorRole, OnlineRole, PeerConnectionStatus, PeerMessage } from '../types';

const APP_ID = 'easy-chess-room';
const ACTION_NAME = 'chess-room';

const normalizeRoomName = (roomName: string) => {
  return roomName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '');
};

const roleLabel = (role: OnlineColorRole) => (role === 'white' ? 'Bianco' : 'Nero');

interface UsePeerRoomOptions {
  currentFen: string;
  onRemoteFen: (fen: string) => boolean;
  onRoleSelected?: (role: OnlineColorRole) => void;
}

export const usePeerRoom = ({ currentFen, onRemoteFen, onRoleSelected }: UsePeerRoomOptions) => {
  const roomRef = useRef<Room | null>(null);
  const actionRef = useRef<MessageAction<PeerMessage> | null>(null);
  const currentFenRef = useRef(currentFen);
  const rolesRef = useRef<{ whitePlayerId: string | null; blackPlayerId: string | null }>({
    whitePlayerId: null,
    blackPlayerId: null,
  });

  const [connectionStatus, setConnectionStatus] = useState<PeerConnectionStatus>('offline');
  const [roomName, setRoomName] = useState('');
  const [peerIds, setPeerIds] = useState<string[]>([]);
  const [whitePlayerId, setWhitePlayerId] = useState<string | null>(null);
  const [blackPlayerId, setBlackPlayerId] = useState<string | null>(null);
  const [myRole, setMyRole] = useState<OnlineRole>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    currentFenRef.current = currentFen;
  }, [currentFen]);

  const updateRoles = useCallback((white: string | null, black: string | null) => {
    rolesRef.current = { whitePlayerId: white, blackPlayerId: black };
    setWhitePlayerId(white);
    setBlackPlayerId(black);

    if (white === selfId) {
      setMyRole('white');
    } else if (black === selfId) {
      setMyRole('black');
    } else if (roomRef.current) {
      setMyRole('spectator');
    } else {
      setMyRole(null);
    }
  }, []);

  const sendMessage = useCallback((message: PeerMessage, target?: string) => {
    const action = actionRef.current;
    if (!action) return;

    action.send(message, target ? { target } : undefined).catch((error) => {
      console.warn('Invio messaggio peer-to-peer non riuscito.', error);
    });
  }, []);

  const sendRoleState = useCallback((target?: string, customNotice?: string) => {
    sendMessage(
      {
        type: 'role-state',
        peerId: selfId,
        whitePlayerId: rolesRef.current.whitePlayerId,
        blackPlayerId: rolesRef.current.blackPlayerId,
        notice: customNotice,
      },
      target,
    );
  }, [sendMessage]);

  const sendStateSync = useCallback((target?: string) => {
    sendMessage(
      {
        type: 'state-sync',
        peerId: selfId,
        fen: currentFenRef.current,
        whitePlayerId: rolesRef.current.whitePlayerId,
        blackPlayerId: rolesRef.current.blackPlayerId,
      },
      target,
    );
  }, [sendMessage]);

  const handlePeerGone = useCallback((peerId: string) => {
    const { whitePlayerId: currentWhite, blackPlayerId: currentBlack } = rolesRef.current;
    const leftRole = currentWhite === peerId ? 'white' : currentBlack === peerId ? 'black' : null;
    const nextWhite = currentWhite === peerId ? null : currentWhite;
    const nextBlack = currentBlack === peerId ? null : currentBlack;

    setPeerIds((current) => current.filter((id) => id !== peerId));
    updateRoles(nextWhite, nextBlack);

    if (leftRole) {
      setNotice(`Il giocatore ${roleLabel(leftRole)} è uscito.`);
    }
  }, [updateRoles]);

  const joinPeerRoom = useCallback((rawRoomName: string): boolean => {
    const normalizedRoomName = normalizeRoomName(rawRoomName);
    if (!normalizedRoomName) {
      setNotice('Inserisci un nome stanza valido.');
      return false;
    }

    if (roomRef.current) {
      setNotice('Sei già dentro una stanza. Esci prima di entrare in un’altra.');
      return false;
    }

    try {
      setConnectionStatus('connecting');
      const room = joinRoom({ appId: APP_ID }, normalizedRoomName);
      const action = room.makeAction<PeerMessage>(ACTION_NAME);

      roomRef.current = room;
      actionRef.current = action;
      setRoomName(normalizedRoomName);
      setPeerIds([]);
      updateRoles(null, null);
      setMyRole('spectator');
      setNotice(`Entrato nella stanza "${normalizedRoomName}".`);

      room.onPeerJoin = (peerId) => {
        setPeerIds((current) => (current.includes(peerId) ? current : [...current, peerId]));
      };

      room.onPeerLeave = (peerId) => {
        handlePeerGone(peerId);
      };

      action.onMessage = (message, context) => {
        if (!message || message.peerId === selfId) return;

        if (message.type === 'claim-role') {
          const { whitePlayerId: currentWhite, blackPlayerId: currentBlack } = rolesRef.current;

          if (message.role === 'white') {
            if (!currentWhite || currentWhite === message.peerId) {
              updateRoles(message.peerId, currentBlack);
              setNotice(`Un peer ha scelto il Bianco.`);
              sendRoleState();
            } else {
              sendRoleState(message.peerId, 'Il ruolo Bianco è già occupato.');
            }
          }

          if (message.role === 'black') {
            if (!currentBlack || currentBlack === message.peerId) {
              updateRoles(currentWhite, message.peerId);
              setNotice(`Un peer ha scelto il Nero.`);
              sendRoleState();
            } else {
              sendRoleState(message.peerId, 'Il ruolo Nero è già occupato.');
            }
          }
        }

        if (message.type === 'role-state') {
          updateRoles(message.whitePlayerId, message.blackPlayerId);
          if (message.notice) setNotice(message.notice);
        }

        if (message.type === 'state-request') {
          sendStateSync(context.peerId);
        }

        if (message.type === 'state-sync') {
          updateRoles(message.whitePlayerId, message.blackPlayerId);
          const loaded = onRemoteFen(message.fen);
          setNotice(loaded ? 'Stato partita sincronizzato.' : 'FEN ricevuta non valida.');
        }

        if (message.type === 'move-sync') {
          const loaded = onRemoteFen(message.fen);
          setNotice(loaded ? 'Mossa ricevuta dalla stanza.' : 'FEN ricevuta non valida.');
        }

        if (message.type === 'peer-gone') {
          handlePeerGone(message.peerId);
        }
      };

      window.setTimeout(() => sendMessage({ type: 'state-request', peerId: selfId }), 300);
      window.setTimeout(() => sendMessage({ type: 'state-request', peerId: selfId }), 1000);

      setConnectionStatus('connected');
      return true;
    } catch (error) {
      console.error('Errore stanza peer-to-peer:', error);
      setConnectionStatus('error');
      setNotice('Impossibile entrare nella stanza peer-to-peer.');
      return false;
    }
  }, [handlePeerGone, onRemoteFen, sendMessage, sendRoleState, sendStateSync, updateRoles]);

  const leavePeerRoom = useCallback(() => {
    if (!roomRef.current) return;

    const room = roomRef.current;
    const action = actionRef.current;

    if (action) {
      action.send({ type: 'peer-gone', peerId: selfId }).finally(() => {
        room.leave().catch((error) => {
          console.warn('Uscita dalla stanza non completata correttamente.', error);
        });
      });
    } else {
      room.leave().catch((error) => {
        console.warn('Uscita dalla stanza non completata correttamente.', error);
      });
    }

    roomRef.current = null;
    actionRef.current = null;
    setConnectionStatus('offline');
    setPeerIds([]);
    updateRoles(null, null);
    setMyRole(null);
    setNotice('Sei uscito dalla stanza.');
  }, [sendMessage, updateRoles]);

  const claimRole = useCallback((role: OnlineColorRole) => {
    if (!roomRef.current) return;

    const { whitePlayerId: currentWhite, blackPlayerId: currentBlack } = rolesRef.current;
    if (role === 'white' && currentWhite && currentWhite !== selfId) return;
    if (role === 'black' && currentBlack && currentBlack !== selfId) return;

    const nextWhite = role === 'white' ? selfId : currentWhite === selfId ? null : currentWhite;
    const nextBlack = role === 'black' ? selfId : currentBlack === selfId ? null : currentBlack;

    updateRoles(nextWhite, nextBlack);
    onRoleSelected?.(role);
    setNotice(`Stai giocando come ${roleLabel(role)}.`);
    sendMessage({ type: 'claim-role', role, peerId: selfId });
    sendRoleState();
    sendStateSync();
  }, [onRoleSelected, sendMessage, sendRoleState, sendStateSync, updateRoles]);

  const sendMoveSync = useCallback((fen: string) => {
    if (!roomRef.current) return;
    sendMessage({ type: 'move-sync', peerId: selfId, fen });
  }, [sendMessage]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (roomRef.current && actionRef.current) {
        void actionRef.current.send({ type: 'peer-gone', peerId: selfId });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (roomRef.current) {
        void roomRef.current.leave();
      }
    };
  }, []);

  return {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    roomName,
    selfId,
    peerIds,
    whitePlayerId,
    blackPlayerId,
    myRole,
    notice,
    joinPeerRoom,
    leavePeerRoom,
    claimRole,
    sendMoveSync,
  };
};
