import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Cpu,
  Sparkles,
  ShieldCheck,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Database,
  Radio,
  FileJson,
  Layers,
} from "lucide-react";
import Button from "../ui/Button.jsx";

const STAGES = [
  {
    id: "queue",
    number: "01",
    title: "Instant Job Queuing",
    subtitle: "Non-blocking API response",
    icon: Server,
    color: "from-blue-500 to-indigo-500",
    borderGlow: "border-blue-500/50",
    accentText: "text-blue-400",
    badgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    flowLabel: "POST /api/submissions → Bull Queue",
    description:
      "When a developer submits code from Monaco, the Express API never executes it synchronously. It pushes the job into a Redis-backed Bull queue and returns HTTP 202 Accepted in under 40ms. This protects the server against thread starvation.",
    telemetry: {
      endpoint: "POST /api/v1/submissions",
      status: 202,
      duration: "38ms",
      payload: {
        submissionId: "sub_9f82d4bc7a",
        challengeId: "rate-limiter-token-bucket",
        languageId: 63, // JavaScript Node.js
        queue: "bull:evaluation-jobs",
        status: "WAITING_IN_QUEUE",
      },
    },
  },
  {
    id: "sandbox",
    number: "02",
    title: "Judge0 Sandboxed Execution",
    subtitle: "Isolated Linux micro-container",
    icon: Cpu,
    color: "from-violet-500 to-purple-500",
    borderGlow: "border-violet-500/50",
    accentText: "text-violet-400",
    badgeBg: "bg-violet-500/10 text-violet-300 border-violet-500/30",
    flowLabel: "Worker → Judge0 Sandbox",
    description:
      "A dedicated sandbox worker pops the job and submits the code to Judge0. The user code is executed in an isolated, unprivileged Linux cgroup container with strictly capped memory (128MB) and CPU timeout (5s) against hidden test suites.",
    telemetry: {
      engine: "Judge0 v1.13 CE",
      sandboxIsolation: "Linux namespace + seccomp + cgroups",
      testCasesTotal: 12,
      testCasesPassed: 12,
      executionTime: "0.142s",
      memoryUsage: "18.4MB",
      exitCode: 0,
      status: "ALL_TESTS_PASSED",
    },
  },
  {
    id: "ai-review",
    number: "03",
    title: "Dual AI Senior Review",
    subtitle: "Gemini / Groq architectural audit",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    borderGlow: "border-purple-500/50",
    accentText: "text-purple-400",
    badgeBg: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    flowLabel: "AI Worker → Gemini 1.5 Pro",
    description:
      "Autograders only check test passes; VerifAI checks engineering craftsmanship. The AI Worker streams the solution, problem context, and execution logs to Gemini/Groq using a strict JSON rubric. It grades architecture, time complexity, and edge cases.",
    telemetry: {
      model: "Gemini 1.5 Pro (Temperature: 0.1)",
      latency: "1.28s",
      architecturalScore: 94,
      analysis: {
        timeComplexity: "O(1) optimal",
        memoryFootprint: "Minimal (no memory leaks)",
        codeSmells: 0,
        edgeCasesCovered: ["burst traffic", "clock skew", "zero capacity"],
      },
    },
  },
  {
    id: "verify",
    number: "04",
    title: "Real-time Push & Verifiable Proof",
    subtitle: "Socket.io broadcast & minted credential",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-500",
    borderGlow: "border-emerald-500/50",
    accentText: "text-emerald-400",
    badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    flowLabel: "MongoDB → Socket.io → Client",
    description:
      "Results are permanently saved to MongoDB Atlas. A WebSocket event triggers instant client UI update without browser polling. If the submission passes the threshold (score ≥ 80), a tamper-evident badge is minted with a SHA-256 verification hash.",
    telemetry: {
      delivery: "Socket.io (event: submission:completed)",
      dbCommit: "MongoDB Atlas (cluster-0)",
      badgeMinted: true,
      badgeId: "badge_sys_des_884",
      verificationHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      publicPermalink: "https://verifai.dev/verify/badge_sys_des_884",
    },
  },
];

