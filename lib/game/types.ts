export type CardValue =
  | "ACE"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "JACK"
  | "QUEEN"
  | "KING";

export type CardSuit = "SPADES" | "HEARTS" | "DIAMONDS" | "CLUBS";

export interface Card {
  code: string;
  image: string;
  value: CardValue;
  suit: CardSuit;
}

export type GamePhase =
  | "idle"
  | "dealing"
  | "playerTurn"
  | "dealerTurn"
  | "resolved";

export type RoundOutcome = "win" | "loss" | "push" | "blackjack";

export interface Bets {
  main: number;
  pairs: number;
  sameSuit: number;
}

export interface SideBetResult {
  pairsWon: boolean;
  sameSuitWon: boolean;
  pairsPayout: number;
  sameSuitPayout: number;
}

export interface RoundResult {
  outcome: RoundOutcome;
  mainPayout: number;
  sideBets: SideBetResult;
  playerValue: number;
  dealerValue: number;
  message: string;
}

export interface HistoryEntry {
  id: string;
  message: string;
  amount: number;
  type: "win" | "loss" | "push" | "sideBet";
  timestamp: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export interface GameState {
  phase: GamePhase;
  deckId: string | null;
  remainingCards: number;
  wallet: number;
  playerCards: Card[];
  dealerCards: Card[];
  bets: Bets;
  pendingBets: Bets;
  doubledDown: boolean;
  dealerHoleRevealed: boolean;
  history: HistoryEntry[];
  toasts: ToastMessage[];
  isLoading: boolean;
  error: string | null;
}

export const INITIAL_WALLET = 20000;
export const RESHUFFLE_THRESHOLD = 12;
export const DEALER_STAND_VALUE = 17;

export const initialGameState: GameState = {
  phase: "idle",
  deckId: null,
  remainingCards: 52,
  wallet: INITIAL_WALLET,
  playerCards: [],
  dealerCards: [],
  bets: { main: 0, pairs: 0, sameSuit: 0 },
  pendingBets: { main: 0, pairs: 0, sameSuit: 0 },
  doubledDown: false,
  dealerHoleRevealed: false,
  history: [],
  toasts: [],
  isLoading: false,
  error: null,
};
