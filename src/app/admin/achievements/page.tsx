"use client";

import { AdminActionDialog } from "@/components/admin/AdminActionDialog";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminFormSection } from "@/components/admin/AdminFormSection";
import { useEffect, useState } from "react";

type Achievement = {
  id: number;
  title: string;
  description: string;
  reward: number;
  rarity: string;
  category: string;
  icon: string;
  isActive: boolean;
};

export default function AdminAchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ item: Achievement; nextIsActive: boolean } | null>(null);

  async function load() {
    const response = await fetch("/api/admin/achievements", { cache: "no-store" });
    const data = (await response.json()) as { error?: string; items?: Achievement[] };
    if (!response.ok) {
      throw new Error(data.error || "Failed to load achievements");
    }
    setItems(data.items || []);
  }

  async function createItem() {
    setSuccess(null);
    const response = await fetch("/api/admin/achievements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, reward: 100, rarity: "common", category: "activity", icon: "🏅", isActive: true }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(data.error || "Failed to create achievement");
    }
    setTitle("");
    setDescription("");
    setSuccess("Достижение создано");
    await load();
  }

  async function toggle(item: Achievement) {
    const previous = items;
    setItems((draft) => draft.map((entry) => entry.id === item.id ? { ...entry, isActive: !item.isActive } : entry));

    const response = await fetch("/api/admin/achievements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setItems(previous);
      throw new Error(data.error || "Failed to update achievement");
    }
    setSuccess("Статус достижения обновлен");
    await load();
  }

  useEffect(() => {
    void load().catch((loadError: unknown) => {
      setError(loadError instanceof Error ? loadError.message : "Failed to load achievements");
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-2xl font-semibold">Admin Achievements</h1>
        <AdminForm>
          <AdminFormSection title="Создать достижение">
            <div className="mt-2 grid gap-2 md:grid-cols-3">
          <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
          <button
            className="rounded bg-emerald-700 px-3 py-2 text-sm"
            onClick={() =>
              void createItem().catch((createError: unknown) => {
                setError(createError instanceof Error ? createError.message : "Failed to create achievement");
              })
            }
          >
            Create
          </button>
            </div>
          </AdminFormSection>
        </AdminForm>

        {success ? <p className="mt-4 text-sm text-emerald-300">{success}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        <div className="mt-4 grid gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded border border-slate-800 bg-slate-950/60 p-3 text-sm">
              <div>
                <p className="font-medium">{item.icon} {item.title}</p>
                <p className="text-slate-400">{item.description}</p>
              </div>
              <button
                className={`rounded px-3 py-1 text-xs ${item.isActive ? "bg-emerald-800" : "bg-slate-700"}`}
                onClick={() => setConfirm({ item, nextIsActive: !item.isActive })}
              >
                {item.isActive ? "active" : "inactive"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <AdminActionDialog
        open={Boolean(confirm)}
        title={confirm?.nextIsActive ? "Активировать достижение?" : "Деактивировать достижение?"}
        description={confirm ? `Изменение затронет достижение: ${confirm.item.title}` : ""}
        changes={confirm ? [`isActive: ${confirm.item.isActive} -> ${confirm.nextIsActive}`] : []}
        danger={Boolean(confirm && !confirm.nextIsActive)}
        loading={actionLoading}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          setActionLoading(true);
          void toggle(confirm.item)
            .catch((toggleError: unknown) => {
              setError(toggleError instanceof Error ? toggleError.message : "Failed to update achievement");
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
