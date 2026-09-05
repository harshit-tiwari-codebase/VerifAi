import React, { useState, useRef } from "react";

/**
 * CinematicTypography
 *
 * Minimal, transparent dark typography for "VerifAI":
 * - Container: Fully transparent, pointer-events-none (hover only targets the text itself).
 * - Base state: Completely transparent fill with a sleek hairline grey outline, PLUS
 *   a continuous kinetic "light sweep" — a soft diagonal beam that glides across the
 *   glyphs on a loop, clipped strictly inside the text.
 * - Hover state (Text only): A burnt-purple CIRCLE glow follows the cursor at a fixed
 *   420px size. No size animation — instead its COLOR/OPACITY fades in smoothly over
 *   exactly 1.5 seconds the moment the cursor reaches the text, and fades back out the
 *   same way on mouse leave. Clipped strictly inside the text glyphs.
 */
export default function CinematicTypography({ className = "" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const textRef = useRef(null);

  // fixed circle diameter — no growth, no spreading, always this size
  const GLOW_SIZE = 420; // px
  // how long the color/opacity takes to rise in (and fade out)
  const FADE_DURATION = 1800; // ms

  const handleMouseMove = (e) => {
    if (!textRef.current) return;
    const rect = textRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      className={`relative w-full max-w-[100vw] overflow-hidden bg-transparent flex items-center justify-center py-16 sm:py-24 lg:py-28 select-none pointer-events-none ${className}`}
    >
      {/* Keyframes for the kinetic light sweep. Injected once, scoped by class name. */}
      <style>{`
        @keyframes verifaiLightSweep {
          0% { background-position: -180% 0; }
          55% { background-position: 220% 0; }
          100% { background-position: 220% 0; }
        }
      `}</style>

      <div className="relative flex items-center justify-center text-center">
        {/* The interactive text element: pointer-events-auto restricts hover strictly to the text */}
        <h2
          ref={textRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative inline-block cursor-default select-none text-[clamp(3.5rem,14.5vw,15.5rem)] leading-none pointer-events-auto tracking-[-0.02em] font-black transition-all duration-500 ease-out"
          style={{
            fontFamily: "'Archivo Black', 'Montserrat', -apple-system, sans-serif",
            fontWeight: 900,
          }}
        >
          {/* =========================================================
              LAYER 1: BASE STATE
              Clean grey outline, 100% transparent interior
          ========================================================== */}
          <span
            className="block select-none transition-all duration-300 ease-out"
            style={{
              color: "transparent",
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: isHovered
                ? "1.2px rgba(255, 255, 255, 0.32)"
                : "1.2px rgba(255, 255, 255, 0.18)",
            }}
          >
            VerifAI
          </span>

       

          {/* =========================================================
              LAYER 3: BURNT-PURPLE CIRCLE GLOW — STRICTLY INSIDE THE TEXT
              Fixed circular gradient, fixed 420px size (no spreading).
              Position tracks the cursor instantly; only opacity (the
              color rising in) is transitioned, smoothly, over 1.5s.
          ========================================================== */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 select-none"
            style={{
              opacity: isHovered ? 1 : 0,
              backgroundImage: `radial-gradient(circle closest-side, rgba(216, 170, 255, 1) 0%, rgba(168, 85, 247, 0.9) 20%, rgba(109, 40, 217, 0.6) 40%, rgba(59, 20, 110, 0.3) 65%, transparent 85%)`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
              backgroundSize: `${GLOW_SIZE}px ${GLOW_SIZE}px`,
              backgroundColor: "transparent",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              transition: `opacity ${FADE_DURATION}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
            }}
          >
            VerifAI
          </span>
        </h2>
      </div>
    </div>
  );
}