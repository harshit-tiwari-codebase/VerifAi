const VARIANTS = {
  verify:
    "bg-verify text-ink-950 hover:bg-verify/90 shadow-verify font-semibold",
  signal:
    "bg-signal text-white hover:bg-signal/90 shadow-signal font-semibold",
  ghost:
    "bg-transparent text-mist-100 border border-ink-500 hover:border-mist-300 hover:bg-ink-800",
  link: "bg-transparent text-verify hover:text-verify/80 underline-offset-4 hover:underline p-0",
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
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
