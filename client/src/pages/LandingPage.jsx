import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Hero from "../components/landing/Hero.jsx";
import Stats from "../components/landing/Stats.jsx";
import PipelineSimulator from "../components/landing/PipelineSimulator.jsx";
import InteractivePlayground from "../components/landing/InteractivePlayground.jsx";
import FeatureShowcase from "../components/landing/FeatureShowcase.jsx";
import ComparisonMatrix from "../components/landing/ComparisonMatrix.jsx";
import PublicProfileShowcase from "../components/landing/PublicProfileShowcase.jsx";
import TechStack from "../components/landing/TechStack.jsx";
import FAQSection from "../components/landing/FAQSection.jsx";
import CTA from "../components/landing/CTA.jsx";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070A10] text-mist-100 selection:bg-violet-500/30 selection:text-white">
      {/* Dynamic Background Atmosphere Glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-48 -top-48 h-[40rem] w-[40rem] rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute right-0 top-1/4 h-[35rem] w-[35rem] rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute left-1/4 top-2/3 h-[38rem] w-[38rem] rounded-full bg-indigo-600/8 blur-[160px]" />
        <div className="absolute -right-48 bottom-10 h-[42rem] w-[42rem] rounded-full bg-violet-600/10 blur-[150px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          {/* 1. Hero with Interactive 3D Angled Terminal */}
          <Hero />

          {/* 2. Platform Telemetry Numbers */}
          <Stats />

          {/* 3. The 4-Stage Core Architecture Pipeline */}
          <PipelineSimulator />

          {/* 4. Live In-Browser Sandbox Playground */}
          <InteractivePlayground />

          {/* 5. Deep Feature Matrix & Pillars */}
          <FeatureShowcase />

          {/* 6. Why VerifAI: Resumes vs LeetCode vs VerifAI */}
          <ComparisonMatrix />

          {/* 7. Public Developer Profile & Cryptographic Badges */}
          <PublicProfileShowcase />

          {/* 8. Zero-Cost Production Stack */}
          <TechStack />

          {/* 9. Interactive FAQ */}
          <FAQSection />

          {/* 10. Closing Call To Action */}
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
