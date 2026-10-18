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

  // Clean, minimal pipeline stages
  const stages = useMemo(
    () => [
      {
        id: "queued",
        label: "Pending in queue",
        isDone: ["executing", "evaluating", "completed"].includes(currentStatus),
        isActive: currentStatus === "queued",
      },
      {
        id: "executing",
        label:
          currentStatus === "executing"
            ? "Running test cases..."
            : totalCount > 0
            ? `Passed ${passedCount} of ${totalCount} test cases`
            : "Test execution",
        isDone: ["evaluating", "completed"].includes(currentStatus),
        isActive: currentStatus === "executing",
      },
      {
        id: "evaluating",
        label:
          currentStatus === "evaluating"
            ? "Running AI architectural review..."
            : "AI review completed",
        isDone: currentStatus === "completed",
        isActive: currentStatus === "evaluating",
      },
      {
        id: "completed",
        label: isCompleted
          ? `Score: ${finalScore}/100 ${badgeIssued ? "(Badge Earned)" : ""}`
          : "Finalizing score",
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-lg bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl shadow-2xl overflow-hidden font-sans text-neutral-200">
        {/* Subtle linear progress bar */}
        <div className="w-full bg-[#262626] h-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-out ${
              isFailed
                ? "bg-rose-500"
                : isCompleted
                ? "bg-emerald-500"
                : "bg-emerald-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            {!isCompleted && !isFailed && (
              <Loader2 className="h-4 w-4 text-neutral-400 animate-spin" />
            )}
            {isCompleted && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            )}
            {isFailed && <XCircle className="h-4 w-4 text-rose-500" />}

            <h3 className="text-sm font-semibold text-neutral-100">
              {isCompleted
                ? "Submission Result"
                : isFailed
                ? "Submission Failed"
                : "Judging Submission"}
            </h3>
          </div>

          <button
            onClick={onCancel}
            className="p-1 rounded text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* LeetCode-style Outcome Banner */}
          {isCompleted && (
            <div className="space-y-3 pb-2 border-b border-[#2A2A2A]">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-emerald-400">
                  Accepted
                </span>
                <span className="text-sm font-mono text-neutral-400">
                  Score:{" "}
                  <strong className="text-white text-base">
                    {finalScore}
                  </strong>
                  /100
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#242424] border border-[#2E2E2E]">
                  <span className="text-neutral-400 block text-[11px]">
                    Test Cases
                  </span>
                  <span className="text-neutral-100 font-semibold text-sm">
                    {passedCount} / {totalCount} Passed
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#242424] border border-[#2E2E2E]">
                  <span className="text-neutral-400 block text-[11px]">
                    Status
                  </span>
                  <span className="text-emerald-400 font-semibold text-sm">
                    {badgeIssued ? "Badge Earned" : "Verified"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Failure banner */}
          {isFailed && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-rose-400 text-base font-bold">
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
              <div className="p-3 rounded-lg bg-[#242424] border border-[#2E2E2E] text-xs font-mono text-rose-300 whitespace-pre-wrap max-h-44 overflow-y-auto leading-relaxed">
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
                    <div className="h-4 w-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                  ) : stage.isActive ? (
                    <div className="h-4 w-4 flex items-center justify-center">
                      <Loader2 className="h-3.5 w-3.5 text-neutral-400 animate-spin" />
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-full flex items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
                    </div>
                  )}

                  <span
                    className={`${
                      stage.isDone
                        ? "text-neutral-200"
                        : stage.isActive
                        ? "text-white font-medium"
                        : "text-neutral-500"
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>

                <span className="font-mono text-[11px] text-neutral-500">
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
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#2A2A2A]">
            {isFailed ? (
              <>
                <button
                  onClick={onCancel}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  Close
                </button>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#2C2C2C] hover:bg-[#383838] text-neutral-100 transition-colors border border-[#3A3A3A]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Try Again</span>
                  </button>
                )}
              </>
            ) : isCompleted ? (
              <button
                onClick={() => onComplete && onComplete(submission)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                <span>View Full Scorecard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={onCancel}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Run in Background
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
