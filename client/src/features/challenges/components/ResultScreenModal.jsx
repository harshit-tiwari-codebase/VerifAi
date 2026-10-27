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

  const scoreAvailable =
    typeof aiReviewData?.finalScore === "number" ||
    typeof aiReviewData?.score === "number";
  const finalScore =
    typeof aiReviewData?.finalScore === "number"
      ? aiReviewData.finalScore
      : typeof aiReviewData?.score === "number"
      ? aiReviewData.score
      : null;

  const passingThreshold = aiReviewData?.threshold ?? aiReviewData?.passingThreshold ?? 70;
  const badgeIssued = !!(
    aiReviewData?.badgeIssued ||
    (scoreAvailable && aiReviewData?.badgeEligible && finalScore >= passingThreshold)
  );

  const totalTests = aiReviewData?.executionResult?.totalCount ?? 0;
  const passedTests = aiReviewData?.executionResult?.passedCount ?? 0;
  const correctness =
    aiReviewData?.correctness ??
    (totalTests > 0 ? (100 * passedTests) / totalTests : 0);
  const subscores = aiReviewData?.subscores || {
    correctness,
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
          colors: ["#8B5CF6", "#7C3AED", "#A78BFA", "#34D399", "#FBBF24"],
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
      const current = Math.floor(ease * (finalScore ?? 0));
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
    >
      <div className="relative flex flex-col w-full max-w-3xl bg-[#18181F] border border-[#27272A] rounded-[14px] shadow-[0_0_24px_rgba(139,92,246,0.16)] overflow-hidden my-auto">
        {/* Window Chrome */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#27272A] bg-[#14141B] select-none">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA] font-semibold">
              SERVER EVALUATION VERDICT
            </span>
            {badgeIssued && (
              <span className="flex items-center gap-1 rounded-full border border-[#34D399]/30 bg-[#34D399]/10 px-2 py-0.5 font-mono text-[10.5px] text-[#34D399]">
                <Flame className="h-3 w-3 text-[#34D399] fill-[#34D399]" />
                <span>Verified Passed</span>
              </span>
            )}
          </div>

          <button
            onClick={onBackToChallenges}
            className="p-1 rounded text-[#71717A] hover:text-[#FAFAFA] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Top Score Banner: Circle ring + Sub-scores */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 rounded-[12px] border border-[#27272A] bg-[#14141B]">
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
                    className="text-[#27272A]"
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
                      !scoreAvailable
                        ? "text-[#71717A]"
                        : animatedScore >= passingThreshold
                        ? "text-[#34D399]"
                        : animatedScore >= 50
                        ? "text-[#FBBF24]"
                        : "text-[#F87171]"
                    }`}
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold font-mono text-[#FAFAFA] font-display">
                    {scoreAvailable ? animatedScore : "—"}
                  </span>
                  <span className="text-[10px] font-mono text-[#71717A] tracking-wider">
                    {scoreAvailable ? "/ 100 POINTS" : "MANUAL REVIEW"}
                  </span>
                </div>
              </div>

              <div className="mt-2 text-center">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold border ${
                    badgeIssued
                      ? "border-[#34D399]/30 bg-[#34D399]/10 text-[#34D399]"
                      : "border-[#FBBF24]/30 bg-[#FBBF24]/10 text-[#FBBF24]"
                  }`}
                >
                  {badgeIssued
                    ? "PASSED & BADGE ISSUED"
                    : scoreAvailable
                    ? `SCORE ${finalScore} — THRESHOLD ${passingThreshold}`
                    : "AI REVIEW ONLY — NO AUTOMATED SCORE"}
                </span>
              </div>
            </div>

            {/* Sub-score Progress Bars */}
            <div className="md:col-span-8 space-y-3 font-mono text-xs">
              {totalTests > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[#A1A1AA]">
                    <span>Correctness (automated tests)</span>
                    <span className="text-[#34D399] font-semibold">
                      {Math.round(subscores.correctness ?? 0)}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#20202A] overflow-hidden border border-[#27272A]">
                    <div
                      className="h-full bg-[#34D399] rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, Math.round(subscores.correctness ?? 0))}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>AI review: Code quality (advisory)</span>
                  <span className="text-[#A78BFA] font-semibold">
                    {Math.round(subscores.codeQuality ?? 0)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#20202A] overflow-hidden border border-[#27272A]">
                  <div
                    className="h-full bg-[#8B5CF6] rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.round(subscores.codeQuality ?? 0))}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>AI review: Efficiency (advisory)</span>
                  <span className="text-[#60A5FA] font-semibold">
                    {Math.round(subscores.efficiency ?? 0)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#20202A] overflow-hidden border border-[#27272A]">
                  <div
                    className="h-full bg-[#60A5FA] rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.round(subscores.efficiency ?? 0))}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>AI review: Edge cases (advisory)</span>
                  <span className="text-[#FBBF24] font-semibold">
                    {Math.round(subscores.edgeCases ?? 0)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#20202A] overflow-hidden border border-[#27272A]">
                  <div
                    className="h-full bg-[#FBBF24] rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, Math.round(subscores.edgeCases ?? 0))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Badge Section */}
          {badgeIssued ? (
            <div className="rounded-[12px] border border-[#8B5CF6]/30 bg-[#211635] p-4 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-[10px] bg-[#38245C] border border-[#8B5CF6]/40 flex items-center justify-center shrink-0">
                    <Award className="h-6 w-6 text-[#C4B5FD]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[#34D399] text-[11px] font-semibold uppercase">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Tamper-Proof Credential Issued</span>
                    </div>
                    <div className="text-sm font-bold text-[#FAFAFA]">
                      {challengeTitle} Badge
                    </div>
                    <div className="text-[10px] text-[#A1A1AA]">
                      ID: <span className="font-semibold text-[#C4B5FD]">{issueId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-mono bg-[#14141B] hover:bg-[#20202A] text-[#FAFAFA] border border-[#27272A] transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#34D399]" />
                        <span className="text-[#34D399]">Copied</span>
                      </>
                    ) : !scoreAvailable ? (
                      <div className="rounded-[12px] border border-[#FBBF24]/30 bg-[#FBBF24]/10 p-4 font-mono text-xs flex items-center gap-2.5 text-[#FBBF24]">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>
                          AI feedback is advisory only. This challenge requires human review; no score or badge was issued.
                        </span>
                      </div>
                    ) : (
                      <>
                        <Share2 className="h-3.5 w-3.5 text-[#A78BFA]" />
                        <span>Share Badge</span>
                      </>
                    )}
                  </button>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-mono font-medium bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[12px] border border-[#FBBF24]/30 bg-[#FBBF24]/10 p-4 font-mono text-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-[#FBBF24]">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  Badge threshold ({passingThreshold} pts) not reached. Review recommendations below and retry.
                </span>
              </div>
              <button
                type="button"
                onClick={onTryAgain}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[#20202A] hover:bg-[#27272A] text-[#FAFAFA] border border-[#30303A] text-xs font-mono shrink-0 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Retry Now</span>
              </button>
            </div>
          )}

          {/* AI Feedback: Strengths & Weaknesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            {/* Strengths */}
            <div className="rounded-[12px] border border-[#27272A] bg-[#14141B] p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[#34D399] font-semibold text-[11px] uppercase tracking-wider">
                <Check className="h-3.5 w-3.5" />
                <span>Verified Strengths</span>
              </div>
              {strengths.length > 0 ? (
                <ul className="space-y-1.5 text-mist-200">
                  {strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11.5px] leading-relaxed">
                      <span className="text-[#34D399] mt-0.5">•</span>
                      <span className="text-[#FAFAFA]">{str}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#71717A] text-[11px]">
                  Solid modular solution design with constant time consumption.
                </p>
              )}
            </div>

            {/* Suggestions */}
            <div className="rounded-[12px] border border-[#27272A] bg-[#14141B] p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-[#A78BFA] font-semibold text-[11px] uppercase tracking-wider">
                <BrainCircuit className="h-3.5 w-3.5" />
                <span>Key Takeaways</span>
              </div>
              {suggestions.length > 0 ? (
                <ul className="space-y-1.5 text-mist-200">
                  {suggestions.map((sug, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11.5px] leading-relaxed">
                      <span className="text-[#A78BFA] mt-0.5">•</span>
                      <span className="text-[#FAFAFA]">{sug}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#71717A] text-[11px]">
                  Review boundary conditions and consider explicit type coercion on numeric bounds.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#27272A] bg-[#14141B]">
          <button
            type="button"
            onClick={onBackToChallenges}
            className="px-3.5 py-2 rounded-[10px] text-xs font-mono text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A] transition-colors"
          >
            ← Back to Challenges
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onTryAgain}
              className="px-3.5 py-2 rounded-[10px] text-xs font-mono text-[#E4E4E7] hover:text-white bg-[#20202A] hover:bg-[#27272A] border border-[#30303A] transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Try Again</span>
            </button>
            {onNextChallenge && (
              <button
                type="button"
                onClick={onNextChallenge}
                className="px-4 py-2 rounded-[10px] text-xs font-mono font-medium text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors shadow-[0_0_24px_rgba(139,92,246,0.16)] flex items-center gap-1.5"
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
