import { Loader2 } from "lucide-react";

/**
 * Modern Awwwards / Dribbble Button System
 * - Clean, architectural minimalism
 * - Specular top-edge specular highlight (physical glass/crystal depth)
 * - Whisper-soft sheen glint sweep on hover
 * - High-end frosted glassmorphism for ghost variants
 * - Fluid, tactile press physics
 */

const VARIANTS = {
  verify:
    "btn-specular-primary btn-sheen text-white font-medium",

  signal:
    "bg-gradient-to-b from-purple-500 via-violet-600 to-indigo-700 hover:from-purple-400 hover:to-indigo-600 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_20px_-4px_rgba(168,85,247,0.35)] btn-sheen",

  ghost:
    "btn-frosted-glass text-mist-200 hover:text-white font-medium",

  secondary:
    "bg-ink-800/90 hover:bg-ink-700/90 text-mist-200 hover:text-white border border-ink-600/90 hover:border-violet-400/40 shadow-sm font-medium transition-all",

  danger:
    "bg-gradient-to-b from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-4px_rgba(225,29,72,0.35)]",

  link:
    "bg-transparent text-violet-400 hover:text-violet-300 underline-offset-4 hover:underline p-0 font-medium",
};

const SIZES = {
  sm: "text-xs px-3.5 py-1.5 rounded-lg",
  md: "text-sm px-5 py-2.5 rounded-xl",
  lg: "text-base px-6 py-3 rounded-xl",
  xl: "text-base px-8 py-3.5 rounded-2xl",
  icon: "p-2 rounded-lg",
};

export default function Button({
  as: Component = "button",
  variant = "verify",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  children,
  ...props
}) {
  const isLink = variant === "link";

  return (
    <Component
      className={`
        inline-flex items-center justify-center gap-2
        select-none cursor-pointer
        disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed
        ${SIZES[size] || SIZES.md}
        ${VARIANTS[variant] || VARIANTS.verify}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-current" />
          <span>{typeof children === "string" ? "Processing..." : children}</span>
        </>
      ) : (
        children
      )}
    </Component>
  );
}