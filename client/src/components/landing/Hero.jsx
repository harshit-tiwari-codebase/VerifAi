import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  Terminal,
  Play,
  CheckCircle2,
  Cpu,
  Award,
} from "lucide-react";
import Button from "../ui/Button.jsx";

export default function Hero() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const handleHeroPreview = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 1000);
    setTimeout(() => {
      setSimStep(3);
      setIsSimulating(false);
    }, 2200);
  };

  return (
    <section className="container-xl relative pt-20 pb-20 md:pt-28 md:pb-28">
      {/* Centered Circular Violet Glow */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full circular-glow-purple opacity-50" />

      <div className="grid items-center gap-12 lg:gap-16 lg:grid-cols-12 relative z-10">
        {/* Left Headline & CTAs (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#8B5CF6]/30 bg-[#211635] text-[#C4B5FD] font-sans text-xs font-medium mb-6 shadow-[0_0_24px_rgba(139,92,246,0.16)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A78BFA] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]" />
            </span>
            <span>AI-Evaluated Proof of Work · Zero Resume Inflation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-[#FAFAFA] font-display">
            Your resume says <br className="hidden sm:inline" />
            <span className="text-[#71717A] line-through decoration-[#8B5CF6]/60 font-display font-medium text-3xl sm:text-4xl lg:text-5xl">
              "Proficient in Node.js"
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] bg-clip-text text-transparent">
              VerifAI
            </span>{" "}
            makes it provable.
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg text-[#A1A1AA] leading-relaxed font-sans font-normal">
            Solve real production engineering challenges — distributed locks, token buckets, and database schema migrations — in an isolated sandbox. An AI evaluation engine reviews your architecture like a Staff Engineer, minting tamper-proof badges to your public profile.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              as={Link}
              to="/register"
              variant="verify"
              size="lg"
              className="group"
            >
              Start a Challenge
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>

            <Button
              as="a"
              href="#playground"
              variant="ghost"
              size="lg"
              className="group"
            >
              <Play className="h-4 w-4 mr-1.5 fill-current text-[#8B5CF6] group-hover:scale-110 transition-transform duration-200" />
              Try Live Playground
            </Button>
          </div>

          {/* Architecture Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center gap-y-3 gap-x-6 font-sans text-xs font-medium text-[#A1A1AA] border-t border-[#27272A] pt-6">
            <span className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-[#8B5CF6]" />
              Judge0 Sandboxed Cgroups
            </span>
            <span className="h-1 w-1 rounded-full bg-[#27272A] hidden sm:inline" />
            <span className="flex items-center gap-2">
              <ArrowUpRight className="h-3.5 w-3.5 text-[#A78BFA]" />
              Gemini & Groq AI Audit
            </span>
            <span className="h-1 w-1 rounded-full bg-[#27272A] hidden sm:inline" />
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#34D399]" />
              Public Verified Badges
            </span>
          </div>
        </motion.div>

        {/* Right 3D-Angled Interactive Terminal Visual (5 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          {/* Ambient terminal backdrop glow */}
          <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#7C3AED]/20 to-[#8B5CF6]/15 blur-xl opacity-60" />

          <div className="card overflow-hidden shadow-2xl border-[#27272A] bg-[#0D0D12] relative rounded-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-[#27272A] bg-[#111116] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
                <span className="ml-2 font-mono text-xs text-[#A1A1AA]">
                  submissions/rate-limiter.js
                </span>
              </div>

              <span className="text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded border border-[#34D399]/20 font-semibold">
                SANDBOXED
              </span>
            </div>

            {/* Code Body */}
            <pre className="overflow-x-auto no-scrollbar p-5 font-mono text-[12px] leading-6 text-[#E4E4E7] bg-[#0D0D12]">
              <code>
                <span className="text-[#C084FC]">class</span>{" "}
                <span className="text-[#93C5FD]">TokenBucket</span> {"{"}
                {"\n"}
                {"  "}
                <span className="text-[#C084FC]">constructor</span>
                (capacity, refillRate) {"{"}
                {"\n"}
                {"    "}this.tokens = capacity;
                {"\n"}
                {"    "}this.last = Date.now();
                {"\n"}
                {"  }"}
                {"\n\n"}
                {"  "}
                <span className="text-[#858592]">// O(1) mathematical refill delta</span>
                {"\n"}
                {"  "}allow(count = 1) {"{"}
                {"\n"}
                {"    "}
                <span className="text-[#C084FC]">const</span> delta = (Date.now() - this.last) / 1000;
                {"\n"}
                {"    "}this.tokens = Math.min(capacity, this.tokens + delta * refillRate);
                {"\n"}
                {"    "}
                <span className="text-[#C084FC]">return</span> this.tokens &gt;= count;
                {"\n"}
                {"  }"}
                {"\n"}
                {"}"}
              </code>
            </pre>

            {/* Simulated Live Action & Evaluation Footer */}
            <div className="border-t border-[#27272A] bg-[#111116] p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-xs font-sans font-medium text-[#FAFAFA]">
                  <CheckCircle2 className="h-4 w-4 text-[#34D399]" />
                  <span>
                    {simStep === 0 && "12/12 Test Cases Passed"}
                    {simStep === 1 && "Judge0: Running unit assertions..."}
                    {simStep === 2 && "Gemini AI: Analyzing AST & O(1) complexity..."}
                    {simStep === 3 && "Verified: Architecture score 96/100"}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHeroPreview}
                  disabled={isSimulating}
                  className="!px-2.5 !py-1 !text-xs !rounded-lg"
                >
                  <Play className="h-3 w-3 fill-current text-[#8B5CF6]" />
                  {isSimulating ? "Evaluating..." : "Simulate"}
                </Button>
              </div>

              {/* Dynamic Score Card */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#8B5CF6]/30 bg-[#211635]">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-[#A78BFA]" />
                  <span className="font-sans text-xs font-medium text-[#FAFAFA]">
                    Badge Minted: Rate Limiter Architect
                  </span>
                </div>
                <span className="font-sans text-xs font-bold text-[#C4B5FD] bg-[#38245C] px-2 py-0.5 rounded border border-[#8B5CF6]/40">
                  SCORE 96
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
