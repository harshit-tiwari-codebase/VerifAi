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
      {/* Original mark, recolored for the orange brand palette. */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vfOrangeDots" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E9562F" />
            <stop offset="1" stopColor="#FFB08E" />
          </linearGradient>
        </defs>

        {/* six petals arranged in a ring */}
        <circle cx="24" cy="9" r="5.5" fill="url(#vfOrangeDots)" />
        <circle cx="37" cy="16.5" r="4.2" fill="url(#vfOrangeDots)" />
        <circle cx="37" cy="31.5" r="4.2" fill="url(#vfOrangeDots)" />
        <circle cx="24" cy="39" r="5.5" fill="url(#vfOrangeDots)" />
        <circle cx="11" cy="31.5" r="4.2" fill="url(#vfOrangeDots)" />
        <circle cx="11" cy="16.5" r="4.2" fill="url(#vfOrangeDots)" />

        {/* diagonal check-slash cutting through the flower */}
        <path
          d="M15 30L24 21L33 12"
          stroke="#0B0B0A"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path
          d="M15 30L24 21L33 12"
          stroke="#F2EFE6"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex items-baseline">
          <span className={`font-semibold lowercase text-[#F2EFE6] font-sans tracking-tight ${dimensions.text}`}>
            verifai
          </span>
          <span className="ml-1 h-[5px] w-[5px] rounded-full bg-[#FF6A3D] self-start mt-1" />
        </div>
      )}
    </div>
  );
}
