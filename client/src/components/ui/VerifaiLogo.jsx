export default function VerifaiLogo({
  size = "md",
  showWordmark = true,
  className = "",
}) {
  const dimensions = {
    sm: { icon: 26, text: "text-base", mark: "h-6 w-6" },
    md: { icon: 34, text: "text-xl", mark: "h-8 w-8" },
    lg: { icon: 44, text: "text-2xl", mark: "h-11 w-11" },
  }[size] || { icon: 34, text: "text-xl", mark: "h-8 w-8" };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Geometric Emblem */}
      <div className={`relative flex items-center justify-center ${dimensions.mark}`}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 blur-[8px] opacity-60" />

        {/* Crisp Vector Mark */}
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_2px_10px_rgba(147,51,234,0.4)]"
        >
          <defs>
            {/* Gradient for shield border */}
            <linearGradient id="vShieldBorder" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C084FC" />
              <stop offset="0.5" stopColor="#9333EA" />
              <stop offset="1" stopColor="#4F46E5" />
            </linearGradient>

            {/* Gradient for inner fill */}
            <linearGradient id="vShieldFill" x1="20" y1="4" x2="20" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E1B4B" stopOpacity="0.9" />
              <stop offset="1" stopColor="#0B091E" stopOpacity="0.95" />
            </linearGradient>

            {/* Glowing checkmark stroke */}
            <linearGradient id="vCheckGlow" x1="12" y1="20" x2="28" y2="12" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5D0FE" />
              <stop offset="0.4" stopColor="#C084FC" />
              <stop offset="1" stopColor="#38BDF8" />
            </linearGradient>

            {/* AI Node Spark Gradient */}
            <radialGradient id="vSpark" cx="50%" cy="50%" r="50%">
              <stop stopColor="#38BDF8" />
              <stop offset="1" stopColor="#9333EA" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Hexagonal Shield Outer Polygon */}
          <polygon
            points="20,3 35,9 35,27 20,37 5,27 5,9"
            fill="url(#vShieldFill)"
            stroke="url(#vShieldBorder)"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />

          {/* Inner Accent Facets */}
          <path
            d="M20 4L20 18M20 36L20 26M6 10L18 19M34 10L22 19"
            stroke="#9333EA"
            strokeWidth="0.75"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />

          {/* Dynamic Verification Check & Circuit Path */}
          <path
            d="M12 21.5L17.5 27L28.5 13.5"
            stroke="url(#vCheckGlow)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Neural Spark / Core Circuit Dot */}
          <circle cx="28.5" cy="13.5" r="2.2" fill="#38BDF8" />
          <circle cx="28.5" cy="13.5" r="4.5" fill="url(#vSpark)" opacity="0.8" />
        </svg>
      </div>

      {/* Wordmark Typography */}
      {showWordmark && (
        <div className="flex items-center tracking-tight">
          <span className={`font-display font-bold text-white tracking-[-0.03em] ${dimensions.text}`}>
            Verif
          </span>
          <span className={`font-display font-extrabold bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 bg-clip-text text-transparent tracking-[-0.02em] ml-0.5 ${dimensions.text}`}>
            AI
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 ml-1.5 animate-pulse" />
        </div>
      )}
    </div>
  );
}
