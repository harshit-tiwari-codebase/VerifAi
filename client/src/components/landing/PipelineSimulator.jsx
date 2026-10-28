import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, Pause } from "lucide-react";

const STAGES = [
  {
    id: "queue",
    number: "01",
    title: "Job queuing",
    subtitle: "Instant, non-blocking API response",
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
    title: "Sandboxed execution",
    subtitle: "Isolated Linux micro-container",
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
    title: "AI senior review",
    subtitle: "Gemini / Groq architectural audit",
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
    title: "Push & proof",
    subtitle: "Socket.io broadcast, minted credential",
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
const LAST = STAGES.length - 1;

export default function PipelineSimulator() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const reduce = useReducedMotion();

  const stage = STAGES[activeIdx];

  // autoplay: advance every CYCLE_MS, stop after the last stage has had its turn
  useEffect(() => {
    if (!isPlaying) return;
    const id = setTimeout(() => {
      if (activeIdx >= LAST) setIsPlaying(false);
      else setActiveIdx((i) => i + 1);
    }, CYCLE_MS);
    return () => clearTimeout(id);
  }, [isPlaying, activeIdx]);

  const selectStage = (idx) => {
    setIsPlaying(false);
    setActiveIdx(idx);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    if (activeIdx >= LAST) setActiveIdx(0);
    setIsPlaying(true);
  };

  return (
    <section id="architecture" className="container-xl py-24">
      {/* header */}
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-[#71717A]">
            Pipeline
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-[#FAFAFA] md:text-4xl">
            One submission, four stages, a verifiable result
          </h2>
          <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-[#A1A1AA]">
            Pick a stage to see what happens inside it, and the telemetry it
            emits along the way.
          </p>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          className="inline-flex items-center gap-2 self-start rounded-md border border-[#27272A] px-3.5 py-2 font-mono text-xs text-[#FAFAFA] transition-colors hover:border-[#3F3F46] hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B5CF6]"
        >
          {isPlaying ? (
            <>
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              Play through
            </>
          )}
        </button>
      </div>

      {/* stage selector */}
      <div
        role="tablist"
        aria-label="Pipeline stages"
        className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4"
      >
        {STAGES.map((s, i) => {
          const active = i === activeIdx;
          const done = i < activeIdx;
          const fill = active ? "bg-[#8B5CF6]" : "bg-[#52525B]";

          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={active}
              aria-controls="pipeline-panel"
              onClick={() => selectStage(i)}
              className="group text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B5CF6]"
            >
              <div className="relative h-0.5 w-full bg-[#27272A]">
                {(active || done) &&
                  (active && isPlaying && !reduce ? (
                    <motion.span
                      key={`play-${i}`}
                      className={`absolute inset-y-0 left-0 ${fill}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                    />
                  ) : (
                    <span className={`absolute inset-y-0 left-0 w-full ${fill}`} />
                  ))}
              </div>

              <div className="mt-3 flex items-baseline gap-2.5">
                <span className="font-mono text-xs text-[#52525B]">{s.number}</span>
                <span
                  className={`font-sans text-sm font-medium transition-colors ${
                    active
                      ? "text-[#FAFAFA]"
                      : "text-[#71717A] group-hover:text-[#A1A1AA]"
                  }`}
                >
                  {s.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* active stage */}
      <div
        id="pipeline-panel"
        role="tabpanel"
        aria-labelledby={`tab-${stage.id}`}
        className="mt-12 lg:min-h-[22rem]"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stage.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16"
          >
            <div className="lg:col-span-6">
              <p className="font-mono text-xs text-[#A78BFA]">{stage.flowLabel}</p>
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-[#FAFAFA]">
                {stage.subtitle}
              </h3>
              <p className="mt-4 font-sans text-[15px] leading-relaxed text-[#A1A1AA]">
                {stage.description}
              </p>

              <dl className="mt-8 divide-y divide-[#27272A] border-y border-[#27272A] font-sans text-sm">
                <div className="grid grid-cols-[72px_1fr] gap-4 py-3">
                  <dt className="pt-0.5 font-mono text-xs text-[#71717A]">why</dt>
                  <dd className="text-[#D4D4D8]">{stage.why}</dd>
                </div>
                <div className="grid grid-cols-[72px_1fr] gap-4 py-3">
                  <dt className="pt-0.5 font-mono text-xs text-[#71717A]">stack</dt>
                  <dd className="pt-0.5 font-mono text-xs text-[#D4D4D8]">
                    {stage.stack}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-lg border border-[#27272A] bg-[#0D0D12]">
                <p className="border-b border-[#27272A] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#71717A]">
                  Telemetry · stage {stage.number}
                </p>
                <dl className="divide-y divide-[#1C1C22] px-5 font-mono text-[13px]">
                  {Object.entries(stage.telemetry).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-6 py-2.5">
                      <dt className="shrink-0 text-[#71717A]">{key}</dt>
                      <dd className="break-all text-right text-[#FAFAFA]">
                        {String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}