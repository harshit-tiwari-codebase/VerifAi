import {
  Edit2,
  Trash2,
  ArrowUpRight,
  BrainCircuit,
  TestTube2,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../../../components/ui/Button.jsx";

const DIFFICULTY_CONFIG = {
  easy: {
    dot: "bg-[#4ADE80]",
    badge: "border-[#4ADE80]/30 bg-[#4ADE80]/10 text-[#4ADE80]",
    glow: "",
  },
  medium: {
    dot: "bg-[#FBBF24]",
    badge: "border-[#FBBF24]/30 bg-[#FBBF24]/10 text-[#FBBF24]",
    glow: "",
  },
  hard: {
    dot: "bg-[#F87171]",
    badge: "border-[#F87171]/30 bg-[#F87171]/10 text-[#F87171]",
    glow: "",
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
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[8px] border px-2.5 py-0.5 text-[11px] font-mono leading-none ${className}`}
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
      className={`rounded-[8px] p-2 text-[#71717A] transition-colors duration-150 hover:bg-[#27272A] hover:text-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${hoverClass}`}
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
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[14px] border border-[#27272A] bg-[#18181F] p-4 transition-all duration-150 ease-out hover:bg-[#20202A] hover:border-[#3F3F4A] hover:shadow-[0_0_24px_rgba(139,92,246,0.12)] motion-reduce:transform-none motion-reduce:transition-none"
    >
      <div className="flex h-full flex-col justify-between gap-4">
        <div>
          {/* Top meta row */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <Badge className={diffConfig.badge}>
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${diffConfig.dot}`} />
                <span className="capitalize">{challenge?.difficulty || "easy"}</span>
              </Badge>
              <Badge className="min-w-0 truncate border-[#27272A] bg-[#14141B] text-[#A1A1AA]">
                {categoryName}
              </Badge>
            </div>

            <Badge
              className={`shrink-0 ${
                challenge?.executionType === "both"
                  ? "border-[#8B5CF6]/30 bg-[#211635] text-[#C4B5FD]"
                  : isTestCase
                  ? "border-[#60A5FA]/30 bg-[#60A5FA]/10 text-[#60A5FA]"
                  : "border-[#8B5CF6]/30 bg-[#211635] text-[#C4B5FD]"
              }`}
              aria-label={`Execution type: ${challenge?.executionType || "both"}`}
            >
              {challenge?.executionType === "both" ? (
                <BrainCircuit aria-hidden="true" className="h-3 w-3 shrink-0 stroke-[2] text-[#8B5CF6]" />
              ) : isTestCase ? (
                <TestTube2 aria-hidden="true" className="h-3 w-3 shrink-0 stroke-[2]" />
              ) : (
                <BrainCircuit aria-hidden="true" className="h-3 w-3 shrink-0 stroke-[2]" />
              )}
              <span className="hidden sm:inline">
                {challenge?.executionType === "both"
                  ? "Tests + AI Review"
                  : isTestCase
                  ? "Test Cases"
                  : "AI Review"}
              </span>
            </Badge>
          </div>

          {hasBadge && (
            <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-[8px] border border-[#34D399]/30 bg-[#34D399]/10 px-2.5 py-0.5 text-[10.5px] font-medium text-[#34D399]">
              <ShieldCheck aria-hidden="true" className="h-3 w-3" />
              <span>Verified Passed</span>
            </div>
          )}

          <h3
            id={`challenge-title-${challengeId}`}
            className="line-clamp-1 text-[15px] font-semibold leading-snug tracking-tight text-[#FAFAFA] transition-colors duration-150 group-hover:text-[#C4B5FD]"
          >
            {challengeTitle}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-[#A1A1AA]">
            {challenge?.description || "No description provided."}
          </p>

          {challenge?.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Challenge tags">
              {challenge.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="rounded-[6px] border border-[#27272A] bg-[#14141B] px-2 py-0.5 text-[10.5px] font-mono text-[#71717A] transition-colors group-hover:text-[#A1A1AA]"
                >
                  #{tag}
                </span>
              ))}
              {challenge.tags.length > 3 && (
                <span className="text-[10.5px] font-mono text-[#52525B]" aria-label={`${challenge.tags.length - 3} additional tags`}>
                  +{challenge.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-[#27272A] pt-3">
          <div className="flex min-w-0 items-center gap-2 text-[11px] text-[#71717A]">
            <span
              aria-hidden="true"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#211635] text-[9.5px] font-semibold text-[#C4B5FD] border border-[#8B5CF6]/30"
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
                  hoverClass="hover:text-[#FAFAFA] focus-visible:ring-[#8B5CF6]"
                >
                  <Edit2 aria-hidden="true" className="h-3.5 w-3.5 stroke-[1.5]" />
                </IconActionButton>

                <IconActionButton
                  label={`Delete challenge: ${challengeTitle}`}
                  onClick={() => onDelete(challenge)}
                  hoverClass="hover:!bg-[#F87171]/15 hover:text-[#F87171] focus-visible:ring-[#F87171]"
                >
                  <Trash2 aria-hidden="true" className="h-3.5 w-3.5 stroke-[1.5]" />
                </IconActionButton>
              </>
            )}

            <Button
              as={Link}
              to={`/challenges/${challenge?.slug || challenge?._id}`}
              onClick={(e) => e.stopPropagation()}
              variant="verify"
              size="sm"
              className="!py-1 !px-2.5 !text-[11px] font-mono font-medium"
            >
              Solve
              <ArrowUpRight className="h-3 w-3 stroke-[2]" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
