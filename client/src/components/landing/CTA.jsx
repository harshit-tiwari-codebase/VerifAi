import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import Button from "../ui/Button.jsx";

export default function CTA() {
  return (
    <section className="container-xl py-24 relative">
      <div className="card relative overflow-hidden px-8 py-16 md:px-16 md:py-20 text-center border-violet-500/40 bg-gradient-to-b from-ink-800/80 to-[#070A10] shadow-[0_0_60px_rgba(147,51,234,0.15)]">
        {/* Ambient atmospheric gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.22),transparent_70%)]" />
        <div className="pointer-events-none absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 font-sans text-xs font-medium mb-6 shadow-sm">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>Ready To Prove Your Engineering Craftsmanship?</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-semibold text-mist-100 font-display leading-tight">
            Stop listing skills on paper. <br />
            <span className="text-violet-400">Start proving them in code.</span>
          </h2>

          <p className="mt-5 text-mist-300 text-base md:text-lg leading-relaxed">
            Your first evaluated challenge takes ten minutes. Your public profile with cryptographically validated badges does the talking after that.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              as={Link}
              to="/register"
              variant="verify"
              size="lg"
              className="group"
            >
              Get Verified For Free
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>

            <Button
              as="a"
              href="#playground"
              variant="ghost"
              size="lg"
              className="group"
            >
              Try Playground Demo
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 font-sans text-xs font-medium text-mist-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              100% Free Tier Platform
            </span>
            <span className="h-1 w-1 rounded-full bg-ink-500" />
            <span>No Credit Card Required</span>
            <span className="h-1 w-1 rounded-full bg-ink-500" />
            <span>Instant Public Badge URL</span>
          </div>
        </div>
      </div>
    </section>
  );
}