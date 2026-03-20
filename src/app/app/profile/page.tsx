"use client";

import { AppTopBar } from "@/components/layout/AppTopBar";
import { NeonButton } from "@/components/ui/NeonButton";
import { formatCoins, initials } from "@/lib/utils/format";
import { useAppStore, staticCatalog } from "@/store/useAppStore";
import { LogOut, Eye, EyeOff, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const setHideInventory = useAppStore((s) => s.setHideInventory);
  const isBusy = useAppStore((s) => s.isBusy);

  const [copied, setCopied] = useState(false);

  if (!user) {
    return null;
  }

  const activeCoin = staticCatalog.coins.find((coin) => coin.id === user.activeCoinId);
  const activeVfx = staticCatalog.vfx.find((vfx) => vfx.id === user.activeVfxId);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
  };

  const toggleHideInventory = async () => {
    await setHideInventory(!user.hideInventory);
  };

  const copyReferral = async () => {
    await navigator.clipboard.writeText(`https://mireacoin.app/invite/${user.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <main className="px-4 pt-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <AppTopBar />

        <div className="premium-card rounded-3xl overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-cyan-400/20 to-blue-400/15" />

          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-6">
              <div className="w-24 h-24 rounded-2xl border-2 border-cyan-300/40 bg-slate-800 flex items-center justify-center text-3xl font-bold text-cyan-100 shadow-[0_0_32px_rgba(34,211,238,0.16)]">
                {initials(user.fullName)}
              </div>
              <div className="flex-1 pb-2">
                <h1 className="text-2xl font-bold text-slate-100">{user.fullName}</h1>
                <p className="text-sm text-slate-400">{user.group}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="premium-card flex justify-between items-center px-3 py-2 rounded-lg">
                <span className="text-xs uppercase tracking-widest text-slate-400">Role</span>
                <span className="text-sm font-semibold text-cyan-100">
                  {user.role === "STUDENT" ? "Студент" : "Староста"}
                </span>
              </div>

              <div className="premium-card flex justify-between items-center px-3 py-2 rounded-lg">
                <span className="text-xs uppercase tracking-widest text-slate-400">Student ID</span>
                <span className="text-sm font-mono text-cyan-100">{user.studentId}</span>
              </div>

              <div className="premium-card flex justify-between items-center px-3 py-2 rounded-lg">
                <span className="text-xs uppercase tracking-widest text-slate-400">Attendance</span>
                <span className="text-sm font-semibold text-emerald-400">{user.attendanceStatus}</span>
              </div>

              <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-400/20 to-blue-400/10 border border-cyan-300/30">
                <span className="text-xs uppercase tracking-widest text-cyan-300">Баланс</span>
                <span className="text-lg font-bold text-cyan-100">{formatCoins(user.balance)} MC</span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="premium-card rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Активная монета</p>
                <p className="mt-1 text-sm text-slate-100">{activeCoin?.name ?? "Не выбрана"}</p>
              </div>
              <div className="premium-card rounded-xl p-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Активный VFX</p>
                <p className="mt-1 text-sm text-slate-100">{activeVfx?.name ?? "Не выбран"}</p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={toggleHideInventory}
                disabled={isBusy}
                className="premium-card w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-cyan-100 hover:border-cyan-200/60 disabled:opacity-50 transition"
              >
                {user.hideInventory ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                {user.hideInventory ? "Показать инвентарь" : "Скрыть инвентарь"}
              </button>

              <button
                onClick={copyReferral}
                className="premium-card w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-blue-100 hover:border-blue-200/60 transition"
              >
                <Copy className="size-4" />
                {copied ? "Ссылка скопирована" : `Реферал: ${user.referralCode}`}
              </button>

              <NeonButton onClick={handleLogout} disabled={isBusy} className="w-full justify-center">
                <LogOut className="mr-2 size-4" />
                Выйти
              </NeonButton>
            </div>
          </div>
        </div>

        {user.role === "LEADER" && (
          <div className="premium-card rounded-2xl border-amber-200/30 bg-amber-400/10 p-4">
            <p className="text-xs uppercase tracking-widest text-amber-300 mb-2">Блок управления группой</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button className="rounded-xl border border-amber-200/30 bg-amber-200/10 px-3 py-2 text-sm text-amber-100 hover:bg-amber-200/15 transition">
                Начислить бонус группе
              </button>
              <button className="rounded-xl border border-amber-200/30 bg-amber-200/10 px-3 py-2 text-sm text-amber-100 hover:bg-amber-200/15 transition">
                Сформировать отчёт посещаемости
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}