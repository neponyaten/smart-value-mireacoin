"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { ReportDialog } from "@/components/social/ReportDialog";
import { fromNowLabel } from "@/components/social/time";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { apiClient } from "@/lib/api/client";
import type { ActiveUserItem, FeedStatusItem } from "@/lib/types/domain";
import { formatCoins } from "@/lib/utils/format";
import { staticCatalog, useAppStore } from "@/store/useAppStore";

type Tab = "STUDENTS" | "GROUPS";

export default function LeaderboardPage() {
  const students = useAppStore((s) => s.leaderboardStudents);
  const groups = useAppStore((s) => s.leaderboardGroups);
  const loadLeaderboard = useAppStore((s) => s.loadLeaderboard);
  const currentUserId = useAppStore((s) => s.user?.id ?? "");

  const [tab, setTab] = useState<Tab>("STUDENTS");
  const [feed, setFeed] = useState<FeedStatusItem[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUserItem[]>([]);
  const [reportUserId, setReportUserId] = useState<string | null>(null);
  const [reportStatusId, setReportStatusId] = useState<string | null>(null);

  const loadSocial = async () => {
    const [statuses, active] = await Promise.all([apiClient.statusFeed(20), apiClient.activeUsers()]);
    setFeed(statuses.items);
    setActiveUsers(active.users);
  };

  useEffect(() => {
    void loadLeaderboard();
    void loadSocial();

    const timer = setInterval(() => {
      void loadLeaderboard();
      void loadSocial();
    }, 10_000);

    const heartbeat = setInterval(() => {
      void apiClient.heartbeat().catch(() => undefined);
    }, 60_000);

    return () => {
      clearInterval(timer);
      clearInterval(heartbeat);
    };
  }, [loadLeaderboard]);

  return (
    <main className="px-4 pt-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <AppTopBar />

        <h1 className="text-2xl font-bold text-center text-cyan-100">Лидерборд</h1>

        <div className="premium-card flex gap-2 rounded-xl p-1">
          {(["STUDENTS", "GROUPS"] as const).map((currentTab) => (
            <button
              key={currentTab}
              onClick={() => setTab(currentTab)}
              className={[
                "flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition",
                tab === currentTab
                  ? "border-cyan-300/70 bg-cyan-300/15 text-cyan-100 shadow-[0_0_24px_-12px_rgba(34,211,238,0.9)]"
                  : "border-slate-700/20 text-slate-400 hover:text-slate-300 hover:border-cyan-200/30",
              ].join(" ")}
            >
              {currentTab === "STUDENTS" ? "Топ студентов" : "Топ групп"}
            </button>
          ))}
        </div>

        <div className="premium-card rounded-2xl overflow-hidden">
          <div className="divide-y divide-slate-800">
            {tab === "STUDENTS"
              ? students.map((student) => {
                  const coin = staticCatalog.coins.find((item) => item.id === student.activeCoinId);

                  return (
                    <Link
                      key={student.id}
                      href={`/users/${student.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/40 transition"
                    >
                      <div className="w-8 text-lg font-bold text-center">
                        {student.rank === 1 ? "🥇" : student.rank === 2 ? "🥈" : student.rank === 3 ? "🥉" : student.rank}
                      </div>

                      <InitialsAvatar userId={student.id} displayName={student.fullName} size="sm" />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-100 truncate">{student.fullName}</p>
                        <p className="text-xs text-slate-500 truncate">{student.group}</p>
                      </div>

                      <div className="min-w-[110px] text-right">
                        <p className="text-sm font-bold text-cyan-100">{formatCoins(student.balance)} MC</p>
                        <p className="text-xs text-slate-500">{coin?.rarity ?? "COMMON"}</p>
                      </div>
                    </Link>
                  );
                })
              : groups.map((group) => (
                  <div
                    key={group.group}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/40 transition"
                  >
                    <div className="w-8 text-lg font-bold text-center">
                      {group.rank === 1 ? "🥇" : group.rank === 2 ? "🥈" : group.rank === 3 ? "🥉" : group.rank}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-100">{group.group}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-cyan-100">{formatCoins(group.totalBalance)} MC</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {tab === "STUDENTS" ? (
          <section className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div className="premium-card rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-100">Лента статусов</h2>
                <span className="text-xs text-slate-500">newest first</span>
              </div>

              <div className="mt-3 max-h-[560px] space-y-2 overflow-y-auto pr-1">
                {feed.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/users/${item.userId}`} className="flex min-w-0 items-center gap-2">
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
                        <Link href={`/users/${item.userId}`} className="text-xs text-cyan-200 transition hover:text-cyan-100">
                          Профиль
                        </Link>
                        {item.userId !== currentUserId ? (
                          <button
                            className="text-xs text-slate-400 transition hover:text-red-300"
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

            <aside className="premium-card h-fit rounded-2xl p-4">
              <h2 className="text-base font-semibold text-slate-100">Активные пользователи</h2>
              <div className="mt-3 space-y-2">
                {activeUsers.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/45 px-2.5 py-2"
                  >
                    <Link href={`/users/${entry.id}`} className="flex min-w-0 flex-1 items-center gap-2 transition hover:opacity-95">
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
                    {entry.id !== currentUserId ? (
                      <button
                        onClick={() => setReportUserId(entry.id)}
                        className="text-[11px] text-slate-500 transition hover:text-red-300"
                      >
                        Жалоба
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </aside>
          </section>
        ) : null}

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