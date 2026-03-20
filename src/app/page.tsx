import LandingNavbar from "@/components/landing/LandingNavbar";
import Hero from "@/components/landing/Hero";
import SectionAbout from "@/components/landing/SectionAbout";
import SectionTeam from "@/components/landing/SectionTeam";
import SectionHowItWorks from "@/components/landing/SectionHowItWorks";
import SectionBenefits from "@/components/landing/SectionBenefits";
import LandingFooter from "@/components/landing/LandingFooter";
import SectionCTA from "@/components/landing/SectionCTA";
import BackgroundGlow from "@/components/landing/BackgroundGlow";

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <LandingNavbar />

      {/* фон */}
      <div className="fixed inset-0 -z-10 bg-[#05070D]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(900px_600px_at_75%_20%,rgba(30,120,255,0.20),transparent_60%),radial-gradient(900px_700px_at_15%_30%,rgba(120,0,255,0.14),transparent_60%),radial-gradient(1100px_700px_at_55%_90%,rgba(0,255,255,0.10),transparent_60%)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.20),rgba(0,0,0,0.85))]" />

      <BackgroundGlow />

      <Hero />

      {/* 1 */}
      <SectionAbout />

      {/* 2 */}
      <SectionHowItWorks />

      {/* 3 */}
      <SectionBenefits />

      {/* 4 */}
      <SectionTeam />

      <SectionCTA />

      <LandingFooter />
    </main>
  );
}