"use client";

type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const safe = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2.5 overflow-hidden rounded-full border border-cyan-200/20 bg-slate-900/65">
      <div
        className="h-full bg-gradient-to-r from-cyan-300 to-blue-300 transition-all duration-500"
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}
