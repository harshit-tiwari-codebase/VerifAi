import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import {
  Cpu,
  Zap,
  Activity,
  Award,
  Check,
  ShieldCheck,
  Terminal,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    id: "deterministic-harness",
    icon: Cpu,
    tag: "Concurrency & Determinism",
    stepNumber: "01",
    title: "Deterministic Test Harness & Concurrency Fuzzing",
    subtitle: "Micro-container isolation with race condition synthesis",
    description:
      "Executes algorithms against thousands of interleaved thread states, asynchronous reentrancy permutations, and edge-case boundaries in deterministic Linux micro-containers.",
    highlights: [
      "Multi-threaded race condition and deadlock fuzzing",
      "Deterministic seed execution for reproducible audit traces",
      "Atomic Redis Lua token bucket and distributed mutex checks",
      "Sub-millisecond CPU quota and seccomp syscall constraints",
    ],
    codePreview: `// Deterministic Concurrency Fuzzing Harness
const fuzzer = new ConcurrencyFuzzer({
  threads: 64,
  burstOpsPerSec: 50_000,
  chaosLatencyMs: [1, 25],
  detectDeadlocks: true
});
const verdict = await fuzzer.assertInvariants(distributedLock);`,
    codeLang: "javascript",
    // Cyan/Emerald rich dark theme gradient
    gradientClass: "bg-gradient-to-br from-[#031513] via-[#072420] to-[#020b0a]",
    borderColor: "border-emerald-500/40 hover:border-emerald-400/60",
    shadowColor: "shadow-[0_-15px_50px_rgba(0,0,0,0.85),0_30px_70px_rgba(0,0,0,0.9)]",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    accentColor: "text-emerald-400",
    glowOrb: "rgba(16, 185, 129, 0.35)",
    indicatorColor: "#10b981",
  },
  {
    id: "chaos-monkey",
    icon: Zap,
    tag: "Fault Injection",
    stepNumber: "02",
    title: "Distributed Network Fault Injection (Chaos Monkey Engine)",
    subtitle: "Partition resilience and split-brain mitigation audits",
    description:
      "Simulates network jitter, split-brain packet drops, leader elections, and clock drift under extreme production scale to ensure distributed algorithms never corrupt global state.",
    highlights: [
      "Jepsen-style network partition and partition healing tests",
      "Clock skew and NTP drift simulation across cluster nodes",
      "Graceful degradation verification under cascading upstream failures",
      "Zero data loss assertions on Raft and Redlock consensus",
    ],
    codePreview: `// Chaos Monkey Partition Simulation Telemetry
{
  "scenario": "SplitBrainNetworkPartition_50Nodes",
  "droppedPackets": "42.8%",
  "clockSkewMs": 140,
  "leaderReElection": "12ms (Raft Validated)",
  "stateIntegrity": "100% Monotonic Consistency"
}`,
    codeLang: "json",
    // Violet/Fuchsia rich dark theme gradient
    gradientClass: "bg-gradient-to-br from-[#160826] via-[#230a3b] to-[#090312]",
    borderColor: "border-fuchsia-500/40 hover:border-fuchsia-400/60",
    shadowColor: "shadow-[0_-15px_50px_rgba(0,0,0,0.85),0_30px_70px_rgba(0,0,0,0.9)]",
    badgeBg: "bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-300",
    accentColor: "text-fuchsia-400",
    glowOrb: "rgba(217, 70, 239, 0.35)",
    indicatorColor: "#d946ef",
  },
  {
    id: "telemetry-profiler",
    icon: Activity,
    tag: "Telemetry & Profiling",
    stepNumber: "03",
    title: "Real-time State Telemetry & Memory Profiler",
    subtitle: "Deep heap allocation, event-loop lag, and AST complexity metrics",
    description:
      "Continuous profiling captures memory allocations, GC pause durations, V8 bytecode de-optimizations, and algorithmic asymptotic complexity curves in real-time.",
    highlights: [
      "O(1) vs O(n) asymptotic runtime verification",
      "Event-loop latency breakdown with microsecond precision",
      "Heap allocation delta profiling & memory leak detection",
      "Dual AI architectural critique (Gemini 1.5 Pro + Groq)",
    ],
    codePreview: `# Live Heap & Latency Profiler Specs
runtime_telemetry:
  p50_latency_ms: 0.42
  p99_latency_ms: 1.18
  heap_allocation_delta_kb: 4.2
  event_loop_lag_us: 180
  memory_leak_risk: "0.00% (Monotonic Stable)"`,
    codeLang: "yaml",
    // Amber/Orange rich dark theme gradient
    gradientClass: "bg-gradient-to-br from-[#1f0e03] via-[#331705] to-[#0f0601]",
    borderColor: "border-orange-500/40 hover:border-orange-400/60",
    shadowColor: "shadow-[0_-15px_50px_rgba(0,0,0,0.85),0_30px_70px_rgba(0,0,0,0.9)]",
    badgeBg: "bg-orange-500/15 border-orange-500/30 text-orange-300",
    accentColor: "text-orange-400",
    glowOrb: "rgba(249, 115, 22, 0.35)",
    indicatorColor: "#f97316",
  },
  {
    id: "crypto-credentials",
    icon: Award,
    tag: "Verifiable Credentials",
    stepNumber: "04",
    title: "Cryptographic Verification & Proof-of-Skill Badging",
    subtitle: "Permanent proof recruiters and peers can verify in 1 click",
    description:
      "Successful challenge resolutions produce a tamper-proof cryptographic badge anchored with a SHA-256 hash containing test logs, AI feedback, and code execution telemetry.",
    highlights: [
      "Shareable public profile permalink (verifai.dev/u/handle)",
      "Cryptographic SHA-256 signature validating authentic execution",
      "1-click recruiter verification modal with zero paywall",
      "Embeddable SVG dynamic badge for GitHub READMEs & portfolios",
    ],
    codePreview: `# Cryptographic Skill Credential Permalink
https://verifai.dev/verify/badge_9f82d4bc
sha256: 8f4a180d7c03b12f6892e59174fa9062b1a8d00344d9...
status: "AUTHENTIC_STAFF_VERIFIED"
issued_at: "2026-10-27T21:35:00Z"`,
    codeLang: "bash",
    // Blue/Sky rich dark theme gradient
    gradientClass: "bg-gradient-to-br from-[#05142b] via-[#082045] to-[#020b17]",
    borderColor: "border-sky-500/40 hover:border-sky-400/60",
    shadowColor: "shadow-[0_-15px_50px_rgba(0,0,0,0.85),0_30px_70px_rgba(0,0,0,0.9)]",
    badgeBg: "bg-sky-500/15 border-sky-500/30 text-sky-300",
    accentColor: "text-sky-400",
    glowOrb: "rgba(14, 165, 233, 0.35)",
    indicatorColor: "#0ea5e9",
  },
];

