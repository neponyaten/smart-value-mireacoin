"use client";

import type { NotificationItem as NotificationEntity } from "@/lib/types/domain";
import { Bell, Coins, Rocket, Trophy } from "lucide-react";
import { fromNowLabel } from "@/components/social/time";

const iconByType = {
  achievement: Trophy,
  coins: Coins,
  market: Rocket,
  system: Bell,
} as const;

type NotificationItemProps = {
  item: NotificationEntity;
  onRead?: (id: string) => void;
};

export function NotificationItem({ item, onRead }: NotificationItemProps) {
  const Icon = iconByType[item.type] || Bell;

  return (
    <article
      className={[
        "rounded-xl border px-3 py-2 transition",
        item.isRead
          ? "border-slate-700/60 bg-slate-900/45"
          : "border-cyan-300/35 bg-cyan-400/10 shadow-[0_0_28px_-16px_rgba(34,211,238,0.85)]",
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 rounded-lg border border-cyan-200/25 bg-slate-900/70 p-1.5 text-cyan-200">
          <Icon className="size-3.5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-100">{item.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-300">{item.description}</p>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500">{fromNowLabel(item.createdAt)}</span>
            {!item.isRead ? (
              <button
                type="button"
                onClick={() => onRead?.(item.id)}
                className="text-[11px] text-cyan-200 transition hover:text-cyan-100"
              >
                Прочитано
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
