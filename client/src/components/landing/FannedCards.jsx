/**
 * FannedCards — three stacked coding panels that fan apart on hover.
 * Dark design-system only. No gradients, no glassmorphism, no glow.
 * Uses framer-motion whileHover + CSS perspective for the 3-D fan effect.
 */
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, CheckCircle2, Cpu, Clock, AlertCircle } from "lucide-react";

/* ─── card data ────────────────────────────────────────────────────────────── */

// Card 1 — Monaco-style code editor
const CODE_LINES = [
  { n: 1,  parts: [{ t: "class ",          c: "#FF9B66" }, { t: "TokenBucket",     c: "#93C5FD" }, { t: " {"                        }] },
  { n: 2,  parts: [{ t: "  // O(1) refill delta",         c: "#6F6D66" }] },
  { n: 3,  parts: [{ t: "  allow",          c: "#93C5FD" }, { t: "(count = 1) {"                                                  }] },
  { n: 4,  parts: [{ t: "    ",             c: "" },        { t: "const",           c: "#FF9B66" }, { t: " delta = (Date.now() - this.last) / 1000;" }] },
  { n: 5,  parts: [{ t: "    this.tokens = Math.min(cap, this.tokens + delta * rate);" }] },
  { n: 6,  parts: [{ t: "    ",             c: "" },        { t: "return",          c: "#FF9B66" }, { t: " this.tokens >= count;"   }] },
  { n: 7,  parts: [{ t: "  }"                                                                                                    }] },
  { n: 8,  parts: [{ t: "}"                                                                                                      }] },
];

// Card 2 — Judge0 test results
const TEST_ROWS = [
  { id: "TC-01", label: "Empty bucket rejects burst",        pass: true,  ms: "0.3" },
  { id: "TC-02", label: "Refill rate is monotonic",          pass: true,  ms: "0.4" },
  { id: "TC-03", label: "Concurrent allows under cap",       pass: true,  ms: "0.8" },
  { id: "TC-04", label: "Race condition: simultaneous -1",   pass: true,  ms: "1.2" },
  { id: "TC-05", label: "Overflow tokens clamped to cap",    pass: true,  ms: "0.3" },
  { id: "TC-06", label: "Zero-rate bucket always blocks",    pass: true,  ms: "0.2" },
];

// Card 3 — AI review + badge
const REVIEW_ROWS = [
  { label: "Correctness",   score: 100, note: "12 / 12 tests"          },
  { label: "Complexity",    score: 96,  note: "O(1) time, O(1) space"  },
  { label: "Concurrency",   score: 92,  note: "Atomic token delta"      },
  { label: "Readability",   score: 88,  note: "Clear naming, no magic" },
];

/* ─── sub-components ──────────────────────────────────────────────────────── */

