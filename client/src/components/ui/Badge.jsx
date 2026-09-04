const TONES = {
  verify:
    "border-violet-400/40 bg-violet-500/10 text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.08)]",

  signal:
    "border-purple-300/35 bg-purple-500/10 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.06)]",

  neutral:
    "border-ink-500 bg-ink-800 text-mist-300",
};

export default function Badge({
  tone = "neutral",
  children,
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-xs font-medium tracking-normal transition-all duration-200 ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}