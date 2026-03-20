import { HoverCard, SectionReveal, StaggerContainer } from "@/components/landing/motion";

export default function SectionTeam() {
  return (
    <section id="team" className="px-4 mt-16 md:mt-20">
      <SectionReveal>
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="text-center text-2xl md:text-3xl font-extrabold tracking-tight">Команда</h2>

          <StaggerContainer>
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <HoverCard className="premium-card rounded-2xl px-5 py-4 text-center">
                <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-cyan-200/20 bg-[radial-gradient(circle_at_30%_25%,rgba(125,242,255,0.22),rgba(255,255,255,0.02))]" />
                <div className="text-white font-semibold">Kirill Chekunov</div>
                <div className="text-gray-400 text-xs mt-1">Product / Co-founder</div>
              </HoverCard>

              <HoverCard className="premium-card rounded-2xl px-5 py-4 text-center">
                <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-cyan-200/20 bg-[radial-gradient(circle_at_30%_25%,rgba(125,242,255,0.22),rgba(255,255,255,0.02))]" />
                <div className="text-white font-semibold">Denis Kosourov</div>
                <div className="text-gray-400 text-xs mt-1">Engineering / Co-founder</div>
              </HoverCard>
            </div>
          </StaggerContainer>
        </div>
      </SectionReveal>
    </section>
  );
}