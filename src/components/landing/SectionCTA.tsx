import Link from "next/link";
import Reveal from "@/components/landing/Reveal";

export default function SectionCTA() {
  return (
    <section className="px-4 mt-24 mb-16">
      <Reveal>
        <div className="mx-auto w-full max-w-6xl glass rounded-[40px] border border-white/10 p-10 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_50%,rgba(0,255,255,0.15),transparent_70%)] pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-glow">
            Готов начать?
          </h2>
          <p className="mt-6 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Подключи аккаунт и получай монеты автоматически за посещаемость и активность.
          </p>
          <Link
            href="/auth"
            className="inline-flex mt-10 px-12 py-4 rounded-full bg-neon text-black font-semibold shadow-neon hover:scale-105 active:scale-95 transition duration-200 btn-glow"
          >
            Подключиться
          </Link>
        </div>
      </Reveal>
    </section>
  );
}