import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Copy, Check, AlertCircle, ArrowUpRight } from "lucide-react";
import { getChallengeById } from "../api/challengeApi.js";

const DIFFICULTY_CONFIG = {
  easy: "text-[#4ADE80] border-[#4ADE80]/30 bg-[#4ADE80]/10",
  medium: "text-[#FBBF24] border-[#FBBF24]/30 bg-[#FBBF24]/10",
  hard: "text-[#F87171] border-[#F87171]/30 bg-[#F87171]/10",
};

export default function ChallengeDetailModal({ challengeId, isOpen, onClose }) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !challengeId) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    getChallengeById(challengeId)
      .then((res) => {
        if (!mounted) return;
        const data = res.challenge;
        setChallenge(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load challenge details");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen, challengeId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(challenge?.starterCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col w-full max-w-5xl h-[90vh] max-h-[850px] bg-[#18181F] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden">
        {/* Modern Window Title Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#27272A] bg-[#14141B]">
          <div className="flex items-center gap-3">
            {/* macOS-style window dots */}
            <div className="flex items-center gap-1.5 pr-2 border-r border-[#27272A]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#FAFAFA]">
                {challenge?.title || "Challenge Specification"}
              </span>
              {challenge?.difficulty && (
                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-mono border capitalize ${
                    DIFFICULTY_CONFIG[challenge.difficulty] || ""
                  }`}
                >
                  {challenge.difficulty}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#20202A] transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 stroke-[1.75]" />
          </button>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-[#14141B]">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#8B5CF6] border-t-transparent" />
            <p className="text-xs font-mono text-[#A1A1AA]">Loading sandbox environment...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#14141B]">
            <AlertCircle className="h-8 w-8 text-[#F87171] mb-2 stroke-[1.5]" />
            <p className="text-xs font-mono text-[#F87171]">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 rounded-lg px-3 py-1.5 text-xs font-mono text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
            {/* Left Column: Problem Brief */}
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-[#27272A] overflow-y-auto p-6 bg-[#14141B] space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] block mb-2 font-semibold">
                  Problem Specification
                </span>
                <div className="text-xs text-[#A1A1AA] whitespace-pre-line leading-relaxed">
                  {challenge.description}
                </div>
              </div>

              {challenge.tags && challenge.tags.length > 0 && (
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] block mb-2 font-semibold">
                    Key Topics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {challenge.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded border border-[#27272A] bg-[#0D0D12] px-2 py-0.5 font-mono text-[11px] text-[#A1A1AA]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Test cases (shown for 'both' and 'testcases') */}
              {(challenge.executionType === "both" || challenge.executionType === "testcases" || !challenge.executionType) && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] font-semibold">
                      Public Test Cases ({challenge.testCases?.length || 0})
                    </span>
                    <span className="text-[10px] font-mono text-[#71717A]">
                      Hidden tests run during verification
                    </span>
                  </div>

                  {challenge.testCases && challenge.testCases.length > 0 ? (
                    <div className="space-y-2">
                      {challenge.testCases.map((tc, idx) => (
                        <div
                          key={tc._id || idx}
                          className="rounded-lg border border-[#27272A] bg-[#0D0D12] p-3 text-xs font-mono"
                        >
                          <div className="text-[10px] text-[#71717A] mb-1 font-semibold">CASE #{idx + 1}</div>
                          {tc.input && (
                            <div className="text-[#A1A1AA] mb-1">
                              <span className="text-[#71717A]">Input: </span>
                              <span className="text-[#FAFAFA]">{tc.input}</span>
                            </div>
                          )}
                          <div className="text-[#A1A1AA]">
                            <span className="text-[#71717A]">Expected: </span>
                            <span className="text-[#34D399] font-semibold">{tc.expectedOutput}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-[#71717A]">No public test cases.</p>
                  )}
                </div>
              )}

              {/* AI Evaluation Rubric (shown for 'both' and 'review_only') */}
              {(challenge.executionType === "both" || challenge.executionType === "review_only") && challenge.evaluationCriteria && (
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#71717A] block mb-2 font-semibold">
                    AI Evaluation Rubric
                  </span>
                  <div className="rounded-lg border border-[#8B5CF6]/30 bg-[#211635] p-3.5 text-xs text-[#C4B5FD] font-mono whitespace-pre-line leading-relaxed">
                    {challenge.evaluationCriteria}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Starter Code Preview */}
            <div className="flex flex-col h-full bg-[#0D0D12] overflow-hidden">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#27272A] bg-[#111116]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#A1A1AA]">starter_code.js</span>
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-mono text-[#71717A] border border-[#27272A] bg-[#14141B]">
                    read-only
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-mono text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-[#34D399] stroke-[2]" />
                      <span className="text-[#34D399]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 stroke-[1.5]" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Starter Code Preview */}
              <div className="flex-1 overflow-auto p-4 bg-[#0D0D12]">
                <pre className="font-mono text-xs text-[#E4E4E7] leading-relaxed whitespace-pre-wrap">
                  {challenge.starterCode || "// No starter code provided for this challenge."}
                </pre>
              </div>

              {/* Status Bar / Workspace CTA */}
              <div className="border-t border-[#27272A] bg-[#14141B] px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] shrink-0" />
                  <span className="text-[11px] font-mono text-[#A1A1AA]">
                    Judge0 Isolated Sandbox & AI Review active.
                  </span>
                </div>
                <Link
                  to={`/challenges/${challenge?.slug || challenge?._id || "rate-limiter"}`}
                  className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#8B5CF6] hover:bg-[#7C3AED] px-4 py-2 font-mono text-xs font-semibold text-white transition-all shadow-md active:scale-95"
                >
                  <span>Open Interactive Workspace</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
