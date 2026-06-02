"use client";

import { AppTopBar } from "@/components/layout/AppTopBar";
import { CoinRender } from "@/components/dashboard/CoinRender";
import { CoinSelector } from "@/components/dashboard/CoinSelector";
import { StatusLine } from "@/components/StatusLine";
import { useAppStore } from "@/store/useAppStore";

export default function DashboardPage() {
  const syncAttendance = useAppStore((s) => s.syncAttendance);

  return (
    <main className="px-4 pt-6">
      <div className="mx-auto w-full max-w-2xl space-y-5">
        <AppTopBar onSync={syncAttendance} />

        <CoinSelector />

        <CoinRender />

        <div className="premium-card rounded-2xl px-4 py-3 text-center">
          <StatusLine />
        </div>
      </div>
    </main>
  );
}
