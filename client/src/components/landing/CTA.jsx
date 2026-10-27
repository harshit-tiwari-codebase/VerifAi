import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import Button from "../ui/Button.jsx";

export default function CTA() {
  return (
    <section className="container-xl py-24 relative">
      <div className="relative overflow-hidden px-8 py-16 md:px-16 md:py-20 text-center rounded-3xl bg-[#18181F] border border-[#27272A] shadow-[0_0_24px_rgba(139,92,246,0.16)]">
        {/* Soft Circular Violet Background Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full circular-glow-purple opacity-40" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#8B5CF6]/30 bg-[#211635] text-[#C4B5FD] font-sans text-xs font-medium mb-6">
            <ArrowUpRight className="h-3.5 w-3.5 text-[#A78BFA]" />
            <span>Ready To Prove Your Engineering Craftsmanship?</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-semibold text-[#FAFAFA] font-display leading-tight">
            Stop listing skills on paper. <br />
            <span className="text-[#8B5CF6]">Start proving them in code.</span>
          </h2>

          <p className="mt-5 text-[#A1A1AA] text-base md:text-lg leading-relaxed">
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

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 font-sans text-xs font-medium text-[#71717A]">
            <span className="flex items-center gap-1.5 text-[#A1A1AA]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#34D399]" />
              100% Free Tier Platform
            </span>
            <span className="h-1 w-1 rounded-full bg-[#27272A]" />
            <span>No Credit Card Required</span>
            <span className="h-1 w-1 rounded-full bg-[#27272A]" />
            <span>Instant Public Badge URL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
