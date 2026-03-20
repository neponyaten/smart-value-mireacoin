import Link from "next/link";
import { SectionReveal } from "@/components/landing/motion";

export default function SectionCTA() {
  return (
    <section className="px-4 mt-24 mb-16">
      <SectionReveal>
        <div className="mx-auto w-full max-w-6xl premium-card rounded-[40px] p-10 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_50%,rgba(0,255,255,0.15),transparent_70%)] pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-glow">
            Начни получать MireaCoin уже сегодня
          </h2>
          <p className="mt-6 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Подключи аккаунт и начни использовать продукт в beta-режиме
          </p>
          <Link
            href="/auth"
            className="premium-btn-primary inline-flex mt-10 px-12 py-4 rounded-full font-semibold"
          >
            Подключить аккаунт
          </Link>
        </div>
      </SectionReveal>
    </section>
  );
}