function CardStackItem({ feature, index, smoothProgress }) {
  // Physical card stacking with zero upward drift so cards NEVER collide with Stage Header
  let translateY;
  let scale;
  let dimOverlay;

  if (index === 0) {
    translateY = useTransform(smoothProgress, [0, 0.28, 0.56, 0.84, 1.0], ["0%", "0%", "0%", "0%", "0%"]);
    scale = useTransform(smoothProgress, [0, 0.28, 0.56, 0.84, 1.0], [1, 0.96, 0.92, 0.88, 0.86]);
    dimOverlay = useTransform(smoothProgress, [0, 0.28, 0.56, 0.84, 1.0], [0, 0.28, 0.48, 0.65, 0.72]);
  } else if (index === 1) {
    translateY = useTransform(smoothProgress, [0, 0.14, 0.32, 0.56, 0.84, 1.0], ["110%", "110%", "0%", "0%", "0%", "0%"]);
    scale = useTransform(smoothProgress, [0, 0.14, 0.32, 0.56, 0.84, 1.0], [1, 1, 1, 0.96, 0.92, 0.90]);
    dimOverlay = useTransform(smoothProgress, [0, 0.14, 0.32, 0.56, 0.84, 1.0], [0, 0, 0, 0.28, 0.50, 0.60]);
  } else if (index === 2) {
    translateY = useTransform(smoothProgress, [0, 0.42, 0.60, 0.84, 1.0], ["110%", "110%", "0%", "0%", "0%"]);
    scale = useTransform(smoothProgress, [0, 0.42, 0.60, 0.84, 1.0], [1, 1, 1, 0.96, 0.93]);
    dimOverlay = useTransform(smoothProgress, [0, 0.42, 0.60, 0.84, 1.0], [0, 0, 0, 0.28, 0.45]);
  } else {
    // Card 3 (Final Card)
    translateY = useTransform(smoothProgress, [0, 0.70, 0.88, 1.0], ["110%", "110%", "0%", "0%"]);
    scale = useTransform(smoothProgress, [0, 0.70, 0.88, 1.0], [1, 1, 1, 1]);
    dimOverlay = useTransform(smoothProgress, [0, 0.70, 0.88, 1.0], [0, 0, 0, 0]);
  }

  // Smooth opacity fade so cards don't pop abruptly into view
  const opacity = useTransform(
    smoothProgress,
    index === 0
      ? [0, 1]
      : [
          index === 1 ? 0.12 : index === 2 ? 0.40 : 0.68,
          index === 1 ? 0.26 : index === 2 ? 0.54 : 0.82,
        ],
    index === 0 ? [1, 1] : [0, 1]
  );

  const Icon = feature.icon;

  return (
    <motion.div
      style={{
        y: translateY,
        scale,
        opacity,
        zIndex: index + 10,
      }}
      className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 will-change-transform"
    >
      <div
        className={`w-full max-w-5xl rounded-3xl border border-t-white/20 ${feature.borderColor} ${feature.gradientClass} ${feature.shadowColor} p-5 sm:p-7 md:p-8 relative overflow-hidden flex flex-col justify-between max-h-[58vh] sm:max-h-[62vh] backdrop-blur-2xl transition-colors duration-300`}
      >
        {/* Physical stacking dimming overlay as subsequent cards stack */}
        <motion.div
          style={{ opacity: dimOverlay }}
          className="pointer-events-none absolute inset-0 bg-black z-20 transition-opacity"
        />

        {/* Ambient colored spotlight glow inside card */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl opacity-80"
          style={{ background: feature.glowOrb }}
        />

        {/* Card Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl ${feature.badgeBg} border flex items-center justify-center shrink-0 shadow-sm`}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-mist-400">
                Pillar {feature.stepNumber}
              </div>
              <div className="font-semibold text-xs sm:text-sm text-white">
                {feature.tag}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-mist-400">
            <span
              className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
              style={{ backgroundColor: feature.indicatorColor, color: feature.indicatorColor }}
            />
            <span className="hidden sm:inline text-xs">Active architectural component</span>
          </div>
        </div>

        {/* Card Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-7 items-center py-3 relative z-10 flex-1 overflow-hidden">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-2.5 sm:space-y-3">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white tracking-tight leading-snug">
              {feature.title}
            </h3>

            <p className="text-xs sm:text-sm text-mist-300 leading-relaxed font-sans line-clamp-2 sm:line-clamp-3">
              {feature.description}
            </p>

            <ul className="space-y-1.5 pt-0.5">
              {feature.highlights.map((item, hIdx) => (
                <li
                  key={hIdx}
                  className="flex items-start gap-2 text-xs sm:text-[13px] text-mist-200"
                >
                  <Check
                    className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${feature.accentColor}`}
                  />
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Monospace Code / Spec Container */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/[0.1] bg-[#07090e]/95 p-3.5 font-mono text-xs leading-relaxed text-mist-200 shadow-2xl overflow-x-auto no-scrollbar">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.08] text-[10px] text-mist-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500/70" />
                  <span className="h-2 w-2 rounded-full bg-amber-500/70" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                  <span className="ml-1.5 text-mist-400 font-mono">spec.{feature.codeLang}</span>
                </span>
                <span className={feature.accentColor}>verified</span>
              </div>
              <pre className="text-[11px] leading-relaxed text-mist-200">
                <code>{feature.codePreview}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Card Footer Bar */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.08] font-mono text-[11px] text-mist-500 relative z-10">
          <span>VerifAI Core Platform</span>
          <span className={feature.accentColor}>
            Card {index + 1} of {FEATURES.length}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeatureShowcase() {
  const containerRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Buttery-smooth spring interpolation to eliminate scroll notches and mouse-wheel jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.6,
    restDelta: 0.001,
  });

  // Track active card index cleanly using normalized progress thresholds
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (latest < 0.28) setActiveCardIndex(0);
    else if (latest < 0.56) setActiveCardIndex(1);
    else if (latest < 0.84) setActiveCardIndex(2);
    else setActiveCardIndex(3);
  });

  const targetProgresses = [0.05, 0.36, 0.64, 0.94];

  const scrollToCard = (index) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + targetProgresses[index] * containerHeight;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative h-[360vh] sm:h-[400vh] bg-black select-none"
    >
      {/* 
        Pinned Sticky Stage - Locks in Viewport on Scroll 
        Top offset: pt-20 sm:pt-24 to ensure the header is NEVER obscured by the sticky Navbar.
      */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden pt-20 sm:pt-24 pb-6 sm:pb-8 container-xl z-20">
        {/* 
          Stage Header & Quick Jump Pills 
          Locked at z-30 so cards NEVER slide over or cover the title and pills!
        */}
        <div className="relative z-30 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 pb-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-mist-300 font-sans text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span>Core Platform Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight">
              Engineered for real engineering competence
            </h2>
          </div>

          {/* Interactive Card Selection Tabs (Quick-jump indicator pills) */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-2xl border border-white/[0.1] bg-[#0c0f17]/95 backdrop-blur-xl p-1 gap-1 shadow-2xl">
              {FEATURES.map((feat, idx) => {
                const isActive = activeCardIndex === idx;

                return (
                  <button
                    key={feat.id}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    className="relative px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors duration-200"
                    aria-label={`Jump to Card ${feat.stepNumber}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFeaturePill"
                        className="absolute inset-0 rounded-xl bg-white/[0.15] border border-white/25 shadow-sm"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors ${
                        isActive ? "text-white font-bold" : "text-mist-500 hover:text-mist-200"
                      }`}
                    >
                      {feat.stepNumber}
                    </span>
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-mono text-mist-400 hidden lg:inline">
              Scroll to scrub
            </span>
          </div>
        </div>

        {/* 
          Stacked Full-Width Cards Container 
          Positioned below header so cards stay within bounds and never obscure the title or pills!
        */}
        <div className="relative flex-1 w-full flex items-center justify-center my-auto min-h-0 z-10 overflow-hidden">
          {FEATURES.map((feature, idx) => (
            <CardStackItem
              key={feature.id}
              feature={feature}
              index={idx}
              smoothProgress={smoothProgress}
            />
          ))}
        </div>

        {/* Global Bottom Progress Bar */}
        <div className="relative z-30 shrink-0 pt-2 flex items-center justify-between text-xs font-mono text-mist-500 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full transition-colors duration-300 shadow-[0_0_8px_currentColor]"
              style={{
                backgroundColor: FEATURES[activeCardIndex].indicatorColor,
                color: FEATURES[activeCardIndex].indicatorColor,
              }}
            />
            <span className="text-mist-200 font-medium">
              {FEATURES[activeCardIndex].tag}
            </span>
            <span className="text-mist-500">
              ({activeCardIndex + 1} / {FEATURES.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {FEATURES.map((feat, dotIdx) => {
              const isPassed = activeCardIndex >= dotIdx;
              const isCurrent = activeCardIndex === dotIdx;

              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => scrollToCard(dotIdx)}
                  className={`h-1.5 transition-all duration-300 rounded-full overflow-hidden ${
                    isCurrent ? "w-10 bg-white" : isPassed ? "w-6 bg-white/40" : "w-6 bg-white/10"
                  }`}
                  aria-label={`Go to step ${dotIdx + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
