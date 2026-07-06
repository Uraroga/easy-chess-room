import { useCallback, useEffect, useRef, useState } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { GameState, PendingPromotion } from '../types';

const STORAGE_KEY = 'easy-chess-room:game';

type BoardOrientation = 'white' | 'black';

interface SavedGame {
  version: 1;
  fen: string;
  pgn: string;
  orientation: BoardOrientation;
  showMoveHelp: boolean;
  savedAt: string;
}

const createGameState = (game: Chess): GameState => {
  const historyVerbose = game.history({ verbose: true });
  const uciHistory = historyVerbose.map((move) => move.from + move.to + (move.promotion || ''));

  return {
    fen: game.fen(),
    turn: game.turn(),
    inCheck: game.inCheck(),
    isCheckmate: game.isCheckmate(),
    isDraw: game.isDraw(),
    isGameOver: game.isGameOver(),
    history: game.history(),
    uciHistory,
    pgn: game.pgn(),
  };
};

const getLastMoveFromHistory = (game: Chess): { from: Square; to: Square } | null => {
  const history = game.history({ verbose: true }) as Move[];
  const last = history.at(-1);

  return last ? { from: last.from, to: last.to } : null;
};

const restoreSavedGame = (): { game: Chess; orientation: BoardOrientation; showMoveHelp: boolean } => {
  const fallback = { game: new Chess(), orientation: 'white' as BoardOrientation, showMoveHelp: false };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const saved = JSON.parse(raw) as Partial<SavedGame>;
    const orientation = saved.orientation === 'black' ? 'black' : 'white';
    const showMoveHelp = saved.showMoveHelp === true;
    const savedFen = typeof saved.fen === 'string' ? saved.fen : '';

    if (typeof saved.pgn === 'string' && saved.pgn.trim()) {
      const gameFromPgn = new Chess();
      gameFromPgn.loadPgn(saved.pgn);

      if (!savedFen || gameFromPgn.fen() === savedFen) {
        return { game: gameFromPgn, orientation, showMoveHelp };
      }
    }

    if (savedFen) {
      const gameFromFen = new Chess();
      gameFromFen.load(savedFen);
      return { game: gameFromFen, orientation, showMoveHelp };
    }
  } catch (error) {
    console.warn('Salvataggio locale non valido, avvio una nuova partita.', error);
  }

  return fallback;
};

export const clearStoredGame = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};

export const useChessGame = () => {
  const [restoredGame] = useState(restoreSavedGame);
  const gameRef = useRef(restoredGame.game);

  const [gameState, setGameState] = useState<GameState>(() => createGameState(gameRef.current));
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(() => getLastMoveFromHistory(gameRef.current));
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion>(null);
  const [orientation, setOrientation] = useState<BoardOrientation>(restoredGame.orientation);
  const [showMoveHelp, setShowMoveHelp] = useState(restoredGame.showMoveHelp);

  const updateGameState = useCallback(() => {
    setGameState(createGameState(gameRef.current));
  }, []);

  useEffect(() => {
    try {
      const savedGame: SavedGame = {
        version: 1,
        fen: gameState.fen,
        pgn: gameRef.current.pgn(),
        orientation,
        showMoveHelp,
        savedAt: new Date().toISOString(),
      };

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedGame));
    } catch (error) {
      console.warn('Impossibile salvare la partita nel browser.', error);
    }
  }, [gameState.fen, orientation, showMoveHelp]);

  const handleMove = (from: Square, to: Square): string | null => {
    const game = gameRef.current;
    if (game.isGameOver()) return null;

    const moves = game.moves({ verbose: true });
    const isPromotion = moves.some((move) => move.from === from && move.to === to && move.promotion);

    if (isPromotion) {
      setPendingPromotion({ from, to, color: game.turn() });
      return null;
    }

    try {
      const result = game.move({ from, to });
      if (result) {
        setLastMove({ from, to });
        updateGameState();
        return game.fen();
      }
    } catch (error) {
      console.error('Mossa non valida', error);
    }

    return null;
  };

  const finalizePromotion = (promotionPiece: 'q' | 'r' | 'b' | 'n'): string | null => {
    if (!pendingPromotion) return null;

    try {
      const result = gameRef.current.move({
        from: pendingPromotion.from,
        to: pendingPromotion.to,
        promotion: promotionPiece,
      });

      if (result) {
        setLastMove({ from: pendingPromotion.from, to: pendingPromotion.to });
        updateGameState();
        return gameRef.current.fen();
      }
    } catch (error) {
      console.error('Promozione non valida', error);
    } finally {
      setPendingPromotion(null);
    }

    return null;
  };

  const resetGame = () => {
    gameRef.current.reset();
    setLastMove(null);
    setPendingPromotion(null);
    updateGameState();
  };

  const clearSavedGame = () => {
    clearStoredGame();
    resetGame();
    setOrientation('white');
    setShowMoveHelp(false);
  };

  const handleLoadFen = (fen: string): boolean => {
    try {
      gameRef.current.load(fen);
      setLastMove(null);
      setPendingPromotion(null);
      updateGameState();
      return true;
    } catch (error) {
      console.error('FEN non valido:', error);
      return false;
    }
  };

  const undoMove = () => {
    const undid = gameRef.current.undo();
    if (!undid) return;

    setLastMove(getLastMoveFromHistory(gameRef.current));
    updateGameState();
  };

  const toggleOrientation = () => {
    setOrientation((current) => (current === 'white' ? 'black' : 'white'));
  };

  const setBoardOrientation = (nextOrientation: BoardOrientation) => {
    setOrientation(nextOrientation);
  };

  const toggleMoveHelp = () => {
    setShowMoveHelp((current) => !current);
  };

  return {
    game: gameRef.current,
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
  };
};
