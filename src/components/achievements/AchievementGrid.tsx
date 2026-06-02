"use client";

import type { AchievementCategory, UserAchievementView } from "@/lib/types/domain";
import { AchievementCard } from "@/components/achievements/AchievementCard";

type AchievementGridProps = {
  items: UserAchievementView[];
  category: AchievementCategory;
};

export function AchievementGrid({ items, category }: AchievementGridProps) {
  const filtered = items.filter((item) => item.category === category);

  if (filtered.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-6 text-center text-sm text-slate-400">
        В этой категории пока нет достижений
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((item) => (
        <AchievementCard key={item.id} item={item} />
      ))}
    </div>
  );
}
