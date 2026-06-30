import type { Bets, Card, SideBetResult } from "./types";

export function resolveSideBets(cards: Card[], bets: Bets): SideBetResult {
  const result: SideBetResult = {
    pairsWon: false,
    sameSuitWon: false,
    pairsPayout: 0,
    sameSuitPayout: 0,
  };

  if (cards.length < 2) {
    return result;
  }

  const [first, second] = cards;

  if (bets.pairs > 0 && first.value === second.value) {
    result.pairsWon = true;
    result.pairsPayout = bets.pairs * 10;
  }

  if (bets.sameSuit > 0 && first.suit === second.suit) {
    result.sameSuitWon = true;
    result.sameSuitPayout = bets.sameSuit * 6;
  }

  return result;
}

export function getSideBetMessage(sideBets: SideBetResult): string | null {
  const messages: string[] = [];

  if (sideBets.pairsWon) {
    messages.push(`Pairs bet won $${sideBets.pairsPayout.toLocaleString()}!`);
  }

  if (sideBets.sameSuitWon) {
    messages.push(
      `Same suit bet won $${sideBets.sameSuitPayout.toLocaleString()}!`
    );
  }

  return messages.length > 0 ? messages.join(" ") : null;
}

export function getTotalSideBetPayout(sideBets: SideBetResult): number {
  return sideBets.pairsPayout + sideBets.sameSuitPayout;
}
