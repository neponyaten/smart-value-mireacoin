"use client";

import { AppTopBar } from "@/components/layout/AppTopBar";
import { CoinRender } from "@/components/dashboard/CoinRender";
import { CoinSelector } from "@/components/dashboard/CoinSelector";
import { NeonButton } from "@/components/ui/NeonButton";
import { useAppStore } from "@/store/useAppStore";
import { formatCoins } from "@/lib/utils/format";
import Link from "next/link";

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const syncAttendance = useAppStore((s) => s.syncAttendance);

  return (
    <main className="px-4 pt-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <AppTopBar onSync={syncAttendance} />

        <CoinRender />

        <CoinSelector />

        <div className="premium-card rounded-2xl p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-cyan-200 mb-1">Баланс</p>
          <div className="text-3xl font-bold text-cyan-100">{formatCoins(user?.balance ?? 0)}</div>
          <p className="text-xs text-slate-400 mt-2">MireaCoin в активе</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Link href="/app/shop">
            <NeonButton className="w-full justify-center">🛒 Маркет</NeonButton>
          </Link>
          <Link href="/app/profile">
            <NeonButton className="w-full justify-center">👤 Профиль</NeonButton>
          </Link>
        </div>

        <p className="text-xs text-slate-500 text-center">Синхронизируйте посещаемость, чтобы получить награды</p>
      </div>
    </main>
  );
}
