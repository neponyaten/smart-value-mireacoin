"use client";

import { AdminActionDialog } from "@/components/admin/AdminActionDialog";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { AdminSortHeader } from "@/components/admin/AdminSortHeader";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminTableToolbar } from "@/components/admin/AdminTableToolbar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AdminUser = {
  id: number;
  email: string;
  fullName: string;
  group: string;
  role: string;
  userType: string;
  coins: number;
  isBlocked: boolean;
  achievementsCount: number;
  vfxCount: number;
  lastSeenAt?: string | null;
  updatedAt?: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const pathname = usePathname();
  const router = useRouter();

  const [items, setItems] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("");
  const [role, setRole] = useState("");
  const [blocked, setBlocked] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{
    title: string;
    description: string;
    changes: string[];
    danger?: boolean;
    payload: Record<string, unknown>;
    optimistic?: (draft: AdminUser[]) => AdminUser[];
  } | null>(null);

  function syncUrl(nextPage: number, nextSortBy = sortBy, nextSortOrder = sortOrder) {
    const query = new URLSearchParams();
    if (search.trim()) query.set("search", search.trim());
    if (userType) query.set("userType", userType);
    if (role) query.set("role", role);
    if (blocked) query.set("blocked", blocked);
    if (nextSortBy) query.set("sortBy", nextSortBy);
    if (nextSortOrder) query.set("sortOrder", nextSortOrder);
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
      if (search.trim()) query.set("search", search.trim());
      if (userType) query.set("userType", userType);
      if (role) query.set("role", role);
      if (blocked) query.set("blocked", blocked);
      query.set("sortBy", effectiveSortBy);
      query.set("sortOrder", effectiveSortOrder);
      query.set("page", String(nextPage));
      query.set("pageSize", String(pageSize));

      const response = await fetch(`/api/admin/users?${query.toString()}`, { cache: "no-store" });
      const data = (await response.json()) as { error?: string; items?: AdminUser[]; total?: number; page?: number };
      if (!response.ok) {
        throw new Error(data.error || "Failed to load users");
      }
      setItems(data.items || []);
      setTotal(data.total || 0);
      setPage(data.page || nextPage);
      syncUrl(data.page || nextPage, effectiveSortBy, effectiveSortOrder);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function runAction(payload: Record<string, unknown>, optimistic?: (draft: AdminUser[]) => AdminUser[]) {
    setError(null);
    setSuccess(null);
    const previous = items;
    if (optimistic) {
      setItems((draft) => optimistic(draft));
    }

    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      if (optimistic) {
        setItems(previous);
      }
      throw new Error(data.error || "Action failed");
    }
    setSuccess("Изменение успешно применено");
    await load();
  }

  function requestAction(params: {
    title: string;
    description: string;
    changes: string[];
    payload: Record<string, unknown>;
    danger?: boolean;
    optimistic?: (draft: AdminUser[]) => AdminUser[];
  }) {
    setConfirm(params);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-2xl font-semibold">Admin Users</h1>

        <AdminTableToolbar>
          <input
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            placeholder="Поиск по имени, email или группе"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
            value={userType}
            onChange={(event) => setUserType(event.target.value)}
          >
            <option value="">Все типы</option>
            <option value="user">user</option>
            <option value="moderator">moderator</option>
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
          </select>
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="">Все роли</option>
            <option value="Студент">Студент</option>
            <option value="Преподаватель">Преподаватель</option>
            <option value="LEADER">LEADER</option>
          </select>
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={blocked} onChange={(event) => setBlocked(event.target.value)}>
            <option value="">Все статусы</option>
            <option value="false">active</option>
            <option value="true">blocked</option>
          </select>
          <button className="rounded bg-sky-600 px-3 py-2 text-sm" onClick={() => void load(1)}>
            Обновить
          </button>
        </AdminTableToolbar>

        {success ? <p className="mt-4 text-sm text-emerald-300">{success}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        {loading ? <p className="mt-4 text-sm text-slate-400">Загрузка...</p> : null}

        <div className="mt-4">
          {items.length === 0 ? <AdminEmptyState title="Пользователи не найдены" /> : (
          <AdminTable>
            <thead>
              <tr className="border-b border-slate-800 text-slate-300">
                <th className="px-2 py-2">
                  <AdminSortHeader label="User" sortKey="createdAt" currentSortBy={sortBy} currentSortOrder={sortOrder} onChange={(nextSortBy, nextSortOrder) => { setSortBy(nextSortBy); setSortOrder(nextSortOrder); void load(1, { sortBy: nextSortBy, sortOrder: nextSortOrder }); }} />
                </th>
                <th className="px-2 py-2">
                  <AdminSortHeader label="Role" sortKey="role" currentSortBy={sortBy} currentSortOrder={sortOrder} onChange={(nextSortBy, nextSortOrder) => { setSortBy(nextSortBy); setSortOrder(nextSortOrder); void load(1, { sortBy: nextSortBy, sortOrder: nextSortOrder }); }} />
                </th>
                <th className="px-2 py-2">
                  <AdminSortHeader label="Coins" sortKey="coins" currentSortBy={sortBy} currentSortOrder={sortOrder} onChange={(nextSortBy, nextSortOrder) => { setSortBy(nextSortBy); setSortOrder(nextSortOrder); void load(1, { sortBy: nextSortBy, sortOrder: nextSortOrder }); }} />
                </th>
                <th className="px-2 py-2">Flags</th>
                <th className="px-2 py-2">
                  <AdminSortHeader label="Seen/Updated" sortKey="lastSeenAt" currentSortBy={sortBy} currentSortOrder={sortOrder} onChange={(nextSortBy, nextSortOrder) => { setSortBy(nextSortBy); setSortOrder(nextSortOrder); void load(1, { sortBy: nextSortBy, sortOrder: nextSortOrder }); }} />
                </th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user.id} className="border-b border-slate-900 align-top">
                  <td className="px-2 py-2">
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                    <div className="text-xs text-slate-400">{user.group || "-"}</div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-xs text-slate-300">{user.userType}</div>
                    <div className="text-xs text-slate-500">{user.role}</div>
                  </td>
                  <td className="px-2 py-2">{user.coins}</td>
                  <td className="px-2 py-2 text-xs text-slate-400">
                    {user.isBlocked ? "blocked" : "active"} / ach:{user.achievementsCount} / vfx:{user.vfxCount}
                  </td>
                  <td className="px-2 py-2 text-xs text-slate-400">
                    <div>lastSeen: {user.lastSeenAt ? new Date(user.lastSeenAt).toLocaleString() : "-"}</div>
                    <div>updated: {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"}</div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded bg-emerald-700 px-2 py-1 text-xs"
                        onClick={() =>
                          requestAction({
                            title: "Подтвердите изменение роли доступа",
                            description: `Пользователь ${user.fullName} получит права moderator.`,
                            changes: [`userType: ${user.userType} -> moderator`],
                            payload: { action: "set_user_type", userId: user.id, userType: "moderator" },
                          })
                        }
                      >
                        to moderator
                      </button>
                      <button
                        className="rounded bg-indigo-700 px-2 py-1 text-xs"
                        onClick={() => {
                          const nextRole = window.prompt("Новая роль:", user.role)?.trim();
                          if (!nextRole || nextRole === user.role) return;
                          requestAction({
                            title: "Подтвердите изменение роли",
                            description: `Роль пользователя ${user.fullName} будет изменена.`,
                            changes: [`role: ${user.role} -> ${nextRole}`],
                            payload: { action: "set_role", userId: user.id, role: nextRole },
                          });
                        }}
                      >
                        change role
                      </button>
                      <button
                        className="rounded bg-cyan-700 px-2 py-1 text-xs"
                        onClick={() =>
                          requestAction({
                            title: "Подтвердите начисление монет",
                            description: `Пользователь ${user.fullName} получит +100 coins.`,
                            changes: [`coins: +100`],
                            payload: { action: "grant_coins", userId: user.id, amount: 100 },
                          })
                        }
                      >
                        +100 coins
                      </button>
                      {user.isBlocked ? (
                        <button
                          className="rounded bg-emerald-800 px-2 py-1 text-xs"
                          onClick={() =>
                            requestAction({
                              title: "Разблокировать пользователя?",
                              description: `Пользователь ${user.fullName} снова получит доступ к системе.`,
                              changes: ["isBlocked: true -> false"],
                              payload: { action: "unblock", userId: user.id },
                              optimistic: (draft) => draft.map((entry) => entry.id === user.id ? { ...entry, isBlocked: false } : entry),
                            })
                          }
                        >
                          unblock
                        </button>
                      ) : (
                        <button
                          className="rounded bg-rose-800 px-2 py-1 text-xs"
                          onClick={() =>
                            requestAction({
                              title: "Заблокировать пользователя?",
                              description: `Пользователь ${user.fullName} будет заблокирован.`,
                              changes: ["isBlocked: false -> true", "reason: Moderation"],
                              payload: { action: "block", userId: user.id, reason: "Moderation" },
                              danger: true,
                              optimistic: (draft) => draft.map((entry) => entry.id === user.id ? { ...entry, isBlocked: true } : entry),
                            })
                          }
                        >
                          block
                        </button>
                      )}
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
          void runAction(confirm.payload, confirm.optimistic)
            .catch((actionError: unknown) => {
              setError(actionError instanceof Error ? actionError.message : "Action failed");
            })
            .finally(() => {
              setActionLoading(false);
              setConfirm(null);
            });
        }}
      />
    </main>
  );
}
