"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import type { Bets } from "@/lib/game/types";

interface BetPanelProps {
  pendingBets: Bets;
  wallet: number;
  canDeal: boolean;
  canAct: boolean;
  canDoubleDown: boolean;
  isLoading: boolean;
  onBetsChange: (bets: Bets) => void;
  onDeal: (bets: Bets) => void;
  onHit: () => void;
  onStand: () => void;
  onDoubleDown: () => void;
}

export function BetPanel({
  pendingBets,
  wallet,
  canDeal,
  canAct,
  canDoubleDown,
  isLoading,
  onBetsChange,
  onDeal,
  onHit,
  onStand,
  onDoubleDown,
}: BetPanelProps) {
  const [main, setMain] = useState(String(pendingBets.main));
  const [pairs, setPairs] = useState(String(pendingBets.pairs));
  const [sameSuit, setSameSuit] = useState(String(pendingBets.sameSuit));

  useEffect(() => {
    if (canDeal) {
      setMain(String(pendingBets.main));
      setPairs(String(pendingBets.pairs));
      setSameSuit(String(pendingBets.sameSuit));
    }
  }, [canDeal, pendingBets]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const bets = {
      main: parseInt(main, 10) || 0,
      pairs: parseInt(pairs, 10) || 0,
      sameSuit: parseInt(sameSuit, 10) || 0,
    };
    onBetsChange(bets);
    onDeal(bets);
  };

  const updateBets = () => {
    onBetsChange({
      main: parseInt(main, 10) || 0,
      pairs: parseInt(pairs, 10) || 0,
      sameSuit: parseInt(sameSuit, 10) || 0,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          label="Main Bet"
          type="number"
          min={0}
          max={wallet}
          value={main}
          onChange={(e) => setMain(e.target.value)}
          onBlur={updateBets}
          disabled={!canDeal || isLoading}
        />
        <Input
          label="Pairs"
          hint="10:1 odds"
          type="number"
          min={0}
          max={wallet}
          value={pairs}
          onChange={(e) => setPairs(e.target.value)}
          onBlur={updateBets}
          disabled={!canDeal || isLoading}
        />
        <Input
          label="Same Suit"
          hint="6:1 odds"
          type="number"
          min={0}
          max={wallet}
          value={sameSuit}
          onChange={(e) => setSameSuit(e.target.value)}
          onBlur={updateBets}
          disabled={!canDeal || isLoading}
        />
        <Button
          type="submit"
          variant="gold"
          size="lg"
          disabled={!canDeal || isLoading}
          className="w-full"
        >
          {isLoading ? "Dealing..." : "Deal"}
        </Button>
      </form>

      <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
        <Button
          onClick={onHit}
          disabled={!canAct}
          className="w-full"
          aria-label="Hit - draw another card"
        >
          Hit
        </Button>
        <Button
          onClick={onStand}
          variant="secondary"
          disabled={!canAct}
          className="w-full"
          aria-label="Stand - end your turn"
        >
          Stand
        </Button>
        <Button
          onClick={onDoubleDown}
          variant="secondary"
          disabled={!canDoubleDown}
          className="w-full"
          aria-label="Double down - double bet and draw one card"
        >
          Double Down
        </Button>
      </div>
    </div>
  );
}
