"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function HistoryPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const ledger = useAppStore((s) => s.ledger ?? []);

  useEffect(() => {
    if (!user) router.replace("/auth");
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="px-4 pb-24 pt-6">
      <div className="mx-auto w-full max-w-md glass rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-neon">История</h1>

          <button
            onClick={() => router.push("/app")}
            className="px-4 py-2 rounded-full bg-black/40 border border-white/10 text-gray-200 hover:border-white/20 transition text-xs"
          >
            Назад
          </button>
        </div>

        <div className="text-xs text-gray-400 mb-3">
          Баланс: <span className="text-neon font-semibold">{user.coins}</span>
        </div>

        {ledger.length === 0 ? (
          <div className="text-sm text-gray-400">
            Пока нет записей. Скоро добавим авто-синхронизацию посещаемости.
          </div>
        ) : (
          <div className="space-y-3">
            {ledger.map((it) => (
              <div
                key={it.id}
                className="rounded-xl bg-black/30 border border-white/10 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-white font-semibold">
                      {it.title}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(it.createdAt).toLocaleString()} • {it.type}
                    </div>
                  </div>

                  <div
                    className={[
                      "text-sm font-bold",
                      it.delta >= 0 ? "text-neon" : "text-red-400",
                    ].join(" ")}
                  >
                    {it.delta >= 0 ? `+${it.delta}` : it.delta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}