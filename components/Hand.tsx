import { Card } from "./Card";
import type { Card as CardType } from "@/lib/game/types";

interface HandProps {
  cards: CardType[];
  label: string;
  value?: number;
  hideFirstCard?: boolean;
  showValue?: boolean;
}

export function Hand({
  cards,
  label,
  value,
  hideFirstCard = false,
  showValue = true,
}: HandProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="font-display text-3xl tracking-wider text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
        {label}
      </h2>
      <div className="flex min-h-[8rem] flex-wrap items-center justify-center gap-2 sm:min-h-[10rem] sm:gap-3">
        {cards.length === 0 ? (
          <div className="flex h-28 w-20 items-center justify-center rounded-lg border-2 border-dashed border-white/20 sm:h-36 sm:w-28">
            <span className="text-sm text-white/30">—</span>
          </div>
        ) : (
          cards.map((card, index) => (
            <Card
              key={`${card.code}-${index}`}
              image={card.image}
              faceDown={hideFirstCard && index === 0}
              alt={`${card.value} of ${card.suit}`}
            />
          ))
        )}
      </div>
      {showValue && cards.length > 0 && value !== undefined && (
        <div
          className={`rounded-full px-4 py-1 text-sm font-semibold ${
            value > 21
              ? "bg-red-600/80 text-white"
              : value === 21
                ? "bg-gold/90 text-felt-dark"
                : "bg-black/50 text-white"
          }`}
        >
          {hideFirstCard && cards.length >= 2 ? "?" : value}
        </div>
      )}
    </div>
  );
}
