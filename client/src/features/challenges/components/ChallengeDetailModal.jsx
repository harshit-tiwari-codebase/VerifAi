import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Copy, Check, AlertCircle, ArrowUpRight } from "lucide-react";
import { getChallengeById } from "../api/challengeApi.js";

const DIFFICULTY_CONFIG = {
  easy: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
  medium: "text-amber-300 border-amber-500/30 bg-amber-500/10",
  hard: "text-rose-300 border-rose-500/30 bg-rose-500/10",
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
      <div className="relative flex flex-col w-full max-w-5xl h-[90vh] max-h-[850px] bg-[#0A0D15] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        {/* Modern Window Title Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#07090F]">
          <div className="flex items-center gap-3">
            {/* macOS-style window dots */}
            <div className="flex items-center gap-1.5 pr-2 border-r border-white/[0.08]">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-mist-100">
                {challenge?.title || "Challenge Details"}
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
            className="rounded-lg p-1 text-mist-500 hover:text-mist-200 hover:bg-white/[0.06] transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4 stroke-[1.75]" />
          </button>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <p className="text-xs font-mono text-mist-400">Loading sandbox environment...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-8 w-8 text-rose-400 mb-2 stroke-[1.5]" />
            <p className="text-xs font-mono text-rose-300">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 rounded-lg px-3 py-1.5 text-xs font-mono text-mist-400 hover:text-mist-100 hover:bg-white/[0.06] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
            {/* Left Column: Problem Brief */}
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-white/[0.08] overflow-y-auto p-6 bg-[#080B12] space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-mist-500 block mb-2">
                  Problem Specification
                </span>
                <div className="text-xs text-mist-300 whitespace-pre-line leading-relaxed">
                  {challenge.description}
                </div>
              </div>

              {challenge.tags && challenge.tags.length > 0 && (
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-mist-500 block mb-2">
                    Key Topics
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {challenge.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded border border-white/[0.06] bg-[#05070B] px-2 py-0.5 font-mono text-[11px] text-mist-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {challenge.executionType === "testcases" ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-mist-500">
                      Public Test Cases ({challenge.testCases?.length || 0})
                    </span>
                    <span className="text-[10px] font-mono text-mist-600">
                      Hidden tests run during verification
                    </span>
                  </div>

                  {challenge.testCases && challenge.testCases.length > 0 ? (
                    <div className="space-y-2">
                      {challenge.testCases.map((tc, idx) => (
                        <div
                          key={tc._id || idx}
                          className="rounded-lg border border-white/[0.05] bg-[#05070B] p-3 text-xs font-mono"
                        >
                          <div className="text-[10px] text-mist-500 mb-1">CASE #{idx + 1}</div>
                          {tc.input && (
                            <div className="text-mist-400 mb-1">
                              <span className="text-mist-600">Input: </span>
                              <span>{tc.input}</span>
                            </div>
                          )}
                          <div className="text-mist-400">
                            <span className="text-mist-600">Expected: </span>
                            <span className="text-emerald-400 font-semibold">{tc.expectedOutput}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-mist-500">No public test cases.</p>
                  )}
                </div>
              ) : (
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-mist-500 block mb-2">
                    AI Evaluation Rubric
                  </span>
                  <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3.5 text-xs text-mist-300 font-mono whitespace-pre-line leading-relaxed">
                    {challenge.evaluationCriteria}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Starter Code Preview */}
            <div className="flex flex-col h-full bg-[#04060A] overflow-hidden">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.08] bg-[#07090F]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-mist-400">starter_code.js</span>
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-mono text-mist-600 border border-white/[0.06] bg-[#0B0F19]">
                    read-only
                  </span>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-mono text-mist-400 hover:text-mist-200 hover:bg-white/[0.06] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400 stroke-[2]" />
                      <span className="text-emerald-400">Copied</span>
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
              <div className="flex-1 overflow-auto p-4">
                <pre className="font-mono text-xs text-mist-200 leading-relaxed whitespace-pre-wrap">
                  {challenge.starterCode || "// No starter code provided for this challenge."}
                </pre>
              </div>

              {/* Status Bar / Workspace CTA */}
              <div className="border-t border-white/[0.08] bg-[#07090F] px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-[11px] font-mono text-mist-400">
                    Judge0 Isolated Sandbox & AI Review active.
                  </span>
                </div>
                <Link
                  to={`/challenges/${challenge?.slug || challenge?._id || "rate-limiter"}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-mist-100 px-3.5 py-1.5 font-mono text-xs font-semibold text-black hover:bg-white transition-all shadow-md active:scale-95"
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
