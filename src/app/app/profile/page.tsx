"use client";

import { AppTopBar } from "@/components/layout/AppTopBar";
import { AchievementGrid } from "@/components/achievements/AchievementGrid";
import { ProgressBar } from "@/components/achievements/ProgressBar";
import { AchievementTabs } from "@/components/achievements/AchievementTabs";
import { NeonButton } from "@/components/ui/NeonButton";
import { apiClient } from "@/lib/api/client";
import type { AchievementCategory, AchievementProgress, UserAchievementView } from "@/lib/types/domain";
import { formatCoins, initials } from "@/lib/utils/format";
import { useAppStore, staticCatalog } from "@/store/useAppStore";
import { useUIStore } from "@/store/useUIStore";
import { LogOut, Copy, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const setUser = useAppStore((s) => s.setUser);
  const isBusy = useAppStore((s) => s.isBusy);
  const pushToast = useUIStore((s) => s.pushToast);
  const loadNotifications = useUIStore((s) => s.loadNotifications);

  const [copied, setCopied] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [statusText, setStatusText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isStatusBusy, setIsStatusBusy] = useState(false);
  const [achievements, setAchievements] = useState<UserAchievementView[]>([]);
  const [progress, setProgress] = useState<AchievementProgress>({ unlocked: 0, total: 0, percent: 0 });
  const [achievementTab, setAchievementTab] = useState<AchievementCategory>("study");
  const [achievementsBusy, setAchievementsBusy] = useState(false);
  const [didAutoUnlock, setDidAutoUnlock] = useState(false);
  const [profileMeta, setProfileMeta] = useState({ rank: 0, views: 0, badges: 0 });
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

  const userId = user?.id ?? "";

  const activeCoin = staticCatalog.coins.find((coin) => coin.id === user?.activeCoinId);
  const activeVfx = staticCatalog.vfx.find((vfx) => vfx.id === user?.activeVfxId);

  useEffect(() => {
    if (!user) {
      return;
    }

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
  }, [user]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isMounted = true;

    const loadMyStatus = async () => {
      try {
        const response = await apiClient.statusFeed(50);
        if (!isMounted) {
          return;
        }
        const ownStatus = response.items.find((item) => item.userId === userId);
        setStatusText(ownStatus?.text ?? "");
      } catch {
        if (isMounted) {
          setStatusMessage("Не удалось загрузить текущий статус");
        }
      }
    };

    void loadMyStatus();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let disposed = false;

    const loadProfileMeta = async () => {
      try {
        const result = await apiClient.publicProfile(userId);
        if (!disposed) {
          setProfileMeta({
            rank: result.profile.rank,
            views: result.profile.profileViews,
            badges: result.profile.badges.length,
          });
        }
      } catch {
        if (!disposed) {
          setProfileMeta({ rank: 0, views: 0, badges: 0 });
        }
      }
    };

    void loadProfileMeta();

    return () => {
      disposed = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let disposed = false;

    const loadAchievements = async () => {
      try {
        const response = await apiClient.getUserAchievements();
        if (!disposed) {
          setAchievements(response.items);
          setProgress(response.progress);
        }
      } catch {
        if (!disposed) {
          setAchievements([]);
          setProgress({ unlocked: 0, total: 0, percent: 0 });
        }
      }
    };

    const autoUnlock = async () => {
      if (didAutoUnlock) {
        return;
      }

      const unlockCandidates: string[] = ["ach-first-login"];
      if (user.balance >= 1000) {
        unlockCandidates.push("ach-1000-mc");
      }

      for (const achievementId of unlockCandidates) {
        try {
          const result = await apiClient.unlockAchievement(achievementId);
          if (disposed) {
            return;
          }

          setUser({ ...user, balance: result.newBalance, coins: result.newBalance });
          pushToast({
            type: "achievement",
            title: `🎉 Новое достижение: ${result.achievement.title}`,
            message: `+${result.rewardDelta} MC`,
          });
          await loadNotifications(20);
        } catch {
          // Ignore duplicate unlock attempts.
        }
      }

      if (!disposed) {
        setDidAutoUnlock(true);
      }
    };

    void (async () => {
      await autoUnlock();
      await loadAchievements();
    })();

    return () => {
      disposed = true;
    };
  }, [didAutoUnlock, loadNotifications, pushToast, setUser, user]);

  if (!user) {
    return null;
  }

  const canShowTelegram = useMemo(() => Boolean(form.telegramUrl.trim()), [form.telegramUrl]);
  const canShowVk = useMemo(() => Boolean(form.vkUrl.trim()), [form.vkUrl]);
  const canShowMax = useMemo(() => Boolean(form.maxUrl.trim()), [form.maxUrl]);
  const totalOwnedItems = useMemo(() => user.ownedCoinIds.length + user.ownedVfxIds.length, [user]);

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

  const handleSaveStatus = async () => {
    try {
      setStatusMessage("");
      setIsStatusBusy(true);
      await apiClient.createOrUpdateStatus(statusText);
      setStatusMessage("Статус сохранен");
    } catch (error) {
      setStatusMessage((error as Error).message || "Не удалось обновить статус");
    } finally {
      setIsStatusBusy(false);
    }
  };

  const handleUnlockAchievement = async (achievementId: string) => {
    try {
      setAchievementsBusy(true);
      const result = await apiClient.unlockAchievement(achievementId);
      setUser({ ...user, balance: result.newBalance, coins: result.newBalance });
      pushToast({
        type: "achievement",
        title: `🎉 Новое достижение: ${result.achievement.title}`,
        message: `+${result.rewardDelta} MC`,
      });

      const [achievementState] = await Promise.all([apiClient.getUserAchievements(), loadNotifications(30)]);
      setAchievements(achievementState.items);
      setProgress(achievementState.progress);
    } catch (error) {
      pushToast({
        type: "system",
        title: "Не удалось открыть достижение",
        message: (error as Error).message || "Повторите попытку позже",
      });
    } finally {
      setAchievementsBusy(false);
    }
  };

  return (
    <main className="px-4 pt-6">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <AppTopBar />

        <section className="premium-card overflow-hidden rounded-3xl">
          <div className="h-24 bg-gradient-to-r from-cyan-400/25 via-blue-400/18 to-cyan-300/16" />

          <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6">
            <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-2 border-cyan-300/35 bg-slate-800 text-3xl font-bold text-cyan-100 shadow-[0_0_32px_rgba(34,211,238,0.16)]">
                  {initials(user.fullName)}
                </div>
                <div className="min-w-0 pb-1">
                  <h1 className="truncate text-2xl font-bold text-slate-100">{user.fullName}</h1>
                  <p className="text-sm text-slate-400">{user.group}</p>
                  <div className="mt-1 inline-flex items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-0.5 text-[11px] text-cyan-100">
                    {user.role === "STUDENT" ? "Студент" : "Староста"}
                  </div>
                </div>
              </div>

              <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2">
                <button
                  onClick={copyReferral}
                  className="premium-card flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-blue-100 transition hover:border-blue-200/60"
                >
                  <Copy className="size-4" />
                  {copied ? "Ссылка скопирована" : `Реферал: ${user.referralCode}`}
                </button>
                <NeonButton onClick={handleLogout} disabled={isBusy} className="justify-center px-4 py-2 text-sm">
                  <LogOut className="mr-2 size-4" />
                  Выйти
                </NeonButton>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="premium-card rounded-xl px-3 py-2.5">
                <p className="text-xs uppercase tracking-widest text-slate-400">Баланс</p>
                <p className="mt-1 text-lg font-bold text-cyan-100">{formatCoins(user.balance)} MC</p>
              </div>
              <div className="premium-card rounded-xl px-3 py-2.5">
                <p className="text-xs uppercase tracking-widest text-slate-400">Student ID</p>
                <p className="mt-1 text-sm font-mono text-cyan-100">{user.studentId}</p>
              </div>
              <div className="premium-card rounded-xl px-3 py-2.5">
                <p className="text-xs uppercase tracking-widest text-slate-400">Активная монета</p>
                <p className="mt-1 text-sm text-slate-100">{activeCoin?.name ?? "Не выбрана"}</p>
              </div>
              <div className="premium-card rounded-xl px-3 py-2.5">
                <p className="text-xs uppercase tracking-widest text-slate-400">Активный VFX</p>
                <p className="mt-1 text-sm text-slate-100">{activeVfx?.name ?? "Не выбран"}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <div className="premium-card rounded-2xl p-4 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Public Profile</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-100">Настройки приватности и контактов</h2>
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

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="premium-card flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-200">
                  <span>Показывать группу</span>
                  <input
                    type="checkbox"
                    checked={form.showGroup}
                    onChange={(event) => setForm((prev) => ({ ...prev, showGroup: event.target.checked }))}
                    className="size-4 accent-cyan-400"
                  />
                </label>
                <label className="premium-card flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-200">
                  <span>Открыть инвентарь</span>
                  <input
                    type="checkbox"
                    checked={form.showInventory}
                    onChange={(event) => setForm((prev) => ({ ...prev, showInventory: event.target.checked }))}
                    className="size-4 accent-cyan-400"
                  />
                </label>
              </div>

              <div className="space-y-3">
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
                    Показать Telegram
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
                    Показать VK
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
                    Показать Max
                  </label>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <NeonButton onClick={handleSaveSettings} disabled={isBusy} className="px-4 py-2 text-sm">
                  <Save className="mr-2 size-4" />
                  Сохранить настройки
                </NeonButton>
                {saveMessage ? <p className="text-xs text-slate-400">{saveMessage}</p> : null}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-7">
            <div className="premium-card rounded-2xl p-4 space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Status</p>
                <h3 className="mt-1 text-base font-semibold text-slate-100">Статус профиля</h3>
              </div>

              <textarea
                value={statusText}
                onChange={(event) => setStatusText(event.target.value.slice(0, 200))}
                rows={3}
                placeholder="Поделись, что происходит сейчас"
                className="w-full rounded-xl border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
              />

              <div className="flex flex-wrap items-center gap-3">
                <NeonButton onClick={handleSaveStatus} disabled={isStatusBusy} className="px-4 py-2 text-sm">
                  <Save className="mr-2 size-4" />
                  Сохранить статус
                </NeonButton>
                <p className="text-xs text-slate-400">
                  {statusMessage || "Статус можно обновлять не чаще одного раза в час"}
                </p>
              </div>
            </div>

            <div className="premium-card rounded-2xl p-4">
              <div className="mb-3">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Quick Stats</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-100">Сводка аккаунта</h2>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-2.5">
                  <p className="text-xs text-slate-400">Место в топе</p>
                  <p className="text-sm font-semibold text-cyan-100">{profileMeta.rank ? `#${profileMeta.rank}` : "-"}</p>
                </div>
                <div className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-2.5">
                  <p className="text-xs text-slate-400">Просмотры</p>
                  <p className="text-sm font-semibold text-cyan-100">{profileMeta.views}</p>
                </div>
                <div className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-2.5">
                  <p className="text-xs text-slate-400">Достижения</p>
                  <p className="text-sm font-semibold text-cyan-100">{progress.unlocked} / {progress.total}</p>
                </div>
                <div className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-2.5">
                  <p className="text-xs text-slate-400">Инвентарь</p>
                  <p className="text-sm font-semibold text-cyan-100">{totalOwnedItems} предметов</p>
                </div>
              </div>
            </div>

            <div className="premium-card rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Achievements</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-100">Достижения</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-cyan-100">{progress.percent}%</p>
                  <p className="text-xs text-slate-400">Прогресс</p>
                </div>
              </div>

              <ProgressBar value={progress.percent} />

              <AchievementTabs current={achievementTab} onChange={setAchievementTab} />

              <AchievementGrid items={achievements} category={achievementTab} />

              <div className="flex flex-wrap gap-2">
                {achievements
                  .filter((item) => !item.unlocked)
                  .slice(0, 2)
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      disabled={achievementsBusy}
                      onClick={() => void handleUnlockAchievement(item.id)}
                      className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100 transition hover:bg-cyan-300/15 disabled:opacity-70"
                    >
                      Получить: {item.title}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}