import { useEffect, useRef, useState } from "react";
import { Clock, Cpu, ShieldCheck, Zap } from "lucide-react";

const STATS = [
  {
    icon: Clock,
    label: "Avg. Evaluation Turnaround",
    value: 28,
    prefix: "< ",
    suffix: "s",
    detail: "From Monaco editor submit to verified badge",
    tone: "verify",
  },
  {
    icon: Zap,
    label: "Evaluation Dimensions",
    value: 6,
    prefix: "",
    suffix: " Metrics",
    detail: "Correctness, time complexity, safety, style",
    tone: "signal",
  },
  {
    icon: Cpu,
    label: "Execution Sandbox Isolation",
    value: 100,
    prefix: "",
    suffix: "%",
    detail: "Linux cgroups + seccomp micro-containers",
    tone: "verify",
  },
  {
    icon: ShieldCheck,
    label: "Platform Infrastructure Cost",
    value: 0,
    prefix: "₹",
    suffix: " / month",
    detail: "Engineered on modern production free tiers",
    tone: "signal",
  },
];

function useCountUp(target, active, duration = 1400) {
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
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function StatCard({ stat, active }) {
  const count = useCountUp(stat.value, active);
  const Icon = stat.icon;

  return (
    <div className="card p-6 border-ink-600 hover:border-violet-500/30 hover:shadow-[0_0_25px_rgba(147,51,234,0.08)] transition-all duration-300 relative overflow-hidden group">
      {/* Subtle purple atmosphere */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-600/10 blur-2xl group-hover:bg-violet-600/20 transition-colors" />

      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-3xl md:text-4xl font-bold tracking-tight text-mist-100">
          <span className="text-violet-400 font-semibold">{stat.prefix}</span>
          {count}
          <span className="text-mist-400 text-lg md:text-xl font-normal ml-0.5">
            {stat.suffix}
          </span>
        </span>
        <div className="h-9 w-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <p className="font-display font-medium text-sm text-mist-200">{stat.label}</p>
      <p className="text-xs text-mist-400 mt-1 font-sans">{stat.detail}</p>
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
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="container-xl py-12 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </section>
  );
}