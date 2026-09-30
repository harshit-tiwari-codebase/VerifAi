import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Share2,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Check,
  X,
  Flame,
  BrainCircuit,
  AlertCircle,
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

  const finalScore =
    typeof aiReviewData?.finalScore === "number"
      ? aiReviewData.finalScore
      : typeof aiReviewData?.score === "number"
      ? aiReviewData.score
      : 0;

  const passingThreshold = aiReviewData?.threshold ?? aiReviewData?.passingThreshold ?? 70;
  const badgeIssued = !!(aiReviewData?.badgeIssued || (aiReviewData?.badgeEligible && finalScore >= passingThreshold));
  const isPassed = finalScore >= passingThreshold;

  const subscores = aiReviewData?.subscores || {
    correctness: aiReviewData?.correctness ?? 0,
    codeQuality: aiReviewData?.aiEvaluation?.codeQuality ?? 0,
    efficiency: aiReviewData?.aiEvaluation?.efficiency ?? 0,
    edgeCases: aiReviewData?.aiEvaluation?.edgeCases ?? 0,
  };

  const strengths =
    aiReviewData?.aiEvaluation?.strengths ||
    aiReviewData?.strengths ||
    [];

  const suggestions =
    aiReviewData?.aiEvaluation?.suggestions ||
    aiReviewData?.suggestions ||
    [];

  const weaknesses =
    aiReviewData?.aiEvaluation?.weaknesses ||
    aiReviewData?.weaknesses ||
    [];

  // Animated score counter + Confetti burst
  useEffect(() => {
    if (!isOpen) {
      setAnimatedScore(0);
      return;
    }

    if (badgeIssued) {
      try {
        confetti({
          particleCount: 50,
          spread: 55,
          origin: { y: 0.6 },
          colors: ["#9333EA", "#C084FC", "#38BDF8", "#34D399", "#F59E0B"],
          disableForReducedMotion: true,
        });
      } catch {
        // Confetti unavailable
      }
    }

    const duration = 1000;
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
  }, [isOpen, finalScore, badgeIssued]);

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

  const issueId =
    aiReviewData?.badge?.issueId ||
    (aiReviewData?._id
      ? `VRF-${aiReviewData._id.toString().slice(-6).toUpperCase()}`
      : `VRF-SUB`);

  const challengeTitle =
    aiReviewData?.challenge?.title ||
    aiReviewData?.title ||
    "Challenge";

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
              SERVER EVALUATION VERDICT (v1)
            </span>
            {badgeIssued && (
              <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10.5px] text-emerald-300">
                <Flame className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                <span>Verified Passed</span>
              </span>
            )}
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
                        : animatedScore >= 50
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
                    badgeIssued
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                  }`}
                >
                  {badgeIssued
                    ? "PASSED & BADGE ISSUED"
                    : `SCORE ${finalScore} — THRESHOLD ${passingThreshold}`}
                </span>
              </div>
            </div>

            {/* Sub-score Progress Bars */}
            <div className="md:col-span-8 space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-mist-400">
                  <span>Correctness (70%)</span>
                  <span className="text-emerald-400 font-semibold">
                    {Math.round(subscores.correctness ?? 0)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#07080c] overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.round(subscores.correctness ?? 0))}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-mist-400">
                  <span>Code Quality & Idioms (15%)</span>
                  <span className="text-violet-300 font-semibold">
                    {Math.round(subscores.codeQuality ?? 0)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#07080c] overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full bg-violet-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.round(subscores.codeQuality ?? 0))}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-mist-400">
                  <span>Algorithmic Efficiency (10%)</span>
                  <span className="text-sky-400 font-semibold">
                    {Math.round(subscores.efficiency ?? 0)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#07080c] overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full bg-sky-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.round(subscores.efficiency ?? 0))}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-mist-400">
                  <span>Edge Cases & Boundary (5%)</span>
                  <span className="text-amber-400 font-semibold">
                    {Math.round(subscores.edgeCases ?? 0)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#07080c] overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.round(subscores.edgeCases ?? 0))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Badge Section */}
          {badgeIssued ? (
            <div className="rounded-xl border border-violet-500/25 bg-[#0e1017] p-4 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-xl bg-violet-500/15 border border-violet-400/30 flex items-center justify-center shrink-0">
                    <Award className="h-6 w-6 text-violet-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold uppercase">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Tamper-Proof Credential Issued</span>
                    </div>
                    <div className="text-sm font-semibold text-white mt-0.5 font-display">
                      {aiReviewData?.badge?.name || `${challengeTitle} Architect`}
                    </div>
                    <div className="text-[10.5px] text-mist-400">
                      ID: {issueId} · Verifiable proof of skill
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
                <AlertCircle className="h-4 w-4" />
                <span>Badge Not Eligible</span>
              </div>
              <p className="text-mist-400 text-[11.5px] leading-relaxed">
                A verified credential requires passing all test cases and achieving a composite score of at least {passingThreshold}.
              </p>
            </div>
          )}

          {/* AI Review Notes Cards */}
          {(strengths.length > 0 || suggestions.length > 0 || weaknesses.length > 0) && (
            <div className="space-y-3 font-mono text-xs">
              <span className="text-[10.5px] font-semibold tracking-wider text-mist-500 uppercase block">
                AI ARCHITECTURAL OBSERVATIONS
              </span>

              {strengths.length > 0 && (
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                  <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    <span>Strengths</span>
                  </div>
                  <ul className="list-disc list-inside text-mist-300 text-[11.5px] space-y-1">
                    {strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {weaknesses.length > 0 && (
                <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
                  <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Areas for Improvement</span>
                  </div>
                  <ul className="list-disc list-inside text-mist-300 text-[11.5px] space-y-1">
                    {weaknesses.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="p-3.5 rounded-xl border border-sky-500/20 bg-sky-500/5 space-y-1">
                  <div className="text-sky-400 font-semibold flex items-center gap-1.5">
                    <BrainCircuit className="h-3.5 w-3.5" />
                    <span>Architectural Suggestions</span>
                  </div>
                  <ul className="list-disc list-inside text-mist-300 text-[11.5px] space-y-1">
                    {suggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-[#07090F]">
          <button
            onClick={onTryAgain}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono text-mist-400 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Refactor Solution</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToChallenges}
              className="px-4 py-2 rounded-lg text-xs font-mono text-mist-300 hover:text-white bg-white/[0.05] border border-white/[0.1] transition-colors"
            >
              All Challenges
            </button>
            {onNextChallenge && (
              <button
                onClick={onNextChallenge}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-colors"
              >
                <span>Next Challenge</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
