import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import Button from "../ui/Button.jsx";

export default function CTA() {
  return (
    <section className="container-xl py-24 relative">
      <div className="relative overflow-hidden rounded-[8px] border border-[#30302B] bg-[#141412] px-8 py-16 text-center md:px-16 md:py-20">
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] border border-[#FF6A3D]/30 bg-[#1E1E1A] text-[#AAA69B] font-mono text-[10px] uppercase tracking-[0.18em] mb-6">
            <ArrowUpRight className="h-3 w-3 text-[#FF6A3D]" strokeWidth={1.5} />
            <span>Prove Your Engineering Craftsmanship</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-semibold text-[#F2EFE6] font-display leading-tight">
            Stop listing skills on paper.<br />
            <span className="text-[#FF6A3D]">Start proving them in code.</span>
          </h2>

          <p className="mt-5 text-[#AAA69B] text-base md:text-lg leading-relaxed font-sans">
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
              as={Link}
              to="/playground"
              variant="ghost"
              size="lg"
              className="group"
            >
              Try Playground Demo
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 font-sans text-xs font-medium text-[#77756D]">
            <span className="flex items-center gap-1.5 text-[#AAA69B]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#4FBF94]" strokeWidth={1.5} />
              100% Free Tier Platform
            </span>
            <span className="h-1 w-1 rounded-full bg-[#30302B]" />
            <span>No Credit Card Required</span>
            <span className="h-1 w-1 rounded-full bg-[#30302B]" />
            <span>Instant Public Badge URL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
