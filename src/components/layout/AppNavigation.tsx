"use client";

import { cn } from "@/lib/utils/cn";
import { LayoutGrid, ShoppingCart, Trophy, UserRound, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/app", label: "Дашборд", icon: LayoutGrid },
  { href: "/app/shop", label: "Маркет", icon: ShoppingCart },
  { href: "/app/leaderboard", label: "Топ", icon: Trophy },
  { href: "/app/inventory", label: "Инвентарь", icon: Package },
  { href: "/app/profile", label: "Профиль", icon: UserRound },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-5xl px-3 pb-3">
      <div className="premium-card rounded-3xl px-2 py-2 backdrop-blur-xl">
        <ul className="grid grid-cols-5 gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] text-slate-300 transition",
                    active
                      ? "border border-cyan-300/35 bg-cyan-400/12 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.2)]"
                      : "border border-transparent hover:border-cyan-300/20 hover:bg-cyan-400/6"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
