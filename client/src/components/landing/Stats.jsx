import { useEffect, useRef, useState } from "react";

const STATS = [
  {
    label: "Avg. evaluation turnaround",
    value: 28,
    prefix: "< ",
    suffix: "s",
    detail: "From Monaco editor submit to verified badge",
  },
  {
    label: "Evaluation dimensions",
    value: 6,
    prefix: "",
    suffix: " metrics",
    detail: "Correctness, time complexity, safety, style",
  },
  {
    label: "Execution sandbox isolation",
    value: 100,
    prefix: "",
    suffix: "%",
    detail: "Linux cgroups + seccomp micro-containers",
  },
  {
    label: "Platform infrastructure cost",
    value: 0,
    prefix: "₹",
    suffix: " / month",
    detail: "Engineered on modern production free tiers",
  },
];

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || target === 0) {
      setValue(target);
      return;
    }

    let frame;
    let start = null;

    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function Stat({ stat, active }) {
  const count = useCountUp(stat.value, active);

  return (
    <div className="group relative border-t border-[#27272A] pt-5">
      {/* violet line that sweeps across the top on hover */}
      <span
        aria-hidden="true"
        className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-[#8B5CF6] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100 motion-reduce:transition-none"
      />

      <p className="font-display text-4xl font-semibold tracking-tight text-[#FAFAFA] tabular-nums transition-[transform,color] duration-300 ease-out group-hover:-translate-y-1 group-hover:text-[#C4B5FD] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 md:text-5xl">
        <span className="whitespace-pre text-[#71717A] transition-colors duration-300 group-hover:text-[#8B5CF6]">
          {stat.prefix}
        </span>
        {count}
        <span className="whitespace-pre text-lg font-normal text-[#71717A] transition-colors duration-300 group-hover:text-[#8B5CF6] md:text-xl">
          {stat.suffix}
        </span>
      </p>

      <p className="mt-4 font-sans text-sm font-medium text-[#FAFAFA]">
        {stat.label}
      </p>
      <p className="mt-1 font-sans text-sm leading-relaxed text-[#71717A] transition-colors duration-300 group-hover:text-[#A1A1AA]">
        {stat.detail}
      </p>
    </div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="container-xl py-16 md:py-20">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <Stat key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </section>
  );
}