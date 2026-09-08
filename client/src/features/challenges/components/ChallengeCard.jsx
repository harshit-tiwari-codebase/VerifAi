import {
  Edit2,
  Trash2,
  ArrowUpRight,
  BrainCircuit,
  TestTube2,
  ShieldCheck,
} from "lucide-react";

import Button from "../../../components/ui/Button.jsx";

const DIFFICULTY_CONFIG = {
  easy: {
    dot: "bg-emerald-400",
    badge: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    glow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.10)]",
  },
  medium: {
    dot: "bg-amber-400",
    badge: "border-amber-500/25 bg-amber-500/10 text-amber-300",
    glow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.10)]",
  },
  hard: {
    dot: "bg-rose-400",
    badge: "border-rose-500/25 bg-rose-500/10 text-rose-300",
    glow: "hover:shadow-[0_0_40px_rgba(244,63,94,0.10)]",
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

function Badge({ children, className = "", ...props }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1 text-[11px] font-medium leading-none ${className}`}
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
      className={`rounded-lg p-2 text-mist-600 transition-colors duration-200 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14] ${hoverClass}`}
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
  const currentUserId = currentUser?.id || currentUser?._id;
  const challengeOwnerId =
    typeof challenge?.createdBy === "object"
      ? challenge.createdBy?._id || challenge.createdBy?.id
      : challenge?.createdBy;
  const isOwner =
    Boolean(currentUserId && challengeOwnerId) &&
    String(challengeOwnerId) === String(currentUserId);

  const canManage = isOwner || currentUser?.role === "admin";

  const diffConfig =
    DIFFICULTY_CONFIG[challenge?.difficulty] || DIFFICULTY_CONFIG.easy;

  const categoryName =
    CATEGORY_LABELS[challenge?.category] || challenge?.category || "General";

  const isTestCase = challenge?.executionType === "testcases";

  const challengeId = challenge?._id || challenge?.id || "challenge";
  const challengeTitle = challenge?.title || "Untitled challenge";

  return (
    <article
      aria-labelledby={`challenge-title-${challengeId}`}
      onClick={() => onView(challenge)}
      className={`
        group relative flex h-full cursor-pointer flex-col overflow-hidden
        rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#10141D] to-[#0A0D14] p-4
        transition-all duration-300 ease-out
        hover:-translate-y-0.5 hover:border-violet-500/35
        motion-reduce:transform-none motion-reduce:transition-none
        ${diffConfig.glow}
      `}
    >
      <div className="flex h-full flex-col justify-between gap-4">
        <div>
          {/* top meta row */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <Badge className={diffConfig.badge}>
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${diffConfig.dot}`} />
                <span className="capitalize">{challenge?.difficulty || "easy"}</span>
              </Badge>
              <Badge className="min-w-0 truncate border-white/[0.08] bg-white/[0.04] text-mist-300">
                {categoryName}
              </Badge>
            </div>

            <Badge
              className={`shrink-0 ${
                isTestCase
                  ? "border-cyan-500/20 bg-cyan-500/[0.06] text-cyan-300"
                  : "border-violet-500/20 bg-violet-500/[0.06] text-violet-300"
              }`}
              aria-label={`Execution type: ${isTestCase ? "Test cases" : "AI audit"}`}
            >
              {isTestCase ? (
                <TestTube2 aria-hidden="true" className="h-3 w-3 shrink-0 stroke-[2]" />
              ) : (
                <BrainCircuit aria-hidden="true" className="h-3 w-3 shrink-0 stroke-[2]" />
              )}
              <span className="hidden sm:inline">{isTestCase ? "Test cases" : "AI audit"}</span>
            </Badge>
          </div>

          {hasBadge && (
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-2.5 py-1 text-[10.5px] font-medium text-emerald-300">
              <ShieldCheck aria-hidden="true" className="h-3 w-3" />
              <span>Verified</span>
            </div>
          )}

          <h3
            id={`challenge-title-${challengeId}`}
            className="line-clamp-1 text-[16px] font-semibold leading-snug tracking-tight text-white transition-colors duration-200 group-hover:text-violet-200"
          >
            {challengeTitle}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-mist-500">
            {challenge?.description || "No description provided."}
          </p>

          {challenge?.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Challenge tags">
              {challenge.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="rounded-md bg-white/[0.03] px-2 py-1 text-[10.5px] text-mist-500 transition-colors group-hover:text-mist-400"
                >
                  #{tag}
                </span>
              ))}
              {challenge.tags.length > 3 && (
                <span className="text-[10.5px] text-mist-700" aria-label={`${challenge.tags.length - 3} additional tags`}>
                  +{challenge.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
          <div className="flex min-w-0 items-center gap-2 text-[11px] text-mist-500">
            <span
              aria-hidden="true"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-[9.5px] font-semibold text-violet-300"
            >
              {(challenge?.createdBy?.name || "V")[0].toUpperCase()}
            </span>
            <span className="truncate">{challenge?.createdBy?.name || "VerifAI Standard"}</span>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
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
                !ml-1 !rounded-lg !border-none !bg-violet-500 !px-3 !py-1.5
                font-medium text-[11.5px] !text-white
                transition-colors duration-200
                hover:!bg-violet-400
                focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-violet-400/70 focus-visible:!ring-offset-2 focus-visible:!ring-offset-[#0A0D14]
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