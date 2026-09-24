import React, { useEffect, useState, useRef } from "react";
import {
  Check,
  Cpu,
  BrainCircuit,
  ShieldCheck,
  Award,
  Terminal,
  FastForward,
  Loader2,
  X,
} from "lucide-react";

const PIPELINE_STAGES = [
  {
    id: "tests",
    label: "Running test suite",
    icon: Cpu,
    logLines: [
      "→ Initializing Judge0 Linux sandbox worker (v1.13 CE)...",
      "→ Dispatching starter_code.js with isolated cgroups...",
      "✓ 4/4 public test cases passed in 38ms",
      "✓ 2/2 hidden stress test cases validated",
      "✓ 6/6 tests passed",
    ],
  },
  {
    id: "static",
    label: "Static analysis",
    icon: Terminal,
    logLines: [
      "→ Parsing Abstract Syntax Tree (AST)...",
      "→ Linting scope variables & strict mode compliance...",
      "→ Analyzing time complexity: O(1) constant verified",
      "→ Analyzing space complexity: O(1) auxiliary allocated",
      "✓ Static analysis clean: 0 warnings, 0 type errors",
    ],
  },
  {
    id: "ai",
    label: "AI code review",
    icon: BrainCircuit,
    logLines: [
      "→ Dispatching architectural context to Gemini 1.5 Pro...",
      "→ Evaluating token replenishment equation and clock skew handling...",
      "→ Auditing production ergonomics, variable naming, and encapsulation...",
      "✓ High-assurance architecture confirmed",
    ],
  },
  {
    id: "anticheat",
    label: "Anti-cheat scan",
    icon: ShieldCheck,
    logLines: [
      "→ Cross-referencing against global solution corpus with Moss AST...",
      "→ Verifying keystroke cadence and submission heuristics...",
      "✓ No plagiarism signals detected (0.0% similarity)",
    ],
  },
  {
    id: "scoring",
    label: "Scoring",
    icon: Award,
    logLines: [
      "→ Aggregating correctness, code quality, and efficiency weights...",
      "→ Calculating final composite score...",
      "✓ Verification complete: 92/100 (Pass threshold: 80)",
    ],
  },
];

