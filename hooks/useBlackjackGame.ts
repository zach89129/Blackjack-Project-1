"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { createShuffledDeck, drawCards, shuffleDeck } from "@/lib/api/deckClient";
import { dealerShouldHit } from "@/lib/game/dealer";
import { calculateHandValue, isBust } from "@/lib/game/handValue";
import { resolveRound } from "@/lib/game/payouts";
import {
  createHistoryEntry,
  createToast,
  gameReducer,
  initialGameState,
} from "@/lib/game/reducer";
import {
  getSideBetMessage,
  getTotalSideBetPayout,
  resolveSideBets,
} from "@/lib/game/sideBets";
import type { Bets, GameState } from "@/lib/game/types";
import { RESHUFFLE_THRESHOLD } from "@/lib/game/types";

function getTotalWager(bets: Bets): number {
  return bets.main + bets.pairs + bets.sameSuit;
}

function validateBets(bets: Bets, wallet: number): string | null {
  if (bets.main <= 0) {
    return "Place a main bet to deal";
  }

  if (bets.main < 0 || bets.pairs < 0 || bets.sameSuit < 0) {
    return "Bets cannot be negative";
  }

  const total = getTotalWager(bets);
  if (total > wallet) {
    return "Insufficient funds for these bets";
  }

  return null;
}

