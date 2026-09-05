import {
  Edit2,
  Trash2,
  ArrowUpRight,
  BrainCircuit,
  TestTube2,
} from "lucide-react";

import Button from "../../../components/ui/Button.jsx";

const DIFFICULTY_CONFIG = {
  easy: {
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    text: "text-emerald-300",
    glow: "hover:shadow-[0_0_35px_rgba(16,185,129,0.08)]",
  },
  medium: {
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    text: "text-amber-300",
    glow: "hover:shadow-[0_0_35px_rgba(245,158,11,0.08)]",
  },
  hard: {
    dot: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
    text: "text-rose-300",
    glow: "hover:shadow-[0_0_35px_rgba(244,63,94,0.08)]",
  },
};

const CATEGORY_LABELS = {
  dsa: "DSA",
  "bug-fix": "Bug Fix",
  "api-design": "API Design",
  "schema-modeling": "Schema Modeling",
  "system-design": "System Design",
  debugging: "Debugging",
};

function MetaPill({ children, className = "", ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] text-mist-400 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

function IconActionButton({ label, onClick, hoverClass, children }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className={`rounded-lg p-2 text-mist-600 transition-colors duration-200 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090C12] ${hoverClass}`}
    >
      {children}
    </button>
  );
}

export default function ChallengeCard({
  challenge,
  currentUser,
  onView,
  onEdit,
  onDelete,
  hasBadge = false,
}) {
  const isOwner =
    currentUser &&
    challenge?.createdBy &&
    (challenge.createdBy === currentUser.id ||
      challenge.createdBy?._id === currentUser.id);

  const canManage = isOwner || currentUser?.role === "admin";

  const diffConfig =
    DIFFICULTY_CONFIG[challenge?.difficulty] || DIFFICULTY_CONFIG.easy;

  const categoryName =
    CATEGORY_LABELS[challenge?.category] || challenge?.category || "General";

  const isTestCase = challenge?.executionType === "testcases";

  const challengeId = challenge?._id || challenge?.id || "challenge";
  const challengeTitle = challenge?.title || "Untitled challenge";

  const executionContent = isTestCase ? (
    <>
      <TestTube2 aria-hidden="true" className="h-3 w-3 shrink-0 stroke-[1.7] text-cyan-400" />
      <span className="text-cyan-300/80">Test cases</span>
    </>
  ) : (
    <>
      <BrainCircuit aria-hidden="true" className="h-3 w-3 shrink-0 stroke-[1.7] text-violet-400" />
      <span className="text-violet-300/80">AI audit</span>
    </>
  );

  return (
    <article
      aria-labelledby={`challenge-title-${challengeId}`}
      onClick={() => onView(challenge)}
      className={`
        group relative cursor-pointer overflow-hidden rounded-2xl
        border border-white/[0.07] bg-[#090C12] p-5
        transition-all duration-300
        hover:-translate-y-0.5 hover:border-violet-500/30
        motion-reduce:transform-none motion-reduce:transition-none
        ${diffConfig.glow}
      `}
    >
      {/* faint technical grid — a static texture, not a hover effect */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 opacity-[0.025]
          [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)]
          [background-size:24px_24px]
        "
      />

      <div className="relative flex h-full flex-col justify-between">
        <div>
          {/* top meta row */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <MetaPill aria-label={`Difficulty: ${challenge?.difficulty || "easy"}`}>
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${diffConfig.dot}`} />
                <span className={`uppercase tracking-wide ${diffConfig.text}`}>
                  {challenge?.difficulty || "easy"}
                </span>
              </MetaPill>

              <MetaPill className="min-w-0 truncate" title={categoryName}>
                {categoryName}
              </MetaPill>
            </div>

            {/* execution type — desktop */}
            <div
              className="hidden shrink-0 items-center gap-1.5 rounded-md border border-white/[0.05] bg-white/[0.02] px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors duration-300 group-hover:border-violet-500/15 sm:inline-flex"
              aria-label={`Execution type: ${isTestCase ? "Test cases" : "AI audit"}`}
            >
              {executionContent}
            </div>
          </div>

          {/* execution type — mobile */}
          <div className="mb-3 sm:hidden">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[9px] uppercase tracking-wider ${
                isTestCase
                  ? "border-cyan-500/10 bg-cyan-500/[0.04]"
                  : "border-violet-500/10 bg-violet-500/[0.04]"
              }`}
            >
              {executionContent}
            </span>
          </div>

          {hasBadge && (
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-emerald-400">
              <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
              <span>Verified</span>
            </div>
          )}

          <h3
            id={`challenge-title-${challengeId}`}
            className="line-clamp-1 font-display text-[15px] font-semibold leading-snug text-mist-100 transition-colors duration-200 group-hover:text-violet-200"
          >
            {challengeTitle}
          </h3>

          <p className="mt-2.5 line-clamp-2 max-w-[95%] text-[11px] leading-relaxed text-mist-500">
            {challenge?.description || "No description provided."}
          </p>

          {challenge?.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5" aria-label="Challenge tags">
              {challenge.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="rounded-md border border-white/[0.05] bg-[#06080D] px-2 py-1 font-mono text-[9px] text-mist-500 transition-colors group-hover:border-violet-500/10 group-hover:text-mist-400"
                >
                  #{tag}
                </span>
              ))}
              {challenge.tags.length > 3 && (
                <span
                  className="font-mono text-[9px] text-mist-700"
                  aria-label={`${challenge.tags.length - 3} additional tags`}
                >
                  +{challenge.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-white/[0.05] pt-3.5">
          <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] text-mist-600">
            <span
              aria-hidden="true"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.025] text-[9px] font-semibold text-violet-300/80"
            >
              {(challenge?.createdBy?.name || "V")[0].toUpperCase()}
            </span>
            <span className="truncate">{challenge?.createdBy?.name || "VerifAI Standard"}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {canManage && (
              <>
                <IconActionButton
                  label={`Edit challenge: ${challengeTitle}`}
                  onClick={() => onEdit(challenge)}
                  hoverClass="hover:text-mist-200 focus-visible:ring-violet-400/70"
                >
                  <Edit2 aria-hidden="true" className="h-3.5 w-3.5 stroke-[1.5]" />
                </IconActionButton>

                <IconActionButton
                  label={`Delete challenge: ${challengeTitle}`}
                  onClick={() => onDelete(challenge)}
                  hoverClass="hover:!bg-rose-500/[0.08] hover:text-rose-400 focus-visible:ring-rose-400/70"
                >
                  <Trash2 aria-hidden="true" className="h-3.5 w-3.5 stroke-[1.5]" />
                </IconActionButton>
              </>
            )}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onView(challenge);
              }}
              aria-label={`Solve challenge: ${challengeTitle}`}
              className="
                !ml-1 !rounded-lg !border-white/[0.07] !bg-white/[0.025] !px-3 !py-1.5
                font-sans font-medium text-[11px] text-mist-300
                transition-colors duration-200
                hover:!border-violet-500/30 hover:!bg-violet-500/[0.08] hover:!text-violet-200
                focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-violet-400/70 focus-visible:!ring-offset-2 focus-visible:!ring-offset-[#090C12]
              "
            >
              Solve
              <ArrowUpRight aria-hidden="true" className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}