import type { Bets, Card, RoundOutcome, RoundResult } from "./types";
import { calculateHandValue, isBlackjack, isBust } from "./handValue";
import { resolveSideBets } from "./sideBets";

export function resolveMainPayout(
  bet: number,
  outcome: RoundOutcome
): number {
  switch (outcome) {
    case "blackjack":
      return bet + Math.floor(bet * 1.5);
    case "win":
      return bet * 2;
    case "push":
      return bet;
    case "loss":
      return 0;
    default: {
      const _exhaustive: never = outcome;
      return _exhaustive;
    }
  }
}

export function determineOutcome(
  playerCards: Card[],
  dealerCards: Card[],
  playerBusted = false
): RoundOutcome {
  const playerValue = calculateHandValue(playerCards);
  const dealerValue = calculateHandValue(dealerCards);

  if (playerBusted || isBust(playerCards)) {
    return "loss";
  }

  if (isBust(dealerCards)) {
    return "win";
  }

  if (isBlackjack(playerCards) && !isBlackjack(dealerCards)) {
    return "blackjack";
  }

  if (isBlackjack(dealerCards) && !isBlackjack(playerCards)) {
    return "loss";
  }

  if (playerValue > dealerValue) {
    return "win";
  }

  if (playerValue < dealerValue) {
    return "loss";
  }

  return "push";
}

export function getOutcomeMessage(
  outcome: RoundOutcome,
  bet: number
): string {
  switch (outcome) {
    case "blackjack":
      return `Blackjack! You won $${Math.floor(bet * 1.5).toLocaleString()}`;
    case "win":
      return `You win $${bet.toLocaleString()}!`;
    case "push":
      return "Push — bet returned";
    case "loss":
      return `You lost $${bet.toLocaleString()}`;
    default: {
      const _exhaustive: never = outcome;
      return _exhaustive;
    }
  }
}

export function resolveRound(
  playerCards: Card[],
  dealerCards: Card[],
  bets: Bets,
  playerBusted = false
): RoundResult {
  const outcome = determineOutcome(playerCards, dealerCards, playerBusted);
  const mainPayout = resolveMainPayout(bets.main, outcome);
  const sideBets = resolveSideBets(playerCards, bets);

  return {
    outcome,
    mainPayout,
    sideBets,
    playerValue: calculateHandValue(playerCards),
    dealerValue: calculateHandValue(dealerCards),
    message: getOutcomeMessage(outcome, bets.main),
  };
}
