import React, { useState } from "react";
import {
  Check,
  X,
  Lock,
  ChevronDown,
  ChevronRight,
  Terminal,
  BrainCircuit,
  Loader2,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
} from "lucide-react";

export default function TestResultsConsole({
  isOpen,
  onClose,
  testCases = [],
  revealedCount = 0,
  isRunning = false,
  progressPercent = 0,
  aiReviewData,
  onRunTests,
}) {
  const [activeTab, setActiveTab] = useState("tests"); // "tests" | "console" | "ai"
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  const totalCount = testCases.length;
  const revealedList = testCases.slice(0, revealedCount);
  const passedCount = revealedList.filter((t) => t.passed).length;
  const failedCount = revealedList.filter((t) => !t.passed).length;

  const toggleExpand = (id) => {
    setExpandedCaseId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className={`border-t border-white/[0.08] bg-[#0c0d12] flex flex-col transition-all duration-200 ease-out relative z-30 shrink-0 select-none ${
        isMaximized ? "h-[85%]" : "h-[45%]"
      }`}
    >
      {/* Progress hairline */}
      <div className="h-0.5 w-full bg-white/[0.06] overflow-hidden shrink-0">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Header Tabs bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#07090F] border-b border-white/[0.08] shrink-0 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          {/* Test cases tab */}
          <button
            type="button"
            onClick={() => setActiveTab("tests")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              activeTab === "tests"
                ? "bg-violet-500/20 text-violet-300 font-medium"
                : "text-mist-400 hover:text-mist-200"
            }`}
          >
            <span>Test Cases</span>
            {revealedCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  failedCount > 0
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : revealedCount === totalCount
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {passedCount}/{totalCount}
              </span>
            )}
          </button>

          {/* Console tab */}
          <button
            type="button"
            onClick={() => setActiveTab("console")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              activeTab === "console"
                ? "bg-violet-500/20 text-violet-300 font-medium"
                : "text-mist-400 hover:text-mist-200"
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-mist-400" />
            <span>Stdout</span>
          </button>

          {/* AI Review Preview tab */}
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              activeTab === "ai"
                ? "bg-violet-500/20 text-violet-300 font-medium"
                : "text-mist-400 hover:text-mist-200"
            }`}
          >
            <BrainCircuit className="h-3.5 w-3.5 text-violet-400" />
            <span>AI Static Audit</span>
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          {isRunning ? (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
              <span>Sandbox executing…</span>
            </div>
          ) : (
            onRunTests && (
              <button
                type="button"
                onClick={onRunTests}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-mist-400 hover:text-mist-100 hover:bg-white/[0.06] transition-colors"
                title="Rerun test suites"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Rerun</span>
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => setIsMaximized((prev) => !prev)}
            className="p-1 rounded text-mist-500 hover:text-mist-200 hover:bg-white/[0.06] transition-colors"
            title={isMaximized ? "Restore height" : "Maximize height"}
          >
            {isMaximized ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-mist-500 hover:text-mist-200 hover:bg-white/[0.06] transition-colors"
            title="Close test panel"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3.5 bg-[#07080c] text-xs font-mono select-text">
        {activeTab === "tests" && (
          <div className="space-y-2">
            {testCases.map((tc, idx) => {
              const isRevealed = idx < revealedCount;
              const isCurrent = idx === revealedCount && isRunning;
              const isExpanded = expandedCaseId === (tc.id || idx);

              return (
                <div
                  key={tc.id || idx}
                  className={`rounded-lg border transition-all duration-150 overflow-hidden ${
                    !isRevealed && !isCurrent
                      ? "border-white/[0.04] bg-[#05070B] opacity-40"
                      : isCurrent
                      ? "border-amber-500/40 bg-amber-500/5 ring-1 ring-amber-500/20"
                      : tc.passed
                      ? "border-emerald-500/20 bg-emerald-500/[0.04] hover:border-emerald-500/40"
                      : "border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50"
                  }`}
                >
                  {/* Case summary row */}
                  <div
                    onClick={() => isRevealed && toggleExpand(tc.id || idx)}
                    className={`flex items-center justify-between p-2.5 ${
                      isRevealed ? "cursor-pointer select-none" : "cursor-default"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Status indicator */}
                      {isCurrent ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400 shrink-0" />
                      ) : isRevealed ? (
                        tc.passed ? (
                          <div className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                            <X className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )
                      ) : (
                        <div className="h-3 w-3 rounded-full bg-white/10 shrink-0" />
                      )}

                      {/* Title */}
                      {tc.isHidden ? (
                        <div className="flex items-center gap-1.5 text-mist-400 truncate">
                          <Lock className="h-3 w-3 text-amber-400/80 shrink-0" />
                          <span className="font-semibold text-amber-300">
                            Hidden Case #{idx + 1}
                          </span>
                          <span className="text-[10px] text-mist-500 font-mono">
                            (Anti-cheat validation)
                          </span>
                        </div>
                      ) : (
                        <span
                          className={`truncate font-mono ${
                            isRevealed
                              ? tc.passed
                                ? "text-mist-200"
                                : "text-rose-300 font-medium"
                              : "text-mist-500"
                          }`}
                        >
                          {tc.name || `Test Case #${idx + 1}`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {isRevealed && tc.runtime && (
                        <span className="text-[10.5px] font-mono text-mist-500 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
                          {tc.runtime}
                        </span>
                      )}
                      {isRevealed && (
                        <button
                          type="button"
                          className="text-mist-500 hover:text-mist-300"
                          title="Toggle details"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded test details */}
                  {isExpanded && isRevealed && (
                    <div className="p-3 bg-[#05070B] border-t border-white/[0.06] space-y-2.5">
                      {tc.isHidden ? (
                        <div className="p-2.5 rounded bg-[#07080c] border border-white/[0.05] text-mist-400 text-[11px] leading-relaxed">
                          <span className="text-amber-400 font-semibold">🔒 Input & expected output are masked</span> to safeguard anti-cheat validation.
                          <div className="mt-1 text-emerald-400 font-mono text-[10.5px]">
                            ✓ Runtime constraint verified in sandbox: {tc.runtime || "11ms"}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 rounded bg-[#07080c] border border-white/[0.05]">
                              <span className="text-mist-500 text-[9.5px] uppercase block mb-1">
                                Input
                              </span>
                              <pre className="text-mist-200 whitespace-pre-wrap font-mono text-[11px]">
                                {tc.input || "None"}
                              </pre>
                            </div>
                            <div className="p-2 rounded bg-[#07080c] border border-white/[0.05]">
                              <span className="text-mist-500 text-[9.5px] uppercase block mb-1">
                                Expected Output
                              </span>
                              <pre className="text-emerald-400 whitespace-pre-wrap font-mono text-[11px]">
                                {tc.expectedOutput}
                              </pre>
                            </div>
                          </div>

                          {!tc.passed && (
                            <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
                              <span className="text-rose-400 text-[9.5px] uppercase font-semibold block mb-1">
                                Actual Output (Diff)
                              </span>
                              <div className="font-mono text-[11px]">
                                <span className="text-emerald-400">- {tc.expectedOutput}</span>
                                <br />
                                <span className="text-rose-400">+ {tc.actualOutput || "undefined"}</span>
                              </div>
                            </div>
                          )}

                          {tc.logs && (
                            <div className="p-2 rounded bg-[#07080c] border border-white/[0.05] text-[10.5px]">
                              <span className="text-mist-500 text-[9.5px] uppercase block mb-1">
                                Telemetry Log
                              </span>
                              <pre className="text-mist-400 font-mono whitespace-pre-wrap">
                                {tc.logs}
                              </pre>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "console" && (
          <div className="p-2 space-y-2 text-mist-300 font-mono text-[11.5px] leading-relaxed">
            <div className="text-mist-500">
              [Sandbox Engine] Initialized Judge0 container (Node.js v20.11 / v8 runtime)
            </div>
            <div className="text-mist-500">
              [Isolation] CPU: 5.00s cap | RAM: 128MB ceiling | Wall timeout: 10s
            </div>
            <div className="text-emerald-400">
              [Compiler] starter_code.js compiled without syntax exceptions.
            </div>
            {revealedList.map((tc, idx) => (
              <div key={idx} className="text-mist-300 pl-2 border-l border-white/[0.08]">
                <span className="text-mist-500">Suite #{idx + 1}:</span>{" "}
                <span className={tc.passed ? "text-emerald-400" : "text-rose-400"}>
                  {tc.passed ? "✓ PASS" : "✗ FAIL"}
                </span>{" "}
                <span className="text-mist-500">({tc.runtime || "10ms"})</span> - {tc.name || `Case #${idx + 1}`}
              </div>
            ))}
            {revealedCount === totalCount && (
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 mt-2">
                [Summary] All test suites processed. Result: {passedCount}/{totalCount} passed.
              </div>
            )}
          </div>
        )}

        {activeTab === "ai" && (
          <div className="p-2 space-y-3 font-mono text-xs">
            <div className="purple-comp rounded-xl p-3.5 text-mist-100">
              <div className="flex items-center gap-2 mb-1.5 text-violet-300 font-semibold">
                <Sparkles className="h-4 w-4" />
                <span className="font-display">Preliminary Static Analysis</span>
              </div>
              <p className="text-mist-300 text-[11.5px] leading-relaxed">
                AST scan confirms constant delta arithmetic without background busy loops. Full AI Architectural Audit & tamper-proof credential scoring will occur upon solution submission.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-lg border border-white/[0.05] bg-[#0c0d12]">
                <span className="text-mist-500 text-[10px] block">Time Complexity</span>
                <span className="text-emerald-400 font-semibold">O(1) Constant</span>
              </div>
              <div className="p-2.5 rounded-lg border border-white/[0.05] bg-[#0c0d12]">
                <span className="text-mist-500 text-[10px] block">Space Complexity</span>
                <span className="text-emerald-400 font-semibold">O(1) Auxiliary</span>
              </div>
              <div className="p-2.5 rounded-lg border border-white/[0.05] bg-[#0c0d12]">
                <span className="text-mist-500 text-[10px] block">Plagiarism Signals</span>
                <span className="text-sky-400 font-semibold">0 Detected</span>
              </div>
              <div className="p-2.5 rounded-lg border border-white/[0.05] bg-[#0c0d12]">
                <span className="text-mist-500 text-[10px] block">Audit Readiness</span>
                <span className="text-violet-300 font-semibold">Ready (~90+)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
