import { Edit2, Trash2 } from "lucide-react";
import Button from "../../../components/ui/Button.jsx";

const DIFFICULTY_CONFIG = {
  easy: {
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]",
    text: "text-emerald-300",
  },
  medium: {
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]",
    text: "text-amber-300",
  },
  hard: {
    dot: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.5)]",
    text: "text-rose-300",
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

  const diffConfig = DIFFICULTY_CONFIG[challenge.difficulty] || DIFFICULTY_CONFIG.easy;
  const categoryName = CATEGORY_LABELS[challenge.category] || challenge.category;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-white/[0.07] bg-[#0A0D15]/90 p-5 transition-all duration-200 hover:border-violet-500/40 hover:bg-[#0D121F]/90 hover:shadow-[0_4px_24px_rgba(147,51,234,0.08)]">
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            {/* Difficulty with modern glowing dot */}
            <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-[#070A10] px-2.5 py-1 text-[11px] font-mono capitalize">
              <span className={`h-1.5 w-1.5 rounded-full ${diffConfig.dot}`} />
              <span className={diffConfig.text}>{challenge.difficulty}</span>
            </span>

            {/* Category */}
            <span className="inline-flex items-center rounded-md border border-white/[0.06] bg-[#070A10] px-2.5 py-1 text-[11px] font-mono text-mist-300">
              {categoryName}
            </span>

            {/* Execution type */}
            <span className="hidden sm:inline-flex text-[11px] font-mono text-mist-500">
              {challenge.executionType === "testcases" ? "Tests" : "AI Audit"}
            </span>
          </div>

          {/* Solved Status */}
          {hasBadge && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Verified
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => onView(challenge)}
          className="font-display text-base font-semibold text-mist-100 group-hover:text-violet-300 transition-colors line-clamp-1 cursor-pointer"
        >
          {challenge.title}
        </h3>

        {/* Description snippet */}
        <p className="mt-2 text-xs text-mist-400 line-clamp-2 leading-relaxed">
          {challenge.description}
        </p>

        {/* Tags */}
        {challenge.tags && challenge.tags.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {challenge.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="rounded bg-[#070A10] px-2 py-0.5 font-mono text-[10px] text-mist-400 border border-white/[0.04]"
              >
                #{tag}
              </span>
            ))}
            {challenge.tags.length > 3 && (
              <span className="text-[10px] font-mono text-mist-600 self-center">
                +{challenge.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Bar */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.05] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-mist-500 truncate">
          <span className="h-1.5 w-1.5 rounded-full bg-mist-600" />
          <span className="truncate">
            {challenge.createdBy?.name ? challenge.createdBy.name : "VerifAI Standard"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {canManage && (
            <>
              <button
                type="button"
                onClick={() => onEdit(challenge)}
                className="rounded-lg p-1.5 text-mist-400 hover:text-mist-100 hover:bg-white/[0.06] transition-colors"
                title="Edit challenge"
              >
                <Edit2 className="h-3.5 w-3.5 stroke-[1.5]" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(challenge)}
                className="rounded-lg p-1.5 text-mist-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete challenge"
              >
                <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
              </button>
            </>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onView(challenge)}
            className="!px-2.5 !py-1 text-xs font-mono group-hover:border-violet-500/50"
          >
            Solve →
          </Button>
        </div>
      </div>
    </div>
  );
}
