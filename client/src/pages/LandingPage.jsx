import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Hero from "../components/landing/Hero.jsx";
import Stats from "../components/landing/Stats.jsx";
import FannedCards from "../components/landing/FannedCards.jsx";
import FeatureShowcase from "../components/landing/FeatureShowcase.jsx";
import PipelineSimulator from "../components/landing/PipelineSimulator.jsx";
import FAQSection from "../components/landing/FAQSection.jsx";
import CTA from "../components/landing/CTA.jsx";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#0B0B0A] text-[#ECE8DD] selection:bg-[#422316] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <FannedCards />
        <FeatureShowcase />
        <PipelineSimulator />
        <FAQSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
