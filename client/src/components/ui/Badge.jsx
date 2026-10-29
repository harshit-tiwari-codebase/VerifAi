const TONES = {
  // Brand
  verify:
    "border-[#FF6A3D]/30 bg-[#261912] text-[#FFD1BB]",
  violet:
    "border-[#FF6A3D]/30 bg-[#261912] text-[#FFD1BB]",
  signal:
    "border-[#FFB08E]/30 bg-[#261912] text-[#FFB08E]",
  premium:
    "border-[#FFB08E]/30 bg-[#261912] text-[#FFB08E]",

  // Semantic Status
  accepted:
    "border-[#34D399]/30 bg-[#34D399]/10 text-[#34D399]",
  success:
    "border-[#34D399]/30 bg-[#34D399]/10 text-[#34D399]",
  wrong:
    "border-[#F87171]/30 bg-[#F87171]/10 text-[#F87171]",
  error:
    "border-[#F87171]/30 bg-[#F87171]/10 text-[#F87171]",
  runtime:
    "border-[#FB7185]/30 bg-[#FB7185]/10 text-[#FB7185]",
  warning:
    "border-[#FBBF24]/30 bg-[#FBBF24]/10 text-[#FBBF24]",
  tle:
    "border-[#FBBF24]/30 bg-[#FBBF24]/10 text-[#FBBF24]",
  running:
    "border-[#60A5FA]/30 bg-[#60A5FA]/10 text-[#60A5FA]",
  info:
    "border-[#60A5FA]/30 bg-[#60A5FA]/10 text-[#60A5FA]",
  pending:
    "border-[#30302B] bg-[#1C1C19] text-[#AAA69B]",

  // Difficulty Levels
  easy:
    "border-[#4ADE80]/30 bg-[#4ADE80]/10 text-[#4ADE80]",
  medium:
    "border-[#FBBF24]/30 bg-[#FBBF24]/10 text-[#FBBF24]",
  hard:
    "border-[#F87171]/30 bg-[#F87171]/10 text-[#F87171]",

  // Neutral
  neutral:
    "border-[#30302B] bg-[#1C1C19] text-[#AAA69B]",
};

export default function Badge({
  tone = "neutral",
  children,
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-normal transition-colors duration-150 ${TONES[tone] || TONES.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
