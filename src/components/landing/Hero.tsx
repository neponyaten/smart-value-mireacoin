"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/landing/Reveal";

export default function Hero() {
  return (
    <section id="home" className="pt-24 md:pt-28 px-4">
      <div className="mx-auto w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <Reveal>
          <div>
            <h1 className="text-[clamp(44px,7.6vw,84px)] leading-[0.94] font-extrabold tracking-tight text-white text-glow">
              MireaCoin
            </h1>

            <p className="mt-5 text-gray-200/90 text-[clamp(16px,2.3vw,20px)] max-w-xl">
              <span className="font-semibold">ИНТЕЛЛЕКТУАЛЬНЫЙ</span> актив экосистемы
              РТУ МИРЭА.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center px-10 py-3 rounded-full bg-neon text-black font-semibold shadow-neon hover:scale-[1.04] active:scale-[0.98] transition duration-200"
              >
                Авторизоваться
              </Link>

              <Link
                href="/auth"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-black/35 border border-white/10 text-gray-200 hover:text-white hover:border-white/20 transition"
              >
                Авторизоваться ЛКС
              </Link>
            </div>

            {/* SMART EXCHANGE CARD */}
            <div className="mt-10 max-w-md">
              <div className="glass rounded-[30px] border border-white/10 p-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(520px_240px_at_20%_10%,rgba(0,255,255,0.12),transparent_60%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_30%)] pointer-events-none" />

                <div className="text-sm text-gray-200 font-semibold">SMART EXCHANGE #1</div>
                <div className="text-xs text-gray-400 mt-1">from MireaCoin</div>

                <div className="mt-4 h-44 rounded-2xl bg-black/25 border border-white/10 overflow-hidden relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(320px_180px_at_70%_35%,rgba(0,255,255,0.16),transparent_65%)]" />
                  <div className="absolute -left-10 top-8 w-52 h-[160%] rotate-[18deg] bg-white/10 blur-2xl opacity-25" />
                  <div className="text-gray-300/80 text-sm relative">CARD / ART (placeholder)</div>
                </div>

                <button className="mt-4 w-full py-3 rounded-full bg-neon text-black font-semibold shadow-neon hover:scale-[1.02] active:scale-[0.98] transition duration-200">
                  Обменять бесплатно
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* RIGHT */}
        <div className="relative flex justify-center md:justify-end">
          {/* волна/провод как в макете */}
          <div className="pointer-events-none absolute -left-20 md:-left-40 top-1/2 -translate-y-1/2 w-[520px] h-[240px] opacity-70">
            <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(0,255,255,0.16),transparent)] blur-2xl" />
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 520 240"
              fill="none"
            >
              <path
                d="M10 160 C 120 40, 220 240, 330 120 C 390 50, 450 60, 510 90"
                stroke="rgba(0,255,255,0.35)"
                strokeWidth="3"
              />
              <path
                d="M10 160 C 120 40, 220 240, 330 120 C 390 50, 450 60, 510 90"
                stroke="rgba(0,255,255,0.15)"
                strokeWidth="10"
              />
            </svg>
          </div>

          <Reveal delay={0.06}>
            <motion.div
              animate={{ y: [-6, 6] }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 3.2, ease: "easeInOut" }}
              className="relative"
            >
              {/* phone size responsive */}
              <div className="relative w-[min(340px,86vw)] h-[min(680px,74vh)] rounded-[58px] bg-black/40 border border-white/10 overflow-hidden shadow-[0_18px_70px_rgba(0,0,0,0.60)]">
                {/* outer glow */}
                <div className="absolute -inset-16 bg-[radial-gradient(520px_520px_at_65%_35%,rgba(0,255,255,0.18),transparent_60%)]" />
                <div className="absolute inset-0 ring-2 ring-neon/30 rounded-[58px]" />

                {/* glass highlight */}
                <div className="absolute -left-28 top-12 w-72 h-[140%] rotate-[18deg] bg-white/10 blur-2xl opacity-30" />
                <div className="absolute right-10 top-10 w-40 h-40 bg-white/5 blur-2xl rounded-full" />

                {/* side buttons */}
                <div className="absolute left-[-3px] top-[150px] w-[6px] h-12 rounded-full bg-white/14" />
                <div className="absolute left-[-3px] top-[220px] w-[6px] h-20 rounded-full bg-white/14" />
                <div className="absolute right-[-3px] top-[190px] w-[6px] h-24 rounded-full bg-white/12" />

                {/* inner screen */}
                <div className="absolute inset-5 rounded-[48px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,14,26,0.86),rgba(6,8,14,0.94))] overflow-hidden">
                  {/* top chip / notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-7 rounded-full bg-black/70 border border-white/10" />
                  <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-14 h-2 rounded-full bg-white/10" />
                  <div className="absolute top-[16px] left-[calc(50%+50px)] w-2.5 h-2.5 rounded-full bg-white/14" />

                  {/* phone UI */}
                  <div className="absolute inset-0 px-7 pt-16 pb-8 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-neon/12 border border-neon/35 flex items-center justify-center text-neon font-extrabold text-3xl shadow-[0_0_34px_rgba(0,255,255,0.18)]">
                      M
                    </div>

                    <div className="mt-4 text-gray-300 text-sm">MireaCoin Wallet</div>

                    <div className="mt-6 w-full rounded-3xl border border-white/10 bg-black/25 p-5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(420px_220px_at_30%_20%,rgba(0,255,255,0.14),transparent_70%)]" />
                      <div className="relative">
                        <div className="text-xs text-gray-400">Баланс</div>
                        <div className="text-2xl font-extrabold text-white mt-1">
                          490 <span className="text-neon">MC</span>
                        </div>

                        <div className="mt-4 h-24 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center text-xs text-gray-400">
                          mini card / chart
                        </div>
                      </div>
                    </div>

                    <button className="mt-7 px-10 py-3 rounded-full bg-neon text-black font-semibold shadow-neon hover:scale-[1.04] active:scale-[0.98] transition duration-200">
                      Обменять
                    </button>
                  </div>

                  {/* bottom glow */}
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[560px] h-[240px] bg-[radial-gradient(closest-side,rgba(0,255,255,0.20),transparent)] blur-2xl opacity-80" />
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}