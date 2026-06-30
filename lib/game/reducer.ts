import type {
  Bets,
  GameState,
  HistoryEntry,
  ToastMessage,
} from "@/lib/game/types";
import { initialGameState } from "@/lib/game/types";

export type GameAction =
  | { type: "SET_PENDING_BETS"; bets: Bets }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "START_DEAL"; bets: Bets; deckId: string; remaining: number }
  | {
      type: "DEAL_CARDS";
      playerCards: GameState["playerCards"];
      dealerCards: GameState["dealerCards"];
      remaining: number;
    }
  | { type: "PLAYER_HIT"; card: GameState["playerCards"][number]; remaining: number }
  | { type: "DEALER_HIT"; card: GameState["dealerCards"][number]; remaining: number }
  | { type: "START_DEALER_TURN" }
  | { type: "REVEAL_DEALER" }
  | {
      type: "RESOLVE_ROUND";
      walletDelta: number;
      historyEntry: HistoryEntry;
      toast: ToastMessage;
      sideBetToast?: ToastMessage;
    }
  | { type: "DOUBLE_DOWN"; additionalBet: number }
  | { type: "RESET_ROUND" }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "ADD_TOAST"; toast: ToastMessage }
  | { type: "SET_DECK"; deckId: string; remaining: number };

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_PENDING_BETS":
      return { ...state, pendingBets: action.bets };

    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };

    case "SET_ERROR":
      return { ...state, error: action.error, isLoading: false };

    case "START_DEAL": {
      const totalWager =
        action.bets.main + action.bets.pairs + action.bets.sameSuit;
      return {
        ...state,
        phase: "dealing",
        bets: action.bets,
        pendingBets: action.bets,
        deckId: action.deckId,
        remainingCards: action.remaining,
        wallet: state.wallet - totalWager,
        playerCards: [],
        dealerCards: [],
        doubledDown: false,
        dealerHoleRevealed: false,
        isLoading: true,
        error: null,
      };
    }

    case "DEAL_CARDS":
      return {
        ...state,
        phase: "playerTurn",
        playerCards: action.playerCards,
        dealerCards: action.dealerCards,
        remainingCards: action.remaining,
        isLoading: false,
      };

    case "PLAYER_HIT":
      return {
        ...state,
        playerCards: [...state.playerCards, action.card],
        remainingCards: action.remaining,
        isLoading: false,
      };

    case "DEALER_HIT":
      return {
        ...state,
        dealerCards: [...state.dealerCards, action.card],
        remainingCards: action.remaining,
      };

    case "DOUBLE_DOWN":
      return {
        ...state,
        doubledDown: true,
        bets: {
          ...state.bets,
          main: state.bets.main + action.additionalBet,
        },
        wallet: state.wallet - action.additionalBet,
        isLoading: true,
      };

    case "START_DEALER_TURN":
      return {
        ...state,
        phase: "dealerTurn",
        dealerHoleRevealed: true,
        isLoading: true,
      };

    case "REVEAL_DEALER":
      return {
        ...state,
        dealerHoleRevealed: true,
      };

    case "RESOLVE_ROUND": {
      const toasts = [...state.toasts, action.toast];
      if (action.sideBetToast) {
        toasts.push(action.sideBetToast);
      }
      return {
        ...state,
        phase: "resolved",
        wallet: state.wallet + action.walletDelta,
        history: [action.historyEntry, ...state.history].slice(0, 50),
        toasts,
        isLoading: false,
        dealerHoleRevealed: true,
      };
    }

    case "RESET_ROUND":
      return {
        ...state,
        phase: "idle",
        playerCards: [],
        dealerCards: [],
        bets: { main: 0, pairs: 0, sameSuit: 0 },
        doubledDown: false,
        dealerHoleRevealed: false,
        isLoading: false,
        error: null,
      };

    case "SET_DECK":
      return {
        ...state,
        deckId: action.deckId,
        remainingCards: action.remaining,
      };

    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };

    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

export function createHistoryEntry(
  message: string,
  amount: number,
  type: HistoryEntry["type"]
): HistoryEntry {
  return {
    id: createId(),
    message,
    amount,
    type,
    timestamp: Date.now(),
  };
}

export function createToast(
  message: string,
  type: ToastMessage["type"]
): ToastMessage {
  return {
    id: createId(),
    message,
    type,
  };
}

export { initialGameState };
