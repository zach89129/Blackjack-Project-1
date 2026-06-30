import { describe, expect, it } from "vitest";
import {
  getSideBetMessage,
  getTotalSideBetPayout,
  resolveSideBets,
} from "@/lib/game/sideBets";
import type { Card } from "@/lib/game/types";

function card(value: Card["value"], suit: Card["suit"]): Card {
  return {
    code: `${value}${suit[0]}`,
    image: "https://example.com/card.png",
    value,
    suit,
  };
}

describe("resolveSideBets", () => {
  it("pays pairs 10:1", () => {
    const result = resolveSideBets(
      [card("8", "HEARTS"), card("8", "CLUBS")],
      { main: 0, pairs: 10, sameSuit: 0 }
    );
    expect(result.pairsWon).toBe(true);
    expect(result.pairsPayout).toBe(100);
  });

  it("pays same suit 6:1", () => {
    const result = resolveSideBets(
      [card("8", "HEARTS"), card("KING", "HEARTS")],
      { main: 0, pairs: 0, sameSuit: 10 }
    );
    expect(result.sameSuitWon).toBe(true);
    expect(result.sameSuitPayout).toBe(60);
  });

  it("returns no payout when bets do not match", () => {
    const result = resolveSideBets(
      [card("8", "HEARTS"), card("KING", "CLUBS")],
      { main: 0, pairs: 10, sameSuit: 10 }
    );
    expect(result.pairsWon).toBe(false);
    expect(result.sameSuitWon).toBe(false);
    expect(getTotalSideBetPayout(result)).toBe(0);
    expect(getSideBetMessage(result)).toBeNull();
  });
});
