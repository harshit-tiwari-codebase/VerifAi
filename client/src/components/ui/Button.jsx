import { Loader2 } from "lucide-react";

/**
 * Premium Developer-Focused Button System
 * Built on charcoal and terracotta design tokens
 * 10px radius, 150-200ms smooth transitions
 */

const VARIANTS = {
  verify:
    "bg-[#FF6A3D] hover:bg-[#E9562F] text-white border border-transparent font-medium",

  primary:
    "bg-[#FF6A3D] hover:bg-[#E9562F] text-white border border-transparent font-medium",

  secondary:
    "bg-[#22221E] hover:bg-[#30302B] text-[#E4E0D5] hover:text-[#F2EFE6] border border-[#37372F] hover:border-[#414139] font-medium",

  ghost:
    "bg-transparent hover:bg-[#22221E] text-[#AAA69B] hover:text-[#F2EFE6] border border-transparent font-medium",

  signal:
    "bg-[#261912] hover:bg-[#422316] text-[#FFD1BB] hover:text-white border border-[#FF6A3D]/30 font-medium",

  danger:
    "bg-[#F87171]/15 hover:bg-[#F87171]/25 text-[#F87171] hover:text-white border border-[#F87171]/30 font-medium",

  link:
    "bg-transparent text-[#FFB08E] hover:text-[#FFD1BB] underline-offset-4 hover:underline p-0 font-medium border-0",
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
