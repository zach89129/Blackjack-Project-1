import type { Card, CardValue } from "./types";

const FACE_VALUES: CardValue[] = ["KING", "QUEEN", "JACK"];

export function isFaceCard(value: CardValue): boolean {
  return FACE_VALUES.includes(value);
}

export function getCardNumericValue(value: CardValue): number {
  if (value === "ACE") return 11;
  if (isFaceCard(value)) return 10;
  return parseInt(value, 10);
}

export function calculateHandValue(cards: Card[]): number {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    if (card.value === "ACE") {
      aces++;
      total += 11;
    } else if (isFaceCard(card.value)) {
      total += 10;
    } else {
      total += parseInt(card.value, 10);
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

export function isBust(cards: Card[]): boolean {
  return calculateHandValue(cards) > 21;
}

export function isBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && calculateHandValue(cards) === 21;
}
