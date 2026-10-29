import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Check, Play, ShieldCheck, ArrowUpRight } from "lucide-react";
import Button from "../ui/Button.jsx";

/* ─────────────────────────────────────────────────────────────
   CARD CONTENT DATA
───────────────────────────────────────────────────────────── */

const KW = "#FF9B66";
const FN = "#93C5FD";
const CM = "#5A5854";

const CODE_LINES = [
  [["class ", KW], ["TokenBucket", FN], [" {"]],
  [["  // O(1) refill delta", CM]],
  [["  allow", FN], ["(count = 1) {"]],
  [["    "], ["const", KW], [" delta = (Date.now() - this.last) / 1000;"]],
  [["    this.tokens = Math.min(cap, this.tokens + delta * rate);"]],
  [["    "], ["return", KW], [" this.tokens >= count;"]],
  [["  }"]],
  [["}"]],
];

const TEST_ROWS = [
  { label: "Empty bucket rejects burst",      pass: true, ms: "0.3" },
  { label: "Refill rate is monotonic",        pass: true, ms: "0.4" },
  { label: "Concurrent allows under cap",     pass: true, ms: "0.8" },
  { label: "Race condition: simultaneous −1", pass: true, ms: "1.2" },
  { label: "Overflow clamped to capacity",    pass: true, ms: "0.3" },
];

const REVIEW_DIMS = [
  { label: "Correctness", score: 100 },
  { label: "Complexity",  score: 96  },
  { label: "Concurrency", score: 92  },
  { label: "Style",       score: 88  },
];

/* ─────────────────────────────────────────────────────────────
   SHARED CARD SHELL
───────────────────────────────────────────────────────────── */

function Shell({ children, style }) {
  return (
    <div
      className="w-full overflow-hidden rounded-[8px] border"
      style={{ backgroundColor: "#131311", borderColor: "#272522", ...style }}
    >
      {children}
    </div>
  );
}

