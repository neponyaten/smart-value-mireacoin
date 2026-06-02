"use client";

import type { AchievementCategory } from "@/lib/types/domain";

export const achievementTabs: Array<{ id: AchievementCategory; label: string }> = [
  { id: "study", label: "Учеба" },
  { id: "activity", label: "Активность" },
  { id: "economy", label: "Экономика" },
  { id: "social", label: "Социальные" },
  { id: "rare", label: "Редкие" },
];

type AchievementTabsProps = {
  current: AchievementCategory;
  onChange: (next: AchievementCategory) => void;
};

export function AchievementTabs({ current, onChange }: AchievementTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {achievementTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={[
            "rounded-xl border px-2 py-2 text-xs font-medium transition",
            current === tab.id
              ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-100"
              : "border-slate-700/70 bg-slate-900/45 text-slate-300 hover:border-cyan-200/40",
          ].join(" ")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
