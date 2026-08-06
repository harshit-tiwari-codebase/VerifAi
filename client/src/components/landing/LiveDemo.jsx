import { useEffect, useState } from "react";
import Badge from "../ui/Badge.jsx";

const PHASES = ["queued", "executing", "reviewing", "verified"];
const PHASE_DURATIONS = [1400, 1800, 2200, 2600]; // ms spent in each phase

const REVIEW_LINES = [
  { label: "Correctness", value: "12/12 test cases passed", tone: "verify" },
  { label: "Edge cases", value: "empty input handled", tone: "verify" },
  { label: "Architecture", value: "single responsibility kept", tone: "verify" },
  { label: "Suggestion", value: "extract magic number to const", tone: "signal" },
];

export default function LiveDemo() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length);
    }, PHASE_DURATIONS[phaseIndex]);
    return () => clearTimeout(timer);
  }, [phaseIndex]);

  useEffect(() => {
    if (PHASES[phaseIndex] !== "reviewing") {
      setVisibleLines(0);
      return;
    }
    const interval = setInterval(() => {
      setVisibleLines((n) => (n < REVIEW_LINES.length ? n + 1 : n));
    }, 420);
    return () => clearInterval(interval);
  }, [phaseIndex]);

  const phase = PHASES[phaseIndex];

  return (
    <section id="demo" className="container-xl py-24">
      <div className="mb-12 max-w-xl">
        <p className="eyebrow mb-3">live demo</p>
        <h2 className="text-3xl font-semibold text-mist-100 md:text-4xl">
          Watch a submission become a verified badge.
        </h2>
        <p className="mt-4 text-mist-300">
          This is the actual evaluation loop — queued, executed in Judge0,
          reviewed by the AI worker, then verified. On a real submission this
          runs in 10–60 seconds.
        </p>
      </div>

      <div className="card grid overflow-hidden md:grid-cols-[1fr_1px_360px]">
        {/* left: pipeline status */}
        <div className="p-8">
          <ol className="space-y-5">
            {PHASES.map((p, i) => {
              const state =
                i < phaseIndex ? "done" : i === phaseIndex ? "active" : "pending";
              return (
                <li key={p} className="flex items-start gap-4">
                  <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                    {state === "active" && (
                      <span className="absolute inline-flex h-5 w-5 rounded-full bg-verify/40 animate-pulse-ring" />
                    )}
                    <span
                      className={`relative h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                        state === "pending"
                          ? "bg-ink-500"
                          : state === "active"
                          ? "bg-verify"
                          : "bg-signal"
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`font-mono text-sm transition-colors duration-300 ${
                        state === "pending" ? "text-mist-700" : "text-mist-100"
                      }`}
                    >
                      {PHASE_LABEL[p]}
                    </p>
                    <p className="text-xs text-mist-500">{PHASE_SUB[p]}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="hidden bg-ink-600 md:block" />

        {/* right: AI review panel / badge */}
        <div className="flex flex-col justify-center border-t border-ink-600 bg-ink-900/40 p-8 md:border-t-0">
          {phase !== "verified" ? (
            <div className="space-y-3">
              <p className="mb-2 font-mono text-xs text-mist-500">
                ai_worker → review.json
              </p>
              {REVIEW_LINES.map((line, i) => (
                <div
                  key={line.label}
                  className={`flex items-center justify-between rounded-md border border-ink-600 bg-ink-800/60 px-3 py-2 text-xs transition-all duration-300 ${
                    i < visibleLines
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1 opacity-0"
                  }`}
                >
                  <span className="text-mist-500">{line.label}</span>
                  <span
                    className={
                      line.tone === "verify" ? "text-verify" : "text-signal"
                    }
                  >
                    {line.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4 text-center animate-rise">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <span className="absolute inline-flex h-16 w-16 rounded-full bg-verify/30 animate-pulse-ring" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-verify bg-verify/10 text-verify">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8.5L6.2 11.5L13 4.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <p className="font-display text-lg font-semibold text-mist-100">
                Badge issued
              </p>
              <Badge tone="verify">rate-limiter-design · score 94</Badge>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const PHASE_LABEL = {
  queued: "Queued in Redis/Bull",
  executing: "Executing in Judge0 sandbox",
  reviewing: "AI code review in progress",
  verified: "Verified & badge issued",
};

const PHASE_SUB = {
  queued: "API responded instantly — job added to the queue",
  executing: "stdout / stderr / pass-fail collected",
  reviewing: "structured JSON review from Gemini/Groq",
  verified: "pushed to client over Socket.io",
};
