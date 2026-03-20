"use client";

import { useAppStore } from "@/store/useAppStore";

export default function HistoryPage() {
  const ledger = useAppStore((s) => s.ledger) ?? [];

  return (
    <main className="px-4 pb-24 pt-6">
      <div className="mx-auto w-full max-w-md glass rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-neon">История</h1>
        </div>

        {ledger.length === 0 ? (
          <div className="text-sm text-gray-400">
            Пока нет записей. Забери награду на “Главная” (в перерывах) — и тут появится запись.
          </div>
        ) : (
          <div className="space-y-3">
            {ledger.map((it) => (
              <div
                key={it.id}
                className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-sm text-gray-200">{it.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(it.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-sm font-semibold text-neon">
                  {it.amount > 0 ? `+${it.amount}` : it.amount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}