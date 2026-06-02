type AdminSortHeaderProps = {
  label: string;
  sortKey: string;
  currentSortBy: string;
  currentSortOrder: "asc" | "desc";
  onChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
};

export function AdminSortHeader({
  label,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onChange,
}: AdminSortHeaderProps) {
  const active = currentSortBy === sortKey;
  const nextOrder: "asc" | "desc" = active && currentSortOrder === "asc" ? "desc" : "asc";

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-300"
      onClick={() => onChange(sortKey, nextOrder)}
    >
      {label}
      <span className="text-[10px] text-slate-500">{active ? (currentSortOrder === "asc" ? "↑" : "↓") : "↕"}</span>
    </button>
  );
}
