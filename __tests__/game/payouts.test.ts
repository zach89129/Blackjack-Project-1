import { describe, expect, it } from "vitest";
import {
  determineOutcome,
  resolveMainPayout,
  resolveRound,
} from "@/lib/game/payouts";
import type { Card } from "@/lib/game/types";

function card(value: Card["value"], suit: Card["suit"] = "HEARTS"): Card {
  return {
    code: `${value}${suit[0]}`,
    image: "https://example.com/card.png",
    value,
    suit,
  };
}

describe("resolveMainPayout", () => {
  it("pays 1:1 on win", () => {
    expect(resolveMainPayout(100, "win")).toBe(200);
  });

  it("pays 3:2 on blackjack", () => {
    expect(resolveMainPayout(100, "blackjack")).toBe(250);
  });

  it("returns bet on push", () => {
    expect(resolveMainPayout(100, "push")).toBe(100);
  });

  it("returns 0 on loss", () => {
    expect(resolveMainPayout(100, "loss")).toBe(0);
  });
});

describe("determineOutcome", () => {
  it("player wins with higher hand", () => {
    expect(
      determineOutcome([card("KING"), card("9")], [card("10"), card("7")])
    ).toBe("win");
  });

  it("dealer wins with higher hand", () => {
    expect(
      determineOutcome([card("10"), card("5")], [card("KING"), card("9")])
    ).toBe("loss");
  });

  it("push on tie", () => {
    expect(
      determineOutcome([card("KING"), card("9")], [card("QUEEN"), card("9")])
    ).toBe("push");
  });

  it("player bust loses", () => {
    expect(
      determineOutcome(
        [card("KING"), card("QUEEN"), card("5")],
        [card("10"), card("7")],
        true
      )
    ).toBe("loss");
  });

  it("dealer bust player wins", () => {
    expect(
      determineOutcome(
        [card("10"), card("5")],
        [card("KING"), card("QUEEN"), card("5")]
      )
    ).toBe("win");
  });

  it("player blackjack wins", () => {
    expect(
      determineOutcome([card("ACE"), card("KING")], [card("10"), card("7")])
    ).toBe("blackjack");
  });
});

describe("resolveRound", () => {
  it("resolves full round with side bets", () => {
    const result = resolveRound(
      [card("KING", "HEARTS"), card("9", "CLUBS")],
      [card("10", "SPADES"), card("7", "DIAMONDS")],
      { main: 100, pairs: 10, sameSuit: 5 }
    );

    expect(result.outcome).toBe("win");
    expect(result.mainPayout).toBe(200);
    expect(result.sideBets.pairsPayout).toBe(0);
    expect(result.sideBets.sameSuitPayout).toBe(0);
  });

  it("resolves side bet payouts on winning hand", () => {
    const result = resolveRound(
      [card("8", "HEARTS"), card("8", "HEARTS")],
      [card("10", "CLUBS"), card("7", "CLUBS")],
      { main: 100, pairs: 10, sameSuit: 5 }
    );

    expect(result.sideBets.pairsPayout).toBe(100);
    expect(result.sideBets.sameSuitPayout).toBe(30);
  });
});