function TitleBar({ filename, badge, badgeColor = "#4FBF94" }) {
  return (
    <div
      className="flex items-center justify-between border-b px-4 py-2.5"
      style={{ borderColor: "#272522" }}
    >
      <span className="font-mono text-[11px]" style={{ color: "#6F6D66" }}>
        {filename}
      </span>
      <span className="flex items-center gap-1.5 font-mono text-[10px]" style={{ color: badgeColor }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: badgeColor }} />
        {badge}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CARD A — Code editor
───────────────────────────────────────────────────────────── */

function CodeCard() {
  return (
    <Shell>
      <TitleBar filename="rate-limiter.js" badge="Sandboxed" />
      <pre className="px-4 py-4 font-mono text-[11px] leading-[1.75]" style={{ color: "#D8D4CC" }}>
        <code>
          {CODE_LINES.map((line, i) => (
            <span key={i} className="flex">
              <span className="w-5 shrink-0 select-none" style={{ color: "#353330" }}>{i + 1}</span>
              <span>
                {line.map(([t, c], j) => (
                  <span key={j} style={{ color: c || "#D8D4CC" }}>{t}</span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </Shell>
  );
}

/* ─────────────────────────────────────────────────────────────
   CARD B — Test results
───────────────────────────────────────────────────────────── */

function TestCard() {
  return (
    <Shell>
      <TitleBar filename="judge0 · execution" badge="5 / 5 passed" />
      <div className="divide-y px-4 py-1" style={{ borderColor: "#1D1C1A" }}>
        {TEST_ROWS.map((row) => (
          <div key={row.label} className="flex items-center gap-3 py-2.5">
            {/* checkmark */}
            <span
              className="grid h-4 w-4 shrink-0 place-items-center rounded-full"
              style={{ backgroundColor: "#0D2B1F" }}
            >
              <Check className="h-2.5 w-2.5" style={{ color: "#4FBF94" }} strokeWidth={2.5} />
            </span>
            <span className="flex-1 font-sans text-[11px]" style={{ color: "#9A9590" }}>
              {row.label}
            </span>
            <span className="shrink-0 font-mono text-[10px] tabular-nums" style={{ color: "#4A4844" }}>
              {row.ms}ms
            </span>
          </div>
        ))}
      </div>
      {/* summary bar */}
      <div
        className="flex items-center justify-between border-t px-4 py-2"
        style={{ borderColor: "#272522", backgroundColor: "#0F0F0D" }}
      >
        <span className="font-mono text-[10px]" style={{ color: "#4A4844" }}>execution time</span>
        <span className="font-mono text-[10px] tabular-nums" style={{ color: "#4FBF94" }}>3.0ms total</span>
      </div>
    </Shell>
  );
}

/* ─────────────────────────────────────────────────────────────
   CARD C — AI review + badge (front / hero card)
───────────────────────────────────────────────────────────── */

function BadgeCard({ scoreVisible }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (!scoreVisible) { setDisplayed(0); return; }
    let raf;
    const start = performance.now();
    const dur = 900;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      setDisplayed(Math.round(96 * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scoreVisible]);

  return (
    <Shell>
      <TitleBar filename="ai-review · gemini" badge="Verified" />

      {/* Score bars */}
      <div className="space-y-3 px-4 pt-4 pb-3">
        {REVIEW_DIMS.map((d) => (
          <div key={d.label} className="grid grid-cols-[76px_1fr_28px] items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: "#6F6D66" }}>
              {d.label}
            </span>
            <div className="h-[2px] overflow-hidden rounded-full" style={{ backgroundColor: "#272522" }}>
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{ width: scoreVisible ? `${d.score}%` : "0%", backgroundColor: "#FF6A3D" }}
              />
            </div>
            <span className="text-right font-mono text-[10px] tabular-nums" style={{ color: "#F2EFE6" }}>
              {d.score}
            </span>
          </div>
        ))}
      </div>

      {/* Verified badge */}
      <div
        className="mx-3 mb-3 flex items-center justify-between rounded-[4px] border px-3 py-3"
        style={{ borderColor: "#272522", backgroundColor: "#0F0F0D" }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="grid h-7 w-7 shrink-0 place-items-center rounded-[4px]"
            style={{ backgroundColor: "#0D2B1F" }}
          >
            <ShieldCheck className="h-4 w-4" style={{ color: "#4FBF94" }} strokeWidth={1.5} />
          </span>
          <div>
            <p className="font-sans text-[12px] font-medium" style={{ color: "#F2EFE6" }}>
              Rate Limiter Architect
            </p>
            <p className="font-mono text-[9px]" style={{ color: "#6F6D66" }}>
              VFY-2026-0418
            </p>
          </div>
        </div>
        {/* Count-up score */}
        <p className="font-display text-[44px] leading-none tabular-nums" style={{ color: "#F2EFE6" }}>
          {displayed}
          <span className="font-sans text-[11px]" style={{ color: "#4A4844" }}>/100</span>
        </p>
      </div>

      {/* permalink */}
      <div
        className="flex items-center gap-1 border-t px-4 py-2.5"
        style={{ borderColor: "#272522" }}
      >
        <span className="font-mono text-[10px]" style={{ color: "#4A4844" }}>
          verifai.app/v/rl-8f3a2c
        </span>
        <ArrowUpRight className="h-3 w-3 shrink-0" style={{ color: "#4A4844" }} />
      </div>
    </Shell>
  );
}

/* ─────────────────────────────────────────────────────────────
   FANNED CARD STACK
   Three cards pivot from their bottom-centre.
   At rest: stacked with small rotation offsets.
   On hover: spring-physics fan spread.
   On page load: cards rise from y+28 after a delay.
───────────────────────────────────────────────────────────── */

/*
  Stack order (z-index):
    back  = Code editor    (-12deg offset, left)
    mid   = Test results   (+9deg offset, right)
    front = Badge / score  (0deg, centre)

  On hover they fan: back → far-left, mid → far-right, front stays centre but rises.
*/

const SPRING = { type: "spring", stiffness: 240, damping: 26, mass: 0.85 };

function HeroCards({ reduceMotion, scoreVisible }) {
  const [hovered, setHovered] = useState(false);
  const fan = hovered && !reduceMotion;

  /* Tilt on mouse move — only for the container, very subtle */
  const containerRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(rawY, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(smoothY, [-1, 1], [3, -3]);
  const rotateY = useTransform(smoothX, [-1, 1], [-4, 4]);

  function onMouseMove(e) {
    if (reduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width)  * 2 - 1);
    rawY.set(((e.clientY - rect.top)  / rect.height) * 2 - 1);
  }
  function onMouseLeave() {
    rawX.set(0); rawY.set(0); setHovered(false);
  }

  /* Tab labels that appear above spread cards */
  const tabs = ["Code", "Tests", "Badge"];
  const tabColors = ["#6F6D66", "#6F6D66", "#FF6A3D"];

  return (
    <div className="relative select-none" style={{ height: 480 }}>
      {/* Perspective wrapper — mouse-tilt applies here */}
      <motion.div
        ref={containerRef}
        className="relative h-full w-full"
        style={{ perspective: 1100, rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onMouseLeave}
      >
        {/* ── BACK: Code editor ── */}
        <motion.div
          animate={fan
            ? { rotateZ: -20, x: -195, y: 28, zIndex: 1, opacity: 1 }
            : { rotateZ: -9,  x: -14,  y: 20, zIndex: 1, opacity: 0.88 }}
          initial={{ rotateZ: -9, x: -14, y: 50, opacity: 0 }}
          whileInView={{ opacity: fan ? 1 : 0.88 }}
          transition={SPRING}
          className="absolute inset-0"
          style={{ transformOrigin: "50% 92%", willChange: "transform", width: 320 }}
        >
          {/* tab label */}
          <motion.p
            animate={{ opacity: fan ? 1 : 0, y: fan ? 0 : 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{ color: tabColors[0] }}
          >
            01 Code
          </motion.p>
          <CodeCard />
        </motion.div>

        {/* ── MID: Test results ── */}
        <motion.div
          animate={fan
            ? { rotateZ: 18, x: 190, y: 18, zIndex: 2, opacity: 1 }
            : { rotateZ:  7, x:  12, y: 10, zIndex: 2, opacity: 0.92 }}
          initial={{ rotateZ: 7, x: 12, y: 50, opacity: 0 }}
          transition={{ ...SPRING, delay: 0.05 }}
          className="absolute inset-0"
          style={{ transformOrigin: "50% 92%", willChange: "transform", width: 320 }}
        >
          <motion.p
            animate={{ opacity: fan ? 1 : 0, y: fan ? 0 : 6 }}
            transition={{ duration: 0.18, ease: "easeOut", delay: 0.04 }}
            className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{ color: tabColors[1] }}
          >
            02 Tests
          </motion.p>
          <TestCard />
        </motion.div>

        {/* ── FRONT: Badge / score (always on top) ── */}
        <motion.div
          animate={fan
            ? { rotateZ: 0, x: 0, y: -14, zIndex: 3, opacity: 1 }
            : { rotateZ: 0, x: 0, y:   0, zIndex: 3, opacity: 1 }}
          initial={{ rotateZ: 0, x: 0, y: 50, opacity: 0 }}
          transition={{ ...SPRING, delay: 0.1 }}
          className="absolute inset-0"
          style={{ transformOrigin: "50% 92%", willChange: "transform", width: 320 }}
        >
          <motion.p
            animate={{ opacity: fan ? 1 : 0, y: fan ? 0 : 6 }}
            transition={{ duration: 0.18, ease: "easeOut", delay: 0.08 }}
            className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{ color: tabColors[2] }}
          >
            03 Badge
          </motion.p>
          <BadgeCard scoreVisible={scoreVisible} />
        </motion.div>

        {/* Hint label */}
        <motion.p
          animate={{ opacity: hovered ? 0 : 0.5 }}
          transition={{ duration: 0.2 }}
          className="absolute -bottom-8 left-0 right-0 text-center font-mono text-[9px] uppercase tracking-[0.14em]"
          style={{ color: "#4A4844" }}
        >
          Hover to expand
        </motion.p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────── */

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.5'/></svg>\")";

export default function Hero() {
  const reduceMotion  = useReducedMotion();
  /* scoreVisible drives the count-up inside BadgeCard — starts 2.8s after mount */
  const [scoreVisible, setScoreVisible] = useState(false);

  useEffect(() => {
    if (reduceMotion) { setScoreVisible(true); return; }
    const t = setTimeout(() => setScoreVisible(true), 2800);
    return () => clearTimeout(t);
  }, [reduceMotion]);

  const ease = [0.22, 1, 0.36, 1];

  return (
    <section className="relative isolate overflow-hidden">
      {/* Subtle ambient — one radial, very low opacity, existing in original */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/2 -z-10 h-[580px] w-[580px] -translate-y-1/2 rounded-full bg-[#FF6A3D]/[0.06] blur-[130px]"
      />
      {/* Film-grain texture for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
      />

      <div className="container-xl grid min-w-0 items-center gap-16 pb-24 pt-24 md:pb-32 md:pt-32 lg:grid-cols-12 lg:gap-10">

        {/* ── LEFT: headline + CTA ── */}
        <div className="min-w-0 lg:col-span-6">
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
            className="font-display text-5xl font-normal leading-[1.02] tracking-[-0.03em] text-[#F2EFE6] sm:text-6xl lg:text-[76px]"
          >
            Let your work
            <br />
            <span style={{ color: "#6F6D66" }}>speak for itself.</span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, delay: 0.15, ease }}
            className="mt-7 max-w-md font-sans text-lg leading-relaxed"
            style={{ color: "#AAA69B", lineHeight: 1.7 }}
          >
            Solve real engineering challenges in a secure editor. Your code is
            tested and reviewed, then added to a public record anyone can check.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, delay: 0.25, ease }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button as={Link} to="/register" variant="verify" size="lg" className="group">
              Start a challenge
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
            <Button as="a" href="#playground" variant="ghost" size="lg">
              <Play className="mr-1.5 h-4 w-4 fill-current" style={{ color: "#FF6A3D" }} />
              Try the playground
            </Button>
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.75, delay: 0.35, ease }}
            className="mt-14 flex flex-wrap gap-x-8 gap-y-2 border-t pt-6 font-sans text-sm"
            style={{ borderColor: "rgba(255,255,255,0.07)", color: "#6F6D66" }}
          >
            <span>Isolated sandbox</span>
            <span>AI code review</span>
            <span>Public verified record</span>
          </motion.p>
        </div>

        {/* ── RIGHT: Fanned card stack ── */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="min-w-0 lg:col-span-6"
        >
          <HeroCards reduceMotion={reduceMotion} scoreVisible={scoreVisible} />
        </motion.div>

      </div>
    </section>
  );
}
