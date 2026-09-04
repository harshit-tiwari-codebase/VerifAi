export default function VerifaiLogo({
  size = "md",
  showWordmark = true,
  className = "",
}) {
  const dimensions = {
    sm: { icon: 30, text: "text-lg" },
    md: { icon: 40, text: "text-2xl" },
    lg: { icon: 52, text: "text-3xl" },
  }[size] || { icon: 40, text: "text-2xl" };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Mark — a dot-flower with a diagonal check-slash through it */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vfDots" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A78BFA" />
            <stop offset="1" stopColor="#E879F9" />
          </linearGradient>
        </defs>

        {/* six petals arranged in a ring */}
        <circle cx="24" cy="9" r="5.5" fill="url(#vfDots)" />
        <circle cx="37" cy="16.5" r="4.2" fill="url(#vfDots)" />
        <circle cx="37" cy="31.5" r="4.2" fill="url(#vfDots)" />
        <circle cx="24" cy="39" r="5.5" fill="url(#vfDots)" />
        <circle cx="11" cy="31.5" r="4.2" fill="url(#vfDots)" />
        <circle cx="11" cy="16.5" r="4.2" fill="url(#vfDots)" />

        {/* diagonal check-slash cutting through the flower */}
        <path
          d="M15 30L24 21L33 12"
          stroke="#0B0912"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        <path
          d="M15 30L24 21L33 12"
          stroke="#FAFAFA"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex items-baseline">
          <span className={`font-semibold lowercase text-slate-100 tracking-[-0.01em] ${dimensions.text}`}>
            verifai
          </span>
          <span className="ml-1 h-[5px] w-[5px] rounded-full bg-fuchsia-400 self-start mt-1" />
        </div>
      )}
    </div>
  );
}