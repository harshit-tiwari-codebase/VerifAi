import { useEffect, useRef, useState } from "react";

const STATS = [
  { label: "avg. evaluation time", value: 34, suffix: "s", tone: "verify" },
  { label: "review criteria per submission", value: 4, suffix: "", tone: "signal" },
  { label: "cost to run this stack", value: 0, prefix: "₹", tone: "verify" },
  { label: "custom sandbox code written", value: 0, suffix: " lines", tone: "signal" },
];

function useCountUp(target, active, duration = 1200) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    let frame;
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function StatCard({ stat, active }) {
  const count = useCountUp(stat.value, active);
  return (
    <div className="card px-6 py-7">
      <p
        className={`font-display text-4xl font-semibold ${
          stat.tone === "verify" ? "text-verify" : "text-signal"
        }`}
      >
        {stat.prefix}
        {count}
        {stat.suffix}
      </p>
      <p className="mt-2 font-mono text-xs text-mist-500">{stat.label}</p>
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
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="container-xl py-16">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </section>
  );
}
