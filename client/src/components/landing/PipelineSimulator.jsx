import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SVG_NS = "http://www.w3.org/2000/svg";

/* ─── Site-matched colour tokens ──────────────────────────────────────────── */
const C = {
  bg:      "#0B0B0A",   // bg-base
  surface: "#171714",   // surface
  border:  "#30302B",   // border
  muted:   "#77756D",   // muted text
  text:    "#AAA69B",   // secondary text
  heading: "#F2EFE6",   // headings
  accent:  "#FF6A3D",   // accent (one usage: the particle)
  accentDim: "rgba(255,106,61,0.15)", // accent tinted fill
};

/* Lit (already-travelled) path — thin accent line, no glow stacks */
const LIT_LAYERS = [
  { w: 1.5, o: 0.35, c: C.accent },
  { w: 1,   o: 0.9,  c: C.accent },
];

/* Trail layers behind the particle — kept very subtle */
const TRAIL_LAYERS = [
  { len: 200, w: 4,   o: 0.1,  c: C.accent },
  { len: 80,  w: 2,   o: 0.25, c: C.accent },
  { len: 30,  w: 1.2, o: 0.7,  c: "#FFB08E" },
];

const DEFAULT_MILESTONES = [
  { label: "queued",    at: 0.12 },
  { label: "sandboxed", at: 0.38 },
  { label: "reviewed",  at: 0.64 },
  { label: "verified",  at: 0.9  },
];

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Organic vertical S-curve path */
function buildPath(w, h) {
  const mobile = w < 1024;
  const step  = mobile ? 340 : 480;
  const count = Math.max(4, Math.round(h / step));
  const cx    = mobile ? 40 : w / 2;
  const amp   = mobile ? Math.min(w * 0.035, 14) : Math.min(w * 0.08, 88);
  const pad   = 24;

  const pts = [];
  for (let i = 0; i <= count; i++) {
    const wave =
      Math.sin(i * 1.25 + 0.6) * 0.7 + Math.sin(i * 2.3 + 1.1) * 0.3;
    let x = i === 0 || i === count ? cx : cx + wave * amp;
    x = Math.min(w - pad, Math.max(pad, x));
    pts.push({ x, y: (i / count) * h });
  }

  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function ScrollPathAnimation({
  anchor = 0.5,
  start,
  end,
  milestones = DEFAULT_MILESTONES,
  zIndex = 0,
}) {
  const uid      = useId().replace(/:/g, "");
  const wrapRef  = useRef(null);
  const baseRef  = useRef(null);
  const headRef  = useRef(null);
  const dustRef  = useRef(null);
  const sparkRef = useRef(null);
  const msRef    = useRef(null);
  const msKey    = JSON.stringify(milestones);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useIsoLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const measure = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      setSize((prev) =>
        Math.abs(prev.w - w) < 2 && Math.abs(prev.h - h) < 2 ? prev : { w, h }
      );
    };
    measure();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    });
    ro.observe(wrap);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const d = useMemo(
    () => (size.h ? buildPath(size.w, size.h) : ""),
    [size.w, size.h]
  );

  useIsoLayoutEffect(() => {
    if (!d) return;
    const wrap       = wrapRef.current;
    const base       = baseRef.current;
    const head       = headRef.current;
    const dust       = dustRef.current;
    const sparkGroup = sparkRef.current;
    const msGroup    = msRef.current;
    if (!wrap || !base || !head) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const len    = base.getTotalLength();
    const H      = size.h;

    /* y → length lookup */
    const N  = Math.max(100, Math.min(1500, Math.ceil(len / 3)));
    const ls = new Float32Array(N + 1);
    const ys = new Float32Array(N + 1);
    for (let i = 0; i <= N; i++) {
      const L = (len * i) / N;
      ls[i]   = L;
      ys[i]   = base.getPointAtLength(L).y;
    }
    const lengthAtY = (y) => {
      if (y <= ys[0]) return 0;
      if (y >= ys[N]) return len;
      let lo = 0, hi = N;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (ys[mid] < y) lo = mid; else hi = mid;
      }
      const f = (y - ys[lo]) / (ys[hi] - ys[lo] || 1);
      return ls[lo] + f * (ls[hi] - ls[lo]);
    };

    const litEls   = wrap.querySelectorAll("[data-lit]");
    const trailEls = wrap.querySelectorAll("[data-trail]");
    litEls.forEach((el) => {
      el.setAttribute("stroke-dasharray",  `${len}`);
      el.setAttribute("stroke-dashoffset", `${len}`);
    });

    const mk = (tag, attrs) => {
      const el = document.createElementNS(SVG_NS, tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      return el;
    };

    /* Ambient dust — very faint, on-theme */
    const rand     = mulberry32(7);
    const dustEls  = [];
    if (dust) {
      dust.replaceChildren();
      const dustCount = Math.max(4, Math.min(18, Math.round(H / 180)));
      for (let i = 0; i < dustCount; i++) {
        const L  = (len * (i + rand())) / dustCount;
        const a  = base.getPointAtLength(L);
        const b  = base.getPointAtLength(Math.min(len, L + 2));
        const tx = b.x - a.x, ty = b.y - a.y;
        const tl = Math.hypot(tx, ty) || 1;
        const off = (rand() < 0.5 ? -1 : 1) * (14 + rand() * 60);
        const c = mk("circle", {
          cx:      (a.x + (-ty / tl) * off).toFixed(1),
          cy:      (a.y + ( tx / tl) * off).toFixed(1),
          r:       (0.5 + rand() * 0.9).toFixed(2),
          fill:    C.accent,
          opacity: 0.12,
        });
        dust.appendChild(c);
        dustEls.push(c);
      }
    }

    /* Spark pool — small, no glow */
    const sparks = [];
    if (sparkGroup && !reduce) {
      sparkGroup.replaceChildren();
      for (let i = 0; i < 10; i++) {
        const c = mk("circle", { r: 1.5, fill: "#FFB08E", opacity: 0 });
        sparkGroup.appendChild(c);
        sparks.push(c);
      }
    }
    let sparkIdx   = 0;
    let lastEmitL  = 0;

    const emit = (L, dir) => {
      if (!sparks.length) return;
      const p  = base.getPointAtLength(L);
      const q  = base.getPointAtLength(Math.max(0, Math.min(len, L + dir * 2)));
      let tx   = q.x - p.x, ty = q.y - p.y;
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl; ty /= tl;
      const back = 12 + Math.random() * 22;
      const side = (Math.random() - 0.5) * 20;
      const el   = sparks[sparkIdx++ % sparks.length];
      gsap.fromTo(
        el,
        { x: p.x + (Math.random() - 0.5) * 4, y: p.y + (Math.random() - 0.5) * 4, opacity: 0.7, scale: 0.7 },
        { x: p.x - tx * back * dir - ty * side, y: p.y - ty * back * dir + tx * side, opacity: 0, scale: 0.2,
          duration: 0.6 + Math.random() * 0.5, ease: "power2.out", overwrite: true }
      );
    };

    /* Milestone nodes — on-theme colours */
    const msItems = [];
    const msEls   = [];
    if (msGroup) {
      msGroup.replaceChildren();
      const small = size.w < 1024;
      JSON.parse(msKey).forEach(({ label, at }) => {
        const L     = lengthAtY(at * H);
        const p     = base.getPointAtLength(L);
        const right = !small && p.x < size.w / 2;
        const g     = mk("g", { transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})` });
        /* ring: border colour unlit, accent lit */
        const ring    = mk("circle", { r: 5, fill: C.bg, stroke: C.border,    "stroke-width": 1.5, opacity: 0.9 });
        const pulse   = mk("circle", { r: 5, fill: "none", stroke: C.accent,  "stroke-width": 1,   opacity: 0   });
        const litRing = mk("circle", { r: 5, fill: "none", stroke: C.accent,  "stroke-width": 1.5, opacity: 0   });
        const core    = mk("circle", { r: 2.2, fill: C.heading, opacity: 0 });
        const text    = mk("text", {
          x:             right ? 14 : -14,
          y:             small ? 3.5 : 4,
          "text-anchor": right ? "start" : "end",
          "font-size":   small ? 9 : 10,
          "letter-spacing": "0.12em",
          "font-family": "ui-monospace, SFMono-Regular, Menlo, monospace",
          fill:          C.muted,
          opacity:       0.4,
        });
        text.textContent = label.toUpperCase();
        g.append(ring, pulse, litRing, core, text);
        msGroup.appendChild(g);
        gsap.set([core, pulse], { scale: 0.3, svgOrigin: "0 0" });
        msItems.push({ L, on: false, pulse, litRing, core, text });
        msEls.push(pulse, litRing, core, text);
      });
    }

    const setMilestone = (it, on, instant) => {
      if (it.on === on) return;
      it.on = on;
      const dur = instant || reduce ? 0 : 0.4;
      gsap.to(it.text,    { opacity: on ? 0.9 : 0.4,  duration: dur, overwrite: "auto" });
      gsap.to(it.litRing, { opacity: on ? 1   : 0,    duration: dur, overwrite: "auto" });
      gsap.to(it.core,    {
        opacity: on ? 1 : 0, scale: on ? 1 : 0.3,
        svgOrigin: "0 0", duration: dur, ease: "back.out(2)", overwrite: "auto",
      });
      if (on && !instant && !reduce) {
        gsap.fromTo(
          it.pulse,
          { opacity: 0.6, scale: 1 },
          { opacity: 0, scale: 3, svgOrigin: "0 0", duration: 0.7, ease: "power2.out", overwrite: "auto" }
        );
      }
    };
    let firstRender = true;

    const render = (L) => {
      const pt = base.getPointAtLength(L);
      head.setAttribute("transform", `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)})`);

      const off = len - L;
      litEls.forEach((el)   => el.setAttribute("stroke-dashoffset", off.toFixed(1)));
      trailEls.forEach((el) => {
        const want = Number(el.dataset.len);
        const dl   = Math.min(want, L);
        el.setAttribute("stroke-dasharray",  `${dl.toFixed(1)} ${len}`);
        el.setAttribute("stroke-dashoffset", (-(L - dl)).toFixed(1));
      });

      msItems.forEach((it) => setMilestone(it, L >= it.L - 2, firstRender));

      if (Math.abs(L - lastEmitL) > 10) {
        emit(L, L >= lastEmitL ? 1 : -1);
        lastEmitL = L;
      }
    };

    const ctx = gsap.context(() => {
      const state  = { p: 0 };
      const update = () => render(lengthAtY(state.p * H));
      update();
      firstRender = false;

      const line = `${Math.round(anchor * 100)}%`;
      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: update,
        scrollTrigger: {
          trigger: wrap,
          start:   start  || `top ${line}`,
          end:     end    || `bottom ${line}`,
          scrub:   reduce ? true : 0.6,
          invalidateOnRefresh: true,
        },
      });

      if (!reduce) {
        dustEls.forEach((el) => {
          gsap.to(el, {
            opacity: 0.05 + Math.random() * 0.3,
            duration: 1.8 + Math.random() * 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: Math.random() * 2,
          });
        });
      }
    }, wrap);

    return () => {
      ctx.revert();
      gsap.killTweensOf(sparks);
      gsap.killTweensOf(msEls);
      dust?.replaceChildren();
      sparkGroup?.replaceChildren();
      msGroup?.replaceChildren();
    };
  }, [d, size.w, size.h, anchor, start, end, msKey, uid]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex,
      }}
    >
      {d && (
        <svg
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          style={{ display: "block" }}
        >
          {/* Unlit path — hairline border colour */}
          <path
            ref={baseRef}
            d={d}
            fill="none"
            stroke={C.border}
            strokeOpacity="0.6"
            strokeWidth="1"
            strokeLinecap="round"
          />

          <g ref={dustRef} />

          {/* Progressively lit path — accent only, no gradient */}
          {LIT_LAYERS.map((l, i) => (
            <path
              key={`lit-${i}`}
              data-lit
              d={d}
              fill="none"
              stroke={l.c}
              strokeOpacity={l.o}
              strokeWidth={l.w}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Fading trail */}
          {TRAIL_LAYERS.map((l, i) => (
            <path
              key={`trail-${i}`}
              data-trail
              data-len={l.len}
              d={d}
              fill="none"
              stroke={l.c}
              strokeOpacity={l.o}
              strokeWidth={l.w}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          <g ref={msRef} />
          <g ref={sparkRef} />

          {/* Particle — the ONLY glow on the entire site (one accent dot) */}
          <g ref={headRef}>
            {/* Subtle halo — one radial, kept very small */}
            <circle r="14" fill={C.accent} fillOpacity="0.08" />
            <circle r="5"  fill={C.accent} opacity="0.85" />
            <circle r="2.4" fill="#F2EFE6" />
          </g>
        </svg>
      )}
    </div>
  );
}

/* ─── Stage data ────────────────────────────────────────────────────────────── */

const PIPELINE_STAGES = [
  {
    label: "QUEUED",
    title: "Accepted without blocking the API",
    description:
      "A submission is recorded and sent to the evaluation queue, so the app can respond immediately while the review runs independently.",
    telemetry: [
      ["Endpoint", "POST /api/v1/submissions"],
      ["Response",  "202 Accepted"],
      ["Queue",     "Redis · BullMQ"],
    ],
  },
  {
    label: "SANDBOXED",
    title: "Executed in an isolated sandbox",
    description:
      "The worker runs the solution against hidden tests in Judge0, with execution isolated from the application server.",
    telemetry: [
      ["Runner",    "Judge0"],
      ["Isolation", "Linux sandbox"],
      ["Result",    "12 / 12 tests passed"],
    ],
  },
  {
    label: "REVIEWED",
    title: "Reviewed beyond the test results",
    description:
      "An AI review checks the solution for correctness, complexity, edge cases, and maintainability — not just whether the tests pass.",
    telemetry: [
      ["Review",   "Architecture + complexity"],
      ["Latency",  "1.28s"],
      ["Outcome",  "No critical findings"],
    ],
  },
  {
    label: "VERIFIED",
    title: "A credential others can verify",
    description:
      "The completed result is saved as a shareable proof, so peers and recruiters can verify the work behind the achievement.",
    telemetry: [
      ["Credential", "VFY-2026-0418"],
      ["Score",      "96 / 100"],
      ["Integrity",  "SHA-256 verified"],
    ],
    verified: true,
  },
];

const STAGE_PROGRESS = [0.12, 0.38, 0.64, 0.9];

/* ─── Main export ──────────────────────────────────────────────────────────── */

export default function PipelineSimulator() {
  const sectionRef  = useRef(null);
  const shouldReduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const activeStage =
    progress < 0.25 ? 0 : progress < 0.51 ? 1 : progress < 0.77 ? 2 : 3;
  const stage = PIPELINE_STAGES[activeStage];

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const scrollDistance = section.offsetHeight;
      const nextProgress =
        scrollDistance > 0
          ? Math.min(
              1,
              Math.max(
                0,
                (window.innerHeight * 0.5 - section.getBoundingClientRect().top) /
                  scrollDistance
              )
            )
          : 0;
      setProgress(nextProgress);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      id="verification-journey"
      ref={sectionRef}
      /* bg-raised (#121210) alternates with surrounding bg-base sections */
      className="relative h-[320vh] min-h-[2200px] overflow-clip"
      style={{ backgroundColor: "#121210" }}
      aria-labelledby="pipeline-title"
    >
      {/* Top hairline divider matching all other section dividers */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ backgroundColor: "#30302B" }} />

      {/* Scroll-driven path overlay */}
      <ScrollPathAnimation
        anchor={0.5}
        milestones={[
          { label: "queued",    at: STAGE_PROGRESS[0] },
          { label: "sandboxed", at: STAGE_PROGRESS[1] },
          { label: "reviewed",  at: STAGE_PROGRESS[2] },
          { label: "verified",  at: STAGE_PROGRESS[3] },
        ]}
      />

      {/* Section header */}
      <header
        className="absolute left-5 right-5 top-16 z-10 mx-auto max-w-6xl sm:left-8 sm:right-8 sm:top-20"
      >
        {/* Mono eyebrow label — matches site pattern */}
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] sm:text-[11px]"
           style={{ color: "#77756D" }}>
          04 — How it works
        </p>

        <h2
          id="pipeline-title"
          className="mt-3 max-w-2xl font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl"
          style={{ color: "#F2EFE6", letterSpacing: "-0.02em", lineHeight: 1.1 }}
        >
          From submission to proof.
        </h2>

        <p className="mt-3 max-w-lg text-sm leading-relaxed sm:text-sm"
           style={{ color: "#AAA69B", lineHeight: 1.6 }}>
          Follow the dot. Each node shows what happens at that point in the
          review pipeline.
        </p>
      </header>

      {/* Scroll hint — mono label, no pill shape bloat */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[11%] z-10 mx-auto hidden max-w-6xl justify-center lg:flex"
      >
        <span
          className="font-mono text-[9px] uppercase tracking-[0.14em]"
          style={{ color: "#77756D" }}
        >
          Scroll to follow the proof
        </span>
      </div>

      {/* Stage cards */}
      <div className="absolute inset-0 z-10">
        {PIPELINE_STAGES.map((item, index) => {
          const isActive   = index === activeStage;
          const isComplete = index < activeStage;
          const isLeft     = index % 2 === 0;

          return (
            <motion.article
              key={item.label}
              aria-current={isActive ? "step" : undefined}
              /* Position is handled by absolute + top%, so we only animate
                 the visual "settle" when a card becomes active */
              animate={
                shouldReduce
                  ? {}
                  : {
                      y:     isActive ? 0    : isComplete ? 2   : 4,
                      scale: isActive ? 1    : isComplete ? 0.99 : 0.985,
                    }
              }
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={[
                "absolute -translate-y-1/2",
                "left-[4rem] right-4 sm:left-20 sm:right-8",
                "lg:w-[min(30rem,calc(50%-6rem))]",
                isLeft
                  ? "lg:left-[max(1.5rem,calc(50%-38rem))] lg:right-auto"
                  : "lg:left-auto lg:right-[max(1.5rem,calc(50%-38rem))]",
                "rounded-[8px] border p-4 sm:p-5",
                /* CSS colour transitions — complementing the framer scale */
                "transition-colors duration-200",
              ].join(" ")}
              style={{
                top:             `${STAGE_PROGRESS[index] * 100}%`,
                backgroundColor: isActive ? "#171714" : "#0B0B0A",
                borderColor:     isActive ? "#FF6A3D" : "#30302B",
                opacity:         isComplete ? 0.65 : 1,
                willChange:      "transform",
              }}
            >
              {/* Card header row */}
              <div
                className="flex items-center justify-between gap-3 pb-2.5"
                style={{ borderBottom: "1px solid #30302B" }}
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="font-mono text-[9px] tabular-nums transition-colors duration-200"
                    style={{ color: isActive ? "#FF6A3D" : "#77756D" }}
                  >
                    0{index + 1}
                  </span>
                  <h3
                    className="truncate font-mono text-[9px] tracking-[0.12em] sm:text-[10px] transition-colors duration-200"
                    style={{ color: isActive ? "#F2EFE6" : "#77756D" }}
                  >
                    {item.label}
                  </h3>
                </div>

                <span
                  className="shrink-0 font-mono text-[9px] tabular-nums"
                  style={{ color: "#77756D" }}
                >
                  {Math.round(progress * 100)}%
                </span>
              </div>

              {/* Card body — content fades in when active */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`body-${isActive}`}
                  initial={shouldReduce ? {} : { opacity: 0.5, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduce ? {} : { opacity: 0.5, y: -4 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <h4
                    className="mt-3 font-display text-sm font-semibold leading-snug sm:text-base"
                    style={{ color: "#F2EFE6" }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="mt-1.5 text-[11px] leading-relaxed sm:text-xs"
                    style={{ color: "#AAA69B", lineHeight: 1.6 }}
                  >
                    {item.description}
                  </p>

                  {/* Telemetry rows */}
                  <dl
                    className="mt-3 grid grid-cols-1 gap-1.5 pt-2.5 min-[480px]:grid-cols-3 min-[480px]:gap-3"
                    style={{ borderTop: "1px solid #30302B" }}
                  >
                    {item.telemetry.map(([label, value], ti) => (
                      <motion.div
                        key={label}
                        className="min-w-0"
                        initial={shouldReduce ? {} : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.15, ease: "easeOut", delay: 0.06 + ti * 0.04 }}
                      >
                        <dt
                          className="font-mono text-[8px] uppercase tracking-wider sm:text-[9px]"
                          style={{ color: "#77756D" }}
                        >
                          {label}
                        </dt>
                        <dd
                          className="mt-0.5 break-words font-mono text-[9px] leading-relaxed sm:text-[10px]"
                          style={{ color: "#F2EFE6" }}
                        >
                          {value}
                        </dd>
                      </motion.div>
                    ))}
                  </dl>
                </motion.div>
              </AnimatePresence>

              {item.verified && progress >= STAGE_PROGRESS[index] && (
                <motion.div
                  initial={shouldReduce ? {} : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="mt-3 flex items-start gap-2 rounded-[4px] p-2.5"
                  style={{
                    border: "1px solid rgba(255,106,61,0.3)",
                    backgroundColor: "rgba(255,106,61,0.06)",
                  }}
                >
                  <CheckCircle2
                    className="mt-0.5 h-3.5 w-3.5 shrink-0"
                    style={{ color: "#FF6A3D" }}
                    strokeWidth={1.5}
                  />
                  <div>
                    <p className="text-[11px] font-medium" style={{ color: "#F2EFE6" }}>
                      Verified credential issued
                    </p>
                    <p className="mt-0.5 font-mono text-[9px]" style={{ color: "#77756D" }}>
                      VFY-2026-0418 · SHA-256 integrity verified
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.article>
          );
        })}
      </div>

      {/* Section footer — current stage + progress */}
      <footer
        className="absolute bottom-5 left-5 right-5 z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 pt-3 font-mono text-[9px] uppercase tracking-wider sm:bottom-7 sm:left-8 sm:right-8 sm:pt-4 sm:text-[10px]"
        style={{ borderTop: "1px solid #30302B", color: "#77756D" }}
      >
        <span>
          <span className="hidden sm:inline">Current stage: </span>
          <span style={{ color: "#FF6A3D" }}>{stage.label}</span>
        </span>
        <span className="tabular-nums">{Math.round(progress * 100)}% complete</span>
      </footer>

      {/* Bottom hairline divider */}
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ backgroundColor: "#30302B" }} />
    </section>
  );
}
