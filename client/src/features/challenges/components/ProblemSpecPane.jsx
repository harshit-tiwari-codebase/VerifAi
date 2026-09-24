import React, { useState } from "react";
import { Check, Copy, Sparkles, Cpu, Clock, Terminal, ShieldCheck, Zap } from "lucide-react";

export default function ProblemSpecPane({ challenge }) {
  const [copiedRubric, setCopiedRubric] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // "description" | "rubric"

  const handleCopyRubric = () => {
    const textToCopy = challenge?.aiReview?.rubric || challenge?.evaluationCriteria || "";
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedRubric(true);
      setTimeout(() => setCopiedRubric(false), 2000);
    }
  };

  const testCases = challenge?.testCases || [];
  const publicCases = testCases.filter((tc) => !tc.isHidden);
  const hiddenCount = testCases.filter((tc) => tc.isHidden).length;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0c0d12] text-xs font-mono select-text">
      {/* Pane tab bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#07090F] border-b border-white/[0.08] shrink-0 select-none">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              activeTab === "description"
                ? "bg-violet-500/20 text-violet-300 font-medium"
                : "text-mist-400 hover:text-mist-200"
            }`}
          >
            Problem Specification
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rubric")}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === "rubric"
                ? "bg-violet-500/20 text-violet-300 font-medium"
                : "text-mist-400 hover:text-mist-200"
            }`}
          >
            <Sparkles className="h-3 w-3 text-violet-400" />
            <span>AI Rubric</span>
          </button>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-wider text-mist-500 hidden sm:inline">
          SPEC
        </span>
      </div>

      {/* Scrollable spec content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
        {activeTab === "description" ? (
          <>
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 font-mono text-[10.5px] text-violet-300">
                  {challenge?.category || "Distributed Systems"}
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                  Isolated V8
                </span>
              </div>
              <h2 className="text-base font-semibold text-white tracking-tight font-display">
                {challenge?.title || "Distributed Token Bucket Rate Limiter"}
              </h2>
            </div>

            {/* Problem Statement */}
            <div className="space-y-2">
              <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-mist-500 block">
                PROBLEM STATEMENT
              </span>
              <div className="rounded-xl border border-white/[0.06] bg-[#07080c] p-4 text-[12px] leading-relaxed text-mist-200 whitespace-pre-line font-mono">
                {challenge?.description || "No description provided."}
              </div>
            </div>

            {/* Topics / Tags */}
            {challenge?.tags && challenge.tags.length > 0 && (
              <div>
                <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-mist-500 block mb-2">
                  KEY TOPICS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {challenge.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded border border-white/[0.06] bg-[#07080c] px-2 py-0.5 font-mono text-[11px] text-mist-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Public Test Cases */}
            {publicCases.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-mist-500">
                    PUBLIC TEST SUITES ({publicCases.length})
                  </span>
                  <span className="text-[10px] font-mono text-mist-500">
                    {hiddenCount > 0 ? `+ ${hiddenCount} hidden anti-cheat cases` : "Judge0 verified"}
                  </span>
                </div>

                <div className="space-y-2">
                  {publicCases.map((tc, idx) => (
                    <div
                      key={tc._id || tc.id || idx}
                      className="rounded-lg border border-white/[0.05] bg-[#07080c] p-3 text-[11.5px] font-mono space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-mist-400">
                        <span className="text-violet-400 font-semibold text-[10.5px]">
                          CASE #{idx + 1}
                        </span>
                        {tc.name && (
                          <span className="text-[10.5px] text-mist-500 truncate max-w-[200px]">
                            {tc.name}
                          </span>
                        )}
                      </div>

                      {tc.input && (
                        <div className="p-2 rounded bg-[#05070B] border border-white/[0.04] text-mist-300">
                          <span className="text-mist-600 text-[10px] block uppercase">Input</span>
                          <code className="text-mist-200 text-[11px] break-all">{tc.input}</code>
                        </div>
                      )}

                      <div className="p-2 rounded bg-[#05070B] border border-white/[0.04] text-mist-300">
                        <span className="text-mist-600 text-[10px] block uppercase">Expected Output</span>
                        <code className="text-emerald-400 text-[11px] font-semibold">{tc.expectedOutput}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Constraints */}
            <div>
              <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-mist-500 block mb-2">
                SANDBOX CONSTRAINTS
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-white/[0.05] bg-[#07080c]">
                  <Clock className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-mist-500 block text-[10px]">CPU Time Limit</span>
                    <span className="text-mist-200 font-semibold">5000 ms</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-white/[0.05] bg-[#07080c]">
                  <Cpu className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-mist-500 block text-[10px]">Memory Ceiling</span>
                    <span className="text-mist-200 font-semibold">128 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* AI Rubric Tab - Rich Purple Card */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-mist-400">
                AI ARCHITECTURAL GRADING MATRIX
              </span>
              <button
                type="button"
                onClick={handleCopyRubric}
                className="flex items-center gap-1 text-[10px] font-mono text-mist-400 hover:text-mist-200 transition-colors"
              >
                {copiedRubric ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy Rubric</span>
                  </>
                )}
              </button>
            </div>

            {/* Accent Card: Rich Purple Comp from index.css */}
            <div className="purple-comp rounded-xl p-4 text-[11.5px] leading-relaxed space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-violet-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                  <span className="font-semibold text-white text-xs font-display">
                    Senior AI Review Protocol
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 border border-violet-400/30 text-violet-200">
                  Passing: {challenge?.aiReview?.passingThreshold || 80}/100
                </span>
              </div>

              <div className="whitespace-pre-line text-mist-100 text-[11.5px] leading-relaxed font-mono">
                {challenge?.aiReview?.rubric || challenge?.evaluationCriteria || `CRITERIA:
• Algorithmic Complexity: Optimal O(1) time and auxiliary space consumption
• Thread Safety & Concurrency: Deterministic state protection under concurrent bursts
• Edge Case Hardening: Handling clock jitter, zero capacities, and fractional inputs
• Production Standards: Clean modular class structure and clear variable naming`}
              </div>
            </div>

            {/* Scoring Breakdown */}
            <div className="space-y-2">
              <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-mist-500 block">
                SCORING BREAKDOWN
              </span>
              <div className="space-y-2 text-[11.5px]">
                <div className="p-2.5 rounded-lg border border-white/[0.05] bg-[#07080c] flex items-center justify-between">
                  <span className="text-mist-300">Correctness & Public Tests</span>
                  <span className="text-emerald-400 font-semibold">35%</span>
                </div>
                <div className="p-2.5 rounded-lg border border-white/[0.05] bg-[#07080c] flex items-center justify-between">
                  <span className="text-mist-300">Code Quality & Idiomatic JS</span>
                  <span className="text-violet-300 font-semibold">25%</span>
                </div>
                <div className="p-2.5 rounded-lg border border-white/[0.05] bg-[#07080c] flex items-center justify-between">
                  <span className="text-mist-300">Algorithmic Efficiency (O(1))</span>
                  <span className="text-sky-400 font-semibold">20%</span>
                </div>
                <div className="p-2.5 rounded-lg border border-white/[0.05] bg-[#07080c] flex items-center justify-between">
                  <span className="text-mist-300">Hidden Edge Cases & Anti-Cheat</span>
                  <span className="text-amber-400 font-semibold">20%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
