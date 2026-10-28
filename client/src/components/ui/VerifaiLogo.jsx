export default function VerifaiLogo({
  size = "md",
  showWordmark = true,
  className = "",
}) {
  const dimensions = {
    sm: { icon: 28, text: "text-base" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 46, text: "text-2xl" },
  }[typeof size === "string" ? size : "md"] || {
    icon: typeof size === "number" ? size : 36,
    text: "text-xl",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Mark — dot-flower with signature electric violet accents */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vfVioletDots" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#A78BFA" />
          </linearGradient>
        </defs>

        {/* six petals arranged in a ring */}
        <circle cx="24" cy="9" r="5.5" fill="url(#vfVioletDots)" />
        <circle cx="37" cy="16.5" r="4.2" fill="url(#vfVioletDots)" />
        <circle cx="37" cy="31.5" r="4.2" fill="url(#vfVioletDots)" />
        <circle cx="24" cy="39" r="5.5" fill="url(#vfVioletDots)" />
        <circle cx="11" cy="31.5" r="4.2" fill="url(#vfVioletDots)" />
        <circle cx="11" cy="16.5" r="4.2" fill="url(#vfVioletDots)" />

        {/* diagonal check-slash cutting through the flower */}
        <path
          d="M15 30L24 21L33 12"
          stroke="#09090B"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path
          d="M15 30L24 21L33 12"
          stroke="#FAFAFA"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex items-baseline">
          <span className={`font-semibold lowercase text-[#FAFAFA] font-sans tracking-tight ${dimensions.text}`}>
            verifai
          </span>
          <span className="ml-1 h-[5px] w-[5px] rounded-full bg-[#8B5CF6] self-start mt-1" />
        </div>
      )}
    </div>
  );
}
