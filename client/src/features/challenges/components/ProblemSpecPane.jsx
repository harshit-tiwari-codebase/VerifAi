import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function ProblemSpecPane({ challenge }) {
  const [copiedRubric, setCopiedRubric] = useState(false);

  const handleCopyRubric = () => {
    if (challenge?.aiReview?.rubric) {
      navigator.clipboard.writeText(challenge.aiReview.rubric);
      setCopiedRubric(true);
      setTimeout(() => setCopiedRubric(false), 2000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 text-xs text-mist-300">
      {/* Problem Specification */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10.5px] font-mono font-semibold tracking-wider text-mist-500 uppercase">
            PROBLEM SPECIFICATION
          </span>
        </div>
        <div className="whitespace-pre-line font-mono text-[12px] leading-relaxed text-mist-200 bg-[#0d0f1c]/50 p-3.5 rounded-xl border border-[#1c2033]">
          {challenge?.description}
        </div>
      </div>

      {/* Key Topics / Tags */}
      {challenge?.tags && challenge.tags.length > 0 && (
        <div>
          <span className="text-[10.5px] font-mono font-semibold tracking-wider text-mist-500 uppercase block mb-2">
            TOPICS & ARCHITECTURE
          </span>
          <div className="flex flex-wrap gap-1.5">
            {challenge.tags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-md border border-[#1c2033] bg-[#0d0f1c] px-2.5 py-1 font-mono text-[11px] text-mist-400 hover:text-mist-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Evaluation Rubric Card - deep violet/indigo tinted panel with rounded corners and thin border */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10.5px] font-mono font-semibold tracking-wider text-mist-500 uppercase">
            AI EVALUATION RUBRIC
          </span>
          <button
            onClick={handleCopyRubric}
            className="flex items-center gap-1 text-[10px] font-mono text-mist-500 hover:text-mist-300 transition-colors"
            title="Copy rubric"
          >
            {copiedRubric ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="rounded-xl border border-violet-500/25 bg-gradient-to-b from-[#18112e]/70 via-[#100d22]/80 to-[#0d0f1c] p-4 text-[11.5px] font-mono text-mist-300 leading-relaxed shadow-[0_4px_24px_rgba(124,58,237,0.08)]">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-violet-500/20">
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
            <span className="font-semibold text-violet-300 text-xs">
              Autonomous Grading Matrix (Threshold: {challenge?.aiReview?.passingThreshold || 80}/100)
            </span>
          </div>
          <div className="whitespace-pre-line text-mist-300/90 font-mono text-[11.5px] leading-relaxed">
            {challenge?.aiReview?.rubric || challenge?.evaluationCriteria || "Standard autonomous architectural rubric applies."}
          </div>
        </div>
      </div>

      {/* Public Constraints and Test Overview */}
      <div>
        <span className="text-[10.5px] font-mono font-semibold tracking-wider text-mist-500 uppercase block mb-2">
          VERIFICATION CRITERIA
        </span>
        <div className="space-y-2 text-[11px] font-mono text-mist-400">
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#1c2033] bg-[#0d0f1c]">
            <span className="text-mist-400">Public Test Cases</span>
            <span className="text-emerald-400 font-semibold">4 suites</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#1c2033] bg-[#0d0f1c]">
            <span className="text-mist-400">Hidden Edge Cases (anti-cheat)</span>
            <span className="text-amber-400 font-semibold">2 hidden suites</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-[#1c2033] bg-[#0d0f1c]">
            <span className="text-mist-400">Execution Timeout</span>
            <span className="text-sky-400 font-semibold">5000ms max</span>
          </div>
        </div>
      </div>
    </div>
  );
}
