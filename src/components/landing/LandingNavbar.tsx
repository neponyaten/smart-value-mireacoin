"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div
        className={[
          "mx-auto w-full max-w-6xl rounded-3xl border transition",
          scrolled
            ? "glass border-white/10 backdrop-blur-xl"
            : "bg-transparent border-transparent",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-5 py-3">
          {/* logo */}
          <button
            onClick={() => scrollToId("home")}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-black/35 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.12)]">
              <span className="text-neon font-extrabold">M</span>
            </div>
            <span className="text-sm text-gray-200/90">MireaCoin</span>
          </button>

          {/* links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-200/80">
            <button onClick={() => scrollToId("home")} className="hover:text-white transition">
              Главная
            </button>
            <button onClick={() => scrollToId("about")} className="hover:text-white transition">
              О проекте
            </button>
            <button onClick={() => scrollToId("how")} className="hover:text-white transition">
              Как это работает
            </button>
            <button onClick={() => scrollToId("team")} className="hover:text-white transition">
              Команда
            </button>
          </nav>

          {/* actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="px-5 py-2 rounded-full bg-black/35 border border-white/10 text-gray-200 hover:text-white hover:border-white/20 transition"
            >
              Авторизоваться
            </Link>
            <Link
              href="/auth"
              className="px-5 py-2 rounded-full bg-neon text-black font-semibold shadow-neon hover:scale-[1.03] active:scale-[0.98] transition duration-200 btn-glow"
            >
              Начать
            </Link>
          </div>
        </div>

        {/* mobile quick links */}
        <div className="md:hidden px-5 pb-4 flex gap-2 overflow-x-auto">
          {[
            ["home", "Главная"],
            ["about", "О проекте"],
            ["how", "Как это работает"],
            ["team", "Команда"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollToId(id)}
              className="shrink-0 px-4 py-2 rounded-full bg-black/30 border border-white/10 text-xs text-gray-200/90"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}