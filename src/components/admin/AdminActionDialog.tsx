"use client";

type AdminActionDialogProps = {
  open: boolean;
  title: string;
  description: string;
  changes?: string[];
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AdminActionDialog({
  open,
  title,
  description,
  changes,
  confirmText = "Подтвердить",
  cancelText = "Отмена",
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}: AdminActionDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-5 text-slate-100">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-slate-300">{description}</p>

        {changes && changes.length > 0 ? (
          <ul className="mt-3 space-y-1 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-400">
            {changes.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        ) : null}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
            disabled={loading}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`rounded px-3 py-2 text-sm font-semibold ${danger ? "bg-rose-700" : "bg-emerald-700"} disabled:opacity-60`}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "Выполняется..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
