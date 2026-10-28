import { Loader2 } from "lucide-react";

/**
 * Premium Developer-Focused Button System
 * Built on Black + Electric Violet design tokens
 * 10px radius, 150-200ms smooth transitions
 */

const VARIANTS = {
  verify:
    "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[0_0_24px_rgba(139,92,246,0.16)] hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] border border-transparent font-medium",

  primary:
    "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[0_0_24px_rgba(139,92,246,0.16)] hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] border border-transparent font-medium",

  secondary:
    "bg-[#20202A] hover:bg-[#27272A] text-[#E4E4E7] hover:text-[#FAFAFA] border border-[#30303A] hover:border-[#3F3F4A] font-medium",

  ghost:
    "bg-transparent hover:bg-[#20202A] text-[#A1A1AA] hover:text-[#FAFAFA] border border-transparent font-medium",

  signal:
    "bg-[#211635] hover:bg-[#38245C] text-[#C4B5FD] hover:text-white border border-[#8B5CF6]/30 font-medium",

  danger:
    "bg-[#F87171]/15 hover:bg-[#F87171]/25 text-[#F87171] hover:text-white border border-[#F87171]/30 font-medium",

  link:
    "bg-transparent text-[#A78BFA] hover:text-[#C4B5FD] underline-offset-4 hover:underline p-0 font-medium border-0",
};

const SIZES = {
  sm: "text-xs px-3.5 py-1.5 rounded-[10px]",
  md: "text-sm px-4 py-2 rounded-[10px]",
  lg: "text-base px-6 py-2.5 rounded-[10px]",
  xl: "text-base px-8 py-3 rounded-[12px]",
  icon: "p-2 rounded-[10px]",
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
        transition-all duration-150 ease-out
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
