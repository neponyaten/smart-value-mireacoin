import { HoverCard, SectionReveal, StaggerContainer } from "@/components/landing/motion";

export default function SectionBenefits() {
  return (
    <section id="about" className="px-4 mt-24">
      <SectionReveal>
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Почему это полезно</h2>

          <StaggerContainer>
            <div className="mt-10 grid md:grid-cols-3 gap-4">
              <HoverCard className="premium-card rounded-3xl p-7 text-center">
                <div className="text-lg font-semibold text-white">Автоматически</div>
                <div className="mt-3 text-gray-300 text-sm leading-relaxed">Начисления происходят без ручных действий</div>
              </HoverCard>

              <HoverCard className="premium-card rounded-3xl p-7 text-center">
                <div className="text-lg font-semibold text-white">Без лишних действий</div>
                <div className="mt-3 text-gray-300 text-sm leading-relaxed">Пользовательский путь короткий и понятный</div>
              </HoverCard>

              <HoverCard className="premium-card rounded-3xl p-7 text-center">
                <div className="text-lg font-semibold text-white">Цифровая ценность</div>
                <div className="mt-3 text-gray-300 text-sm leading-relaxed">Учебная активность превращается в MireaCoin</div>
              </HoverCard>
            </div>
          </StaggerContainer>
        </div>
      </SectionReveal>
    </section>
  );
}