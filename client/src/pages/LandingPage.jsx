import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Hero from "../components/landing/Hero.jsx";
import Stats from "../components/landing/Stats.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";
import LiveDemo from "../components/landing/LiveDemo.jsx";
import TechStack from "../components/landing/TechStack.jsx";
import CTA from "../components/landing/CTA.jsx";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <HowItWorks />
        <LiveDemo />
        <TechStack />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
