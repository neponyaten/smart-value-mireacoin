"use client";

import { useEffect } from "react";
import { CheckCircle2, Coins, Bell, Rocket, Trophy } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

const iconByType = {
  success: CheckCircle2,
  achievement: Trophy,
  coins: Coins,
  market: Rocket,
  system: Bell,
} as const;

export function ToastNotification() {
  const toasts = useUIStore((s) => s.toastQueue);
  const removeToast = useUIStore((s) => s.removeToast);

  useEffect(() => {
    const disposers = toasts.map((toast) => {
      const timeout = setTimeout(() => {
        removeToast(toast.id);
      }, toast.durationMs ?? 3400);

      return () => clearTimeout(timeout);
    });

    return () => {
      for (const dispose of disposers) {
        dispose();
      }
    };
  }, [toasts, removeToast]);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[320px] flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = iconByType[toast.type] || Bell;

        return (
          <div
            key={toast.id}
            className="pointer-events-auto rounded-2xl border border-cyan-300/35 bg-slate-950/90 px-3 py-2 shadow-[0_0_32px_-16px_rgba(34,211,238,0.85)] backdrop-blur-xl"
          >
            <div className="flex items-start gap-2">
              <div className="rounded-lg border border-cyan-200/25 bg-slate-900/70 p-1.5 text-cyan-200">
                <Icon className="size-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-100">{toast.title}</p>
                <p className="text-xs text-slate-300">{toast.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
