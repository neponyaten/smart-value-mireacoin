"use client";

import { ReportDialog } from "@/components/social/ReportDialog";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { apiClient } from "@/lib/api/client";
import type { PublicUserProfile } from "@/lib/types/domain";
import { formatCoins } from "@/lib/utils/format";

type PageProps = {
  params: Promise<{ id: string }>;
};

function rarityClass(rarity: string) {
  if (rarity === "ARTIFACT" || rarity === "LEGENDARY") {
    return "text-amber-200 border-amber-200/40 bg-amber-300/10";
  }
  if (rarity === "EPIC") {
    return "text-violet-200 border-violet-200/40 bg-violet-300/10";
  }
  if (rarity === "RARE") {
    return "text-cyan-200 border-cyan-200/40 bg-cyan-300/10";
  }
  return "text-slate-200 border-slate-300/30 bg-slate-300/10";
}

export default function PublicUserPage({ params }: PageProps) {
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [viewText, setViewText] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const resolved = await params;
        if (!mounted) {
          return;
        }

        setUserId(resolved.id);
        const response = await apiClient.publicProfile(resolved.id);
        if (!mounted) {
          return;
        }

        setProfile(response.profile);
        if (resolved.id) {
          try {
            const view = await apiClient.registerProfileView(resolved.id);
            setViewText(view.counted ? "+1 просмотр профиля" : "Просмотр уже учитывался за последние 24 часа");
          } catch {
            setViewText("");
          }
        }
        setError("");
      } catch (err) {
        if (mounted) {
          setError((err as Error).message || "Не удалось загрузить профиль");
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [params]);

  const hasContacts = useMemo(() => {
    return Boolean(profile?.contacts.telegramUrl || profile?.contacts.vkUrl || profile?.contacts.maxUrl);
  }, [profile]);

  return (
    <main className="px-4 pt-6 pb-10">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <AppTopBar />

        <div className="premium-card rounded-2xl p-4">
          <Link
            href="/app/leaderboard"
            className="text-xs uppercase tracking-[0.2em] text-cyan-300/80 hover:text-cyan-200 transition"
          >
            Назад к лидерборду
          </Link>

          {loading ? (
            <p className="mt-4 text-sm text-slate-400">Загружаем профиль...</p>
          ) : null}

          {!loading && error ? (
            <div className="mt-4 rounded-xl border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {!loading && !error && profile ? (
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                <div className="premium-card rounded-2xl p-4 flex flex-col items-center text-center">
                  <InitialsAvatar
                    userId={profile.id}
                    name={profile.firstName}
                    surname={profile.lastName}
                    displayName={profile.displayName}
                    size="lg"
                  />
                  <p className="mt-3 text-sm font-semibold text-slate-100">#{profile.rank} в топе</p>
                  <p className="text-xs text-cyan-200">{formatCoins(profile.balance)} MC</p>
                  <p className="mt-1 text-xs text-slate-400">{profile.profileViews} просмотров</p>
                </div>

                <div className="premium-card rounded-2xl p-4">
                  <h1 className="text-2xl font-bold text-cyan-100">{profile.displayName}</h1>
                  {profile.group ? <p className="mt-1 text-sm text-slate-400">{profile.group}</p> : null}
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{profile.bio || "Пользователь пока не добавил bio."}</p>
                  {viewText ? <p className="mt-2 text-xs text-slate-500">{viewText}</p> : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-cyan-200/30 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-100"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <button
                    className="mt-4 rounded-lg border border-red-400/35 bg-red-400/10 px-3 py-1.5 text-xs text-red-200 hover:border-red-300/60 transition"
                    onClick={() => setReportOpen(true)}
                  >
                    Пожаловаться на профиль
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="premium-card rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Активные предметы</p>
                  <div className="mt-3 grid gap-2">
                    {profile.showcase.map((item) => (
                      <div key={item.id} className="rounded-xl border border-slate-700/70 bg-slate-900/40 px-3 py-2">
                        <p className="text-sm font-semibold text-slate-100">{item.name}</p>
                        <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] ${rarityClass(item.rarity)}`}>
                          {item.category} · {item.rarity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="premium-card rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Контакты</p>
                  {hasContacts ? (
                    <div className="mt-3 space-y-2">
                      {profile.contacts.telegramUrl ? (
                        <a href={profile.contacts.telegramUrl} target="_blank" rel="noreferrer" className="block rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100 hover:border-cyan-200/60 transition">Telegram</a>
                      ) : null}
                      {profile.contacts.vkUrl ? (
                        <a href={profile.contacts.vkUrl} target="_blank" rel="noreferrer" className="block rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100 hover:border-cyan-200/60 transition">VK</a>
                      ) : null}
                      {profile.contacts.maxUrl ? (
                        <a href={profile.contacts.maxUrl} target="_blank" rel="noreferrer" className="block rounded-xl border border-cyan-200/30 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100 hover:border-cyan-200/60 transition">Max</a>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">Пользователь скрыл контакты.</p>
                  )}
                </div>
              </div>

              <div className="premium-card rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Витрина инвентаря</p>
                  {profile.inventory ? <span className="text-xs text-cyan-200">Полный инвентарь открыт</span> : <span className="text-xs text-slate-500">Показаны только активные предметы</span>}
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {(profile.inventory ?? profile.showcase).map((item) => (
                    <div key={`${item.category}-${item.id}`} className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-2">
                      <p className="text-sm font-semibold text-slate-100">{item.name}</p>
                      <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] ${rarityClass(item.rarity)}`}>
                        {item.category} · {item.rarity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {!loading && !error && !profile && userId ? (
          <div className="premium-card rounded-2xl p-4 text-sm text-slate-400">Профиль {userId} не найден.</div>
        ) : null}
      </div>

      <ReportDialog
        title="Жалоба на профиль"
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={async (reason) => {
          if (!profile) {
            return;
          }
          await apiClient.reportUser(profile.id, reason);
        }}
      />
    </main>
  );
}
