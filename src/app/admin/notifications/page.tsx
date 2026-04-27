"use client";

import { AdminActionDialog } from "@/components/admin/AdminActionDialog";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminFormSection } from "@/components/admin/AdminFormSection";
import { useEffect, useState } from "react";

type Batch = {
  id: number;
  targetType: string;
  targetValue: string | null;
  title: string;
  message: string;
  recipientsCount: number;
  createdAt: string;
  sentByUser: { fullName: string; email: string };
};

export default function AdminNotificationsPage() {
  const [items, setItems] = useState<Batch[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState<"all" | "user" | "role">("all");
  const [targetValue, setTargetValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/notifications", { cache: "no-store" });
    const data = (await response.json()) as { error?: string; items?: Batch[] };
    if (!response.ok) {
      throw new Error(data.error || "Failed to load notification history");
    }
    setItems(data.items || []);
  }

  async function send() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, targetType, targetValue: targetValue || undefined }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Failed to send notification");
      }
      setSuccess("Уведомление отправлено");
      setTitle("");
      setMessage("");
      setTargetValue("");
      await load();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load().catch((loadError: unknown) => {
      setError(loadError instanceof Error ? loadError.message : "Failed to load notification history");
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-2xl font-semibold">Admin Notifications</h1>
        <AdminForm>
          <AdminFormSection title="Новая рассылка">
            <div className="mt-2 grid gap-2 md:grid-cols-4">
          <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" placeholder="Message" value={message} onChange={(event) => setMessage(event.target.value)} />
          <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" value={targetType} onChange={(event) => setTargetType(event.target.value as "all" | "user" | "role")}> 
            <option value="all">all</option>
            <option value="user">user</option>
            <option value="role">role</option>
          </select>
          <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" placeholder="Target value (id or role)" value={targetValue} onChange={(event) => setTargetValue(event.target.value)} />
            </div>
            <button className="mt-3 rounded bg-emerald-700 px-3 py-2 text-sm" onClick={() => setConfirmOpen(true)}>Send</button>
          </AdminFormSection>
        </AdminForm>

        {success ? <p className="mt-4 text-sm text-emerald-300">{success}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

        <div className="mt-4 grid gap-2">
          {items.map((item) => (
            <div key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3 text-sm">
              <p className="font-medium">{item.title}</p>
              <p className="text-slate-300">{item.message}</p>
              <p className="mt-1 text-xs text-slate-400">
                {item.targetType} {item.targetValue ? `(${item.targetValue})` : ""} / recipients: {item.recipientsCount}
              </p>
            </div>
          ))}
        </div>
      </div>

      <AdminActionDialog
        open={confirmOpen}
        title="Отправить системное уведомление?"
        description="Рассылка будет создана для выбранной аудитории. Это действие нельзя отменить."
        changes={[`targetType: ${targetType}`, `targetValue: ${targetValue || "-"}`, `title: ${title}`]}
        loading={loading}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          void send()
            .catch((sendError: unknown) => {
              setError(sendError instanceof Error ? sendError.message : "Failed to send notification");
            })
            .finally(() => setConfirmOpen(false));
        }}
      />
    </main>
  );
}
