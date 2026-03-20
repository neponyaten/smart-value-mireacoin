import Link from "next/link";

export default function SectionBenefits() {
  return (
    <section id="benefits" className="px-4 mt-24">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          ПРЕИМУЩЕСТВА
        </h2>

        <div className="mt-10 grid md:grid-cols-3 gap-8 text-center">
          <div className="glass rounded-[28px] border border-white/10 p-8">
            <div className="text-lg font-semibold text-white">
              SEAMLESS MINING
            </div>
            <div className="mt-3 text-gray-300 text-sm leading-relaxed">
              Вам не нужно нажимать кнопки или смотреть рекламу. Всё
              начисляется автоматически.
            </div>
          </div>

          <div className="glass rounded-[28px] border border-white/10 p-8">
            <div className="text-lg font-semibold text-white">
              PROOF-OF-VALUE
            </div>
            <div className="mt-3 text-gray-300 text-sm leading-relaxed">
              Превращаем академические успехи в ликвидный цифровой актив.
            </div>
          </div>

          <div className="glass rounded-[28px] border border-white/10 p-8">
            <div className="text-lg font-semibold text-white">
              GAME EDUCATION
            </div>
            <div className="mt-3 text-gray-300 text-sm leading-relaxed">
              Превращает учебный процесс в увлекательную цифровую игру.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}