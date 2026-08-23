const LAYERS = [
  {
    layer: "client",
    items: [
      "React (Vite)",
      "Tailwind CSS",
      "Monaco Editor",
      "Socket.io-client",
    ],
  },
  {
    layer: "api",
    items: [
      "Node.js",
      "Express.js",
      "JWT (access + refresh)",
      "express-rate-limit",
    ],
  },
  {
    layer: "processing",
    items: [
      "Bull (Redis queue)",
      "Judge0 API",
      "Gemini / Groq",
    ],
  },
  {
    layer: "data",
    items: [
      "MongoDB Atlas",
      "Redis (Upstash)",
      "Cloudinary",
    ],
  },
];

export default function TechStack() {
  return (
    <section id="stack" className="container-xl py-24">
      <div className="mb-12 max-w-xl">
        <p className="eyebrow mb-3 text-violet-400">
          under the hood
        </p>

        <h2 className="text-3xl font-semibold text-mist-100 md:text-4xl">
          Four layers, zero paid infrastructure.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {LAYERS.map((l, i) => (
          <div
            key={l.layer}
            className="card relative overflow-hidden px-5 py-6 transition-all duration-300 hover:border-violet-500/20 hover:shadow-[0_0_30px_rgba(139,92,246,0.06)]"
          >
            {/* Subtle purple moon glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-violet-600/8 blur-3xl" />

            <div className="relative">
              <p className="font-mono text-xs text-mist-700">
                0{i + 1}
              </p>

              <p className="mt-1 font-display text-sm font-semibold uppercase tracking-wide text-mist-100">
                {l.layer}
              </p>

              <ul className="mt-4 space-y-2">
                {l.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 font-mono text-xs text-mist-500"
                  >
                    {/* Purple indicator */}
                    <span className="h-1 w-1 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.6)]" />

                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {i < LAYERS.length - 1 && (
              <span className="pointer-events-none absolute -right-2.5 top-1/2 hidden -translate-y-1/2 font-mono text-violet-500/30 md:block">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}