export default function VerificationModal({
  isOpen,
  onComplete,
  onCancel,
}) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [streamedLogs, setStreamedLogs] = useState([]);
  const [currentTypingText, setCurrentTypingText] = useState("");
  const logContainerRef = useRef(null);

  // Allow skip after 2 seconds
  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIdx(0);
      setCanSkip(false);
      setStreamedLogs([]);
      setCurrentTypingText("");
      return;
    }

    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 2000);

    return () => clearTimeout(skipTimer);
  }, [isOpen]);

  // Stage progression and typewriter log effect
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    let stageTimeout;
    let charInterval;

    // Stage progression every ~950ms (total ~4.8s for 5 stages)
    const stageDuration = 950;
    const stage = PIPELINE_STAGES[currentStageIdx];

    if (stage) {
      // Stream the log lines character by character
      let lineIdx = 0;
      let charIdx = 0;
      const targetLines = stage.logLines;

      const typeNextChar = () => {
        if (!isMounted) return;
        if (lineIdx >= targetLines.length) return;

        const currentLine = targetLines[lineIdx];
        if (charIdx < currentLine.length) {
          setCurrentTypingText(currentLine.slice(0, charIdx + 1));
          charIdx++;
          charInterval = setTimeout(typeNextChar, 12);
        } else {
          // Completed line, push to streamedLogs
          setStreamedLogs((prev) => [...prev, currentLine]);
          setCurrentTypingText("");
          lineIdx++;
          charIdx = 0;
          charInterval = setTimeout(typeNextChar, 40);
        }
      };

      typeNextChar();

      stageTimeout = setTimeout(() => {
        if (currentStageIdx < PIPELINE_STAGES.length - 1) {
          setCurrentStageIdx((prev) => prev + 1);
        } else {
          // Finished all stages
          setTimeout(() => {
            if (isMounted) onComplete();
          }, 600);
        }
      }, stageDuration);
    }

    return () => {
      isMounted = false;
      clearTimeout(stageTimeout);
      clearTimeout(charInterval);
    };
  }, [isOpen, currentStageIdx, onComplete]);

  // Auto-scroll log box
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [streamedLogs, currentTypingText]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative flex flex-col w-full max-w-2xl bg-[#0b0d14] border border-[#1c2033] rounded-2xl shadow-2xl overflow-hidden">
        {/* Top window chrome with traffic-light dots and title */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1c2033] bg-[#0d0f1c] select-none">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>

          <div className="font-mono text-xs uppercase tracking-wider text-mist-300 font-semibold">
            VERIFICATION PIPELINE
          </div>

          {canSkip ? (
            <button
              onClick={onComplete}
              className="flex items-center gap-1 text-[11px] font-mono text-violet-400 hover:text-violet-300 transition-colors"
            >
              <FastForward className="h-3 w-3" />
              <span>Skip animation</span>
            </button>
          ) : (
            <div className="w-16" />
          )}
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6">
          {/* Pipeline stage cards */}
          <div className="space-y-2.5">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isPast = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;
              const isPending = idx > currentStageIdx;
              const Icon = stage.icon;

              return (
                <div
                  key={stage.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                    isCurrent
                      ? "border-violet-500/50 bg-violet-950/20 shadow-[0_0_20px_rgba(147,51,234,0.15)] ring-1 ring-violet-500/30"
                      : isPast
                      ? "border-emerald-500/25 bg-[#0e1017]"
                      : "border-[#1c2033]/60 bg-[#090b14]/40 opacity-40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg border ${
                        isCurrent
                          ? "border-violet-400/40 bg-violet-500/20 text-violet-300"
                          : isPast
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-[#1c2033] bg-[#141724] text-mist-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <span
                        className={`text-xs font-mono font-medium tracking-wide ${
                          isCurrent
                            ? "text-white font-semibold"
                            : isPast
                            ? "text-mist-200"
                            : "text-mist-600"
                        }`}
                      >
                        {stage.label}
                      </span>
                      {isCurrent && (
                        <p className="text-[10.5px] font-mono text-violet-300/80 animate-pulse">
                          Processing real-time telemetry…
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div>
                    {isCurrent ? (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-violet-500/30 bg-violet-500/10 text-[10.5px] font-mono text-violet-300">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>ACTIVE</span>
                      </div>
                    ) : isPast ? (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-[10.5px] font-mono text-emerald-400">
                        <Check className="h-3 w-3 stroke-[2.5]" />
                        <span>VERIFIED</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-mist-700">QUEUED</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time terminal log stream with character-by-character typewriter effect */}
          <div className="rounded-xl border border-[#1c2033] bg-[#070911] p-3.5 space-y-1 font-mono text-[11px] leading-relaxed">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1c2033] text-mist-500 text-[10px] uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-violet-400" />
                Live Engine Stream
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Connected
              </span>
            </div>

            <div
              ref={logContainerRef}
              className="h-28 overflow-y-auto custom-scrollbar space-y-1 text-mist-300"
            >
              {streamedLogs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.startsWith("✓")
                      ? "text-emerald-400 font-medium"
                      : log.startsWith("→")
                      ? "text-mist-400"
                      : "text-mist-300"
                  }
                >
                  {log}
                </div>
              ))}
              {currentTypingText && (
                <div className="text-mist-200">
                  {currentTypingText}
                  <span className="inline-block w-1.5 h-3 bg-violet-400 ml-0.5 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-3 bg-[#0d0f1c] border-t border-[#1c2033] flex items-center justify-between text-xs font-mono">
          <span className="text-mist-500 text-[11px]">
            Sandboxed in isolated Linux cgroup · VerifAI v2.4
          </span>
          {canSkip && (
            <button
              onClick={onComplete}
              className="px-2.5 py-1 rounded bg-[#1c2033] text-mist-200 hover:text-white transition-colors text-[11px]"
            >
              Skip to results →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
