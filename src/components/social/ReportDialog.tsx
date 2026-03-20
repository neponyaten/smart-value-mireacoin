"use client";

import { useState } from "react";
import type { ReportReason } from "@/lib/types/domain";

type ReportDialogProps = {
  title: string;
  open: boolean;
  isBusy?: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason) => Promise<void>;
};

const options: Array<{ label: string; value: ReportReason }> = [
  { label: "Спам", value: "spam" },
  { label: "Оскорбление", value: "abuse" },
  { label: "Неподходящий контент", value: "inappropriate" },
  { label: "Другое", value: "other" },
];

export function ReportDialog({ title, open, isBusy, onClose, onSubmit }: ReportDialogProps) {
  const [reason, setReason] = useState<ReportReason>("spam");
  const [message, setMessage] = useState("");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <div className="premium-card w-full max-w-md rounded-2xl p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Moderation</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-100">{title}</h3>

        <div className="mt-4 space-y-2">
          {options.map((option) => (
            <label key={option.value} className="premium-card flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200">
              <input
                type="radio"
                name="reason"
                value={option.value}
                checked={reason === option.value}
                onChange={() => setReason(option.value)}
                className="size-4 accent-cyan-400"
              />
              {option.label}
            </label>
          ))}
        </div>

        {message ? <p className="mt-3 text-xs text-slate-400">{message}</p> : null}

        <div className="mt-4 flex gap-2">
          <button
            className="premium-card flex-1 rounded-xl px-3 py-2 text-sm text-slate-200"
            onClick={onClose}
            disabled={isBusy}
          >
            Отмена
          </button>
          <button
            className="premium-btn-primary flex-1 rounded-xl px-3 py-2 text-sm font-semibold"
            onClick={async () => {
              try {
                setMessage("");
                await onSubmit(reason);
                setMessage("Жалоба отправлена");
                setTimeout(onClose, 700);
              } catch (error) {
                setMessage((error as Error).message || "Не удалось отправить жалобу");
              }
            }}
            disabled={isBusy}
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}
