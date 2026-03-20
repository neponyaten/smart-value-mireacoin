"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionReveal } from "@/components/landing/motion";

export default function Hero() {
  return (
    <section id="home" className="pt-24 md:pt-28 px-4">
      <div className="mx-auto w-full max-w-6xl grid md:grid-cols-2 gap-10 items-center">
        <SectionReveal>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-cyan-100/90">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-200" />
              Beta
            </div>

            <h1 className="mt-5 text-[clamp(48px,7.4vw,92px)] leading-[0.92] font-extrabold tracking-tight text-white text-glow">
              Зарабатывай за учебу
            </h1>

            <p className="mt-5 text-slate-200/90 text-[clamp(16px,2.1vw,19px)] max-w-xl">
              Посещаемость и активность превращаются в MireaCoin автоматически
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/auth" className="premium-btn-primary inline-flex items-center justify-center px-10 py-3 rounded-full font-semibold">
                Начать
              </Link>
              <Link href="/auth" className="premium-btn-secondary inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold">
                Войти через МИРЭА
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Beta - если заметишь проблему, <a href="https://t.me/MireaCoin" target="_blank" rel="noreferrer" className="text-cyan-200 hover:text-cyan-100 transition">сообщи нам</a>
            </p>
          </div>
        </SectionReveal>

        <div className="relative flex justify-center md:justify-end">
          <SectionReveal delay={0.06}>
            <motion.div
              animate={{ y: [-2, 2], rotate: [-0.3, 0.3] }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 4.8, ease: "easeInOut" }}
              className="relative"
            >
              <div className="energy-lines" />
              <div className="absolute -inset-14 rounded-full bg-[radial-gradient(420px_420px_at_60%_45%,rgba(0,230,255,0.2),transparent_66%)] blur-2xl" />
              <span className="soft-particle left-6 top-16" />
              <span className="soft-particle right-7 top-24 [animation-delay:0.9s]" />
              <span className="soft-particle right-14 bottom-20 [animation-delay:1.6s]" />

              <div className="relative w-[min(332px,84vw)] h-[min(676px,72vh)] rounded-[52px] bg-[#070A12] border border-white/12 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
                <div className="absolute -inset-10 bg-[radial-gradient(420px_420px_at_68%_34%,rgba(0,255,255,0.12),transparent_62%)]" />

                <div className="absolute inset-4 rounded-[44px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,14,26,0.90),rgba(7,10,18,0.96))] overflow-hidden">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 rounded-full bg-black/70 border border-white/10" />

                  <div className="absolute inset-0 px-6 pt-16 pb-7 flex flex-col items-center text-center">
                    <div className="relative flex items-center justify-center">
                      <div className="energy-core" />
                      <div className="relative z-10 w-20 h-20 rounded-full bg-neon/12 border border-neon/30 flex items-center justify-center text-neon font-extrabold text-3xl shadow-[0_0_24px_rgba(0,255,255,0.14)]">
                        M
                      </div>
                    </div>

                    <div className="mt-3 text-slate-300 text-sm">MireaCoin Mobile</div>

                    <div className="mt-5 w-full premium-card rounded-3xl p-5 relative">
                      <div className="relative">
                        <div className="text-xs text-gray-400">Баланс</div>
                        <div className="text-2xl font-extrabold text-white mt-1">
                          490 <span className="text-neon">MC</span>
                        </div>
                        <div className="mt-4 h-20 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center text-xs text-gray-400">
                          attendance synced
                        </div>
                      </div>
                    </div>

                    <button className="premium-btn-primary mt-6 px-9 py-3 rounded-full font-semibold">
                      Обменять
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}