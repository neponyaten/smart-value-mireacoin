"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminTableToolbar } from "@/components/admin/AdminTableToolbar";
import { getAdminActionLabel, getAdminActionMeta, getAdminActionOptions } from "@/lib/constants/adminActionLabels";

type ActivityItem = {
  id: number;
  actorRole: string | null;
  action: string;
  targetType: string | null;
  targetId: number | null;
  summary: string | null;
  details: string | null;
  detailsParsed: unknown;
  createdAt: string;
  user: { id: number; fullName: string; email: string; userType: string };
  targetUser: { id: number; fullName: string; email: string; userType: string } | null;
};

type StaffOption = { id: number; fullName: string; email: string; userType: string };

export default function AdminActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [action, setAction] = useState("");
  const [targetType, setTargetType] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [staffUserId, setStaffUserId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<ActivityItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actionOptions = useMemo(() => getAdminActionOptions(), []);

  async function load(nextPage = page) {
    setLoading(true);
    setError(null);

    try {
      const query = new URLSearchParams({
        page: String(nextPage),
        pageSize: String(pageSize),
      });
      if (search.trim()) query.set("search", search.trim());
      if (role) query.set("role", role);
      if (action) query.set("action", action);
      if (targetType) query.set("targetType", targetType);
      if (targetUser.trim()) query.set("targetUser", targetUser.trim());
      if (staffUserId) query.set("staffUserId", staffUserId);

      if (dateFrom) query.set("dateFrom", dateFrom);
      if (dateTo) query.set("dateTo", dateTo);

      const response = await fetch(`/api/admin/activity?${query.toString()}`, { cache: "no-store" });
      const data = (await response.json()) as {
        error?: string;
        items?: ActivityItem[];
        total?: number;
        page?: number;
        staff?: StaffOption[];
      };

      if (!response.ok) {
        throw new Error(data.error || "Failed to load activity log");
      }

      setItems(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || nextPage);
      setStaff(data.staff || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load activity log");
    } finally {
      setLoading(false);
    }
  }

  function exportCsv() {
    const query = new URLSearchParams();
    if (search.trim()) query.set("search", search.trim());
    if (role) query.set("role", role);
    if (action) query.set("action", action);
    if (targetType) query.set("targetType", targetType);
    if (targetUser.trim()) query.set("targetUser", targetUser.trim());
    if (staffUserId) query.set("staffUserId", staffUserId);
    if (dateFrom) query.set("dateFrom", dateFrom);
    if (dateTo) query.set("dateTo", dateTo);

    window.open(`/api/admin/activity/export?${query.toString()}`, "_blank");
  }

  useEffect(() => {
    void load(1);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-2xl font-semibold">Журнал действий</h1>

        <AdminTableToolbar>
          <input
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Поиск: имя, email, summary, entity id"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="">Все роли</option>
            <option value="helper">helper</option>
            <option value="moderator">moderator</option>
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
          </select>
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={staffUserId} onChange={(event) => setStaffUserId(event.target.value)}>
            <option value="">Все staff</option>
            {staff.map((person) => (
              <option key={person.id} value={person.id}>{person.fullName}</option>
            ))}
          </select>
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={action} onChange={(event) => setAction(event.target.value)}>
            <option value="">Все actions</option>
            {actionOptions.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          <input
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Target user: id / имя / email"
            value={targetUser}
            onChange={(event) => setTargetUser(event.target.value)}
          />
          <input type="date" className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
          <input type="date" className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
          <button className="rounded bg-sky-600 px-3 py-2 text-sm" onClick={() => void load(1)}>Применить</button>
          <button className="rounded bg-emerald-700 px-3 py-2 text-sm" onClick={exportCsv}>Экспорт CSV</button>
        </AdminTableToolbar>

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        {loading ? <p className="mt-3 text-sm text-slate-400">Загрузка...</p> : null}

        <div className="mt-4">
          {items.length === 0 ? (
            <AdminEmptyState title="Записи не найдены" description="Измените фильтры или период поиска" />
          ) : (
            <AdminTable>
              <thead>
                <tr className="border-b border-slate-800 text-slate-300">
                  <th className="px-2 py-2">Кто</th>
                  <th className="px-2 py-2">Роль</th>
                  <th className="px-2 py-2">Действие</th>
                  <th className="px-2 py-2">Объект</th>
                  <th className="px-2 py-2">Детали</th>
                  <th className="px-2 py-2">Дата</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-900 align-top">
                    <td className="px-2 py-2 text-xs">
                      <p className="text-slate-100">{item.user.fullName}</p>
                      <p className="text-slate-400">{item.user.email}</p>
                    </td>
                    <td className="px-2 py-2 text-xs text-slate-300">{item.actorRole || item.user.userType}</td>
                    <td className="px-2 py-2 text-xs text-slate-300">{getAdminActionLabel(item.action)}</td>
                    <td className="px-2 py-2 text-xs text-slate-300">
                      <div>{item.targetType || "-"} {item.targetId ? `#${item.targetId}` : ""}</div>
                      {item.targetUser ? <div className="text-slate-500">Target: {item.targetUser.fullName}</div> : null}
                    </td>
                    <td className="px-2 py-2 text-xs text-slate-300">
                      <button className="rounded bg-slate-800 px-2 py-1" onClick={() => setSelected(item)}>Открыть</button>
                    </td>
                    <td className="px-2 py-2 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
          )}

          <AdminPagination page={page} pageSize={pageSize} total={total} onPageChange={(nextPage) => void load(nextPage)} />
        </div>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Детали действия #{selected.id}</h2>
              <button className="text-slate-400" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
              <p><span className="text-slate-400">Actor:</span> {selected.user.fullName} ({selected.user.email})</p>
              <p><span className="text-slate-400">Actor role:</span> {selected.actorRole || selected.user.userType}</p>
              <p><span className="text-slate-400">Action:</span> {getAdminActionLabel(selected.action)}</p>
              <p><span className="text-slate-400">Entity:</span> {selected.targetType || "-"} {selected.targetId ? `#${selected.targetId}` : ""}</p>
              <p className="md:col-span-2"><span className="text-slate-400">Summary:</span> {selected.summary || getAdminActionMeta(selected.action).shortDescription}</p>
              <p className="md:col-span-2"><span className="text-slate-400">Target user:</span> {selected.targetUser ? `${selected.targetUser.fullName} (${selected.targetUser.email})` : "-"}</p>
              <p className="md:col-span-2"><span className="text-slate-400">Created:</span> {new Date(selected.createdAt).toLocaleString()}</p>
            </div>

            <div className="mt-3 rounded-lg border border-slate-800 bg-slate-950/80 p-3">
              <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">Payload / Details</p>
              <pre className="overflow-x-auto text-xs text-slate-300">{JSON.stringify(selected.detailsParsed || selected.details || null, null, 2)}</pre>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
