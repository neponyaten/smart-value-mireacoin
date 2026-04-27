"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalUsers: number;
  pendingApplications: number;
  approvedApplications: number;
  reportsTotal: number;
  achievementsTotal: number;
  vfxTotal: number;
  notificationsTotal: number;
  activeUsers: number;
};

type AnalyticsData = {
  stats: Stats;
  recentApplications: Array<{ id: number; fullName: string; status: string; createdAt: string }>;
  recentReports: Array<{ id: number; targetType: string; reason: string; status: string; createdAt: string }>;
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/admin/analytics", { cache: "no-store" });
    const payload = (await response.json()) as { error?: string } & Partial<AnalyticsData>;
    if (!response.ok || !payload.stats) {
      throw new Error(payload.error || "Failed to load analytics");
    }
    setData(payload as AnalyticsData);
  }

  useEffect(() => {
    void load().catch((loadError: unknown) => {
      setError(loadError instanceof Error ? loadError.message : "Failed to load analytics");
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-2xl font-semibold">Admin Analytics</h1>
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        {!data ? <p className="mt-4 text-sm text-slate-400">Загрузка...</p> : null}

        {data ? (
          <>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric title="Users" value={data.stats.totalUsers} />
              <Metric title="Pending applications" value={data.stats.pendingApplications} />
              <Metric title="Reports" value={data.stats.reportsTotal} />
              <Metric title="Active (24h)" value={data.stats.activeUsers} />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded border border-slate-800 bg-slate-950/60 p-4">
                <h2 className="text-sm font-semibold">Recent Applications</h2>
                <div className="mt-2 grid gap-2 text-sm">
                  {data.recentApplications.map((item) => (
                    <div key={item.id} className="rounded border border-slate-800 p-2">
                      #{item.id} {item.fullName} / {item.status}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded border border-slate-800 bg-slate-950/60 p-4">
                <h2 className="text-sm font-semibold">Recent Reports</h2>
                <div className="mt-2 grid gap-2 text-sm">
                  {data.recentReports.map((item) => (
                    <div key={item.id} className="rounded border border-slate-800 p-2">
                      #{item.id} {item.targetType} / {item.status}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
