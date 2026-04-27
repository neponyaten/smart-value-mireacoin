"use client";

import { useAppStore } from "@/store/useAppStore";
import { AdminActionDialog } from "@/components/admin/AdminActionDialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Send, Trash2, Copy } from "lucide-react";

interface BetaApplication {
  id: number;
  email: string;
  fullName: string;
  academicGroup: string;
  requestedRole: string;
  whyJoin: string;
  telegramUrl?: string;
  vkUrl?: string;
  status: string;
  adminComment?: string;
  createdAt: string;
  decidedByUser?: { id: number; fullName: string };
  inviteSentAt?: string;
}

export default function AdminApplicationsPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const [applications, setApplications] = useState<BetaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<BetaApplication | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ action: "approve" | "reject" | "resend"; title: string; description: string; changes: string[]; danger?: boolean } | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const canAccess =
      Boolean(user) &&
      (user?.role === "LEADER" || user?.userType === "admin" || user?.userType === "superadmin");

    if (!canAccess) {
      router.replace("/app");
      return;
    }
    loadApplications();
  }, [user, router, filterStatus, search]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (search) params.append("search", search);

      const response = await fetch(`/api/admin/beta-applications?${params}`);

      if (!response.ok) {
        console.error("Load error:", await response.text());
        return;
      }

      const data = await response.json();
      setApplications(data.applications);
    } catch (error) {
      console.error("Load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "approve" | "reject" | "resend") => {
    if (!selectedApp) return;

    try {
      setActionLoading(true);
      setError(null);
      setSuccess(null);
      const response = await fetch("/api/admin/beta-applications/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: selectedApp.id,
          action,
          comment: comment || undefined,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        setError(payload.error || "Ошибка при выполнении действия");
        return;
      }

      setSuccess("Действие успешно выполнено");
      setComment("");
      setSelectedApp(null);
      await loadApplications();
    } catch (error) {
      console.error("Action error:", error);
      setError("Ошибка при выполнении действия");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-900/30 text-yellow-300 border-yellow-900/50",
      invited: "bg-cyan-900/30 text-cyan-300 border-cyan-900/50",
      approved: "bg-green-900/30 text-green-300 border-green-900/50",
      completed: "bg-emerald-900/30 text-emerald-300 border-emerald-900/50",
      rejected: "bg-red-900/30 text-red-300 border-red-900/50",
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-cyan-100">Заявки на бета-тест</h1>
          <p className="mt-1 text-slate-400">Управление заявками от пользователей</p>
          {success ? <p className="mt-2 text-sm text-emerald-300">{success}</p> : null}
          {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-slate-700/70 bg-slate-900/50 px-4 py-2 text-slate-100 outline-none focus:border-cyan-300/50"
            >
              <option value="pending">Ожидают рассмотрения</option>
              <option value="invited">Приглашены</option>
              <option value="completed">Завершили регистрацию</option>
              <option value="rejected">Отклонены</option>
              <option value="">Все</option>
            </select>
            <input
              type="text"
              placeholder="Поиск по имени, email, группе..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 rounded-lg border border-slate-700/70 bg-slate-900/50 px-4 py-2 text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-300/50"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-400">Загрузка...</div>
        ) : applications.length === 0 ? (
          <div className="rounded-lg border border-slate-700/70 bg-slate-900/30 p-8 text-center text-slate-400">
            Нет заявок
          </div>
        ) : (
          <div className="space-y-2">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-lg border border-slate-700/70 bg-slate-900/40 p-4 transition hover:bg-slate-900/60"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-100">{app.fullName}</h3>
                        <p className="text-sm text-slate-400">{app.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span className="text-slate-400">{app.academicGroup}</span>
                      <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedApp(app)}
                    className="flex items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900/70"
                  >
                    <ChevronDown className="size-4" />
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedApp && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
            <div className="w-full max-w-2xl rounded-2xl bg-slate-900 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-100">{selectedApp.fullName}</h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-slate-400 hover:text-slate-300"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Email</p>
                    <p className="mt-1 text-slate-100">{selectedApp.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Группа</p>
                    <p className="mt-1 text-slate-100">{selectedApp.academicGroup}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Роль</p>
                    <p className="mt-1 text-slate-100">{selectedApp.requestedRole}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Статус</p>
                    <p className={`mt-1 inline-block rounded-full border px-2 py-1 text-xs font-semibold ${getStatusBadge(selectedApp.status)}`}>
                      {selectedApp.status}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Почему участвует?</p>
                  <p className="mt-1 text-slate-300">{selectedApp.whyJoin}</p>
                </div>

                {selectedApp.telegramUrl && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Telegram</p>
                    <a href={selectedApp.telegramUrl} target="_blank" rel="noopener noreferrer" className="mt-1 text-cyan-300 hover:text-cyan-200">
                      {selectedApp.telegramUrl}
                    </a>
                  </div>
                )}

                {selectedApp.vkUrl && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">VK</p>
                    <a href={selectedApp.vkUrl} target="_blank" rel="noopener noreferrer" className="mt-1 text-cyan-300 hover:text-cyan-200">
                      {selectedApp.vkUrl}
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Заявка от</p>
                  <p className="mt-1 text-slate-300">{new Date(selectedApp.createdAt).toLocaleDateString()}</p>
                </div>

                {selectedApp.adminComment && (
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Комментарий админа</p>
                    <p className="mt-1 text-slate-300">{selectedApp.adminComment}</p>
                  </div>
                )}

                {selectedApp.status === "pending" && (
                  <div className="mt-6 space-y-2">
                    <textarea
                      placeholder="Комментарий (опционально)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full rounded-lg border border-slate-700/70 bg-slate-900/50 px-3 py-2 text-slate-100 outline-none focus:border-cyan-300/50"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirm({ action: "approve", title: "Одобрить заявку?", description: `Будет отправлен invite пользователю ${selectedApp.fullName}.`, changes: [`status: ${selectedApp.status} -> invited`] })}
                        disabled={actionLoading}
                        className="flex-1 rounded-lg border border-green-900/50 bg-green-900/20 px-4 py-2 text-sm font-semibold text-green-300 transition hover:bg-green-900/30 disabled:opacity-50"
                      >
                        ✓ Одобрить
                      </button>
                      <button
                        onClick={() => setConfirm({ action: "reject", title: "Отклонить заявку?", description: `Заявка ${selectedApp.fullName} будет отклонена.`, changes: [`status: ${selectedApp.status} -> rejected`], danger: true })}
                        disabled={actionLoading}
                        className="flex-1 rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-900/30 disabled:opacity-50"
                      >
                        ✕ Отклонить
                      </button>
                    </div>
                  </div>
                )}

                {selectedApp.status === "invited" && (
                  <button
                    onClick={() => setConfirm({ action: "resend", title: "Отправить приглашение заново?", description: `Пользователь ${selectedApp.fullName} получит повторное письмо с invite ссылкой.`, changes: ["inviteSentAt -> now"] })}
                    disabled={actionLoading}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-900/50 bg-cyan-900/20 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-900/30 disabled:opacity-50"
                  >
                    <Send className="size-4" />
                    Отправить ссылку заново
                  </button>
                )}

                <button
                  onClick={() => setSelectedApp(null)}
                  className="mt-4 w-full rounded-lg border border-slate-700/70 bg-slate-900/50 px-4 py-2 text-slate-300 transition hover:bg-slate-900/70"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
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
          void handleAction(confirm.action).finally(() => setConfirm(null));
        }}
      />
    </div>
  );
}


