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
} from "lucide-react";

export default function TestResultsConsole({
  isOpen,
  onClose,
  testCases,
  revealedCount,
  isRunning,
  progressPercent,
  aiReviewData,
}) {
  const [activeTab, setActiveTab] = useState("tests"); // "tests" | "console" | "ai"
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);

  if (!isOpen) return null;

  const passedCount = testCases.slice(0, revealedCount).filter((t) => t.passed).length;
  const totalCount = testCases.length;

  const toggleExpand = (id) => {
    setExpandedCaseId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className={`border-t border-[#1c2033] bg-[#0d0f1c] flex flex-col transition-all duration-300 ease-in-out relative z-20 ${
        isMaximized ? "h-[80%]" : "h-[42%]"
      }`}
    >
      {/* Thin progress hairline at top of console that fills while running */}
      <div className="h-0.5 w-full bg-[#1c2033] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-violet-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Header bar with tabs and controls */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#090b14] border-b border-[#1c2033] select-none text-xs font-mono">
        <div className="flex items-center gap-1">
          {/* Tab buttons */}
          <button
            onClick={() => setActiveTab("tests")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              activeTab === "tests"
                ? "bg-[#1c2033] text-mist-100"
                : "text-mist-400 hover:text-mist-200 hover:bg-[#141724]"
            }`}
          >
            <span>Test Cases</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                revealedCount === totalCount
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              }`}
            >
              {revealedCount}/{totalCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("console")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              activeTab === "console"
                ? "bg-[#1c2033] text-mist-100"
                : "text-mist-400 hover:text-mist-200 hover:bg-[#141724]"
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-mist-400" />
            <span>Console</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              activeTab === "ai"
                ? "bg-[#1c2033] text-violet-300"
                : "text-mist-400 hover:text-mist-200 hover:bg-[#141724]"
            }`}
          >
            <BrainCircuit className="h-3.5 w-3.5 text-violet-400" />
            <span>AI Review</span>
            <span className="text-[9px] bg-violet-500/20 text-violet-300 px-1 rounded border border-violet-500/30 font-semibold">
              PREVIEW
            </span>
          </button>
        </div>

        {/* Right side controls: minimize / maximize / close */}
        <div className="flex items-center gap-2">
          {isRunning && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300 pr-2">
              <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
              <span>Executing in sandbox…</span>
            </div>
          )}

          <button
            onClick={() => setIsMaximized((prev) => !prev)}
            className="p-1 rounded text-mist-500 hover:text-mist-200 hover:bg-[#1c2033] transition-colors"
            title={isMaximized ? "Restore size" : "Maximize console"}
          >
            {isMaximized ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded text-mist-500 hover:text-mist-200 hover:bg-[#1c2033] transition-colors"
            title="Collapse console"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 bg-[#0b0d14] text-xs font-mono">
        {activeTab === "tests" && (
          <div className="space-y-2">
            {testCases.map((tc, idx) => {
              const isRevealed = idx < revealedCount;
              const isCurrent = idx === revealedCount && isRunning;
              const isExpanded = expandedCaseId === tc.id;

              return (
                <div
                  key={tc.id}
                  className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                    !isRevealed && !isCurrent
                      ? "border-[#1c2033]/50 bg-[#090b14]/50 opacity-40"
                      : isCurrent
                      ? "border-amber-500/40 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.06)]"
                      : tc.passed
                      ? "border-emerald-500/25 bg-[#0a1114]/60 hover:border-emerald-500/40"
                      : "border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50"
                  }`}
                >
                  {/* Case summary row */}
                  <div
                    onClick={() => isRevealed && toggleExpand(tc.id)}
                    className={`flex items-center justify-between p-2.5 ${
                      isRevealed ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* State icon: check, fail, spinner, or pending dot */}
                      {isCurrent ? (
                        <Loader2 className="h-4 w-4 animate-spin text-amber-400 shrink-0" />
                      ) : isRevealed ? (
                        tc.passed ? (
                          <div className="h-4 w-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                            <Check className="h-3 w-3 stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                            <X className="h-3 w-3 stroke-[2.5]" />
                          </div>
                        )
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-[#1c2033] shrink-0" />
                      )}

                      {/* Case title / Hidden title */}
                      {tc.isHidden ? (
                        <div className="flex items-center gap-1.5 text-mist-400">
                          <Lock className="h-3.5 w-3.5 text-amber-400/80 shrink-0" />
                          <span className="font-medium text-amber-300/90">
                            Hidden case #{idx + 1}
                          </span>
                          <span className="text-[10px] text-mist-500">(Anti-cheat verification)</span>
                        </div>
                      ) : (
                        <span
                          className={`font-medium truncate ${
                            isRevealed
                              ? tc.passed
                                ? "text-mist-200"
                                : "text-rose-300"
                              : "text-mist-500"
                          }`}
                        >
                          {tc.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isRevealed && (
                        <span className="text-[11px] font-mono text-mist-500">
                          {tc.runtime}
                        </span>
                      )}
                      {isRevealed && (
                        <button className="text-mist-500 hover:text-mist-300">
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline expandable diff for failure or logs */}
                  {isExpanded && isRevealed && (
                    <div className="p-3 bg-[#07080f] border-t border-[#1c2033] text-[11.5px] space-y-2">
                      {tc.isHidden ? (
                        <div className="p-2 rounded bg-[#0b0d17] border border-[#1c2033] text-mist-400">
                          <span className="text-amber-400 font-semibold">🔒 Input & expected output are masked</span> to protect test integrity against hardcoded solutions.
                          <div className="mt-1 text-emerald-400 font-mono text-[11px]">
                            ✓ Runtime constraint met: {tc.runtime} (Target &lt; 50ms)
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="p-2 rounded bg-[#0b0d14] border border-[#1c2033]">
                              <span className="text-mist-500 text-[10px] uppercase block mb-1">
                                Input
                              </span>
                              <pre className="text-mist-300 whitespace-pre-wrap font-mono text-[11px]">
                                {tc.input}
                              </pre>
                            </div>
                            <div className="p-2 rounded bg-[#0b0d14] border border-[#1c2033]">
                              <span className="text-mist-500 text-[10px] uppercase block mb-1">
                                Expected Output
                              </span>
                              <pre className="text-emerald-400 whitespace-pre-wrap font-mono text-[11px]">
                                {tc.expectedOutput}
                              </pre>
                            </div>
                          </div>

                          {!tc.passed && (
                            <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300">
                              <span className="text-rose-400 text-[10px] uppercase font-semibold block mb-1">
                                Actual Output (Diff)
                              </span>
                              <div className="font-mono text-[11px]">
                                - {tc.expectedOutput}
                                <br />+ {tc.actualOutput}
                              </div>
                            </div>
                          )}

                          {tc.logs && (
                            <div className="p-2 rounded bg-[#070912] border border-[#1c2033]">
                              <span className="text-mist-500 text-[10px] uppercase block mb-1">
                                Sandbox Telemetry
                              </span>
                              <pre className="text-mist-400 font-mono text-[10.5px]">
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
              [Sandbox Engine] Initializing Judge0 Linux container with v8 isolated worker...
            </div>
            <div className="text-mist-400">
              [Sandbox Engine] Memory Limit: 128MB | CPU Time Limit: 5.00s | Wall Time: 10.00s
            </div>
            <div className="text-emerald-400">
              [Execution] Compiled starter_code.js without syntax or reference errors.
            </div>
            {testCases.slice(0, revealedCount).map((tc, idx) => (
              <div key={idx} className="text-mist-300 pl-2 border-l border-[#1c2033]">
                <span className="text-mist-500">Suite #{idx + 1}:</span>{" "}
                <span className={tc.passed ? "text-emerald-400" : "text-rose-400"}>
                  {tc.passed ? "✓ PASS" : "✗ FAIL"}
                </span>{" "}
                <span className="text-mist-400">({tc.runtime})</span> - {tc.name}
              </div>
            ))}
            {revealedCount === totalCount && (
              <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 mt-2">
                [Summary] All 6 test suites passed successfully! Total execution time: 65ms.
              </div>
            )}
          </div>
        )}

        {activeTab === "ai" && (
          <div className="p-2 space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl border border-violet-500/30 bg-violet-500/10 text-mist-200">
              <div className="flex items-center gap-2 mb-1.5 text-violet-300 font-semibold">
                <Sparkles className="h-4 w-4" />
                <span>Preliminary Static Insights</span>
              </div>
              <p className="text-mist-300 text-[11.5px] leading-relaxed">
                AST analysis shows continuous time delta computation without busy loops. Full AI Architectural Review and Code Quality rubrics are generated upon solution submission.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 rounded-lg border border-[#1c2033] bg-[#0d0f1c]">
                <span className="text-mist-500 text-[10px] block">Time Complexity</span>
                <span className="text-emerald-400 font-semibold">O(1) Constant</span>
              </div>
              <div className="p-2 rounded-lg border border-[#1c2033] bg-[#0d0f1c]">
                <span className="text-mist-500 text-[10px] block">Space Complexity</span>
                <span className="text-emerald-400 font-semibold">O(1) Auxiliary</span>
              </div>
              <div className="p-2 rounded-lg border border-[#1c2033] bg-[#0d0f1c]">
                <span className="text-mist-500 text-[10px] block">Anti-Cheat Check</span>
                <span className="text-sky-400 font-semibold">Clean (0 signals)</span>
              </div>
              <div className="p-2 rounded-lg border border-[#1c2033] bg-[#0d0f1c]">
                <span className="text-mist-500 text-[10px] block">Estimated Grade</span>
                <span className="text-violet-300 font-semibold">~90+ Ready</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
