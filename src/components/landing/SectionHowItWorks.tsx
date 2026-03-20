import { HoverCard, SectionReveal, StaggerContainer } from "@/components/landing/motion";

export default function SectionHowItWorks() {
  return (
    <section id="how" className="px-4 mt-16 md:mt-24">
      <SectionReveal>
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Как это работает</h2>

          <StaggerContainer>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <HoverCard className="premium-card rounded-3xl p-6 text-center">
                <div className="mx-auto w-11 h-11 rounded-full bg-neon/15 border border-neon/35 flex items-center justify-center text-neon font-semibold">
                  1
                </div>
                <div className="mt-4 text-white font-semibold">Вход через МИРЭА</div>
                <div className="mt-2 text-gray-300 text-sm leading-relaxed">Подключение аккаунта</div>
              </HoverCard>

              <HoverCard className="premium-card rounded-3xl p-6 text-center">
                <div className="mx-auto w-11 h-11 rounded-full bg-emerald-300/15 border border-emerald-200/35 flex items-center justify-center text-emerald-200 font-semibold">
                  2
                </div>
                <div className="mt-4 text-white font-semibold">Синхронизация данных</div>
                <div className="mt-2 text-gray-300 text-sm leading-relaxed">Обновление автоматически</div>
              </HoverCard>

              <HoverCard className="premium-card rounded-3xl p-6 text-center">
                <div className="mx-auto w-11 h-11 rounded-full bg-indigo-300/15 border border-indigo-200/35 flex items-center justify-center text-indigo-200 font-semibold">
                  3
                </div>
                <div className="mt-4 text-white font-semibold">Получение MireaCoin</div>
                <div className="mt-2 text-gray-300 text-sm leading-relaxed">Монеты поступают на баланс</div>
              </HoverCard>
            </div>
          </StaggerContainer>
        </div>
      </SectionReveal>
    </section>
  );
}