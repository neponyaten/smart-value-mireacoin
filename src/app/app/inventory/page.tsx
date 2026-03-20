"use client";

import { AppTopBar } from "@/components/layout/AppTopBar";
import { useAppStore, staticCatalog } from "@/store/useAppStore";
import { useEffect } from "react";
import Image from "next/image";
import { NeonButton } from "@/components/ui/NeonButton";

export default function InventoryPage() {
  const user = useAppStore((s) => s.user);
  const setActiveCoin = useAppStore((s) => s.setActiveCoin);
  const setActiveVfx = useAppStore((s) => s.setActiveVfx);
  const loadLedger = useAppStore((s) => s.loadLedger);
  const ledger = useAppStore((s) => s.ledger);

  const coins = staticCatalog.coins;
  const vfx = staticCatalog.vfx;

  useEffect(() => {
    loadLedger();
  }, [loadLedger]);

  if (!user || user.hideInventory) {
    return (
      <main className="px-4 pt-6">
        <div className="mx-auto w-full max-w-2xl">
          <AppTopBar />
          <div className="mt-8 text-center text-slate-400">
            <p className="text-sm">Инвентарь скрыт</p>
          </div>
        </div>
      </main>
    );
  }

  const ownedCoins = coins.filter((c) => user.ownedCoinIds.includes(c.id));
  const ownedVfx = vfx.filter((v) => user.ownedVfxIds.includes(v.id));

  return (
    <main className="px-4 pt-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <AppTopBar />

        <section>
          <h2 className="text-lg font-bold text-cyan-100 mb-3">💎 Монеты</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {ownedCoins.map((coin) => (
              <div
                key={coin.id}
                className="rounded-2xl border border-cyan-200/20 bg-slate-900/40 overflow-hidden hover:border-cyan-200/60 transition"
              >
                <div className="relative w-full h-28 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <Image src={coin.image} alt={coin.name} width={70} height={70} className="" />
                </div>

                <div className="p-3">
                  <p className="text-xs font-semibold text-slate-100 truncate">{coin.name}</p>
                  <p className="text-xs text-slate-500 mb-2">{coin.rarity}</p>

                  {user.activeCoinId === coin.id ? (
                    <div className="w-full py-1.5 rounded text-xs font-semibold text-center bg-emerald-300/15 border border-emerald-300/30 text-emerald-300">
                      Активна
                    </div>
                  ) : (
                    <NeonButton
                      onClick={() => setActiveCoin(coin.id)}
                      className="w-full py-1.5 text-xs"
                    >
                      Выбрать
                    </NeonButton>
                  )}
                </div>
              </div>
            ))}
          </div>
          {ownedCoins.length === 0 && <p className="text-slate-500 text-sm">Нет монет в инвентаре</p>}
        </section>

        <section>
          <h2 className="text-lg font-bold text-cyan-100 mb-3">✨ VFX</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {ownedVfx.map((v) => (
              <div
                key={v.id}
                className="rounded-2xl border border-cyan-200/20 bg-slate-900/40 overflow-hidden hover:border-cyan-200/60 transition"
              >
                <div className="relative w-full h-28 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-3xl">
                  ✨
                </div>

                <div className="p-3">
                  <p className="text-xs font-semibold text-slate-100 truncate">{v.name}</p>
                  <p className="text-xs text-slate-500 mb-2">{v.tier}</p>

                  {user.activeVfxId === v.id ? (
                    <div className="w-full py-1.5 rounded text-xs font-semibold text-center bg-emerald-300/15 border border-emerald-300/30 text-emerald-300">
                      Активен
                    </div>
                  ) : (
                    <NeonButton
                      onClick={() => setActiveVfx(v.id)}
                      className="w-full py-1.5 text-xs"
                    >
                      Выбрать
                    </NeonButton>
                  )}
                </div>
              </div>
            ))}
          </div>
          {ownedVfx.length === 0 && <p className="text-slate-500 text-sm">Нет VFX в инвентаре</p>}
        </section>

        <section>
          <h2 className="text-lg font-bold text-cyan-100 mb-3">📊 История</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {ledger.length === 0 ? (
              <p className="text-slate-500 text-sm">История пуста</p>
            ) : (
              ledger.slice(0, 10).map((item) => (
                <div key={item.id} className="px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/50 flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  <p className={`text-sm font-bold ${item.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {item.amount > 0 ? "+" : ""}{item.amount}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
