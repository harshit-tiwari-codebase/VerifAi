const LAYERS = [
  {
    layer: "client",
    items: ["React (Vite)", "Tailwind CSS", "Monaco Editor", "Socket.io-client"],
  },
  {
    layer: "api",
    items: ["Node.js", "Express.js", "JWT (access + refresh)", "express-rate-limit"],
  },
  {
    layer: "processing",
    items: ["Bull (Redis queue)", "Judge0 API", "Gemini / Groq"],
  },
  {
    layer: "data",
    items: ["MongoDB Atlas", "Redis (Upstash)", "Cloudinary"],
  },
];

export default function TechStack() {
  return (
    <section id="stack" className="container-xl py-24">
      <div className="mb-12 max-w-xl">
        <p className="eyebrow mb-3">under the hood</p>
        <h2 className="text-3xl font-semibold text-mist-100 md:text-4xl">
          Four layers, zero paid infrastructure.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {LAYERS.map((l, i) => (
          <div key={l.layer} className="card relative px-5 py-6">
            <p className="font-mono text-xs text-mist-700">0{i + 1}</p>
            <p className="mt-1 font-display text-sm font-semibold uppercase tracking-wide text-mist-100">
              {l.layer}
            </p>
            <ul className="mt-4 space-y-2">
              {l.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 font-mono text-xs text-mist-500"
                >
                  <span className="h-1 w-1 rounded-full bg-verify" />
                  {item}
                </li>
              ))}
            </ul>
            {i < LAYERS.length - 1 && (
              <span className="pointer-events-none absolute -right-2.5 top-1/2 hidden -translate-y-1/2 font-mono text-ink-500 md:block">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
