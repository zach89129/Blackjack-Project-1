import { Hand } from "./Hand";
import type { Card } from "@/lib/game/types";

interface PlayingTableProps {
  playerCards: Card[];
  dealerCards: Card[];
  playerValue: number;
  dealerValue: number;
  dealerHoleRevealed: boolean;
  phase: string;
}

export function PlayingTable({
  playerCards,
  dealerCards,
  playerValue,
  dealerValue,
  dealerHoleRevealed,
  phase,
}: PlayingTableProps) {
  const hideDealerCard =
    !dealerHoleRevealed && dealerCards.length > 0 && phase !== "idle";

  return (
    <div className="flex flex-1 flex-col justify-between gap-8 rounded-2xl border border-white/10 bg-felt/40 p-4 backdrop-blur-sm sm:p-8">
      <Hand
        cards={dealerCards}
        label="Dealer"
        value={dealerValue}
        hideFirstCard={hideDealerCard}
        showValue={dealerCards.length > 0 && (dealerHoleRevealed || phase === "resolved")}
      />
      <div className="mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <Hand
        cards={playerCards}
        label="Player"
        value={playerValue}
        showValue={playerCards.length > 0}
      />
    </div>
  );
}
