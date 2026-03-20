"use client";

import { NeonButton } from "@/components/ui/NeonButton";
import { APP_VERSION } from "@/lib/constants/app";
import { formatCoins } from "@/lib/utils/format";
import { useAppStore } from "@/store/useAppStore";
import { Coins, RefreshCcw } from "lucide-react";

type AppTopBarProps = {
  onSync?: () => Promise<void> | void;
};

export function AppTopBar({ onSync }: AppTopBarProps) {
  const user = useAppStore((state) => state.user);
  const isBusy = useAppStore((state) => state.isBusy);

  return (
    <header className="premium-card rounded-3xl px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/75">MireaCoin</p>
          <h1 className="text-base font-semibold text-slate-100">{user?.group ?? "Student App"}</h1>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-cyan-200/70">{APP_VERSION}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-full border border-cyan-200/20 bg-slate-900/60 px-3 py-1.5 text-xs text-cyan-100">
            <span className="inline-flex items-center gap-1">
              <Coins className="size-3.5" />
              {formatCoins(user?.balance ?? 0)} MC
            </span>
          </div>
          {onSync ? (
            <NeonButton onClick={onSync} disabled={isBusy} className="px-3 py-1.5 text-xs">
              <RefreshCcw className="mr-1 size-3.5" />
              Sync
            </NeonButton>
          ) : null}
        </div>
      </div>
    </header>
  );
}
