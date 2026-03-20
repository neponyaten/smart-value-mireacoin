"use client";

import { AppTopBar } from "@/components/layout/AppTopBar";
import { NeonButton } from "@/components/ui/NeonButton";
import { formatCoins, initials } from "@/lib/utils/format";
import { useAppStore, staticCatalog } from "@/store/useAppStore";
import { LogOut, Copy, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const isBusy = useAppStore((s) => s.isBusy);

  const [copied, setCopied] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [form, setForm] = useState({
    bio: "",
    showInventory: true,
    showGroup: true,
    showTelegram: false,
    showVk: false,
    showMax: false,
    telegramUrl: "",
    vkUrl: "",
    maxUrl: "",
  });

  if (!user) {
    return null;
  }

  const activeCoin = staticCatalog.coins.find((coin) => coin.id === user.activeCoinId);
  const activeVfx = staticCatalog.vfx.find((vfx) => vfx.id === user.activeVfxId);

  useEffect(() => {
    setForm({
      bio: user.bio || "",
      showInventory: user.showInventory ?? !user.hideInventory,
      showGroup: user.showGroup ?? true,
      showTelegram: user.showTelegram ?? false,
      showVk: user.showVk ?? false,
      showMax: user.showMax ?? false,
      telegramUrl: user.telegramUrl || "",
      vkUrl: user.vkUrl || "",
      maxUrl: user.maxUrl || "",
    });
  }, [
    user.bio,
    user.hideInventory,
    user.maxUrl,
    user.showGroup,
    user.showInventory,
    user.showMax,
    user.showTelegram,
    user.showVk,
    user.telegramUrl,
    user.vkUrl,
  ]);

  const canShowTelegram = useMemo(() => Boolean(form.telegramUrl.trim()), [form.telegramUrl]);
  const canShowVk = useMemo(() => Boolean(form.vkUrl.trim()), [form.vkUrl]);
  const canShowMax = useMemo(() => Boolean(form.maxUrl.trim()), [form.maxUrl]);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth");
  };

  const copyReferral = async () => {
    await navigator.clipboard.writeText(`https://mireacoin.app/invite/${user.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleSaveSettings = async () => {
    try {
      setSaveMessage("");
      await updateProfile({
        bio: form.bio,
        showInventory: form.showInventory,
        showGroup: form.showGroup,
        showTelegram: form.showTelegram && canShowTelegram,
        showVk: form.showVk && canShowVk,
        showMax: form.showMax && canShowMax,
        telegramUrl: form.telegramUrl,
        vkUrl: form.vkUrl,
        maxUrl: form.maxUrl,
      });
      setSaveMessage("Настройки публичного профиля сохранены");
    } catch {
      setSaveMessage("Не удалось сохранить настройки");
    }
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

        <div className="premium-card rounded-2xl p-4 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Public Profile Settings</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-100">Настройка публичного профиля</h2>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-slate-400">Bio</span>
            <textarea
              value={form.bio}
              onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value.slice(0, 280) }))}
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
              placeholder="Коротко расскажи о себе"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="premium-card rounded-xl px-3 py-2 flex items-center justify-between text-sm text-slate-200">
              <span>Показывать группу</span>
              <input
                type="checkbox"
                checked={form.showGroup}
                onChange={(event) => setForm((prev) => ({ ...prev, showGroup: event.target.checked }))}
                className="size-4 accent-cyan-400"
              />
            </label>

            <label className="premium-card rounded-xl px-3 py-2 flex items-center justify-between text-sm text-slate-200">
              <span>Открыть полный инвентарь</span>
              <input
                type="checkbox"
                checked={form.showInventory}
                onChange={(event) => setForm((prev) => ({ ...prev, showInventory: event.target.checked }))}
                className="size-4 accent-cyan-400"
              />
            </label>
          </div>

          <div className="grid gap-3">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Telegram URL</span>
              <input
                value={form.telegramUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, telegramUrl: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
                placeholder="https://t.me/username"
              />
              <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.showTelegram}
                  disabled={!canShowTelegram}
                  onChange={(event) => setForm((prev) => ({ ...prev, showTelegram: event.target.checked }))}
                  className="size-4 accent-cyan-400 disabled:opacity-50"
                />
                Показать Telegram в публичном профиле
              </label>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">VK URL</span>
              <input
                value={form.vkUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, vkUrl: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
                placeholder="https://vk.com/username"
              />
              <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.showVk}
                  disabled={!canShowVk}
                  onChange={(event) => setForm((prev) => ({ ...prev, showVk: event.target.checked }))}
                  className="size-4 accent-cyan-400 disabled:opacity-50"
                />
                Показать VK в публичном профиле
              </label>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-widest text-slate-400">Max URL</span>
              <input
                value={form.maxUrl}
                onChange={(event) => setForm((prev) => ({ ...prev, maxUrl: event.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
                placeholder="https://max.ru/username"
              />
              <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.showMax}
                  disabled={!canShowMax}
                  onChange={(event) => setForm((prev) => ({ ...prev, showMax: event.target.checked }))}
                  className="size-4 accent-cyan-400 disabled:opacity-50"
                />
                Показать Max в публичном профиле
              </label>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <NeonButton onClick={handleSaveSettings} disabled={isBusy} className="px-4 py-2 text-sm">
              <Save className="mr-2 size-4" />
              Сохранить настройки
            </NeonButton>
            {saveMessage ? <p className="text-xs text-slate-400">{saveMessage}</p> : null}
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