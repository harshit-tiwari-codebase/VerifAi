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
  Zap,
} from "lucide-react";
import Button from "../ui/Button.jsx";
import Badge from "../ui/Badge.jsx";

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
      {/* Centered Circular Purple Glow */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-[550px] w-[550px] rounded-full circular-glow-purple opacity-70" />

      <div className="grid items-center gap-12 lg:gap-16 lg:grid-cols-12 relative z-10">
        {/* Left Headline & CTAs (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 font-sans text-xs font-medium mb-6 shadow-[0_0_20px_rgba(147,51,234,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
            </span>
            <span>AI-Evaluated Proof of Work · Zero Resume Inflation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-mist-100 font-display">
            Your resume says <br className="hidden sm:inline" />
            <span className="text-mist-500 line-through decoration-violet-500/60 font-display font-medium text-3xl sm:text-4xl lg:text-5xl">
              "Proficient in Node.js"
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent">
              VerifAI
            </span>{" "}
            makes it provable.
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg text-mist-300 leading-relaxed font-sans font-normal">
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
              <Play className="h-4 w-4 mr-1.5 fill-current text-violet-400 group-hover:scale-110 transition-transform duration-200" />
              Try Live Playground
            </Button>
          </div>

          {/* Architecture Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center gap-y-3 gap-x-6 font-sans text-xs font-medium text-mist-400 border-t border-ink-600/70 pt-6">
            <span className="flex items-center gap-2">
              <Cpu className="h-3.5 w-3.5 text-violet-400" />
              Judge0 Sandboxed Cgroups
            </span>
            <span className="h-1 w-1 rounded-full bg-ink-500 hidden sm:inline" />
            <span className="flex items-center gap-2">
              <ArrowUpRight className="h-3.5 w-3.5 text-purple-400" />
              Gemini & Groq AI Audit
            </span>
            <span className="h-1 w-1 rounded-full bg-ink-500 hidden sm:inline" />
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
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
          <div className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-600/25 to-purple-600/15 blur-xl opacity-60" />

          <div className="card overflow-hidden shadow-2xl border-white/[0.08] bg-[#07080c] relative">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-[#0d0f15] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-xs text-mist-400">
                  submissions/rate-limiter.js
                </span>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                SANDBOXED
              </span>
            </div>

            {/* Code Body */}
            <pre className="overflow-x-auto no-scrollbar p-5 font-mono text-[12px] leading-6 text-mist-300">
              <code>
                <span className="text-violet-400">class</span>{" "}
                <span className="text-amber-300">TokenBucket</span> {"{"}
                {"\n"}
                {"  "}
                <span className="text-violet-400">constructor</span>
                (capacity, refillRate) {"{"}
                {"\n"}
                {"    "}this.tokens = capacity;
                {"\n"}
                {"    "}this.last = Date.now();
                {"\n"}
                {"  }"}
                {"\n\n"}
                {"  "}
                <span className="text-mist-500">// O(1) mathematical refill delta</span>
                {"\n"}
                {"  "}allow(count = 1) {"{"}
                {"\n"}
                {"    "}
                <span className="text-violet-400">const</span> delta = (Date.now() - this.last) / 1000;
                {"\n"}
                {"    "}this.tokens = Math.min(capacity, this.tokens + delta * refillRate);
                {"\n"}
                {"    "}
                <span className="text-violet-400">return</span> this.tokens &gt;= count;
                {"\n"}
                {"  }"}
                {"\n"}
                {"}"}
              </code>
            </pre>

            {/* Simulated Live Action & Evaluation Footer */}
            <div className="border-t border-white/[0.08] bg-[#0d0f15] p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-xs font-sans font-medium text-mist-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
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
                  <Play className="h-3 w-3 fill-current text-violet-400" />
                  {isSimulating ? "Evaluating..." : "Simulate"}
                </Button>
              </div>

              {/* Dynamic Score Card */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-violet-500/30 bg-violet-950/20">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-violet-400" />
                  <span className="font-sans text-xs font-medium text-mist-200">
                    Badge Minted: Rate Limiter Architect
                  </span>
                </div>
                <span className="font-sans text-xs font-bold text-violet-400 bg-violet-500/20 px-2 py-0.5 rounded border border-violet-500/30">
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