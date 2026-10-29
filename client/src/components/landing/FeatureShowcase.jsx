import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import { Cpu, Zap, Activity, Award, Check } from "lucide-react";

/*
  All cards use the orange/amber palette — VerifAI brand identity
*/
const FEATURES = [
  {
    id: "deterministic-harness",
    icon: Cpu,
    tag: "Concurrency & Determinism",
    stepNumber: "01",
    title: "Deterministic Test Harness & Concurrency Fuzzing",
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
    accent:       "#FF6A3D",
    accentDim:    "rgba(255,106,61,0.08)",
    accentBorder: "rgba(255,106,61,0.20)",
    cardBg:       "#181511",
    cardBorder:   "#3A2A1E",
  },
  {
    id: "chaos-monkey",
    icon: Zap,
    tag: "Fault Injection",
    stepNumber: "02",
    title: "Distributed Network Fault Injection (Chaos Monkey Engine)",
    description:
      "Simulates network jitter, split-brain packet drops, leader elections, and clock drift under extreme production scale to ensure distributed algorithms never corrupt global state.",
    highlights: [
      "Jepsen-style network partition and partition healing tests",
      "Clock skew and NTP drift simulation across cluster nodes",
      "Graceful degradation under cascading upstream failures",
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
    accent:       "#FF6A3D",
    accentDim:    "rgba(255,106,61,0.08)",
    accentBorder: "rgba(255,106,61,0.20)",
    cardBg:       "#181511",
    cardBorder:   "#3A2A1E",
  },
  {
    id: "telemetry-profiler",
    icon: Activity,
    tag: "Telemetry & Profiling",
    stepNumber: "03",
    title: "Real-time State Telemetry & Memory Profiler",
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
    accent:       "#FF6A3D",
    accentDim:    "rgba(255,106,61,0.08)",
    accentBorder: "rgba(255,106,61,0.20)",
    cardBg:       "#181511",
    cardBorder:   "#3A2A1E",
  },
  {
    id: "crypto-credentials",
    icon: Award,
    tag: "Verifiable Credentials",
    stepNumber: "04",
    title: "Cryptographic Verification & Proof-of-Skill Badging",
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
    accent:       "#FF6A3D",
    accentDim:    "rgba(255,106,61,0.08)",
    accentBorder: "rgba(255,106,61,0.20)",
    cardBg:       "#181511",
    cardBorder:   "#3A2A1E",
  },
];

function CardStackItem({ feature, index, smoothProgress }) {
  let translateY, scale, dimOverlay;

  if (index === 0) {
    translateY = useTransform(smoothProgress, [0, 0.28, 0.56, 0.84, 1.0], ["0%", "0%", "0%", "0%", "0%"]);
    scale      = useTransform(smoothProgress, [0, 0.28, 0.56, 0.84, 1.0], [1, 0.96, 0.92, 0.88, 0.86]);
    dimOverlay = useTransform(smoothProgress, [0, 0.28, 0.56, 0.84, 1.0], [0, 0.30, 0.50, 0.66, 0.73]);
  } else if (index === 1) {
    translateY = useTransform(smoothProgress, [0, 0.14, 0.32, 0.56, 0.84, 1.0], ["110%", "110%", "0%", "0%", "0%", "0%"]);
    scale      = useTransform(smoothProgress, [0, 0.14, 0.32, 0.56, 0.84, 1.0], [1, 1, 1, 0.96, 0.92, 0.90]);
    dimOverlay = useTransform(smoothProgress, [0, 0.14, 0.32, 0.56, 0.84, 1.0], [0, 0, 0, 0.30, 0.52, 0.62]);
  } else if (index === 2) {
    translateY = useTransform(smoothProgress, [0, 0.42, 0.60, 0.84, 1.0], ["110%", "110%", "0%", "0%", "0%"]);
    scale      = useTransform(smoothProgress, [0, 0.42, 0.60, 0.84, 1.0], [1, 1, 1, 0.96, 0.93]);
    dimOverlay = useTransform(smoothProgress, [0, 0.42, 0.60, 0.84, 1.0], [0, 0, 0, 0.30, 0.48]);
  } else {
    translateY = useTransform(smoothProgress, [0, 0.70, 0.88, 1.0], ["110%", "110%", "0%", "0%"]);
    scale      = useTransform(smoothProgress, [0, 0.70, 0.88, 1.0], [1, 1, 1, 1]);
    dimOverlay = useTransform(smoothProgress, [0, 0.70, 0.88, 1.0], [0, 0, 0, 0]);
  }

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
  const { accent, accentDim, accentBorder, cardBg, cardBorder } = feature;

  return (
    <motion.div
      style={{ y: translateY, scale, opacity, zIndex: index + 10 }}
      className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 will-change-transform"
    >
      <div
        className="w-full max-w-5xl rounded-[8px] border p-5 sm:p-7 md:p-8 relative overflow-hidden flex flex-col justify-between max-h-[60vh] sm:max-h-[64vh] transition-colors duration-300"
        style={{ backgroundColor: cardBg, borderColor: cardBorder }}
      >
        {/* Dimming overlay */}
        <motion.div
          style={{ opacity: dimOverlay }}
          className="pointer-events-none absolute inset-0 bg-[#0B0B0A] z-20"
        />

        {/* Subtle accent tint in top-right corner */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-[80px] z-0"
          style={{ backgroundColor: accent, opacity: 0.12 }}
        />

        {/* Card Header */}
        <div
          className="flex items-center justify-between pb-3 border-b relative z-10"
          style={{ borderColor: accentBorder }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-[4px] border flex items-center justify-center shrink-0"
              style={{ backgroundColor: accentDim, borderColor: accentBorder }}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: accent }} strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#77756D]">
                Pillar {feature.stepNumber}
              </div>
              <div className="font-semibold text-xs sm:text-sm text-[#F2EFE6]">
                {feature.tag}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]" style={{ color: accent }}>
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <span className="hidden sm:inline opacity-70">Active component</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-7 items-center py-4 relative z-10 flex-1 overflow-hidden">
          {/* Left — text */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#F2EFE6] tracking-tight leading-snug font-display">
              {feature.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#AAA69B] leading-relaxed font-sans line-clamp-2 sm:line-clamp-3">
              {feature.description}
            </p>
            <ul className="space-y-1.5 pt-0.5">
              {feature.highlights.map((item, hIdx) => (
                <li key={hIdx} className="flex items-start gap-2 text-xs sm:text-[13px] text-[#AAA69B]">
                  <Check
                    className="h-3.5 w-3.5 shrink-0 mt-0.5"
                    style={{ color: accent }}
                    strokeWidth={2.5}
                  />
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — code block */}
          <div className="lg:col-span-5">
            <div
              className="rounded-[8px] border p-3.5 font-mono text-xs leading-relaxed overflow-x-auto"
              style={{
                backgroundColor: "#0B0B0A",
                borderColor: accentBorder,
              }}
            >
              {/* Mini traffic lights + filename */}
              <div
                className="flex items-center justify-between pb-2 mb-2 border-b text-[10px]"
                style={{ borderColor: accentBorder }}
              >
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#E5604D]" />
                  <span className="h-2 w-2 rounded-full bg-[#FBBF24]" />
                  <span className="h-2 w-2 rounded-full bg-[#4FBF94]" />
                  <span className="ml-1.5 text-[#77756D] font-mono">spec.{feature.codeLang}</span>
                </span>
                <span style={{ color: accent }} className="font-semibold">verified ✓</span>
              </div>
              <pre className="text-[11px] leading-relaxed text-[#AAA69B] whitespace-pre-wrap">
                <code>{feature.codePreview}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div
          className="flex items-center justify-between pt-2.5 border-t font-mono text-[11px] relative z-10"
          style={{ borderColor: accentBorder, color: "#55524C" }}
        >
          <span>VerifAI Core Platform</span>
          <span style={{ color: accent }}>Card {index + 1} of {FEATURES.length}</span>
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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.6,
    restDelta: 0.001,
  });

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (latest < 0.28)      setActiveCardIndex(0);
    else if (latest < 0.56) setActiveCardIndex(1);
    else if (latest < 0.84) setActiveCardIndex(2);
    else                    setActiveCardIndex(3);
  });

  const targetProgresses = [0.05, 0.36, 0.64, 0.94];

  const scrollToCard = (index) => {
    if (!containerRef.current) return;
    const rect          = containerRef.current.getBoundingClientRect();
    const scrollTop     = window.scrollY || document.documentElement.scrollTop;
    const containerTop  = rect.top + scrollTop;
    const containerH    = containerRef.current.offsetHeight - window.innerHeight;
    window.scrollTo({ top: containerTop + targetProgresses[index] * containerH, behavior: "smooth" });
  };

  const active = FEATURES[activeCardIndex];

  return (
    <section
      id="features"
      ref={containerRef}
      className="relative h-[360vh] sm:h-[400vh] bg-[#0B0B0A] select-none"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden pt-20 sm:pt-24 pb-6 sm:pb-8 container-xl z-20">

        {/* Header */}
        <div className="relative z-30 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 pb-2">
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77756D] flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: active.accent }}
              />
              Core Platform Architecture
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#F2EFE6] tracking-tight font-display">
              Engineered for real engineering competence
            </h2>
          </div>

          {/* Jump pills */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-[8px] border border-[#30302B] bg-[#141412] p-1 gap-1">
              {FEATURES.map((feat, idx) => {
                const isActive = activeCardIndex === idx;
                return (
                  <button
                    key={feat.id}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    className="relative px-3.5 py-1.5 rounded-[4px] text-xs font-mono transition-colors duration-150"
                    aria-label={`Jump to ${feat.tag}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeFeaturePill"
                        className="absolute inset-0 rounded-[4px] border"
                        style={{ backgroundColor: feat.accentDim, borderColor: feat.accentBorder }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span
                      className="relative z-10 transition-colors duration-150 font-bold"
                      style={{ color: isActive ? feat.accent : "#77756D" }}
                    >
                      {feat.stepNumber}
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-mono text-[#77756D] hidden lg:inline">Scroll to scrub</span>
          </div>
        </div>

        {/* Card stack */}
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

        {/* Bottom progress bar */}
        <div className="relative z-30 shrink-0 pt-2 flex items-center justify-between text-xs font-mono border-t border-[#30302B]">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: active.accent }}
            />
            <span className="text-[#F2EFE6] font-medium">{active.tag}</span>
            <span className="text-[#55524C]">({activeCardIndex + 1} / {FEATURES.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {FEATURES.map((feat, dotIdx) => {
              const isCurrent = activeCardIndex === dotIdx;
              const isPassed  = activeCardIndex > dotIdx;
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => scrollToCard(dotIdx)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: isCurrent ? "2.5rem" : "1.5rem",
                    backgroundColor: isCurrent
                      ? feat.accent
                      : isPassed
                      ? "#555550"
                      : "#30302B",
                  }}
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
