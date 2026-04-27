"use client";

import { Moon, Sun } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export function ThemeToggle() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-cyan-200/20 bg-slate-900/60 text-cyan-100 transition hover:border-cyan-300/45 hover:shadow-[0_0_18px_rgba(34,211,238,0.22)]"
      aria-label="Переключить тему"
      title={theme === "dark" ? "Светлая тема" : "Темная тема"}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
