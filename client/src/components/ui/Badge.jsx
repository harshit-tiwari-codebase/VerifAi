const TONES = {
  verify: "border-verify/40 bg-verify/10 text-verify",
  signal: "border-signal/40 bg-signal/10 text-signal",
  neutral: "border-ink-500 bg-ink-800 text-mist-300",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs tracking-wide ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