export function useBlackjackGame() {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const setPendingBets = useCallback((bets: Bets) => {
    dispatch({ type: "SET_PENDING_BETS", bets });
  }, []);

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: "DISMISS_TOAST", id });
  }, []);

  const resetRound = useCallback(() => {
    dispatch({ type: "RESET_ROUND" });
  }, []);

  const ensureDeck = useCallback(async (): Promise<string> => {
    const current = stateRef.current;

    if (current.deckId && current.remainingCards >= RESHUFFLE_THRESHOLD) {
      return current.deckId;
    }

    if (current.deckId && current.remainingCards < RESHUFFLE_THRESHOLD) {
      const shuffled = await shuffleDeck(current.deckId);
      dispatch({
        type: "SET_DECK",
        deckId: shuffled.deck_id,
        remaining: shuffled.remaining,
      });
      return shuffled.deck_id;
    }

    const deck = await createShuffledDeck(1);
    dispatch({
      type: "SET_DECK",
      deckId: deck.deck_id,
      remaining: deck.remaining,
    });
    return deck.deck_id;
  }, []);

  const finishRound = useCallback(
    (playerBusted = false, resolveSideBetsNow = true) => {
      const current = stateRef.current;
      const result = resolveRound(
        current.playerCards,
        current.dealerCards,
        current.bets,
        playerBusted
      );

      let walletDelta = result.mainPayout;
      const sideBetResult = resolveSideBetsNow
        ? resolveSideBets(current.playerCards, current.bets)
        : { pairsWon: false, sameSuitWon: false, pairsPayout: 0, sameSuitPayout: 0 };

      const sideBetPayout = resolveSideBetsNow
        ? getTotalSideBetPayout(sideBetResult)
        : 0;
      walletDelta += sideBetPayout;

      const historyType =
        result.outcome === "loss"
          ? "loss"
          : result.outcome === "push"
            ? "push"
            : "win";

      const historyEntry = createHistoryEntry(
        result.message,
        result.outcome === "loss" ? -current.bets.main : result.mainPayout - current.bets.main,
        historyType
      );

      const toastType =
        result.outcome === "loss"
          ? "error"
          : result.outcome === "push"
            ? "warning"
            : "success";

      const sideBetMessage = resolveSideBetsNow
        ? getSideBetMessage(sideBetResult)
        : null;

      dispatch({
        type: "RESOLVE_ROUND",
        walletDelta,
        historyEntry,
        toast: createToast(result.message, toastType),
        sideBetToast: sideBetMessage
          ? createToast(sideBetMessage, "success")
          : undefined,
      });
    },
    []
  );

  const runDealerTurn = useCallback(async () => {
    dispatch({ type: "START_DEALER_TURN" });

    let deckId = stateRef.current.deckId;
    if (!deckId) return;

    while (dealerShouldHit(stateRef.current.dealerCards)) {
      const draw = await drawCards(deckId, 1);
      deckId = draw.deck_id;
      dispatch({
        type: "DEALER_HIT",
        card: draw.cards[0],
        remaining: draw.remaining,
      });
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    finishRound(false, true);
  }, [finishRound]);

  const deal = useCallback(async (betsOverride?: Bets) => {
    const current = stateRef.current;
    const bets = betsOverride ?? current.pendingBets;
    const validationError = validateBets(bets, current.wallet);

    if (validationError) {
      dispatch({ type: "ADD_TOAST", toast: createToast(validationError, "error") });
      return;
    }

    dispatch({ type: "SET_LOADING", isLoading: true });

    try {
      const deckId = await ensureDeck();
      dispatch({
        type: "START_DEAL",
        bets,
        deckId,
        remaining: stateRef.current.remainingCards,
      });

      const playerDraw = await drawCards(deckId, 2);
      const dealerDraw = await drawCards(playerDraw.deck_id, 2);

      dispatch({
        type: "DEAL_CARDS",
        playerCards: playerDraw.cards,
        dealerCards: dealerDraw.cards,
        remaining: dealerDraw.remaining,
      });
    } catch {
      dispatch({
        type: "SET_ERROR",
        error: "Failed to deal cards. Please try again.",
      });
      dispatch({ type: "RESET_ROUND" });
    }
  }, [ensureDeck]);

  const hit = useCallback(async () => {
    const current = stateRef.current;
    if (current.phase !== "playerTurn" || current.isLoading) return;

    const deckId = current.deckId;
    if (!deckId) return;

    dispatch({ type: "SET_LOADING", isLoading: true });

    try {
      const draw = await drawCards(deckId, 1);
      dispatch({
        type: "PLAYER_HIT",
        card: draw.cards[0],
        remaining: draw.remaining,
      });

      const updatedCards = [...current.playerCards, draw.cards[0]];
      if (isBust(updatedCards)) {
        dispatch({ type: "REVEAL_DEALER" });
        await new Promise((resolve) => setTimeout(resolve, 800));
        finishRound(true, false);
      }
    } catch {
      dispatch({
        type: "SET_ERROR",
        error: "Failed to draw card",
      });
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  }, [finishRound]);

  const stand = useCallback(async () => {
    const current = stateRef.current;
    if (current.phase !== "playerTurn" || current.isLoading) return;

    await runDealerTurn();
  }, [runDealerTurn]);

  const doubleDown = useCallback(async () => {
    const current = stateRef.current;
    if (
      current.phase !== "playerTurn" ||
      current.isLoading ||
      current.playerCards.length !== 2 ||
      current.doubledDown
    ) {
      return;
    }

    if (current.wallet < current.bets.main) {
      dispatch({
        type: "SET_ERROR",
        error: "Insufficient funds to double down",
      });
      return;
    }

    dispatch({
      type: "DOUBLE_DOWN",
      additionalBet: current.bets.main,
    });

    const deckId = current.deckId;
    if (!deckId) return;

    try {
      const draw = await drawCards(deckId, 1);
      dispatch({
        type: "PLAYER_HIT",
        card: draw.cards[0],
        remaining: draw.remaining,
      });

      await new Promise((resolve) => setTimeout(resolve, 600));
      await runDealerTurn();
    } catch {
      dispatch({
        type: "SET_ERROR",
        error: "Failed to double down",
      });
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  }, [runDealerTurn]);

  useEffect(() => {
    if (state.phase !== "resolved") return;

    const timer = setTimeout(() => {
      resetRound();
    }, 2500);

    return () => clearTimeout(timer);
  }, [state.phase, resetRound]);

  const brokeRef = useRef(false);
  useEffect(() => {
    if (state.wallet <= 0 && state.phase === "idle" && !brokeRef.current) {
      brokeRef.current = true;
      dispatch({
        type: "ADD_TOAST",
        toast: createToast("You're out of money! Refresh to restart.", "error"),
      });
    }
  }, [state.wallet, state.phase]);

  const playerValue = calculateHandValue(state.playerCards);
  const dealerValue = calculateHandValue(state.dealerCards);
  const canAct =
    state.phase === "playerTurn" && !state.isLoading && !isBust(state.playerCards);
  const canDoubleDown =
    canAct &&
    state.playerCards.length === 2 &&
    !state.doubledDown &&
    state.wallet >= state.bets.main;
  const canDeal =
    state.phase === "idle" && !state.isLoading && state.wallet > 0;

  return {
    state,
    playerValue,
    dealerValue,
    canAct,
    canDoubleDown,
    canDeal,
    setPendingBets,
    deal,
    hit,
    stand,
    doubleDown,
    dismissToast,
    resetRound,
  };
}

export type BlackjackGame = ReturnType<typeof useBlackjackGame>;
