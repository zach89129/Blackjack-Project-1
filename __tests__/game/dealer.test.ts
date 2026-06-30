import { describe, expect, it } from "vitest";
import { dealerShouldHit, dealerShouldStand } from "@/lib/game/dealer";
import type { Card } from "@/lib/game/types";

function card(value: Card["value"]): Card {
  return {
    code: value,
    image: "https://example.com/card.png",
    value,
    suit: "SPADES",
  };
}

describe("dealer rules", () => {
  it("hits on 16", () => {
    expect(dealerShouldHit([card("10"), card("6")])).toBe(true);
  });

  it("stands on 17", () => {
    expect(dealerShouldStand([card("10"), card("7")])).toBe(true);
  });

  it("stands on soft 17 as ace+6", () => {
    expect(dealerShouldStand([card("ACE"), card("6")])).toBe(true);
  });

  it("stands on bust", () => {
    expect(dealerShouldStand([card("KING"), card("QUEEN"), card("5")])).toBe(
      true
    );
  });
});
