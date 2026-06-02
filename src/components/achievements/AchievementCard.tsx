"use client";

import type { UserAchievementView } from "@/lib/types/domain";
import { Lock } from "lucide-react";

const rarityStyles = {
  common: {
    badge: "border-slate-400/35 bg-slate-500/10 text-slate-200",
    glow: "shadow-[0_0_16px_-12px_rgba(148,163,184,0.8)]",
  },
  rare: {
    badge: "border-cyan-300/50 bg-cyan-300/12 text-cyan-100",
    glow: "shadow-[0_0_20px_-10px_rgba(34,211,238,0.9)]",
  },
  epic: {
    badge: "border-violet-300/50 bg-violet-400/12 text-violet-100",
    glow: "shadow-[0_0_24px_-10px_rgba(167,139,250,0.9)]",
  },
  legendary: {
    badge: "border-amber-300/55 bg-amber-300/15 text-amber-100",
    glow: "shadow-[0_0_32px_-8px_rgba(245,158,11,0.95)]",
  },
} as const;

type AchievementCardProps = {
  item: UserAchievementView;
};

export function AchievementCard({ item }: AchievementCardProps) {
  const style = rarityStyles[item.rarity];

  return (
    <article
      className={[
        "group rounded-2xl border px-3 py-3 transition duration-200",
        item.unlocked
          ? `border-cyan-200/25 bg-slate-900/45 ${style.glow} hover:-translate-y-0.5`
          : "border-slate-800/80 bg-slate-950/65 opacity-75 hover:-translate-y-0.5",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-200/20 bg-slate-900/70 text-lg">
          {item.unlocked ? item.icon : <Lock className="size-4 text-slate-500" />}
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${style.badge}`}>
          {item.rarity}
        </span>
      </div>

      <h4 className="mt-2 text-sm font-semibold text-slate-100">{item.title}</h4>
      <p className="mt-1 text-xs text-slate-400">{item.description}</p>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-cyan-200">+{item.reward} MC</span>
        <span className="text-[11px] text-slate-500">{item.unlocked ? "Открыто" : "Закрыто"}</span>
      </div>
    </article>
  );
}
