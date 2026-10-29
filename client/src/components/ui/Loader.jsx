import { useEffect, useState, useRef } from "react";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * <Loader />
 * NeoLeaf-style fluid preloader:
 *  - Pure solid black background (#000000)
 *  - Bold "verifai." text mask
 *  - Undulating sine-wave liquid in warm orange and ember tones
 *  - Telemetry: "loading... [counter]%"
 *  - Seamless camera fly-through zoom & cross-fade reveal into the application
 */
export default function Loader({
  onDone,
  onStartReveal,
  minDuration = 2600,
  once = false,
  force = false,
}) {
  const [skip] = useState(() => {
    if (force) return false;
    if (!once) return false;
    try {
      return sessionStorage.getItem("verifai-loaded") === "1";
    } catch {
      return false;
    }
  });

  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(skip ? "gone" : "loading"); // "loading" | "flash" | "zoom" | "gone"
  const [waveD, setWaveD] = useState("");

  const mRef = useRef(0);
  const animFrameRef = useRef(null);

  // If already seen this session
  useEffect(() => {
    if (skip) {
      onStartReveal?.();
      onDone?.();
    }
  }, [skip, onDone, onStartReveal]);

  // Lock document scroll while loader is visible
  useEffect(() => {
    if (phase === "gone") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  // Main liquid wave loop & progress interpolation
  useEffect(() => {
    if (phase !== "loading") return;

    if (prefersReduced()) {
      setProgress(100);
      onStartReveal?.();
      setPhase("zoom");
      const t = setTimeout(() => {
        setPhase("gone");
        onDone?.();
      }, 300);
      return () => clearTimeout(t);
    }

    let ready = false;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const loaded = new Promise((res) => {
      if (document.readyState === "complete") res();
      else window.addEventListener("load", res, { once: true });
    });
    Promise.all([fonts, loaded]).then(() => {
      ready = true;
    });

    const startTime = performance.now();
    const duration = minDuration;

    // ViewBox dimensions: 965 x 192
    const W = 965;
    const H = 192;
    const c = 18; // wave amplitude

    const tick = (now) => {
      const elapsed = Math.min(1, (now - startTime) / duration);
      let p = elapsed * 100;
      if (!ready) p = Math.min(p, 90);
      const currentProg = Math.round(p);
      setProgress(currentProg);

      // NeoLeaf wave formula:
      const e = 1 - currentProg / 100;
      mRef.current += 0.035;
      const m = mRef.current;

      const points = [];
      points.push(`M 0 ${H}`);
      const step = 4;
      for (let x = 0; x <= W; x += step) {
        const wave =
          Math.sin(0.02 * x + m) *
          Math.sin(0.01 * x + m) *
          Math.sin(0.05 * x + m) *
          c;
        const y = Math.max(0, Math.min(H, (H + 1.75 * c) * e - wave));
        points.push(`L ${x} ${y.toFixed(1)}`);
      }
      points.push(`L ${W} ${H} Z`);
      setWaveD(points.join(" "));

      if (elapsed >= 1 && ready) {
        setProgress(100);
        // Step 1: Flash to a warm orange illumination
        setPhase("flash");

        setTimeout(() => {
          // Step 2: Signal landing page to begin its smooth cross-fade reveal
          onStartReveal?.();
          setPhase("zoom");

          setTimeout(() => {
            try {
              if (once) sessionStorage.setItem("verifai-loaded", "1");
            } catch {
              /* ignore */
            }
            setPhase("gone");
            onDone?.();
          }, 900);
        }, 220);
        return;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [phase, minDuration, once, onDone, onStartReveal]);

  if (phase === "gone") return null;

  const isFlashing = phase === "flash" || phase === "zoom";
  const isZooming = phase === "zoom";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading VerifAI"
      className={`fixed inset-0 z-[99999] flex select-none items-center justify-center bg-black text-center text-white will-change-[opacity] transition-opacity duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isZooming ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Central Container */}
      <div className="relative w-full max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[740px] xl:max-w-[965px]">
        {/* Wordmark with Liquid Wave Mask */}
        <div
          className={`relative aspect-[965/192] w-full will-change-transform transition-all ${
            isZooming
              ? "duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] scale-[2.6] opacity-0"
              : "duration-200 scale-100 opacity-100"
          }`}
        >
          <svg
            viewBox="0 0 965 192"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-full overflow-hidden"
          >
            <defs>
              {/* Text Mask for verifai. */}
              <mask id="neoleafVerifaiMask">
                <rect width="965" height="192" fill="#000000" />
                <g fill="#ffffff">
                  <text
                    x="50%"
                    y="148"
                    textAnchor="middle"
                    fontSize="175"
                    fontWeight="800"
                    letterSpacing="-0.04em"
                    fontFamily="'Manrope', system-ui, -apple-system, sans-serif"
                  >
                    verifai.
                  </text>
                </g>
              </mask>

              {/* Warm orange liquid wave */}
              <linearGradient
                id="orangeLiquid"
                x1="0"
                y1="192"
                x2="0"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#35170F" />
                <stop offset="50%" stopColor="#B94725" />
                <stop offset="85%" stopColor="#E9562F" />
                <stop offset="100%" stopColor="#FF9B66" />
              </linearGradient>

              {/* Illumination flash gradient */}
              <linearGradient
                id="flashOrangeGrad"
                x1="0"
                y1="0"
                x2="965"
                y2="192"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#E9562F" />
                <stop offset="50%" stopColor="#FF6A3D" />
                <stop offset="100%" stopColor="#E9562F" />
              </linearGradient>
            </defs>

            {/* Silhouette Base: Translucent letter outline */}
            <rect
              width="965"
              height="192"
              fill={isFlashing ? "url(#flashOrangeGrad)" : "#ffffff"}
              fillOpacity={isFlashing ? 1 : 0.12}
              mask="url(#neoleafVerifaiMask)"
              className="transition-[fill-opacity] duration-200"
            />

            {/* Rising orange liquid wave */}
            {!isFlashing && waveD && (
              <path
                d={waveD}
                fill="url(#orangeLiquid)"
                mask="url(#neoleafVerifaiMask)"
              />
            )}
          </svg>
        </div>

        {/* Bottom-right Counter ('loading... [counter]%') */}
        <div
          className={`absolute right-0 top-full mt-2 font-mono text-xs sm:text-sm tracking-wider text-neutral-400 transition-opacity duration-200 ${
            isFlashing ? "opacity-0" : "opacity-100"
          }`}
        >
          loading...{" "}
          <span className="inline-block tabular-nums font-mono text-neutral-200">
            {progress}
          </span>
          %
        </div>
      </div>
    </div>
  );
}
