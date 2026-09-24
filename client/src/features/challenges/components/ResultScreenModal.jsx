import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Award,
  Share2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  Flame,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ResultScreenModal({
  isOpen,
  aiReviewData,
  onTryAgain,
  onBackToChallenges,
  onNextChallenge,
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const finalScore = aiReviewData?.finalScore ?? 92;
  const passingThreshold = aiReviewData?.passingThreshold ?? 80;
  const isPassed = finalScore >= passingThreshold;

  // Animated score counter + Confetti burst
  useEffect(() => {
    if (!isOpen) {
      setAnimatedScore(0);
      return;
    }

    // Single burst confetti in brand colors if passed
    if (isPassed) {
      try {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#9333EA", "#C084FC", "#38BDF8", "#34D399", "#F59E0B"],
          disableForReducedMotion: true,
        });
      } catch {
        // Fallback gracefully
      }
    }

    let start = 0;
    const duration = 1200; // 1.2s
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * finalScore);
      setAnimatedScore(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isOpen, finalScore, isPassed]);

  if (!isOpen) return null;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative flex flex-col w-full max-w-3xl bg-[#0A0D15] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Window Chrome */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#07090F] select-none">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-mist-300 font-semibold">
              EVALUATION VERDICT
            </span>
            <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10.5px] text-amber-300">
              <Flame className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span>3rd solve this week 🔥</span>
            </span>
          </div>

          <button
            onClick={onBackToChallenges}
            className="p-1 rounded text-mist-500 hover:text-mist-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Top Score Banner: Circle ring + Sub-scores */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 rounded-2xl border border-white/[0.08] bg-[#0c0d12]">
            {/* Circular Ring (Score) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/[0.06]"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`transition-all duration-300 ease-out ${
                      animatedScore >= passingThreshold
                        ? "text-emerald-400"
                        : animatedScore >= 60
                        ? "text-amber-400"
                        : "text-rose-500"
                    }`}
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold font-mono text-mist-100 font-display">
                    {animatedScore}
                  </span>
                  <span className="text-[10px] font-mono text-mist-500 tracking-wider">
                    / 100 POINTS
                  </span>
                </div>
              </div>

              <div className="mt-2 text-center">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold border ${
                    isPassed
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                  }`}
                >
                  {isPassed ? "PASSED VERIFICATION" : `SCORE ${finalScore} — YOU NEED ${passingThreshold}`}
                </span>
              </div>
            </div>

            {/* Sub-score Progress Bars */}
            <div className="md:col-span-8 space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-mist-400">
                  <span>Correctness</span>
                  <span className="text-emerald-400 font-semibold">
                    {aiReviewData?.subscores?.correctness ?? 96}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#07080c] overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${aiReviewData?.subscores?.correctness ?? 96}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-mist-400">
                  <span>Code Quality & Idioms</span>
                  <span className="text-violet-300 font-semibold">
                    {aiReviewData?.subscores?.codeQuality ?? 92}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#07080c] overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full bg-violet-400 rounded-full transition-all duration-1000"
                    style={{ width: `${aiReviewData?.subscores?.codeQuality ?? 92}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-mist-400">
                  <span>Algorithmic Efficiency (Time / Memory)</span>
                  <span className="text-sky-400 font-semibold">
                    {aiReviewData?.subscores?.efficiency ?? 94}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#07080c] overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full bg-sky-400 rounded-full transition-all duration-1000"
                    style={{ width: `${aiReviewData?.subscores?.efficiency ?? 94}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-mist-400">
                  <span>Edge Cases & Boundary Hardening</span>
                  <span className="text-amber-400 font-semibold">
                    {aiReviewData?.subscores?.edgeCases ?? 86}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#07080c] overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-1000"
                    style={{ width: `${aiReviewData?.subscores?.edgeCases ?? 86}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Badge Issued Card (if passed) with shine sweep animation */}
          {isPassed ? (
            <div className="purple-comp relative overflow-hidden rounded-xl p-4 font-mono shadow-[0_0_30px_rgba(147,51,234,0.2)]">
              {/* Shine sweep overlay */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-xl bg-violet-500/25 border border-violet-400/40 flex items-center justify-center shrink-0">
                    <Award className="h-6 w-6 text-violet-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold uppercase">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Tamper-Proof Credential Issued</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5 font-display">
                      {aiReviewData?.badge?.name || "Token Bucket Architect"}
                    </div>
                    <div className="text-[10.5px] text-mist-400">
                      ID: {aiReviewData?.badge?.issueId || "VRF-2026-8942-TB"} · Verifiable by recruiters
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="btn-frosted-glass flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-mist-300 hover:text-white transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Share Proof</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 font-mono text-xs text-amber-200">
              <div className="font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span>Almost there! Focus on edge case boundary protection</span>
              </div>
              <p className="text-mist-400 text-[11.5px] leading-relaxed">
                Your time complexity and concurrency logic are strong. Double check clock jitter handling and non-integer inputs to push your score past 80.
              </p>
            </div>
          )}

          {/* AI Review Notes Cards */}
          <div className="space-y-2">
            <span className="text-[10.5px] font-mono font-semibold tracking-wider text-mist-500 uppercase block">
              SENIOR AI REVIEW CRITIQUE
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(aiReviewData?.reviewNotes || []).map((note, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.06] bg-[#07080c] p-3.5 font-mono text-[11.5px] text-mist-300 leading-relaxed"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-violet-400 mt-0.5 shrink-0 font-bold">
                      0{idx + 1}.
                    </span>
                    <span>{note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-[#07090F] border-t border-white/[0.08] select-none text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToChallenges}
              className="btn-frosted-glass px-3.5 py-1.5 rounded-lg text-mist-400 hover:text-white transition-colors"
            >
              ← Back to Challenges
            </button>

            <button
              onClick={handleShare}
              className="btn-frosted-glass flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-mist-400 hover:text-white transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copiedLink ? "Link Copied!" : "Share Result"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isPassed ? (
              <button
                onClick={onTryAgain}
                className="btn-specular-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-white font-semibold transition-all shadow-lg active:scale-95"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Try Again</span>
              </button>
            ) : (
              <>
                <button
                  onClick={onTryAgain}
                  className="btn-frosted-glass px-3.5 py-2 rounded-lg text-mist-300 hover:text-white transition-colors"
                >
                  Refactor Code
                </button>
                <button
                  onClick={onNextChallenge}
                  className="btn-specular-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-white font-semibold transition-all shadow-lg active:scale-95"
                >
                  <span>Next Challenge</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
