import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Play, RotateCcw, ShieldCheck } from "lucide-react";
import Button from "../ui/Button.jsx";

/* ─── data ──────────────────────────────────────────────────── */

const CHECKS = [
  { label: "Correctness", value: 100, result: "12 of 12 tests" },
  { label: "Efficiency",  value: 96,  result: "O(1) refill"    },
  { label: "Concurrency", value: 92,  result: "Atomic updates" },
];

const KW = "text-[#FF9B66]";
const FN = "text-[#93C5FD]";
const CM = "text-[#6F6D66]";

const CODE = [
  [["class ", KW], ["TokenBucket", FN], [" {"]],
  [["  // O(1) refill delta", CM]],
  [["  allow(count = 1) {"]],
  [["    "], ["const", KW], [" delta = (Date.now() - this.last) / 1000;"]],
  [["    this.tokens = Math.min(cap, this.tokens + delta * rate);"]],
  [["    "], ["return", KW], [" this.tokens >= count;"]],
  [["  }"]],
  [["}"]],
];

const STEP_MS = [700, 1400, 2100, 2900];

/* ─── count-up hook ─────────────────────────────────────────── */

function useCountUp(active, target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) { setValue(0); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

/* ─── shared card shell (original gradient-border style) ────── */

function CardShell({ children }) {
  return (
    <div className="rounded-[20px] bg-gradient-to-b from-white/[0.14] via-white/[0.04] to-white/[0.01] p-px shadow-[0_32px_64px_-32px_rgba(0,0,0,0.95)]">
      <div className="overflow-hidden rounded-[19px] bg-[#131311]">
        {children}
      </div>
    </div>
  );
}

/* ─── Card A: code editor ────────────────────────────────────── */

function CodeCard() {
  return (
    <CardShell>
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <span className="font-mono text-xs text-[#8F8B80]">submissions/rate-limiter.js</span>
        <span className="flex items-center gap-2 text-xs text-[#8F8B80]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
          Sandboxed
        </span>
      </div>
      <pre className="overflow-hidden px-5 py-5 font-mono text-[12px] leading-6 text-[#E4E0D5]">
        <code className="block">
          {CODE.map((line, i) => (
            <span key={i} className="flex whitespace-pre">
              <span className="w-6 shrink-0 select-none text-[#4A4944]">{i + 1}</span>
              <span>
                {line.map(([text, cls], j) => (
                  <span key={j} className={cls}>{text}</span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </CardShell>
  );
}

/* ─── Card B: test results ───────────────────────────────────── */

const TESTS = [
  { label: "Empty bucket rejects burst",      ms: "0.3" },
  { label: "Refill rate is monotonic",        ms: "0.4" },
  { label: "Concurrent allows under cap",     ms: "0.8" },
  { label: "Race condition: simultaneous −1", ms: "1.2" },
  { label: "Overflow clamped to capacity",    ms: "0.3" },
];

function TestCard() {
  return (
    <CardShell>
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <span className="font-mono text-xs text-[#8F8B80]">judge0 · execution</span>
        <span className="flex items-center gap-2 text-xs text-[#34D399]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
          5 / 5 passed
        </span>
      </div>
      <ul className="divide-y divide-white/[0.04] px-5 py-3">
        {TESTS.map((t) => (
          <li key={t.label} className="flex items-center gap-3 py-2.5 text-xs">
            <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-[#34D399]/15 text-[#34D399]">
              <Check className="h-3 w-3" strokeWidth={2.5} />
            </span>
            <span className="flex-1 text-[#8F8B80]">{t.label}</span>
            <span className="font-mono tabular-nums text-[#4A4944]">{t.ms}ms</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3 font-mono text-[10px] text-[#4A4944]">
        <span>Total execution</span>
        <span className="text-[#34D399]">3.0ms</span>
      </div>
    </CardShell>
  );
}

/* ─── Card C: AI review + verified badge (FRONT) ────────────── */

function BadgeCard({ shown, onReplay, reduceMotion }) {
  const done  = shown > CHECKS.length;
  const score = useCountUp(done && !reduceMotion, 96);
  const displayScore = reduceMotion ? (done ? 96 : 0) : score;

  return (
    <CardShell>
      {/* header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <span className="font-mono text-xs text-[#8F8B80]">ai-review · gemini</span>
        <span className="flex items-center gap-2 text-xs text-[#8F8B80]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A3D]" />
          Reviewing
        </span>
      </div>

      {/* code preview */}
      <pre className="overflow-hidden px-5 py-4 font-mono text-[12px] leading-6 text-[#E4E0D5]">
        <code className="block">
          {CODE.slice(0, 4).map((line, i) => (
            <span key={i} className="flex whitespace-pre">
              <span className="w-6 shrink-0 select-none text-[#4A4944]">{i + 1}</span>
              <span>
                {line.map(([text, cls], j) => (
                  <span key={j} className={cls}>{text}</span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>

      {/* verification */}
      <div className="border-t border-white/[0.06] bg-[#161614] px-5 pb-5 pt-4">
        <ul className="space-y-3.5">
          {CHECKS.map((c, i) => {
            const ok = shown > i;
            return (
              <li key={c.label} className="grid grid-cols-[22px_92px_1fr_auto] items-center gap-3 text-xs">
                <span
                  className={`grid h-[18px] w-[18px] place-items-center rounded-full transition-all duration-300 ${
                    ok ? "bg-[#34D399] text-[#0B1F17]" : "ring-1 ring-inset ring-white/15"
                  }`}
                >
                  <Check className={`h-3 w-3 transition-opacity duration-300 ${ok ? "opacity-100" : "opacity-0"}`} strokeWidth={3} />
                </span>
                <span className={ok ? "text-[#F2EFE6]" : "text-[#8F8B80]"}>{c.label}</span>
                <span className="h-px overflow-hidden bg-white/10">
                  <span
                    className="block h-full bg-[#FF6A3D] transition-[width] duration-700 ease-out motion-reduce:transition-none"
                    style={{ width: ok ? `${c.value}%` : "0%" }}
                  />
                </span>
                <span className="w-28 text-right tabular-nums text-[#8F8B80]">
                  {ok ? c.result : "Checking"}
                </span>
              </li>
            );
          })}
        </ul>

        {/* score row */}
        <div
          aria-live="polite"
          className={`mt-5 flex items-end justify-between gap-4 border-t border-white/[0.06] pt-4 transition-opacity duration-700 ${done ? "opacity-100" : "opacity-0"}`}
        >
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs text-[#34D399]">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
              Verified
            </p>
            <p className="mt-1 truncate font-display text-base text-[#F2EFE6]">Rate Limiter Architect</p>
            <p className="mt-1 flex items-center gap-1 font-mono text-xs text-[#8F8B80]">
              verifai.app/v/rl-8f3a2c
              <ArrowUpRight className="h-3 w-3 shrink-0" />
            </p>
          </div>
          <p className="font-display text-6xl font-normal leading-none tracking-tight text-[#F2EFE6] tabular-nums">
            {displayScore}
            <span className="ml-1 font-sans text-xs text-[#5F5D56]">/100</span>
          </p>
        </div>
      </div>

      {/* replay */}
      <div className="flex justify-end px-1 pt-3">
        <button
          type="button"
          onClick={onReplay}
          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs text-[#8F8B80] transition-colors hover:text-[#F2EFE6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6A3D]"
        >
          <RotateCcw className="h-3 w-3" strokeWidth={1.75} />
          Run again
        </button>
      </div>
    </CardShell>
  );
}

/* ─── Scroll-driven fan stack ───────────────────────────────── */
/*
  Three cards share the same absolute origin (bottom-centre pivot).
  As the hero scrolls, cards fan open via rotateZ only — no x translation,
  so they never bleed into the left column.
  Left column sits at z-10 so headline is always on top.
*/

const SPRING_CFG = { stiffness: 160, damping: 22, mass: 0.7 };

function HeroCards({ sectionRef, reduceMotion, shown, onReplay }) {
  const { scrollYProgress } = useScroll({
    target:  sectionRef,
    offset:  ["start start", "end start"],
  });

  // Fan opens during the first 45% of scrolling past the hero
  const rawBack = useTransform(scrollYProgress, [0, 0.45], [-7, -26]);
  const rawMid  = useTransform(scrollYProgress, [0, 0.45], [ 5,  23]);

  const backRot = useSpring(rawBack, SPRING_CFG);
  const midRot  = useSpring(rawMid,  SPRING_CFG);

  // Reduced-motion: instantly show at rest rotation
  const backRotFinal = reduceMotion ? -7 : backRot;
  const midRotFinal  = reduceMotion ?  5 : midRot;

  return (
    /* Container: position:relative, height holds the stacked cards,
       NO overflow:hidden — cards fan freely. z-index lower than headline. */
    <div className="relative" style={{ height: 520, zIndex: 1 }}>
      {/* hint label */}
      <p
        className="absolute -top-7 right-0 font-mono text-[9px] uppercase tracking-[0.14em]"
        style={{ color: "#4A4844" }}
      >
        Scroll to expand
      </p>

      {/* BACK — Code editor */}
      <motion.div
        className="absolute inset-0"
        style={{
          rotateZ:       backRotFinal,
          transformOrigin: "50% 96%",
          zIndex:        1,
          willChange:    "transform",
          opacity:       0.72,
        }}
      >
        <CodeCard />
      </motion.div>

      {/* MID — Test results */}
      <motion.div
        className="absolute inset-0"
        style={{
          rotateZ:       midRotFinal,
          transformOrigin: "50% 96%",
          zIndex:        2,
          willChange:    "transform",
          opacity:       0.84,
        }}
      >
        <TestCard />
      </motion.div>

      {/* FRONT — Badge / score (always at rest, fully visible) */}
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ zIndex: 3, willChange: "transform" }}
      >
        <BadgeCard shown={shown} reduceMotion={reduceMotion} onReplay={onReplay} />
      </motion.div>
    </div>
  );
}

/* ─── Hero ──────────────────────────────────────────────────── */

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.5'/></svg>\")";

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef   = useRef(null);
  const [shown, setShown] = useState(0);
  const [run,   setRun  ] = useState(0);

  useEffect(() => {
    if (reduceMotion) { setShown(CHECKS.length + 1); return; }
    setShown(0);
    const timers = STEP_MS.map((ms, i) => setTimeout(() => setShown(i + 1), ms));
    return () => timers.forEach(clearTimeout);
  }, [run, reduceMotion]);

  const ease = [0.22, 1, 0.36, 1];

  return (
    <section ref={sectionRef} className="relative isolate overflow-visible">
      {/* ambient radial — same as original */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/2 -z-10 h-[640px] w-[640px] -translate-y-1/2 rounded-full bg-[#FF6A3D]/[0.07] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
      />

      <div className="container-xl grid min-w-0 items-center gap-16 pb-24 pt-24 md:pb-32 md:pt-32 lg:grid-cols-12 lg:gap-12">

        {/* LEFT — headline, always on top via z-10 */}
        <div className="relative min-w-0 lg:col-span-6" style={{ zIndex: 10 }}>
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="font-display text-5xl font-normal leading-[1.02] tracking-[-0.03em] text-[#F2EFE6] sm:text-6xl lg:text-[76px]"
          >
            Let your work
            <br />
            <span className="text-[#8F8B80]">speak for itself.</span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="mt-7 max-w-md font-sans text-lg leading-relaxed text-[#AAA69B]"
          >
            Solve real engineering challenges in a secure editor. Your code is
            tested and reviewed, then added to a public record anyone can check.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button as={Link} to="/register" variant="verify" size="lg" className="group">
              Start a challenge
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
            <Button as={Link} to="/playground" variant="ghost" size="lg" className="group">
              <Play className="mr-1.5 h-4 w-4 fill-current text-[#FF6A3D]" />
              Try the playground
            </Button>
          </motion.div>

          <p className="mt-14 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/[0.08] pt-6 font-sans text-sm text-[#8F8B80]">
            <span>Isolated sandbox</span>
            <span>AI code review</span>
            <span>Public verified record</span>
          </p>
        </div>

        {/* RIGHT — card stack, z-1 (behind headline) */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="min-w-0 lg:col-span-6 lg:pl-8"
          style={{ zIndex: 1 }}
        >
          <HeroCards
            sectionRef={sectionRef}
            reduceMotion={reduceMotion}
            shown={shown}
            onReplay={() => setRun((r) => r + 1)}
          />
        </motion.div>

      </div>
    </section>
  );
}
