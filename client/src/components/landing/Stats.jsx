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
  },
  {
    icon: Zap,
    label: "Evaluation Dimensions",
    value: 6,
    prefix: "",
    suffix: " Metrics",
    detail: "Correctness, time complexity, safety, style",
  },
  {
    icon: Cpu,
    label: "Execution Sandbox Isolation",
    value: 100,
    prefix: "",
    suffix: "%",
    detail: "Linux cgroups + seccomp micro-containers",
  },
  {
    icon: ShieldCheck,
    label: "Platform Infrastructure Cost",
    value: 0,
    prefix: "₹",
    suffix: " / month",
    detail: "Engineered on modern production free tiers",
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
    <div className="card p-6 border border-[#27272A] hover:border-[#3F3F4A] bg-[#18181F] hover:bg-[#20202A] rounded-2xl transition-all duration-200 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#FAFAFA]">
          <span className="text-[#8B5CF6] font-semibold">{stat.prefix}</span>
          {count}
          <span className="text-[#A1A1AA] text-lg md:text-xl font-normal ml-0.5">
            {stat.suffix}
          </span>
        </span>
        <div className="h-9 w-9 rounded-xl bg-[#211635] border border-[#8B5CF6]/30 flex items-center justify-center text-[#A78BFA]">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <p className="font-display font-medium text-sm text-[#FAFAFA]">{stat.label}</p>
      <p className="text-xs text-[#71717A] mt-1 font-sans">{stat.detail}</p>
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
    <section ref={ref} className="container-xl py-12 md:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {STATS.map((stat, idx) => (
          <StatCard key={idx} stat={stat} active={active} />
        ))}
      </div>
    </section>
  );
}
