"use client";

import { useAppStore, staticCatalog } from "@/store/useAppStore";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export function CoinSelector() {
  const user = useAppStore((s) => s.user);
  const setActiveCoin = useAppStore((s) => s.setActiveCoin);

  const [currentIndex, setCurrentIndex] = useState(0);

  const owned = user?.ownedCoinIds ?? [];
  const coins = staticCatalog.coins;

  const navigate = (direction: 1 | -1) => {
    const nextIndex = (currentIndex + direction + coins.length) % coins.length;
    setCurrentIndex(nextIndex);
  };

  const onSelect = async (coinId: string) => {
    if (!owned.includes(coinId)) return;
    await setActiveCoin(coinId);
  };

  const currentCoin = coins[currentIndex];
  const isOwned = owned.includes(currentCoin.id);

  return (
    <div className="mt-4 rounded-2xl border border-cyan-200/20 bg-slate-900/40 backdrop-blur-md px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-cyan-200/30 hover:border-cyan-200/60 transition text-cyan-300"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="relative w-16 h-16">
            <Image src={currentCoin.image} alt={currentCoin.name} fill className={isOwned ? "" : "grayscale opacity-40"} />
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-slate-100">{currentCoin.name}</div>
            <div className={`text-xs ${isOwned ? "text-cyan-300" : "text-slate-500"}`}>
              {isOwned ? currentCoin.rarity : "Locked"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(1)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-cyan-200/30 hover:border-cyan-200/60 transition text-cyan-300"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      <button
        onClick={() => onSelect(currentCoin.id)}
        disabled={!isOwned}
          className="mt-3 w-full py-2.5 rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-sm font-semibold text-cyan-100 disabled:opacity-40 disabled:cursor-not-allowed hover:border-cyan-300/60 transition"
      >
        {isOwned && user?.activeCoinId === currentCoin.id ? "✓ Активна" : isOwned ? "Выбрать" : "Недоступна"}
      </button>
    </div>
  );
}