export default function PipelineSimulator() {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "json"

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setActiveStageIdx((prev) => {
        if (prev >= STAGES.length - 1) {
          setIsAutoPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const currentStage = STAGES[activeStageIdx];

  const handleStartAutoPlay = () => {
    setActiveStageIdx(0);
    setIsAutoPlaying(true);
  };

  const handleStopAutoPlay = () => {
    setIsAutoPlaying(false);
  };

  return (
    <section id="architecture" className="container-xl py-24 relative">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-64 w-full max-w-4xl rounded-full bg-violet-600/10 blur-[120px]" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 font-sans text-xs font-medium mb-3">
            <Radio className="h-3.5 w-3.5 animate-pulse text-violet-400" />
            <span>Under The Hood</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-mist-100 font-display">
            The 4-Stage Automated Pipeline. From submission to verifiable proof.
          </h2>
          <p className="mt-4 text-mist-300 text-base leading-relaxed font-sans">
            Click through the four stages or watch the live cycle to see how VerifAI orchestrates message queues, sandboxed containers, and AI LLMs in under 30 seconds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAutoPlaying ? (
            <Button variant="ghost" size="sm" onClick={handleStopAutoPlay}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Pause Simulation
            </Button>
          ) : (
            <Button variant="verify" size="sm" onClick={handleStartAutoPlay} className="purple-glow font-medium">
              <Play className="h-4 w-4 mr-2 fill-current" />
              Watch Full Pipeline Cycle
            </Button>
          )}
        </div>
      </div>

      {/* Stage Cards Horizontal Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAGES.map((stage, idx) => {
          const isActive = idx === activeStageIdx;
          const isPassed = idx < activeStageIdx;
          const Icon = stage.icon;

          return (
            <button
              key={stage.id}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveStageIdx(idx);
              }}
              className={`p-5 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group ${
                isActive
                  ? "border-violet-400 bg-violet-950/20 shadow-[0_0_30px_rgba(147,51,234,0.18)]"
                  : "border-ink-600 bg-ink-800/40 hover:border-ink-500 hover:bg-ink-800/80"
              }`}
            >
              {/* Active top highlight indicator */}
              {isActive && (
                <motion.div
                  layoutId="activePipelineIndicator"
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"
                />
              )}

              <div className="flex items-center justify-between mb-4">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center border ${
                    isActive
                      ? "border-violet-400/50 bg-violet-500/20 text-violet-300"
                      : "border-ink-600 bg-ink-900 text-mist-500 group-hover:text-mist-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`font-sans text-xs font-semibold px-2 py-0.5 rounded border ${
                    isActive
                      ? "bg-violet-500/20 text-violet-300 border-violet-500/40"
                      : isPassed
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-ink-900 text-mist-600 border-ink-600"
                  }`}
                >
                  {isPassed ? "PASS ✓" : `STAGE ${stage.number}`}
                </span>
              </div>

              <h3 className="font-display font-semibold text-sm text-mist-100 group-hover:text-violet-300 transition-colors">
                {stage.title}
              </h3>
              <p className="text-xs text-mist-400 mt-1 font-sans">{stage.subtitle}</p>

              {/* Step connection arrow for desktop */}
              {idx < STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="h-4 w-4 text-ink-500" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Stage Detail & Telemetry Card */}
      <div className="card overflow-hidden border-ink-600 shadow-2xl bg-ink-800/40">
        {/* Stage Header Bar */}
        <div className="border-b border-ink-600 bg-ink-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs font-medium px-2.5 py-1 rounded bg-violet-500/15 border border-violet-500/30 text-violet-300">
              {currentStage.flowLabel}
            </span>
            <span className="hidden sm:inline text-xs font-sans text-mist-500">|</span>
            <span className="text-xs font-sans text-mist-400">
              Stage {currentStage.number} of 04
            </span>
          </div>

          {/* Toggle between Narrative & JSON Telemetry */}
          <div className="flex items-center gap-2 bg-ink-900 p-1 rounded-lg border border-ink-600">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-sans font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-violet-600/30 text-violet-300 font-semibold"
                  : "text-mist-400 hover:text-mist-200"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Architecture
            </button>
            <button
              onClick={() => setActiveTab("json")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-sans font-medium transition-colors ${
                activeTab === "json"
                  ? "bg-violet-600/30 text-violet-300 font-semibold"
                  : "text-mist-400 hover:text-mist-200"
              }`}
            >
              <FileJson className="h-3.5 w-3.5" />
              Live JSON Telemetry
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "overview" ? (
              <motion.div
                key={`overview-${currentStage.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Left Description (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-violet-400 animate-pulse" />
                    <h3 className="font-display text-2xl font-semibold text-mist-100">
                      {currentStage.title}
                    </h3>
                  </div>

                  <p className="text-mist-300 text-sm md:text-base leading-relaxed">
                    {currentStage.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-lg border border-ink-600 bg-ink-900/60">
                      <p className="text-[11px] font-mono text-mist-500 uppercase tracking-wider">
                        Why this matters
                      </p>
                      <p className="text-xs text-mist-300 mt-1 font-sans leading-normal">
                        {currentStage.id === "queue" && "Eliminates server timeouts on long AI reviews."}
                        {currentStage.id === "sandbox" && "Untrusted code never touches host system."}
                        {currentStage.id === "ai-review" && "Catches bad patterns test cases miss."}
                        {currentStage.id === "verify" && "Recruiters verify authentic work in 1 click."}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg border border-ink-600 bg-ink-900/60">
                      <p className="text-[11px] font-mono text-mist-500 uppercase tracking-wider">
                        Core Technology
                      </p>
                      <p className="text-xs text-violet-300 mt-1 font-mono">
                        {currentStage.id === "queue" && "Redis + BullMQ (FIFO queue)"}
                        {currentStage.id === "sandbox" && "Judge0 API + Linux cgroups"}
                        {currentStage.id === "ai-review" && "Google Gemini 1.5 + Groq Llama"}
                        {currentStage.id === "verify" && "MongoDB Atlas + Socket.io"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Telemetry Preview (5 cols) */}
                <div className="lg:col-span-5">
                  <div className="rounded-xl border border-ink-600 bg-[#070A10] p-4 shadow-inner">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-ink-700/80 font-mono text-xs text-mist-400">
                      <span className="flex items-center gap-1.5 text-violet-400">
                        <Radio className="h-3 w-3" /> Live Channel
                      </span>
                      <span className="text-emerald-400">● ACTIVE</span>
                    </div>

                    <pre className="font-mono text-xs text-mist-300 overflow-x-auto no-scrollbar leading-relaxed max-h-56">
                      <code>{JSON.stringify(currentStage.telemetry, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`json-${currentStage.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl border border-ink-600 bg-[#070A10] p-5 shadow-inner"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-ink-700/80 font-mono text-xs text-mist-400">
                  <span className="text-violet-400 font-medium">
                    Payload at Stage {currentStage.number}: {currentStage.title}
                  </span>
                  <span className="text-mist-500">application/json</span>
                </div>
                <pre className="font-mono text-xs text-violet-300 overflow-x-auto no-scrollbar leading-relaxed max-h-80">
                  <code>{JSON.stringify(currentStage.telemetry, null, 2)}</code>
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
