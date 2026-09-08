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
    <div className="relative min-h-screen overflow-x-hidden bg-black text-mist-100 selection:bg-violet-500/30 selection:text-white">
      {/* Clean Circular Purple Background Glows (Landing Page ONLY as requested) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Top Hero circular glow */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full circular-glow-purple pointer-events-none opacity-80" />
        {/* Mid-page circular glow anchor */}
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 h-[550px] w-[550px] rounded-full circular-glow-purple pointer-events-none opacity-60" />
        {/* Lower CTA circular glow anchor */}
        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full circular-glow-purple pointer-events-none opacity-75" />
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
