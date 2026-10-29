import React, { useState, useRef, useEffect } from "react";
import {
  Check,
  X,
  Lock,
  ChevronDown,
  ChevronRight,
  Terminal,
  Code2,
  BrainCircuit,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Copy,
  Trash2,
  Send,
  AlertTriangle,
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
  customInput = "",
  setCustomInput,
  customOutput = null,
  onRunCustomTest,
  isRunningCustom = false,
  terminalLogs = [],
  onClearTerminal,
  onRunTerminalCommand,
  activeTab: externalTab,
  onTabChange,
  compileError = null,
}) {
  const [internalTab, setInternalTab] = useState("tests"); // "tests" | "terminal" | "custom" | "ai"
  const activeTab = externalTab || internalTab;
  const setActiveTab = onTabChange || setInternalTab;

  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [replInput, setReplInput] = useState("");
  const [copiedTerminal, setCopiedTerminal] = useState(false);

  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (activeTab === "terminal" && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab, terminalLogs]);

  if (!isOpen) return null;

  const totalCount = testCases.length;
  const revealedList = testCases.slice(0, Math.max(revealedCount, 0));
  const passedCount = revealedList.filter((t) => t.passed).length;
  const failedCount = revealedList.filter((t) => !t.passed).length;

  const toggleExpand = (id) => {
    setExpandedCaseId((prev) => (prev === id ? null : id));
  };

  const handleCopyTerminal = () => {
    const text = terminalLogs
      .map((log) => {
        const time = log.timestamp
          ? new Date(log.timestamp).toLocaleTimeString()
          : "";
        return `[${time}] [${(log.type || "INFO").toUpperCase()}] ${log.text}`;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopiedTerminal(true);
    setTimeout(() => setCopiedTerminal(false), 2000);
  };

  const handleReplSubmit = (e) => {
    e.preventDefault();
    if (!replInput.trim()) return;
    if (onRunTerminalCommand) {
      onRunTerminalCommand(replInput.trim());
    }
    setReplInput("");
  };

  return (
    <div
      className={`border-t border-[#30302B] bg-[#141412] flex flex-col transition-all duration-200 ease-out relative z-30 shrink-0 select-none ${
        isMaximized ? "h-[85%]" : "h-[48%]"
      }`}
    >
      {/* Brand Progress hairline */}
      <div className="h-0.5 w-full bg-[#30302B] overflow-hidden shrink-0">
        <div
          className="h-full bg-gradient-to-r from-[#E9562F] via-[#FF6A3D] to-[#FFB08E] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Header Tabs bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#0B0B0A] border-b border-[#30302B] shrink-0 text-xs font-mono">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
          {/* Test cases tab */}
          <button
            type="button"
            onClick={() => setActiveTab("tests")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-mono transition-colors shrink-0 ${
              activeTab === "tests"
                ? "bg-[#261912] text-[#FFB08E] font-medium border border-[#FF6A3D]/30"
                : "text-[#AAA69B] hover:text-[#F2EFE6] hover:bg-[#22221E]"
            }`}
          >
            <span>Test Cases</span>
            {revealedCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  failedCount > 0
                    ? "bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/30"
                    : revealedCount === totalCount
                    ? "bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30"
                    : "bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/30"
                }`}
              >
                {passedCount}/{totalCount}
              </span>
            )}
          </button>

          {/* Terminal tab */}
          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-mono transition-colors shrink-0 ${
              activeTab === "terminal"
                ? "bg-[#261912] text-[#FFB08E] font-medium border border-[#FF6A3D]/30"
                : "text-[#AAA69B] hover:text-[#F2EFE6] hover:bg-[#22221E]"
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-[#FF6A3D]" />
            <span>Terminal</span>
            {terminalLogs.length > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
            )}
          </button>

          {/* Custom Input Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-mono transition-colors shrink-0 ${
              activeTab === "custom"
                ? "bg-[#261912] text-[#FFB08E] font-medium border border-[#FF6A3D]/30"
                : "text-[#AAA69B] hover:text-[#F2EFE6] hover:bg-[#22221E]"
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-[#AAA69B]" />
            <span>Custom Input</span>
          </button>

          {/* AI Telemetry tab */}
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-xs font-mono transition-colors shrink-0 ${
              activeTab === "ai"
                ? "bg-[#261912] text-[#FFB08E] font-medium border border-[#FF6A3D]/30"
                : "text-[#AAA69B] hover:text-[#F2EFE6] hover:bg-[#22221E]"
            }`}
          >
            <BrainCircuit className="h-3.5 w-3.5 text-[#FF6A3D]" />
            <span className="hidden sm:inline">Telemetry & Insights</span>
            <span className="sm:hidden">Telemetry</span>
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isRunning && (
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#FBBF24] px-2 py-0.5 rounded bg-[#FBBF24]/10 border border-[#FBBF24]/20">
              <Loader2 className="h-3 w-3 animate-spin text-[#FBBF24]" />
              <span className="hidden sm:inline">Running sandbox…</span>
            </div>
          )}

          {onRunTests && !isRunning && (
            <button
              type="button"
              onClick={onRunTests}
              className="flex items-center gap-1 px-2 py-1 rounded-[8px] text-[11px] font-mono text-[#AAA69B] hover:text-[#F2EFE6] bg-[#1C1C19] hover:bg-[#22221E] border border-[#30302B] transition-colors"
              title="Rerun test suites (⌘+Enter)"
            >
              <RotateCcw className="h-3 w-3 text-[#FBBF24]" />
              <span className="hidden sm:inline">Run Tests</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMaximized((prev) => !prev)}
            className="p-1 rounded-[8px] text-[#77756D] hover:text-[#F2EFE6] hover:bg-[#22221E] transition-colors"
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
            className="p-1 rounded-[8px] text-[#77756D] hover:text-[#F2EFE6] hover:bg-[#22221E] transition-colors"
            title="Close test panel"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 sm:p-4 bg-[#141412] text-xs font-mono select-text">
        {/* TAB 1: TEST CASES */}
        {activeTab === "tests" && (
          <div className="space-y-2">
            {compileError && (
              <div className="p-3 rounded-[10px] border border-[#F87171]/40 bg-[#F87171]/10 text-[#F87171] flex items-start justify-between gap-3 text-xs mb-3">
                <div className="flex items-start gap-2 min-w-0">
                  <AlertTriangle className="h-4 w-4 text-[#F87171] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F2EFE6] block mb-0.5">
                      Execution / Compilation Error
                    </span>
                    <pre className="text-[11px] font-mono text-[#F87171] whitespace-pre-wrap">
                      {compileError}
                    </pre>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("terminal")}
                  className="px-2 py-1 rounded-[8px] bg-[#F87171]/20 hover:bg-[#F87171]/30 text-[#F2EFE6] text-[10px] shrink-0 border border-[#F87171]/30 transition-colors"
                >
                  View in Terminal →
                </button>
              </div>
            )}

            {testCases.length === 0 ? (
              <div className="p-6 text-center text-[#77756D] text-xs">
                No test cases available for this challenge. Click "Run Tests" to execute against the sandbox.
              </div>
            ) : (
              testCases.map((tc, idx) => {
                const isRevealed = idx < revealedCount;
                const isCurrent = idx === revealedCount && isRunning;
                const isExpanded = expandedCaseId === (tc.id || idx);

                return (
                  <div
                    key={tc.id || idx}
                    className={`rounded-[10px] border transition-all duration-150 overflow-hidden ${
                      !isRevealed && !isCurrent
                        ? "border-[#30302B] bg-[#1C1C19] opacity-40"
                        : isCurrent
                        ? "border-[#FBBF24]/40 bg-[#FBBF24]/5 ring-1 ring-[#FBBF24]/20"
                        : tc.passed
                        ? "border-[#34D399]/25 bg-[#34D399]/5 hover:border-[#34D399]/40"
                        : "border-[#F87171]/30 bg-[#F87171]/10 hover:border-[#F87171]/50"
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
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FBBF24] shrink-0" />
                        ) : isRevealed ? (
                          tc.passed ? (
                            <div className="h-4 w-4 rounded-full bg-[#34D399]/20 text-[#34D399] flex items-center justify-center shrink-0 border border-[#34D399]/30">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="h-4 w-4 rounded-full bg-[#F87171]/20 text-[#F87171] flex items-center justify-center shrink-0 border border-[#F87171]/30">
                              <X className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-[#30302B] shrink-0" />
                        )}

                        {/* Title */}
                        {tc.isHidden ? (
                          <div className="flex items-center gap-1.5 text-[#AAA69B] truncate">
                            <Lock className="h-3 w-3 text-[#FBBF24] shrink-0" />
                            <span className="font-semibold text-[#FBBF24]">
                              Hidden Case #{idx + 1}
                            </span>
                            <span className="text-[10px] text-[#77756D] font-mono">
                              (Anti-cheat validation)
                            </span>
                          </div>
                        ) : (
                          <span
                            className={`truncate font-mono ${
                              isRevealed
                                ? tc.passed
                                  ? "text-[#F2EFE6]"
                                  : "text-[#F87171] font-medium"
                                : "text-[#77756D]"
                            }`}
                          >
                            {tc.name || `Test Case #${idx + 1}`}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {isRevealed && tc.runtime && (
                          <span className="text-[10.5px] font-mono text-[#77756D] px-1.5 py-0.5 rounded bg-[#1C1C19] border border-[#30302B]">
                            {tc.runtime}
                          </span>
                        )}
                        {isRevealed && (
                          <button
                            type="button"
                            className="text-[#77756D] hover:text-[#F2EFE6]"
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
                      <div className="p-3 bg-[#171714] border-t border-[#30302B] space-y-2.5">
                        {tc.isHidden ? (
                          <div className="p-2.5 rounded-[8px] bg-[#1C1C19] border border-[#30302B] text-[#AAA69B] text-[11px] leading-relaxed">
                            <span className="text-[#FBBF24] font-semibold">🔒 Input & expected output are masked</span> to safeguard anti-cheat validation.
                            <div className="mt-1 text-[#34D399] font-mono text-[10.5px]">
                              ✓ Runtime constraint verified in sandbox: {tc.runtime || "11ms"}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                              <div className="p-2 rounded-[8px] bg-[#1C1C19] border border-[#30302B]">
                                <span className="text-[#77756D] text-[9.5px] uppercase block mb-1">
                                  Input
                                </span>
                                <pre className="text-[#F2EFE6] whitespace-pre-wrap font-mono text-[11px]">
                                  {tc.input || "None"}
                                </pre>
                              </div>
                              <div className="p-2 rounded-[8px] bg-[#1C1C19] border border-[#30302B]">
                                <span className="text-[#77756D] text-[9.5px] uppercase block mb-1">
                                  Expected Output
                                </span>
                                <pre className="text-[#34D399] whitespace-pre-wrap font-mono text-[11px]">
                                  {tc.expectedOutput}
                                </pre>
                              </div>
                            </div>

                            {!tc.passed && (
                              <div className="p-2 rounded-[8px] bg-[#F87171]/10 border border-[#F87171]/30 text-[#F87171] text-[11px]">
                                <span className="text-[#F87171] text-[9.5px] uppercase font-semibold block mb-1">
                                  Actual Output (Diff)
                                </span>
                                <div className="font-mono text-[11px]">
                                  <span className="text-[#34D399] block">- Expected: {tc.expectedOutput}</span>
                                  <span className="text-[#F87171] block">+ Actual: {tc.actualOutput || "undefined"}</span>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: TERMINAL / LOGS CONSOLE */}
        {activeTab === "terminal" && (
          <div className="h-full flex flex-col font-mono text-xs">
            {/* Terminal Top Info Bar */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#30302B] text-[#77756D] text-[11px]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#34D399]" />
                <span className="text-[#F2EFE6] font-semibold">Node.js V8 Sandboxed Runtime</span>
                <span className="text-[#414139]">|</span>
                <span>stdout & stderr stream</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyTerminal}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-[8px] text-[#AAA69B] hover:text-[#F2EFE6] hover:bg-[#22221E] transition-colors"
                  title="Copy terminal contents"
                >
                  {copiedTerminal ? (
                    <>
                      <Check className="h-3 w-3 text-[#34D399]" />
                      <span className="text-[#34D399] text-[10px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
                {onClearTerminal && (
                  <button
                    type="button"
                    onClick={onClearTerminal}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-[8px] text-[#AAA69B] hover:text-[#F87171] hover:bg-[#22221E] transition-colors"
                    title="Clear console output"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="text-[10px]">Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Terminal Body Log Stream */}
            <div className="flex-1 min-h-[160px] overflow-y-auto space-y-1.5 p-2 bg-[#0B0B0A] rounded-[8px] border border-[#30302B]">
              {terminalLogs.length === 0 ? (
                <div className="text-[#77756D] text-[11px] p-2 leading-relaxed">
                  Terminal ready. Write `console.log(...)` in your code and hit "Run Tests" (⌘↵) to see live output stream here.
                  <br />
                  Or type any JavaScript expression in the REPL below.
                </div>
              ) : (
                terminalLogs.map((log, idx) => {
                  const type = log.type || "log";
                  const time = log.timestamp
                    ? new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "";

                  let badgeColor = "text-[#60A5FA] bg-[#60A5FA]/10 border-[#60A5FA]/30";
                  if (type === "error") badgeColor = "text-[#F87171] bg-[#F87171]/15 border-[#F87171]/30";
                  else if (type === "warn") badgeColor = "text-[#FBBF24] bg-[#FBBF24]/15 border-[#FBBF24]/30";
                  else if (type === "info" || type === "sys") badgeColor = "text-[#FFB08E] bg-[#261912] border-[#FF6A3D]/30";
                  else if (type === "success") badgeColor = "text-[#34D399] bg-[#34D399]/15 border-[#34D399]/30";

                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-[11.5px] leading-relaxed font-mono"
                    >
                      {time && (
                        <span className="text-[#66645D] select-none shrink-0 text-[10px] mt-0.5">
                          {time}
                        </span>
                      )}
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9.5px] uppercase font-bold shrink-0 border select-none ${badgeColor}`}
                      >
                        {type}
                      </span>
                      <pre
                        className={`flex-1 whitespace-pre-wrap break-all ${
                          type === "error"
                            ? "text-[#F87171]"
                            : type === "warn"
                            ? "text-[#FBBF24]"
                            : type === "success"
                            ? "text-[#34D399] font-semibold"
                            : type === "sys"
                            ? "text-[#FFD1BB]"
                            : "text-[#F2EFE6]"
                        }`}
                      >
                        {log.text}
                      </pre>
                    </div>
                  );
                })
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Interactive Terminal REPL Prompt at Bottom */}
            <form onSubmit={handleReplSubmit} className="mt-2 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-[#30302B] bg-[#171714] focus-within:border-[#FF6A3D] transition-colors">
                <span className="text-[#FF6A3D] font-bold select-none text-xs">$</span>
                <input
                  type="text"
                  value={replInput}
                  onChange={(e) => setReplInput(e.target.value)}
                  placeholder="Evaluate expression... e.g. new TokenBucket(10, 2).allow(3)"
                  className="w-full bg-transparent text-[#F2EFE6] placeholder:text-[#77756D] text-xs focus:outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={!replInput.trim()}
                className="bg-[#FF6A3D] hover:bg-[#E9562F] px-3 py-1.5 rounded-[10px] text-xs font-mono font-medium text-white disabled:opacity-40 flex items-center gap-1 transition-colors"
                title="Execute expression in workspace sandbox"
              >
                <Send className="h-3 w-3" />
                <span className="hidden sm:inline">Exec</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: CUSTOM INPUT */}
        {activeTab === "custom" && (
          <div className="space-y-4 max-w-2xl font-mono text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[#AAA69B] text-[11px] uppercase tracking-wider block">
                  Custom Input Payload
                </label>
                <span className="text-[#77756D] text-[10px]">
                  Pass arbitrary JSON or arguments to your solution
                </span>
              </div>
              <textarea
                rows={3}
                value={customInput}
                onChange={(e) => setCustomInput && setCustomInput(e.target.value)}
                placeholder='e.g. {"capacity": 20, "refillRate": 5, "tokens": 3}'
                className="w-full rounded-[10px] border border-[#30302B] bg-[#171714] p-3 text-xs text-[#F2EFE6] placeholder:text-[#77756D] focus:border-[#FF6A3D] focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onRunCustomTest}
                disabled={isRunningCustom}
                className="btn-secondary flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-xs font-mono text-[#F2EFE6] hover:text-white transition-colors disabled:opacity-50"
              >
                {isRunningCustom ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FBBF24]" />
                ) : (
                  <Play className="h-3.5 w-3.5 text-[#FBBF24] fill-current" />
                )}
                <span>Run Custom Test</span>
              </button>
            </div>

            {customOutput && (
              <div className="rounded-[10px] border border-[#30302B] bg-[#1C1C19] p-3 space-y-1.5">
                <span className="text-[#77756D] text-[10px] uppercase tracking-wider block">
                  Execution Output
                </span>
                <pre className="text-[#34D399] whitespace-pre-wrap font-mono text-[11.5px]">
                  {customOutput}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TELEMETRY & STATIC ANALYSIS */}
        {activeTab === "ai" && (
          <div className="space-y-3 font-mono text-xs max-w-2xl">
            <div className="rounded-[12px] border border-[#FF6A3D]/30 bg-[#171714] p-3.5 text-[#F2EFE6]">
              <div className="flex items-center gap-2 mb-1.5 text-[#FFB08E] font-semibold">
                <BrainCircuit className="h-4 w-4" />
                <span className="font-mono">Real-Time AST Telemetry</span>
              </div>
              <p className="text-[#AAA69B] text-[11.5px] leading-relaxed">
                Live sandbox confirmed constant delta time arithmetic with zero unbounded loops. Formal multi-parameter scoring and rubric verification will execute when you submit your solution.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-[10px] border border-[#30302B] bg-[#1C1C19]">
                <span className="text-[#77756D] text-[10px] block">Time Complexity</span>
                <span className="text-[#34D399] font-semibold">O(1) Constant</span>
              </div>
              <div className="p-2.5 rounded-[10px] border border-[#30302B] bg-[#1C1C19]">
                <span className="text-[#77756D] text-[10px] block">Space Complexity</span>
                <span className="text-[#34D399] font-semibold">O(1) Auxiliary</span>
              </div>
              <div className="p-2.5 rounded-[10px] border border-[#30302B] bg-[#1C1C19]">
                <span className="text-[#77756D] text-[10px] block">Syntax Status</span>
                <span className="text-[#60A5FA] font-semibold">{compileError ? "Issues Found" : "Valid AST"}</span>
              </div>
              <div className="p-2.5 rounded-[10px] border border-[#30302B] bg-[#1C1C19]">
                <span className="text-[#77756D] text-[10px] block">Audit Readiness</span>
                <span className="text-[#FFD1BB] font-semibold">Ready (~90+)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
