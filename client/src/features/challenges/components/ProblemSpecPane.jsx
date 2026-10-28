import React, { useState } from "react";
import { Check, Copy, BrainCircuit, Cpu, Clock, SlidersHorizontal } from "lucide-react";

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
    <div className="flex-1 flex flex-col min-h-0 bg-[#0D0D12] text-xs font-mono select-text">
      {/* Pane tab bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#09090B] border-b border-[#27272A] shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`px-3 py-1 rounded-[8px] text-xs font-mono transition-colors ${
              activeTab === "description"
                ? "bg-[#211635] text-[#A78BFA] border border-[#8B5CF6]/30 font-medium"
                : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A]"
            }`}
          >
            Specification
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rubric")}
            className={`px-3 py-1 rounded-[8px] text-xs font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === "rubric"
                ? "bg-[#211635] text-[#A78BFA] border border-[#8B5CF6]/30 font-medium"
                : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A]"
            }`}
          >
            <BrainCircuit className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>AI Rubric</span>
          </button>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] hidden sm:inline">
          SPEC
        </span>
      </div>

      {/* Scrollable spec content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
        {activeTab === "description" ? (
          <>
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-md border border-[#27272A] bg-[#14141B] px-2.5 py-0.5 font-mono text-[10.5px] text-[#A1A1AA]">
                  {challenge?.category || "Distributed Systems"}
                </span>
                <span className="rounded-md border border-[#34D399]/30 bg-[#34D399]/10 px-2.5 py-0.5 font-mono text-[10px] text-[#34D399]">
                  Isolated V8
                </span>
              </div>
              <h2 className="text-base font-semibold text-[#FAFAFA] tracking-tight font-display">
                {challenge?.title || "Distributed Token Bucket Rate Limiter"}
              </h2>
            </div>

            {/* Problem Statement */}
            <div className="space-y-2">
              <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#71717A] block">
                PROBLEM STATEMENT
              </span>
              <div className="rounded-[12px] border border-[#27272A] bg-[#14141B] p-4 text-[12px] leading-relaxed text-[#FAFAFA] whitespace-pre-line font-mono">
                {challenge?.description || "No description provided."}
              </div>
            </div>

            {/* Topics / Tags */}
            {challenge?.tags && challenge.tags.length > 0 && (
              <div>
                <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#71717A] block mb-2">
                  KEY TOPICS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {challenge.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-[6px] border border-[#27272A] bg-[#14141B] px-2 py-0.5 font-mono text-[11px] text-[#A1A1AA]"
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
                  <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#71717A]">
                    PUBLIC TEST SUITES ({publicCases.length})
                  </span>
                  <span className="text-[10px] font-mono text-[#71717A]">
                    {hiddenCount > 0 ? `+ ${hiddenCount} hidden anti-cheat cases` : "Isolated V8 verified"}
                  </span>
                </div>

                <div className="space-y-2">
                  {publicCases.map((tc, idx) => (
                    <div
                      key={tc._id || tc.id || idx}
                      className="rounded-[10px] border border-[#27272A] bg-[#14141B] p-3 text-[11.5px] font-mono space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[#A1A1AA]">
                        <span className="text-[#A78BFA] font-semibold text-[10.5px]">
                          CASE #{idx + 1}
                        </span>
                        {tc.name && (
                          <span className="text-[10.5px] text-[#71717A] truncate max-w-[200px]">
                            {tc.name}
                          </span>
                        )}
                      </div>

                      {tc.input && (
                        <div className="p-2 rounded bg-[#0D0D12] border border-[#27272A] text-[#E4E4E7]">
                          <span className="text-[#71717A] text-[10px] block uppercase">Input</span>
                          <code className="text-[#E4E4E7] text-[11px] break-all">{tc.input}</code>
                        </div>
                      )}

                      <div className="p-2 rounded bg-[#0D0D12] border border-[#27272A] text-[#E4E4E7]">
                        <span className="text-[#71717A] text-[10px] block uppercase">Expected Output</span>
                        <code className="text-[#34D399] text-[11px] font-semibold">{tc.expectedOutput}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Constraints */}
            <div>
              <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#71717A] block mb-2">
                SANDBOX CONSTRAINTS
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-2 p-2.5 rounded-[10px] border border-[#27272A] bg-[#14141B]">
                  <Clock className="h-3.5 w-3.5 text-[#60A5FA] shrink-0" />
                  <div>
                    <span className="text-[#71717A] block text-[10px]">CPU Time Limit</span>
                    <span className="text-[#FAFAFA] font-semibold">5000 ms</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-[10px] border border-[#27272A] bg-[#14141B]">
                  <Cpu className="h-3.5 w-3.5 text-[#FBBF24] shrink-0" />
                  <div>
                    <span className="text-[#71717A] block text-[10px]">Memory Ceiling</span>
                    <span className="text-[#FAFAFA] font-semibold">128 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* AI Rubric Tab */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#A1A1AA]">
                AI ARCHITECTURAL GRADING MATRIX
              </span>
              <button
                type="button"
                onClick={handleCopyRubric}
                className="flex items-center gap-1 text-[10px] font-mono text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
              >
                {copiedRubric ? (
                  <>
                    <Check className="h-3 w-3 text-[#34D399]" />
                    <span className="text-[#34D399]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy Rubric</span>
                  </>
                )}
              </button>
            </div>

            <div className="rounded-[12px] border border-[#8B5CF6]/30 bg-[#18181F] p-4 text-[11.5px] leading-relaxed space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#27272A]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-[#8B5CF6]" />
                  <span className="font-semibold text-[#FAFAFA] text-xs font-mono">
                    Evaluation Matrix
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#211635] border border-[#8B5CF6]/30 text-[#C4B5FD]">
                  Min Pass: {challenge?.aiReview?.passingThreshold || 80}/100
                </span>
              </div>

              <div className="whitespace-pre-line text-[#FAFAFA] text-[11.5px] leading-relaxed font-mono">
                {challenge?.aiReview?.rubric || challenge?.evaluationCriteria || `CRITERIA:
• Algorithmic Complexity: Optimal O(1) time and auxiliary space consumption
• Thread Safety & Concurrency: Deterministic state protection under concurrent bursts
• Edge Case Hardening: Handling clock jitter, zero capacities, and fractional inputs
• Production Standards: Clean modular class structure and clear variable naming`}
              </div>
            </div>

            {/* Scoring Breakdown */}
            <div className="space-y-2">
              <span className="text-[10.5px] font-mono font-semibold uppercase tracking-wider text-[#71717A] block">
                SCORING BREAKDOWN
              </span>
              <div className="space-y-2 text-[11.5px]">
                <div className="p-2.5 rounded-[10px] border border-[#27272A] bg-[#14141B] flex items-center justify-between">
                  <span className="text-[#A1A1AA]">Correctness & Public Tests</span>
                  <span className="text-[#34D399] font-semibold">35%</span>
                </div>
                <div className="p-2.5 rounded-[10px] border border-[#27272A] bg-[#14141B] flex items-center justify-between">
                  <span className="text-[#A1A1AA]">Code Quality & Idiomatic JS</span>
                  <span className="text-[#A78BFA] font-semibold">25%</span>
                </div>
                <div className="p-2.5 rounded-[10px] border border-[#27272A] bg-[#14141B] flex items-center justify-between">
                  <span className="text-[#A1A1AA]">Algorithmic Efficiency (O(1))</span>
                  <span className="text-[#60A5FA] font-semibold">20%</span>
                </div>
                <div className="p-2.5 rounded-[10px] border border-[#27272A] bg-[#14141B] flex items-center justify-between">
                  <span className="text-[#A1A1AA]">Hidden Edge Cases & Anti-Cheat</span>
                  <span className="text-[#FBBF24] font-semibold">20%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
