import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  Cpu,
  ScanSearch,
  ShieldCheck,
  Play,
  Pause,
  Check,
  ChevronDown,
} from "lucide-react";
import Button from "../ui/Button.jsx";

const STAGES = [
  {
    id: "queue",
    number: "01",
    title: "Instant job queuing",
    subtitle: "Non-blocking API response",
    icon: Server,
    flowLabel: "POST /api/submissions → Bull Queue",
    description:
      "When a developer submits code from Monaco, the Express API never executes it synchronously. It pushes the job into a Redis-backed Bull queue and returns HTTP 202 Accepted in under 40ms, so the server is never blocked waiting on a long-running review.",
    why: "Eliminates server timeouts on long AI reviews",
    stack: "Redis + BullMQ",
    telemetry: {
      endpoint: "POST /api/v1/submissions",
      status: 202,
      duration: "38ms",
      submissionId: "sub_9f82d4bc7a",
      challengeId: "rate-limiter-token-bucket",
      languageId: 63,
      queue: "bull:evaluation-jobs",
      status_detail: "WAITING_IN_QUEUE",
    },
  },
  {
    id: "sandbox",
    number: "02",
    title: "Judge0 sandboxed execution",
    subtitle: "Isolated Linux micro-container",
    icon: Cpu,
    flowLabel: "Worker → Judge0 Sandbox",
    description:
      "A dedicated sandbox worker pops the job and submits the code to Judge0. It runs in an isolated, unprivileged Linux cgroup with memory capped at 128MB and a 5 second CPU timeout, checked against hidden test suites the developer never sees.",
    why: "Untrusted code never touches the host system",
    stack: "Judge0 + cgroups",
    telemetry: {
      engine: "Judge0 v1.13 CE",
      isolation: "namespace + seccomp + cgroups",
      tests_passed: "12 / 12",
      exec_time: "0.142s",
      memory: "18.4MB",
      exit_code: 0,
    },
  },
  {
    id: "ai-review",
    number: "03",
    title: "Dual AI senior review",
    subtitle: "Gemini / Groq architectural audit",
    icon: ScanSearch,
    flowLabel: "AI Worker → Gemini 1.5 Pro",
    description:
      "Passing tests only proves the code works, not that it's well built. The AI worker streams the solution, problem context, and execution logs to Gemini and Groq against a strict rubric that scores architecture, time complexity, and edge case handling.",
    why: "Catches bad patterns that test cases miss",
    stack: "Gemini 1.5 + Groq Llama",
    telemetry: {
      model: "gemini-1.5-pro (temp 0.1)",
      latency: "1.28s",
      architectural_score: 94,
      time_complexity: "O(1) optimal",
      code_smells: 0,
      edge_cases: "burst traffic, clock skew, zero capacity",
    },
  },
  {
    id: "verify",
    number: "04",
    title: "Real-time push & verifiable proof",
    subtitle: "Socket.io broadcast, minted credential",
    icon: ShieldCheck,
    flowLabel: "MongoDB → Socket.io → Client",
    description:
      "The result is written to MongoDB Atlas and pushed to the client over a websocket, so the UI updates instantly with no polling. Submissions scoring 80 or above mint a tamper-evident badge, hashed and permalinked so anyone can verify it independently.",
    why: "Recruiters verify authentic work in one click",
    stack: "MongoDB + Socket.io",
    telemetry: {
      event: "submission:completed",
      db: "mongodb-atlas/cluster-0",
      badge_minted: true,
      badge_id: "badge_sys_des_884",
      hash: "e3b0c442...b7852b855",
      verify_url: "verifai.dev/verify/badge_sys_des_884",
    },
  },
];

const CYCLE_MS = 3400;

export default function PipelineSimulator() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => {
        if (prev >= STAGES.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, CYCLE_MS);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const selectStage = (idx) => {
    setIsPlaying(false);
    setActiveIdx(idx);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (activeIdx >= STAGES.length - 1) setActiveIdx(0);
    setIsPlaying(true);
  };

  return (
    <section id="architecture" className="container-xl py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-mist-100 font-display">
            One submission, four stages, a verifiable result
          </h2>
          <p className="mt-4 text-mist-300 text-base leading-relaxed font-sans max-w-xl">
            Open a stage to see what actually happens inside it — including
            the real telemetry it emits along the way.
          </p>
        </div>

        <Button variant="verify" size="sm" onClick={togglePlay}>
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2 fill-current" />
              Play through
            </>
          )}
        </Button>
      </div>

      <div className="relative">
        {/* connecting rail */}
        <div className="absolute left-[23px] top-6 bottom-6 w-px bg-ink-600" />

        <div className="flex flex-col gap-2">
          {STAGES.map((stage, idx) => {
            const isActive = idx === activeIdx;
            const isDone = idx < activeIdx;
            const Icon = stage.icon;

            return (
              <div key={stage.id}>
                <button
                  onClick={() => selectStage(idx)}
                  className="w-full flex items-start gap-4 text-left py-3 group"
                >
                  <span
                    className={`relative z-10 flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center border transition-colors ${
                      isActive
                        ? "border-violet-400 bg-violet-500/20 text-violet-300"
                        : isDone
                        ? "border-emerald-500/40 bg-ink-900 text-emerald-400"
                        : "border-ink-600 bg-ink-900 text-mist-500 group-hover:text-mist-300 group-hover:border-ink-500"
                    }`}
                  >
                    {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </span>

                  <span className="flex-1 min-w-0 pt-1.5">
                    <span className="flex items-baseline gap-3 flex-wrap">
                      <span className="font-mono text-xs text-mist-500">{stage.number}</span>
                      <span
                        className={`font-display font-semibold ${
                          isActive ? "text-mist-100 text-lg" : "text-mist-300 text-base"
                        }`}
                      >
                        {stage.title}
                      </span>
                    </span>
                    <span className="block text-sm text-mist-400 mt-0.5 font-sans">
                      {stage.subtitle}
                    </span>
                  </span>

                  <ChevronDown
                    className={`h-4 w-4 mt-2.5 flex-shrink-0 text-mist-500 transition-transform ${
                      isActive ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pl-16 pb-8 pr-2 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-6 space-y-4">
                          <p className="font-mono text-xs text-violet-300/80">
                            {stage.flowLabel}
                          </p>
                          <p className="text-mist-300 text-sm leading-relaxed">
                            {stage.description}
                          </p>

                          <dl className="text-sm border-t border-ink-700">
                            <div className="grid grid-cols-[72px_1fr] gap-3 py-2.5 border-b border-ink-700">
                              <dt className="font-mono text-xs text-mist-500 pt-0.5">why</dt>
                              <dd className="text-mist-300">{stage.why}</dd>
                            </div>
                            <div className="grid grid-cols-[72px_1fr] gap-3 py-2.5 border-b border-ink-700">
                              <dt className="font-mono text-xs text-mist-500 pt-0.5">stack</dt>
                              <dd className="text-violet-300 font-mono text-xs pt-0.5">
                                {stage.stack}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="lg:col-span-6">
                          <div className="rounded-lg border border-ink-700 bg-[#05070A] overflow-hidden">
                            <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-ink-700 bg-ink-900/60">
                              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                              <span className="ml-2 font-mono text-[11px] text-mist-500">
                                telemetry — stage {stage.number}
                              </span>
                            </div>
                            <pre className="p-4 font-mono text-xs text-emerald-300/90 leading-relaxed overflow-x-auto no-scrollbar">
                              <code>
                                {Object.entries(stage.telemetry)
                                  .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
                                  .join("\n")}
                              </code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}