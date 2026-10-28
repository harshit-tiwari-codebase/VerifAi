import React, { useMemo } from "react";
import {
  Check,
  Loader2,
  X,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function VerificationModal({
  isOpen,
  submission = null,
  status = "queued",
  error = null,
  onComplete,
  onCancel,
  onRetry,
}) {
  if (!isOpen) return null;

  const currentStatus = submission?.status || status;

  const isFailed =
    [
      "compilation_error",
      "runtime_error",
      "timeout",
      "provider_unavailable",
      "ai_evaluation_failed",
      "failed",
    ].includes(currentStatus) || !!error;

  const isCompleted = currentStatus === "completed";

  const passedCount = submission?.executionResult?.passedCount ?? 0;
  const totalCount = submission?.executionResult?.totalCount ?? 0;
  const finalScore = submission?.finalScore ?? null;
  const badgeIssued = submission?.badgeIssued ?? false;

  // Linear progress percentage
  const progressPercent = useMemo(() => {
    if (isFailed || isCompleted) return 100;
    if (currentStatus === "evaluating") return 75;
    if (currentStatus === "executing") return 45;
    return 15;
  }, [currentStatus, isCompleted, isFailed]);

  // Pipeline stages
  const stages = useMemo(
    () => [
      {
        id: "queued",
        label: "Pending in evaluation queue",
        isDone: ["executing", "evaluating", "completed"].includes(currentStatus),
        isActive: currentStatus === "queued",
      },
      {
        id: "executing",
        label:
          currentStatus === "executing"
            ? "Running sandbox test cases..."
            : totalCount > 0
            ? `Passed ${passedCount} of ${totalCount} test suites`
            : "Execution provider test run",
        isDone: ["evaluating", "completed"].includes(currentStatus),
        isActive: currentStatus === "executing",
      },
      {
        id: "evaluating",
        label:
          currentStatus === "evaluating"
            ? "Running AI architectural review..."
            : "AI rubric synthesis completed",
        isDone: currentStatus === "completed",
        isActive: currentStatus === "evaluating",
      },
      {
        id: "completed",
        label: isCompleted
          ? finalScore === null
            ? "AI review complete; manual review required"
            : `Score: ${finalScore}/100 ${badgeIssued ? "(Badge Issued)" : ""}`
          : "Finalizing score & cryptographic proof",
        isDone: isCompleted,
        isActive: false,
      },
    ],
    [currentStatus, totalCount, passedCount, isCompleted, finalScore, badgeIssued]
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-lg bg-[#18181F] border border-[#27272A] rounded-[14px] shadow-[0_0_24px_rgba(139,92,246,0.16)] overflow-hidden font-sans text-[#FAFAFA]">
        {/* Subtle linear progress bar with brand gradient */}
        <div className="w-full bg-[#14141B] h-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-out ${
              isFailed
                ? "bg-[#F87171]"
                : "bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA]"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#27272A] bg-[#14141B]">
          <div className="flex items-center gap-2">
            {!isCompleted && !isFailed && (
              <Loader2 className="h-4 w-4 text-[#8B5CF6] animate-spin" />
            )}
            {isCompleted && (
              <CheckCircle2 className="h-4 w-4 text-[#34D399]" />
            )}
            {isFailed && <XCircle className="h-4 w-4 text-[#F87171]" />}

            <h3 className="text-sm font-semibold text-[#FAFAFA]">
              {isCompleted
                ? "Submission Result"
                : isFailed
                ? "Evaluation Failed"
                : "Evaluating Submission"}
            </h3>
          </div>

          <button
            onClick={onCancel}
            className="p-1 rounded text-[#71717A] hover:text-[#FAFAFA] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Outcome Banner */}
          {isCompleted && (
            <div className="space-y-3 pb-2 border-b border-[#27272A]">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#34D399]">
                  Accepted
                </span>
                <span className="text-sm font-mono text-[#A1A1AA]">
                  Score:{" "}
                  <strong className="text-[#FAFAFA] text-base">
                    {finalScore === null ? "Manual review required" : finalScore}
                  </strong>
                  {finalScore !== null && "/100"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-[10px] bg-[#14141B] border border-[#27272A]">
                  <span className="text-[#71717A] block text-[11px]">
                    Test Cases
                  </span>
                  <span className="text-[#FAFAFA] font-semibold text-sm">
                    {passedCount} / {totalCount} Passed
                  </span>
                </div>
                <div className="p-2.5 rounded-[10px] bg-[#14141B] border border-[#27272A]">
                  <span className="text-[#71717A] block text-[11px]">
                    Verification
                  </span>
                  <span className="text-[#34D399] font-semibold text-sm">
                    {badgeIssued
                      ? "Badge Issued"
                      : finalScore === null
                      ? "Human review required"
                      : "Verified"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Failure banner */}
          {isFailed && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[#F87171] text-base font-bold">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>
                  {currentStatus === "compilation_error"
                    ? "Compile Error"
                    : currentStatus === "runtime_error"
                    ? "Runtime Error"
                    : currentStatus === "timeout"
                    ? "Time Limit Exceeded"
                    : "Evaluation Error"}
                </span>
              </div>
              <div className="p-3 rounded-[10px] bg-[#14141B] border border-[#27272A] text-xs font-mono text-[#F87171] whitespace-pre-wrap max-h-44 overflow-y-auto leading-relaxed">
                {submission?.errorMessage ||
                  submission?.executionResult?.compileOutput ||
                  error ||
                  "An error occurred while evaluating your submission."}
              </div>
            </div>
          )}

          {/* Steps List */}
          <div className="space-y-2 py-1">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="flex items-center justify-between py-1.5 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {stage.isDone ? (
                    <div className="h-4 w-4 rounded-full bg-[#34D399]/15 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-[#34D399]" />
                    </div>
                  ) : stage.isActive ? (
                    <div className="h-4 w-4 flex items-center justify-center">
                      <Loader2 className="h-3.5 w-3.5 text-[#8B5CF6] animate-spin" />
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-full flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#52525B]" />
                    </div>
                  )}

                  <span
                    className={`${
                      stage.isDone
                        ? "text-[#FAFAFA]"
                        : stage.isActive
                        ? "text-[#A78BFA] font-medium"
                        : "text-[#71717A]"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>

                <span className="font-mono text-[11px] text-[#71717A]">
                  {stage.isDone
                    ? "Passed"
                    : stage.isActive
                    ? "Running"
                    : "Pending"}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#27272A] flex items-center justify-end gap-2.5">
            {isFailed && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-xs font-mono font-medium bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retry Submission</span>
              </button>
            )}

            {isCompleted && (
              <button
                type="button"
                onClick={() => onComplete && onComplete(submission)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-xs font-mono font-medium bg-[#8B5CF6] hover:bg-[#7C3AED] text-white transition-colors shadow-[0_0_24px_rgba(139,92,246,0.16)]"
              >
                <span>View Full AI Breakdown</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}

            {!isCompleted && !isFailed && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-xs font-mono text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A] transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
