import Link from "next/link";

export default function SectionHowItWorks() {
  return (
    <section id="how" className="px-4 mt-16 md:mt-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            КАК ЭТО РАБОТАЕТ
          </h2>
          <Link
            href="/auth"
            className="px-10 py-3 rounded-full bg-neon text-black font-semibold shadow-neon hover:opacity-90 transition"
          >
            Начать
          </Link>
        </div>

        <div className="mt-8 glass rounded-[34px] border border-white/10 p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="mx-auto w-12 h-12 rounded-full bg-neon/15 border border-neon/40 flex items-center justify-center text-neon font-bold">
                1
              </div>
              <div className="mt-4 text-white font-semibold">Smart Sync</div>
              <div className="mt-2 text-gray-300 text-sm leading-relaxed">
                Вы входите в систему через личный кабинет. Синхронизируем профиль.
              </div>
            </div>

            <div>
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-300/15 border border-emerald-200/40 flex items-center justify-center text-emerald-200 font-bold">
                2
              </div>
              <div className="mt-4 text-white font-semibold">API-Auth Mining</div>
              <div className="mt-2 text-gray-300 text-sm leading-relaxed">
                Посещаемость и активность автоматически начисляются на баланс.
              </div>
            </div>

            <div>
              <div className="mx-auto w-12 h-12 rounded-full bg-indigo-300/15 border border-indigo-200/40 flex items-center justify-center text-indigo-200 font-bold">
                3
              </div>
              <div className="mt-4 text-white font-semibold">Smart Exchange</div>
              <div className="mt-2 text-gray-300 text-sm leading-relaxed">
                Накопленные токены — внутренняя валюта экосистемы МИРЭА.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}