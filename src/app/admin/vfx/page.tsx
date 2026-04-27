"use client";

import { AdminActionDialog } from "@/components/admin/AdminActionDialog";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminFormSection } from "@/components/admin/AdminFormSection";
import { useEffect, useState } from "react";

type VfxItem = {
  id: number;
  name: string;
  code: string;
  rarity: string;
  targetSlot: string;
  price: number;
  isActive: boolean;
};

export default function AdminVfxPage() {
  const [items, setItems] = useState<VfxItem[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ item: VfxItem; nextIsActive: boolean } | null>(null);

  async function load() {
    const response = await fetch("/api/admin/vfx", { cache: "no-store" });
    const data = (await response.json()) as { error?: string; items?: VfxItem[] };
    if (!response.ok) {
      throw new Error(data.error || "Failed to load VFX");
    }
    setItems(data.items || []);
  }

  async function createItem() {
    setSuccess(null);
    const response = await fetch("/api/admin/vfx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, code, rarity: "common", price: 0, targetSlot: "NICKNAME", isActive: true }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(data.error || "Failed to create VFX");
    }
    setName("");
    setCode("");
    setSuccess("VFX элемент создан");
    await load();
  }

  async function toggle(item: VfxItem) {
    const previous = items;
    setItems((draft) => draft.map((entry) => entry.id === item.id ? { ...entry, isActive: !item.isActive } : entry));

    const response = await fetch("/api/admin/vfx", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setItems(previous);
      throw new Error(data.error || "Failed to update VFX");
    }
    setSuccess("Статус VFX обновлен");
    await load();
  }

  useEffect(() => {
    void load().catch((loadError: unknown) => {
      setError(loadError instanceof Error ? loadError.message : "Failed to load VFX");
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <h1 className="text-2xl font-semibold">Admin VFX</h1>
        <AdminForm>
          <AdminFormSection title="Создать VFX элемент">
            <div className="mt-2 grid gap-2 md:grid-cols-3">
          <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} />
          <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm" placeholder="Code" value={code} onChange={(event) => setCode(event.target.value)} />
          <button
            className="rounded bg-emerald-700 px-3 py-2 text-sm"
            onClick={() =>
              void createItem().catch((createError: unknown) => {
                setError(createError instanceof Error ? createError.message : "Failed to create VFX");
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
                <p className="font-medium">{item.name} ({item.code})</p>
                <p className="text-slate-400">{item.rarity} / {item.targetSlot} / {item.price} coins</p>
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
        title={confirm?.nextIsActive ? "Активировать VFX?" : "Деактивировать VFX?"}
        description={confirm ? `Изменение затронет VFX: ${confirm.item.name}` : ""}
        changes={confirm ? [`isActive: ${confirm.item.isActive} -> ${confirm.nextIsActive}`] : []}
        danger={Boolean(confirm && !confirm.nextIsActive)}
        loading={actionLoading}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (!confirm) return;
          setActionLoading(true);
          void toggle(confirm.item)
            .catch((toggleError: unknown) => {
              setError(toggleError instanceof Error ? toggleError.message : "Failed to update VFX");
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
