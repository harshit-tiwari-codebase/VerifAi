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
    <div className="relative min-h-screen overflow-x-hidden bg-ink-900">
      {/* Ambient background orbs — purely decorative, sit behind everything.
          Sizes/positions are spread out so they don't all cluster in one
          spot as the page scrolls past different sections. */}
      <div className="orb orb-verify -left-40 -top-40 h-[32rem] w-[32rem]" />
      <div className="orb orb-signal -right-32 top-64 h-[28rem] w-[28rem]" />
      <div className="orb orb-verify left-1/3 top-[140rem] h-[30rem] w-[30rem] opacity-70" />
      <div className="orb orb-signal -right-40 bottom-0 h-[34rem] w-[34rem]" />

      <div className="relative z-10">
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
    </div>
  );
}
