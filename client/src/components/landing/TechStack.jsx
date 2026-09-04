import { Layers, Server, Cpu, Database } from "lucide-react";

const LAYERS = [
  {
    layer: "Client Layer",
    role: "Interactive Developer Environment",
    icon: Layers,
    items: [
      { name: "React 18 + Vite", note: "Ultra-fast HMR & hydration" },
      { name: "Monaco Editor", note: "VS Code in-browser editing" },
      { name: "Socket.io Client", note: "Real-time non-polling updates" },
      { name: "Tailwind CSS", note: "Subtle dark-mode aesthetic" },
    ],
  },
  {
    layer: "API Gateway",
    role: "Non-blocking Routing & Auth",
    icon: Server,
    items: [
      { name: "Node.js + Express", note: "RESTful endpoints & sockets" },
      { name: "Dual-Token JWT", note: "Memory access + httpOnly refresh" },
      { name: "Rate Limiting", note: "DDoS & brute-force mitigation" },
      { name: "Async 202 Handshake", note: "Queue delegation in < 40ms" },
    ],
  },
  {
    layer: "Evaluation Engine",
    role: "Sandboxed Execution & AI Review",
    icon: Cpu,
    items: [
      { name: "Bull (Redis Queue)", note: "Job queue & concurrency worker" },
      { name: "Judge0 API", note: "Isolated Linux container runner" },
      { name: "Gemini 1.5 Pro", note: "Senior engineer code quality review" },
      { name: "Groq Llama 3", note: "Ultra-low-latency secondary fallback" },
    ],
  },
  {
    layer: "Data & Proofs",
    role: "Persistent Storage & Credentials",
    icon: Database,
    items: [
      { name: "MongoDB Atlas", note: "Submissions, badges & profiles" },
      { name: "Upstash Redis", note: "Serverless distributed cache" },
      { name: "SHA-256 Hashes", note: "Tamper-evident proof of work" },
      { name: "Cloudinary", note: "Optimized profile avatar hosting" },
    ],
  },
];

export default function TechStack() {
  return (
    <section id="stack" className="container-xl py-24 relative">
      <div className="mb-14 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 font-mono text-xs mb-3">
          <Server className="h-3.5 w-3.5" />
          <span>Production Architecture</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-mist-100 font-display">
          Four production layers. Zero paid infrastructure.
        </h2>
        <p className="mt-4 text-mist-300 text-base leading-relaxed">
          Engineered from day one for extreme reliability, thread safety, and zero deployment cost utilizing best-in-class free tier services.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {LAYERS.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <div
              key={layer.layer}
              className="card p-6 border-ink-600 hover:border-violet-500/30 hover:shadow-[0_0_30px_rgba(147,51,234,0.08)] transition-all duration-300 relative group flex flex-col justify-between"
            >
              {/* Subtle aura */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-600/10 blur-3xl group-hover:bg-violet-600/20 transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-mist-600">0{idx + 1}</span>
                  <div className="h-8 w-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="font-display font-semibold text-base text-mist-100">
                  {layer.layer}
                </h3>
                <p className="text-xs font-mono text-violet-400 mt-0.5">{layer.role}</p>

                <div className="mt-6 space-y-3 pt-4 border-t border-ink-600/80">
                  {layer.items.map((item) => (
                    <div key={item.name} className="flex flex-col">
                      <span className="font-mono text-xs font-medium text-mist-200 flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-violet-400" />
                        {item.name}
                      </span>
                      <span className="text-[11px] text-mist-500 pl-2.5">{item.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-ink-600/50 flex items-center justify-between text-[10px] font-mono text-mist-600">
                <span>STAGE 0{idx + 1}</span>
                <span className="text-emerald-400">OPERATIONAL</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}