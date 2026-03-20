"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { formatCoins } from "@/lib/utils/format";
import { staticCatalog, useAppStore } from "@/store/useAppStore";

type Tab = "ALL" | "COIN" | "VFX";

export default function ShopPage() {
  const user = useAppStore((s) => s.user);
  const marketItems = useAppStore((s) => s.marketItems);
  const loadMarket = useAppStore((s) => s.loadMarket);
  const purchaseItem = useAppStore((s) => s.purchaseItem);
  const isBusy = useAppStore((s) => s.isBusy);
  const error = useAppStore((s) => s.error);

  const [tab, setTab] = useState<Tab>("ALL");

  useEffect(() => {
    void loadMarket();
  }, [loadMarket]);

  const filteredItems = useMemo(() => {
    if (tab === "ALL") {
      return marketItems;
    }
    return marketItems.filter((item) => item.category === tab);
  }, [marketItems, tab]);

  const isOwned = (category: "COIN" | "VFX", itemId: string) => {
    if (!user) return false;
    return category === "COIN"
      ? user.ownedCoinIds.includes(itemId)
      : user.ownedVfxIds.includes(itemId);
  };

  return (
    <main className="px-4 pt-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <AppTopBar />

        <div className="flex flex-wrap gap-2">
          {["ALL", "COIN", "VFX"].map((kind) => (
            <button
              key={kind}
              onClick={() => setTab(kind as Tab)}
              className={[
                "px-4 py-2 text-sm font-medium rounded-full border transition",
                tab === kind
                  ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-100"
                  : "border-slate-600/40 bg-slate-800/30 text-slate-400 hover:border-slate-500/60",
              ].join(" ")}
            >
              {kind === "ALL" ? "Все" : kind === "COIN" ? "Монеты" : "VFX"}
            </button>
          ))}
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          {filteredItems.map((item) => {
            const coin = item.category === "COIN"
              ? staticCatalog.coins.find((entry) => entry.id === item.itemId)
              : null;
            const vfx = item.category === "VFX"
              ? staticCatalog.vfx.find((entry) => entry.id === item.itemId)
              : null;

            const title = coin?.name ?? vfx?.name ?? "Item";
            const subtitle = coin?.rarity ?? vfx?.tier ?? "BASE";
            const owned = isOwned(item.category, item.itemId);
            const canAfford = (user?.balance ?? 0) >= item.price;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-cyan-200/20 bg-slate-900/40 overflow-hidden hover:border-cyan-200/60 transition"
              >
                <div className="relative h-36 w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  {coin ? (
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={92}
                      height={92}
                      className={item.featured ? "drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]" : ""}
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full border border-cyan-200/30 bg-cyan-300/10" />
                  )}
                </div>

                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-100">{title}</p>
                  <p className="text-xs text-slate-400 mt-1">{subtitle}</p>

                  {owned ? (
                    <div className="mt-4 w-full rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-center text-xs font-semibold text-emerald-200">
                      Уже в инвентаре
                    </div>
                  ) : (
                    <button
                      disabled={!canAfford || isBusy}
                      onClick={() => void purchaseItem(item.id)}
                      className={[
                        "mt-4 w-full rounded-lg border px-3 py-2 text-xs font-semibold transition",
                        !canAfford
                          ? "border-red-400/35 bg-red-400/10 text-red-300 cursor-not-allowed"
                          : "border-cyan-300/40 bg-cyan-300/10 text-cyan-100 hover:border-cyan-300/70",
                      ].join(" ")}
                    >
                      {canAfford ? `${formatCoins(item.price)} MC` : "Недостаточно MC"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}