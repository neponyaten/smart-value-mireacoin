"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function Tab({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 rounded-xl text-sm border transition",
        active
          ? "bg-neon text-black border-transparent shadow-neon"
          : "bg-black/40 text-gray-300 border-white/10 hover:bg-black/50",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export function AppHeader() {
  const pathname = usePathname();

  const isLeaderboard = pathname.startsWith("/app/leaderboard");
  const isShop = pathname.startsWith("/app/shop");
  const isProfile = pathname.startsWith("/app/profile");
  const isHome = pathname === "/app";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="mx-auto w-full max-w-md glass rounded-2xl p-3 border border-white/10 flex items-center gap-2">
        <Tab href="/app" label="Главная" active={isHome} />
        <Tab href="/app/leaderboard" label="Лидерборд" active={isLeaderboard} />
        <Tab href="/app/shop" label="Маркет" active={isShop} />
        <Tab href="/app/history" label="История" active={pathname.startsWith("/app/history")} />

        <Link
          href="/app/profile"
          className={[
            "ml-auto w-10 h-10 rounded-full border flex items-center justify-center",
            isProfile
              ? "bg-neon text-black border-transparent shadow-neon"
              : "bg-black/40 border-white/10",
          ].join(" ")}
          aria-label="Профиль"
          title="Профиль"
        >
          <span className="text-sm font-bold">👤</span>
        </Link>
      </div>
    </header>
  );
}