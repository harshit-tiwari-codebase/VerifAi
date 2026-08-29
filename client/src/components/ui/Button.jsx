const VARIANTS = {
  verify:
    "bg-violet-600 text-white border border-violet-400/30 hover:bg-violet-500 shadow-[0_0_20px_rgba(124,58,237,0.22)] hover:shadow-[0_0_30px_rgba(139,92,246,0.38)] font-semibold",

  signal:
    "bg-purple-600 text-white border border-purple-400/30 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.18)] hover:shadow-[0_0_30px_rgba(168,85,247,0.32)] font-semibold",

  ghost:
    "bg-transparent text-mist-100 border border-ink-500 hover:border-violet-400/40 hover:bg-violet-500/[0.06] hover:text-violet-300",

  link:
    "bg-transparent text-violet-400 hover:text-violet-300 underline-offset-4 hover:underline p-0",
};

const SIZES = {
  sm: "text-sm px-3.5 py-1.5 rounded-lg",
  md: "text-sm px-5 py-2.5 rounded-lg",
  lg: "text-base px-6 py-3.5 rounded-xl",
};

export default function Button({
  as: Component = "button",
  variant = "verify",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-200
        disabled:opacity-50
        disabled:pointer-events-none
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}