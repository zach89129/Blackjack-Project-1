import type { HistoryEntry } from "@/lib/game/types";

interface GameSidebarProps {
  wallet: number;
  history: HistoryEntry[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

const typeStyles: Record<HistoryEntry["type"], string> = {
  win: "border-l-gold text-gold-light",
  loss: "border-l-red-500 text-red-300",
  push: "border-l-yellow-500 text-yellow-300",
  sideBet: "border-l-emerald-400 text-emerald-300",
};

const typeIcons: Record<HistoryEntry["type"], string> = {
  win: "▲",
  loss: "▼",
  push: "●",
  sideBet: "★",
};

export function GameSidebar({ wallet, history }: GameSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-6">
      <div className="rounded-xl border border-gold/30 bg-black/40 p-4 text-center backdrop-blur-sm">
        <p className="text-sm font-medium uppercase tracking-widest text-white/60">
          Wallet
        </p>
        <p className="font-display text-4xl text-gold transition-all duration-300 sm:text-5xl">
          {formatCurrency(wallet)}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm">
        <h3 className="border-b border-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-wider text-white/70">
          Round History
        </h3>
        <ul className="flex-1 overflow-y-auto p-2">
          {history.length === 0 ? (
            <li className="px-2 py-4 text-center text-sm text-white/40">
              No rounds played yet
            </li>
          ) : (
            history.map((entry) => (
              <li
                key={entry.id}
                className={`mb-2 border-l-2 bg-white/5 px-3 py-2 text-sm ${typeStyles[entry.type]}`}
              >
                <span className="mr-2 opacity-60">{typeIcons[entry.type]}</span>
                {entry.message}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
