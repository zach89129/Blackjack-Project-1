import { describe, expect, it } from "vitest";
import {
  calculateHandValue,
  isBlackjack,
  isBust,
} from "@/lib/game/handValue";
import type { Card } from "@/lib/game/types";

function card(value: Card["value"], suit: Card["suit"] = "HEARTS"): Card {
  return {
    code: `${value[0]}${suit[0]}`,
    image: "https://example.com/card.png",
    value,
    suit,
  };
}

describe("calculateHandValue", () => {
  it("sums numeric cards", () => {
    expect(calculateHandValue([card("5"), card("7")])).toBe(12);
  });

  it("counts face cards as 10", () => {
    expect(calculateHandValue([card("KING"), card("QUEEN")])).toBe(20);
  });

  it("handles soft ace", () => {
    expect(calculateHandValue([card("ACE"), card("8")])).toBe(19);
  });

  it("converts ace to 1 when busting", () => {
    expect(calculateHandValue([card("ACE"), card("KING"), card("5")])).toBe(16);
  });

  it("handles multiple aces", () => {
    expect(calculateHandValue([card("ACE"), card("ACE"), card("9")])).toBe(21);
  });
});

describe("isBust", () => {
  it("detects bust", () => {
    expect(isBust([card("KING"), card("QUEEN"), card("5")])).toBe(true);
  });

  it("is not bust at 21", () => {
    expect(isBust([card("KING"), card("ACE")])).toBe(false);
  });
});

describe("isBlackjack", () => {
  it("detects blackjack", () => {
    expect(isBlackjack([card("ACE"), card("KING")])).toBe(true);
  });

  it("rejects 21 with more than 2 cards", () => {
    expect(isBlackjack([card("ACE"), card("5"), card("5")])).toBe(false);
  });
});
