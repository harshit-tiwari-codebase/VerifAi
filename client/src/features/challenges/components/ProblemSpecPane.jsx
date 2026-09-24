import React, { useState } from "react";
import { Check, Copy, Sparkles, Shield, Cpu, Clock, Terminal, ChevronRight } from "lucide-react";

export default function ProblemSpecPane({ challenge }) {
  const [copiedRubric, setCopiedRubric] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // "description" | "criteria"

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
    <div className="flex-1 flex flex-col min-h-0 bg-[#0d0f1c] text-xs font-mono select-text">
      {/* Pane sub-header tab selector */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#090b14] border-b border-[#1c2033] shrink-0 select-none">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`px-3 py-1 rounded text-[11px] font-mono transition-colors ${
              activeTab === "description"
                ? "bg-[#1c2033] text-mist-100 font-semibold"
                : "text-mist-400 hover:text-mist-200"
            }`}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("criteria")}
            className={`px-3 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === "criteria"
                ? "bg-[#1c2033] text-violet-300 font-semibold"
                : "text-mist-400 hover:text-mist-200"
            }`}
          >
            <span>AI Rubric</span>
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          </button>
        </div>

        <div className="text-[10px] text-mist-500 font-mono tracking-wider uppercase">
          SPECIFICATION
        </div>
      </div>

      {/* Scrollable spec content area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
        {activeTab === "description" ? (
          <>
            {/* Title & metadata row */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-semibold">
                  {challenge?.category || "Distributed Systems"}
                </span>
                <span className="text-[#2d3245]">·</span>
                <span className="text-[10px] font-mono text-mist-500">
                  ID: {challenge?._id || challenge?.id || "rate-limiter"}
                </span>
              </div>
              <h2 className="text-base font-semibold text-white tracking-tight leading-snug">
                {challenge?.title || "Distributed Token Bucket Rate Limiter"}
              </h2>
            </div>

            {/* Problem statement */}
            <div className="space-y-3">
              <span className="text-[10.5px] font-mono font-semibold tracking-wider text-mist-500 uppercase block">
                PROBLEM STATEMENT
              </span>
              <div className="rounded-xl border border-[#1c2033] bg-[#090b14]/70 p-4 text-[12px] leading-relaxed text-mist-200 whitespace-pre-line font-mono">
                {challenge?.description || "No description provided for this challenge."}
              </div>
            </div>

            {/* Key Topics / Tags */}
            {challenge?.tags && challenge.tags.length > 0 && (
              <div>
                <span className="text-[10.5px] font-mono font-semibold tracking-wider text-mist-500 uppercase block mb-2.5">
                  ARCHITECTURE & TAGS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {challenge.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded border border-[#1c2033] bg-[#090b14] px-2 py-0.5 font-mono text-[11px] text-mist-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Public Test Case Previews */}
            {publicCases.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10.5px] font-mono font-semibold tracking-wider text-mist-500 uppercase">
                    PUBLIC TEST SUITES ({publicCases.length})
                  </span>
                  <span className="text-[10px] font-mono text-mist-500">
                    {hiddenCount > 0 ? `+ ${hiddenCount} hidden anti-cheat cases` : "Validated in sandbox"}
                  </span>
                </div>

                <div className="space-y-2">
                  {publicCases.map((tc, idx) => (
                    <div
                      key={tc._id || tc.id || idx}
                      className="rounded-lg border border-[#1c2033] bg-[#090b14] p-3 text-[11.5px] font-mono space-y-1.5"
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
                        <div className="p-2 rounded bg-[#0d0f1c] border border-[#1c2033] text-mist-300">
                          <span className="text-mist-500 text-[10px] block uppercase">Input</span>
                          <code className="text-mist-200 text-[11px] break-all">{tc.input}</code>
                        </div>
                      )}

                      <div className="p-2 rounded bg-[#0d0f1c] border border-[#1c2033] text-mist-300">
                        <span className="text-mist-500 text-[10px] block uppercase">Expected Output</span>
                        <code className="text-emerald-400 text-[11px] font-semibold">{tc.expectedOutput}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Constraints */}
            <div>
              <span className="text-[10.5px] font-mono font-semibold tracking-wider text-mist-500 uppercase block mb-2">
                EXECUTION CONSTRAINTS
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[#1c2033] bg-[#090b14]">
                  <Clock className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                  <div>
                    <span className="text-mist-500 block text-[10px]">CPU Time Limit</span>
                    <span className="text-mist-200 font-semibold">5000 ms</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg border border-[#1c2033] bg-[#090b14]">
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
          /* AI Rubric Tab */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono font-semibold tracking-wider text-mist-500 uppercase">
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

            {/* Accent Card: Deep violet/indigo panel */}
            <div className="rounded-xl border border-violet-500/30 bg-gradient-to-b from-[#18112e]/70 via-[#100d22]/80 to-[#0d0f1c] p-4 text-[11.5px] leading-relaxed shadow-[0_4px_24px_rgba(124,58,237,0.08)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-violet-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                  <span className="font-semibold text-violet-300 text-xs">
                    Autonomous Grading Protocol
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 border border-violet-500/30 text-violet-300">
                  Min Pass: {challenge?.aiReview?.passingThreshold || 80}/100
                </span>
              </div>

              <div className="whitespace-pre-line text-mist-200 text-[11.5px] leading-relaxed font-mono">
                {challenge?.aiReview?.rubric || challenge?.evaluationCriteria || `CRITERIA:
• Algorithmic Complexity: Optimal O(1) time and auxiliary space consumption
• Thread Safety & Concurrency: Deterministic state protection under concurrent bursts
• Edge Case Hardening: Handling clock jitter, zero capacities, and fractional inputs
• Production Standards: Clean modular class structure and clear variable naming`}
              </div>
            </div>

            {/* AI Review Sub-Score Weightings */}
            <div className="space-y-2">
              <span className="text-[10.5px] font-mono font-semibold tracking-wider text-mist-500 uppercase block">
                SCORING BREAKDOWN WEIGHTS
              </span>
              <div className="space-y-2 text-[11.5px]">
                <div className="p-2.5 rounded-lg border border-[#1c2033] bg-[#090b14] flex items-center justify-between">
                  <span className="text-mist-300">Correctness & Public Tests</span>
                  <span className="text-emerald-400 font-semibold">35%</span>
                </div>
                <div className="p-2.5 rounded-lg border border-[#1c2033] bg-[#090b14] flex items-center justify-between">
                  <span className="text-mist-300">Code Quality & Idiomatic JS</span>
                  <span className="text-violet-300 font-semibold">25%</span>
                </div>
                <div className="p-2.5 rounded-lg border border-[#1c2033] bg-[#090b14] flex items-center justify-between">
                  <span className="text-mist-300">Algorithmic Complexity (O(1))</span>
                  <span className="text-sky-400 font-semibold">20%</span>
                </div>
                <div className="p-2.5 rounded-lg border border-[#1c2033] bg-[#090b14] flex items-center justify-between">
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
