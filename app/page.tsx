"use client";

import { BetPanel } from "@/components/BetPanel";
import { GameSidebar } from "@/components/GameSidebar";
import { PlayingTable } from "@/components/PlayingTable";
import { ToastContainer } from "@/components/Toast";
import { useBlackjackGame } from "@/hooks/useBlackjackGame";

export default function HomePage() {
  const {
    state,
    playerValue,
    dealerValue,
    canAct,
    canDoubleDown,
    canDeal,
    setPendingBets,
    deal,
    hit,
    stand,
    doubleDown,
    dismissToast,
  } = useBlackjackGame();

  return (
    <main className="min-h-screen p-3 sm:p-6">
      <ToastContainer toasts={state.toasts} onDismiss={dismissToast} />

      <header className="mb-4 text-center sm:mb-6">
        <h1 className="font-display text-4xl tracking-widest text-gold drop-shadow-lg sm:text-5xl lg:text-6xl">
          Zach&apos;s Casino
        </h1>
        <p className="mt-1 text-sm text-white/50">Single-deck blackjack</p>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-[240px_1fr_260px] lg:gap-6">
        <aside className="order-3 glass-panel p-4 lg:order-1 lg:col-span-1">
          <GameSidebar wallet={state.wallet} history={state.history} />
        </aside>

        <section className="order-1 lg:order-2">
          <PlayingTable
            playerCards={state.playerCards}
            dealerCards={state.dealerCards}
            playerValue={playerValue}
            dealerValue={dealerValue}
            dealerHoleRevealed={state.dealerHoleRevealed}
            phase={state.phase}
          />
        </section>

        <aside className="order-2 glass-panel p-4 lg:order-3">
          <h3 className="mb-4 font-display text-xl tracking-wide text-gold">
            Place Your Bets
          </h3>
          <BetPanel
            pendingBets={state.pendingBets}
            wallet={state.wallet}
            canDeal={canDeal}
            canAct={canAct}
            canDoubleDown={canDoubleDown}
            isLoading={state.isLoading}
            onBetsChange={setPendingBets}
            onDeal={deal}
            onHit={hit}
            onStand={stand}
            onDoubleDown={doubleDown}
          />
        </aside>
      </div>

      {state.error && (
        <p className="mt-4 text-center text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}
    </main>
  );
}
