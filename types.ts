import { Square, PieceSymbol, Color } from 'chess.js';

export interface Piece {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

export interface GameState {
  fen: string;
  turn: Color;
  inCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
  history: string[]; // SAN history
  uciHistory: string[]; // UCI history
  pgn: string;
}

export type PendingPromotion = {
  from: Square;
  to: Square;
  color: Color;
} | null;

export type OnlineColorRole = 'white' | 'black';

export type OnlineRole = OnlineColorRole | 'spectator' | null;

export type PeerConnectionStatus = 'offline' | 'connecting' | 'connected' | 'error';

export type PeerMessage =
  | {
      type: 'claim-role';
      role: OnlineColorRole;
      peerId: string;
    }
  | {
      type: 'role-state';
      peerId: string;
      whitePlayerId: string | null;
      blackPlayerId: string | null;
      notice?: string;
    }
  | {
      type: 'state-request';
      peerId: string;
    }
  | {
      type: 'state-sync';
      peerId: string;
      fen: string;
      whitePlayerId: string | null;
      blackPlayerId: string | null;
    }
  | {
      type: 'move-sync';
      peerId: string;
      fen: string;
    }
  | {
      type: 'peer-gone';
      peerId: string;
    };
