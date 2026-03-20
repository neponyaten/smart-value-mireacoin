import Reveal from "@/components/landing/Reveal";

export default function SectionAbout() {
  return (
    <section id="about" className="px-4 mt-16 md:mt-24">
      <div className="mx-auto w-full max-w-6xl grid md:grid-cols-2 gap-10 items-start">
        <Reveal>
          <div className="glass rounded-[34px] border border-white/10 p-8">
            <h2 className="text-4xl font-extrabold tracking-tight text-glow">
              Почему это работает
            </h2>

            <p className="mt-5 text-gray-200/90 leading-relaxed">
              MireaCoin строится как продукт: прозрачная логика начислений,
              предсказуемый результат и минимум ручных действий.
            </p>

            <p className="mt-4 text-gray-200/90 leading-relaxed">
              Система связывает учебные данные и активность с цифровыми
              поощрениями. Это делает процесс понятным и воспроизводимым.
            </p>

            <p className="mt-4 text-gray-200/90 leading-relaxed">
              <span className="text-neon font-semibold">SMART EXCHANGE</span> —
              конвертация вашей вовлеченности в ценный цифровой актив.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="glass rounded-[34px] border border-white/10 p-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-glow">
              Как мы считаем
            </h2>

            <ul className="mt-5 space-y-3 text-gray-200/90">
              <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                Данные берутся из системы МИРЭА
              </li>
              <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                Начисления автоматические
              </li>
              <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                Ничего не нужно делать вручную
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}