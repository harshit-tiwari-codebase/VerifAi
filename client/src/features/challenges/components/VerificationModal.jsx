import React, { useMemo } from "react";
import {
  Check,
  Cpu,
  BrainCircuit,
  Award,
  Clock,
  AlertTriangle,
  X,
  Loader2,
  RefreshCw,
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
  const isFailed = [
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

  // Stages matching the real backend lifecycle (§8)
  const stages = useMemo(
    () => [
      {
        id: "queued",
        label: "Queueing & Ingestion",
        icon: Clock,
        isActive: currentStatus === "queued",
        isDone: ["executing", "evaluating", "completed"].includes(currentStatus),
        details: "Dispatched to background execution queue",
      },
      {
        id: "executing",
        label: "Isolated Sandbox Execution",
        icon: Cpu,
        isActive: currentStatus === "executing",
        isDone: ["evaluating", "completed"].includes(currentStatus),
        details:
          currentStatus === "executing"
            ? "Running tests against server test suite..."
            : totalCount > 0
            ? `${passedCount}/${totalCount} tests passed`
            : "Tests evaluated",
      },
      {
        id: "evaluating",
        label: "AI Architectural Review",
        icon: BrainCircuit,
        isActive: currentStatus === "evaluating",
        isDone: currentStatus === "completed",
        details:
          currentStatus === "evaluating"
            ? "Evaluating code quality, efficiency, and edge cases..."
            : isCompleted
            ? "Schema-validated review complete"
            : "Awaiting test execution",
      },
      {
        id: "completed",
        label: "Scoring & Badge Verification",
        icon: Award,
        isActive: isCompleted,
        isDone: isCompleted,
        details: isCompleted
          ? `Final Score: ${finalScore}/100 · ${
              badgeIssued ? "Tamper-Proof Badge Issued" : "Badge Requirements Not Met"
            }`
          : "Finalizing scorecard",
      },
    ],
    [currentStatus, totalCount, passedCount, isCompleted, finalScore, badgeIssued]
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in"
    >
      <div className="relative flex flex-col w-full max-w-2xl bg-[#0A0D15] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#07090F]">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-mono text-xs text-mist-400 font-semibold tracking-wider uppercase">
              VERIFAI VERIFICATION PIPELINE
            </span>
          </div>

          <button
            onClick={onCancel}
            className="p-1 rounded text-mist-500 hover:text-mist-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Failure banner if terminal failure */}
          {isFailed ? (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-rose-300">
                <AlertTriangle className="h-5 w-5" />
                <span>
                  {currentStatus === "compilation_error"
                    ? "Compilation / Syntax Error"
                    : currentStatus === "runtime_error"
                    ? "Runtime Execution Error"
                    : currentStatus === "timeout"
                    ? "Execution Timeout (Time Limit Exceeded)"
                    : currentStatus === "provider_unavailable"
                    ? "Sandbox Provider Unavailable"
                    : currentStatus === "ai_evaluation_failed"
                    ? "AI Architectural Review Failed"
                    : "Submission Evaluation Failed"}
                </span>
              </div>
              <p className="font-mono text-xs text-rose-300/90 whitespace-pre-wrap leading-relaxed">
                {submission?.errorMessage ||
                  submission?.executionResult?.compileOutput ||
                  error ||
                  "An infrastructure or execution error prevented this submission from being verified. No score or credential was issued."}
              </p>
            </div>
          ) : (
            /* Progress Stages driven by real lifecycle */
            <div className="space-y-3">
              {stages.map((st) => {
                const IconComponent = st.icon;
                return (
                  <div
                    key={st.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      st.isDone
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                        : st.isActive
                        ? "border-violet-500/40 bg-violet-500/10 text-violet-200 shadow-sm"
                        : "border-white/[0.04] bg-[#07080c] text-mist-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                          st.isDone
                            ? "bg-emerald-500/20 text-emerald-400"
                            : st.isActive
                            ? "bg-violet-500/20 text-violet-300"
                            : "bg-white/[0.04] text-mist-600"
                        }`}
                      >
                        {st.isDone ? (
                          <Check className="h-4 w-4" />
                        ) : st.isActive ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <IconComponent className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold font-sans">
                          {st.label}
                        </div>
                        <div className="text-xs font-mono text-mist-400">
                          {st.details}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-mono">
                      {st.isDone ? (
                        <span className="text-emerald-400 font-semibold">Done</span>
                      ) : st.isActive ? (
                        <span className="text-violet-400 font-semibold animate-pulse">
                          In Progress...
                        </span>
                      ) : (
                        <span className="text-mist-600">Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
            <span className="text-[11px] font-mono text-mist-500">
              State: {currentStatus}
            </span>

            <div className="flex items-center gap-3">
              {isFailed ? (
                <>
                  <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-mist-300 hover:text-white bg-white/[0.05] border border-white/[0.1] transition-colors"
                  >
                    Return to Editor
                  </button>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Retry Submission</span>
                    </button>
                  )}
                </>
              ) : isCompleted ? (
                <button
                  onClick={() => onComplete && onComplete(submission)}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2"
                >
                  <Award className="h-4 w-4" />
                  <span>View Verified Scorecard</span>
                </button>
              ) : (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-mist-400 hover:text-mist-200 transition-colors"
                >
                  Close & Background
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
