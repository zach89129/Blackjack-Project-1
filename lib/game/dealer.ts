import type { Card } from "./types";
import { calculateHandValue } from "./handValue";
import { DEALER_STAND_VALUE } from "./types";

export function dealerShouldHit(cards: Card[]): boolean {
  return calculateHandValue(cards) < DEALER_STAND_VALUE;
}

export function dealerShouldStand(cards: Card[]): boolean {
  return calculateHandValue(cards) >= DEALER_STAND_VALUE;
}
