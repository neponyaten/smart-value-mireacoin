"use client";

import { AdminActionDialog } from "@/components/admin/AdminActionDialog";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminSortHeader } from "@/components/admin/AdminSortHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminTableToolbar } from "@/components/admin/AdminTableToolbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ReportItem = {
  id: number;
  targetType: string;
  reason: string;
  details: string | null;
  status: string;
  createdAt: string;
  reporter: { id: number; fullName: string; email: string };
  targetUser: { id: number; fullName: string; email: string; isBlocked: boolean } | null;
  targetStatus: { id: number; text: string; userId: number } | null;
};

export default function AdminReportsPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [items, setItems] = useState<ReportItem[]>([]);
  const [search, setSearch] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [status, setStatus] = useState("");
  const [targetType, setTargetType] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{
    title: string;
    description: string;
    changes: string[];
    danger?: boolean;
    reportId: number;
    action: "resolve" | "reject" | "hide_status" | "restrict_user";
    optimistic?: (draft: ReportItem[]) => ReportItem[];
  } | null>(null);

  function syncUrl(nextPage: number, nextSortBy = sortBy, nextSortOrder = sortOrder) {
    const query = new URLSearchParams();
    if (search.trim()) query.set("search", search.trim());
    if (targetUser.trim()) query.set("targetUser", targetUser.trim());
    if (status) query.set("status", status);
    if (targetType) query.set("targetType", targetType);
    query.set("sortBy", nextSortBy);
    query.set("sortOrder", nextSortOrder);
    query.set("page", String(nextPage));
    router.replace(`${pathname}?${query.toString()}`);
  }

  async function load(nextPage = page, overrides?: { sortBy?: string; sortOrder?: "asc" | "desc" }) {
    setLoading(true);
    setError(null);
    try {
      const effectiveSortBy = overrides?.sortBy ?? sortBy;
      const effectiveSortOrder = overrides?.sortOrder ?? sortOrder;
      const query = new URLSearchParams();
      if (status) query.set("status", status);
      if (targetType) query.set("targetType", targetType);
      if (search.trim()) query.set("search", search.trim());
      if (targetUser.trim()) query.set("targetUser", targetUser.trim());
      query.set("sortBy", effectiveSortBy);
      query.set("sortOrder", effectiveSortOrder);
      query.set("page", String(nextPage));
      query.set("pageSize", String(pageSize));

      const response = await fetch(`/api/admin/reports?${query.toString()}`, { cache: "no-store" });
      const data = (await response.json()) as { error?: string; items?: ReportItem[]; total?: number; page?: number };
      if (!response.ok) {
        throw new Error(data.error || "Failed to load reports");
      }
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || nextPage);
      syncUrl(data.page || nextPage, effectiveSortBy, effectiveSortOrder);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  async function moderate(reportId: number, action: "resolve" | "reject" | "hide_status" | "restrict_user", optimistic?: (draft: ReportItem[]) => ReportItem[]) {
    const previous = items;
    if (optimistic) {
      setItems((draft) => optimistic(draft));
    }

    try {
      const response = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Moderation failed");
      }
      setSuccess("Действие применено");
      await load();
    } catch (moderationError) {
      if (optimistic) {
        setItems(previous);
      }
      setError(moderationError instanceof Error ? moderationError.message : "Moderation failed");
    }
  }

  function requestAction(params: {
    title: string;
    description: string;
    changes: string[];
    danger?: boolean;
    reportId: number;
    action: "resolve" | "reject" | "hide_status" | "restrict_user";
    optimistic?: (draft: ReportItem[]) => ReportItem[];
  }) {
    setConfirm(params);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-2xl font-semibold">Admin Reports</h1>

        <AdminTableToolbar>
          <input
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Поиск по причине, имени, email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <input
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Target user: id / имя / email"
            value={targetUser}
            onChange={(event) => setTargetUser(event.target.value)}
          />
          <select
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">Все</option>
            <option value="pending">pending</option>
            <option value="resolved">resolved</option>
            <option value="rejected">rejected</option>
          </select>
          <select
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={targetType}
            onChange={(event) => setTargetType(event.target.value)}
          >
            <option value="">Все типы</option>
            <option value="status">status</option>
            <option value="profile">profile</option>
            <option value="user">user</option>
          </select>
          <button className="rounded bg-sky-600 px-3 py-2 text-sm" onClick={() => void load(1)}>
            Обновить
          </button>
        </AdminTableToolbar>

        {success ? <p className="mt-4 text-sm text-emerald-300">{success}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        {loading ? <p className="mt-4 text-sm text-slate-400">Загрузка...</p> : null}

        <div className="mt-4">
          {items.length === 0 ? <AdminEmptyState title="Жалобы не найдены" /> : (
          <AdminTable>
            <thead>
              <tr className="border-b border-slate-800 text-slate-300">
                <th className="px-2 py-2">
                  <AdminSortHeader label="Created" sortKey="createdAt" currentSortBy={sortBy} currentSortOrder={sortOrder} onChange={(nextSortBy, nextSortOrder) => { setSortBy(nextSortBy); setSortOrder(nextSortOrder); void load(1, { sortBy: nextSortBy, sortOrder: nextSortOrder }); }} />
                </th>
                <th className="px-2 py-2">
                  <AdminSortHeader label="Status" sortKey="status" currentSortBy={sortBy} currentSortOrder={sortOrder} onChange={(nextSortBy, nextSortOrder) => { setSortBy(nextSortBy); setSortOrder(nextSortOrder); void load(1, { sortBy: nextSortBy, sortOrder: nextSortOrder }); }} />
                </th>
                <th className="px-2 py-2">
                  <AdminSortHeader label="Target" sortKey="targetType" currentSortBy={sortBy} currentSortOrder={sortOrder} onChange={(nextSortBy, nextSortOrder) => { setSortBy(nextSortBy); setSortOrder(nextSortOrder); void load(1, { sortBy: nextSortBy, sortOrder: nextSortOrder }); }} />
                </th>
                <th className="px-2 py-2">Reason</th>
                <th className="px-2 py-2">Reporter</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-900 align-top">
              <td className="px-2 py-2 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</td>
              <td className="px-2 py-2 text-xs text-slate-300">{item.status}</td>
              <td className="px-2 py-2 text-xs text-slate-300">{item.targetType}</td>
              <td className="px-2 py-2 text-xs text-slate-300">#{item.id} {item.reason}</td>
              <td className="px-2 py-2 text-xs text-slate-400">{item.reporter.fullName}<br />{item.reporter.email}</td>
              <td className="px-2 py-2">
                <div className="flex flex-wrap gap-2">
                  <button className="rounded bg-emerald-700 px-2 py-1 text-xs" onClick={() => requestAction({ title: "Подтвердите действие", description: `Жалоба #${item.id} будет отмечена как resolved`, changes: ["status: pending -> resolved"], reportId: item.id, action: "resolve", optimistic: (draft) => draft.map((entry) => entry.id === item.id ? { ...entry, status: "resolved" } : entry) })}>resolve</button>
                  <button className="rounded bg-amber-700 px-2 py-1 text-xs" onClick={() => requestAction({ title: "Подтвердите действие", description: `Жалоба #${item.id} будет отмечена как rejected`, changes: ["status: pending -> rejected"], reportId: item.id, action: "reject", optimistic: (draft) => draft.map((entry) => entry.id === item.id ? { ...entry, status: "rejected" } : entry) })}>reject</button>
                  {item.targetStatus ? (
                    <button className="rounded bg-slate-700 px-2 py-1 text-xs" onClick={() => requestAction({ title: "Скрыть статус?", description: `Текст статуса для жалобы #${item.id} будет скрыт модератором`, changes: ["status text -> [Скрыто модератором]"], reportId: item.id, action: "hide_status", danger: true })}>hide status</button>
                  ) : null}
                  {item.targetUser ? (
                    <button className="rounded bg-rose-800 px-2 py-1 text-xs" onClick={() => requestAction({ title: "Ограничить пользователя?", description: `Пользователь ${item.targetUser?.fullName ?? "пользователь"} будет ограничен по жалобе #${item.id}`, changes: ["target user -> blocked"], reportId: item.id, action: "restrict_user", danger: true })}>restrict user</button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
            </tbody>
          </AdminTable>
          )}

          <AdminPagination page={page} pageSize={pageSize} total={total} onPageChange={(nextPage) => void load(nextPage)} />
        </div>
      </div>

      <AdminActionDialog
        open={Boolean(confirm)}
        title={confirm?.title || ""}
        description={confirm?.description || ""}
        changes={confirm?.changes}
        danger={confirm?.danger}
        loading={actionLoading}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          setActionLoading(true);
          void moderate(confirm.reportId, confirm.action, confirm.optimistic)
            .finally(() => {
              setActionLoading(false);
              setConfirm(null);
            });
        }}
      />
    </main>
  );
}
