"use client";

import { AppTopBar } from "@/components/layout/AppTopBar";
import { ReportDialog } from "@/components/social/ReportDialog";
import { fromNowLabel } from "@/components/social/time";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { apiClient } from "@/lib/api/client";
import type { ActiveUserItem, FeedStatusItem, TopUser } from "@/lib/types/domain";
import { useAppStore } from "@/store/useAppStore";
import { formatCoins } from "@/lib/utils/format";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const syncAttendance = useAppStore((s) => s.syncAttendance);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [feed, setFeed] = useState<FeedStatusItem[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUserItem[]>([]);
  const [newStatus, setNewStatus] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [reportUserId, setReportUserId] = useState<string | null>(null);
  const [reportStatusId, setReportStatusId] = useState<string | null>(null);

  const me = user?.id || "";

  const loadSocial = async () => {
    const [top, statuses, active] = await Promise.all([
      apiClient.topUsers(),
      apiClient.statusFeed(20),
      apiClient.activeUsers(),
    ]);

    setTopUsers(top.users);
    setFeed(statuses.items);
    setActiveUsers(active.users);
  };

  useEffect(() => {
    void loadSocial();

    const heartbeat = setInterval(() => {
      void apiClient.heartbeat().catch(() => undefined);
    }, 60_000);

    const refresh = setInterval(() => {
      void loadSocial().catch(() => undefined);
    }, 30_000);

    return () => {
      clearInterval(heartbeat);
      clearInterval(refresh);
    };
  }, []);

  const topThree = useMemo(() => new Set(topUsers.slice(0, 3).map((entry) => entry.id)), [topUsers]);

  return (
    <main className="px-4 pt-6">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <AppTopBar onSync={syncAttendance} />

        <section className="premium-card rounded-2xl p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Top 10</p>
              <h2 className="text-lg font-semibold text-slate-100">Лидеры MireaCoin</h2>
            </div>
            <Link href="/app/leaderboard" className="text-xs text-cyan-200 hover:text-cyan-100 transition">
              Открыть полный рейтинг
            </Link>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {topUsers.map((entry) => (
              <Link
                href={`/users/${entry.id}`}
                key={entry.id}
                className={`rounded-xl border px-3 py-2 transition ${
                  topThree.has(entry.id)
                    ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_30px_-18px_rgba(34,211,238,0.85)]"
                    : "border-slate-700/70 bg-slate-900/40 hover:border-cyan-200/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 text-sm font-semibold text-cyan-200">#{entry.rank}</span>
                  <InitialsAvatar
                    userId={entry.id}
                    name={entry.firstName}
                    surname={entry.lastName}
                    displayName={entry.displayName}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-100">{entry.displayName}</p>
                    <p className="text-xs text-slate-400">{formatCoins(entry.balance)} MC</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="premium-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-100">Новый статус</h3>
                <span className="text-xs text-slate-500">до 200 символов</span>
              </div>

              <textarea
                value={newStatus}
                onChange={(event) => setNewStatus(event.target.value.slice(0, 200))}
                rows={3}
                placeholder="Поделись, что происходит сейчас"
                className="mt-3 w-full rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/50"
              />

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">{statusMessage || "Обновление статуса доступно раз в час"}</p>
                <button
                  disabled={isBusy}
                  onClick={async () => {
                    try {
                      setIsBusy(true);
                      setStatusMessage("");
                      await apiClient.createOrUpdateStatus(newStatus);
                      setNewStatus("");
                      setStatusMessage("Статус опубликован");
                      await loadSocial();
                    } catch (error) {
                      setStatusMessage((error as Error).message || "Не удалось обновить статус");
                    } finally {
                      setIsBusy(false);
                    }
                  }}
                  className="premium-btn-primary rounded-xl px-4 py-2 text-sm font-semibold"
                >
                  Опубликовать
                </button>
              </div>
            </div>

            <div className="premium-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-100">Лента статусов</h3>
                <span className="text-xs text-slate-500">newest first</span>
              </div>

              <div className="mt-3 max-h-[560px] space-y-2 overflow-y-auto pr-1">
                {feed.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/users/${item.userId}`} className="flex items-center gap-2 min-w-0">
                        <InitialsAvatar
                          userId={item.userId}
                          name={item.firstName}
                          surname={item.lastName}
                          displayName={item.displayName}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-100">{item.displayName}</p>
                          <p className="text-xs text-slate-500">{fromNowLabel(item.updatedAt)}</p>
                        </div>
                      </Link>

                      <div className="flex items-center gap-2">
                        <Link href={`/users/${item.userId}`} className="text-xs text-cyan-200 hover:text-cyan-100 transition">
                          Профиль
                        </Link>
                        {item.userId !== me ? (
                          <button
                            className="text-xs text-slate-400 hover:text-red-300 transition"
                            onClick={() => setReportStatusId(item.id)}
                          >
                            Жалоба
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="premium-card h-fit rounded-2xl p-4">
            <h3 className="text-base font-semibold text-slate-100">Активные пользователи</h3>
            <div className="mt-3 space-y-2">
              {activeUsers.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/45 px-2.5 py-2"
                >
                  <Link href={`/users/${entry.id}`} className="flex min-w-0 flex-1 items-center gap-2 hover:opacity-95 transition">
                    <InitialsAvatar
                      userId={entry.id}
                      name={entry.firstName}
                      surname={entry.lastName}
                      displayName={entry.displayName}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-slate-100">{entry.displayName}</p>
                      <p className="text-[11px] text-slate-500">
                        {entry.isOnline ? "online" : `в сети ${fromNowLabel(entry.lastSeenAt)}`}
                      </p>
                    </div>
                  </Link>
                  <span className={`h-2 w-2 rounded-full ${entry.isOnline ? "bg-emerald-400" : "bg-slate-600"}`} />
                  {entry.id !== me ? (
                    <button
                      onClick={() => setReportUserId(entry.id)}
                      className="text-[11px] text-slate-500 hover:text-red-300 transition"
                    >
                      Жалоба
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </aside>
        </section>

        <div className="premium-card rounded-2xl p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-cyan-200 mb-1">Баланс</p>
          <div className="text-3xl font-bold text-cyan-100">{formatCoins(user?.balance ?? 0)}</div>
          <p className="text-xs text-slate-400 mt-2">MireaCoin в активе</p>
        </div>

        <ReportDialog
          title="Жалоба на пользователя"
          open={Boolean(reportUserId)}
          onClose={() => setReportUserId(null)}
          onSubmit={async (reason) => {
            if (!reportUserId) {
              return;
            }
            await apiClient.reportUser(reportUserId, reason);
          }}
        />

        <ReportDialog
          title="Жалоба на статус"
          open={Boolean(reportStatusId)}
          onClose={() => setReportStatusId(null)}
          onSubmit={async (reason) => {
            if (!reportStatusId) {
              return;
            }
            await apiClient.reportStatus(reportStatusId, reason);
          }}
        />
      </div>
    </main>
  );
}