function CardShell({ children, style, className = "", ...rest }) {
  return (
    <div
      className={`rounded-[8px] border overflow-hidden select-none ${className}`}
      style={{ backgroundColor: "#171714", borderColor: "#2A2924", ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

function CardTitleBar({ filename, status, statusColor = "#4FBF94" }) {
  return (
    <div
      className="flex items-center justify-between border-b px-4 py-2.5"
      style={{ borderColor: "#2A2924" }}
    >
      <span className="font-mono text-[11px]" style={{ color: "#8F8B80" }}>
        {filename}
      </span>
      <span className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: statusColor }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
        {status}
      </span>
    </div>
  );
}

/* Card A — code editor */
function CodeCard() {
  return (
    <CardShell className="w-full">
      <CardTitleBar filename="rate-limiter.js" status="Sandboxed" />
      <pre className="px-4 py-4 font-mono text-[11px] leading-[1.7]" style={{ color: "#E4E0D5" }}>
        <code>
          {CODE_LINES.map((line) => (
            <span key={line.n} className="flex">
              <span className="w-5 shrink-0 select-none" style={{ color: "#3A3834" }}>{line.n}</span>
              <span>
                {line.parts.map((p, i) => (
                  <span key={i} style={{ color: p.c || "#E4E0D5" }}>{p.t}</span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </CardShell>
  );
}

/* Card B — test results */
function TestCard() {
  return (
    <CardShell className="w-full">
      <CardTitleBar filename="judge0 · results" status="6 / 6 passed" statusColor="#4FBF94" />
      <div className="px-4 py-3 space-y-0">
        {TEST_ROWS.map((row) => (
          <div
            key={row.id}
            className="flex items-center gap-3 py-1.5 border-b last:border-0"
            style={{ borderColor: "#1E1E1A" }}
          >
            <CheckCircle2
              className="h-3.5 w-3.5 shrink-0"
              style={{ color: "#4FBF94" }}
              strokeWidth={1.5}
            />
            <span className="flex-1 font-sans text-[11px]" style={{ color: "#AAA69B" }}>
              {row.label}
            </span>
            <span className="shrink-0 font-mono text-[10px] tabular-nums" style={{ color: "#5F5D56" }}>
              {row.ms}ms
            </span>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

/* Card C — AI review + verified badge */
function ReviewCard() {
  return (
    <CardShell className="w-full">
      <CardTitleBar filename="ai-review · gemini" status="Verified" />
      <div className="px-4 pt-3 pb-2 space-y-2.5">
        {REVIEW_ROWS.map((row) => (
          <div key={row.label} className="grid grid-cols-[80px_1fr_auto] items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "#77756D" }}>
              {row.label}
            </span>
            {/* score bar */}
            <div className="h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: "#2A2924" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${row.score}%`, backgroundColor: "#FF6A3D" }}
              />
            </div>
            <span className="font-mono text-[10px] tabular-nums w-7 text-right" style={{ color: "#F2EFE6" }}>
              {row.score}
            </span>
          </div>
        ))}
      </div>

      {/* Verified badge row */}
      <div
        className="mx-4 mb-4 mt-3 flex items-center justify-between rounded-[4px] px-3 py-2.5"
        style={{ backgroundColor: "#1E1E1A", border: "1px solid #2A2924" }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" style={{ color: "#4FBF94" }} strokeWidth={1.5} />
          <div>
            <p className="font-mono text-[10px] font-medium" style={{ color: "#F2EFE6" }}>Rate Limiter Architect</p>
            <p className="font-mono text-[9px]" style={{ color: "#77756D" }}>VFY-2026-0418</p>
          </div>
        </div>
        <p className="font-display text-3xl leading-none tabular-nums" style={{ color: "#F2EFE6" }}>
          96<span className="font-sans text-[10px]" style={{ color: "#5F5D56" }}>/100</span>
        </p>
      </div>
    </CardShell>
  );
}

/* ─── Fanned stack ────────────────────────────────────────────────────────── */

/* Three cards in a fan. On hover they spread; at rest they are stacked. */
const CARDS = [
  { id: "code",   component: <CodeCard />,   restRotate: -8,  restX: -22, restY: 8,  hoverRotate: -18, hoverX: -210, hoverY: 20,  zRest: 1, zHover: 3 },
  { id: "badge",  component: <ReviewCard />, restRotate:  7,  restX:  20, restY: 4,  hoverRotate:  16, hoverX:  200, hoverY: 16,  zRest: 2, zHover: 1 },
  { id: "test",   component: <TestCard />,   restRotate:  0,  restX:   0, restY: 0,  hoverRotate:   0, hoverX:    0, hoverY:  0,  zRest: 3, zHover: 2 },
];

export default function FannedCards() {
  const [hovered, setHovered] = useState(false);
  const shouldReduce = useReducedMotion();

  const transition = { type: "spring", stiffness: 260, damping: 28, mass: 0.9 };

  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: "#121210", borderTop: "1px solid #30302B", borderBottom: "1px solid #30302B" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">

          {/* Left — copy */}
          <div className="max-w-md">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.18em] sm:text-[11px]"
              style={{ color: "#77756D" }}
            >
              02 — What you get
            </p>
            <h2
              className="mt-3 font-display text-3xl font-semibold md:text-4xl lg:text-[42px]"
              style={{ color: "#F2EFE6", letterSpacing: "-0.02em", lineHeight: 1.08 }}
            >
              Code review, test results, and a verified badge — all in one place.
            </h2>
            <p
              className="mt-5 text-base leading-relaxed"
              style={{ color: "#AAA69B", lineHeight: 1.7 }}
            >
              Every submission produces three artefacts: sandboxed execution
              results, an AI architecture review, and a public credential with a
              permanent URL. Hover the cards to see them.
            </p>

            {/* Three labelled bullets */}
            <ul className="mt-8 space-y-4">
              {[
                { icon: Cpu,          label: "Code execution",  detail: "Judge0 Linux sandbox — 6 hidden tests, isolated from the app server." },
                { icon: AlertCircle,  label: "AI review",       detail: "Gemini + Groq review architecture, not just whether tests pass."       },
                { icon: ShieldCheck,  label: "Verified badge",  detail: "SHA-256-signed credential with a permanent public URL."                 },
              ].map(({ icon: Icon, label, detail }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#FF6A3D" }} strokeWidth={1.5} />
                  <span>
                    <span className="block font-sans text-sm font-medium" style={{ color: "#F2EFE6" }}>{label}</span>
                    <span className="block font-sans text-sm leading-relaxed" style={{ color: "#77756D" }}>{detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — fanned cards */}
          <div
            className="relative mx-auto flex items-center justify-center"
            style={{ height: 420, width: "100%", perspective: 900 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Outer label */}
            <p
              className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: "#4A4844" }}
            >
              {hovered ? "Three artefacts, one submission" : "Hover to expand"}
            </p>

            {CARDS.map((card) => {
              const isSpread = hovered && !shouldReduce;
              return (
                <motion.div
                  key={card.id}
                  animate={{
                    rotateZ: isSpread ? card.hoverRotate : card.restRotate,
                    x:       isSpread ? card.hoverX       : card.restX,
                    y:       isSpread ? card.hoverY        : card.restY,
                    zIndex:  isSpread ? card.zHover        : card.zRest,
                  }}
                  transition={transition}
                  className="absolute w-[320px] sm:w-[360px]"
                  style={{
                    transformOrigin: "50% 90%",
                    willChange: "transform",
                    /* subtle shadow for lift */
                    filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.55))",
                  }}
                >
                  {card.component}
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
