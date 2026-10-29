import { useState } from "react";

const STEPS = [
  {
    cmd: "$ submit",
    title: "Code hits the queue, not the API thread",
    body: "Your solution goes from the Monaco editor straight into a Redis/Bull job. The API responds instantly — evaluation runs in the background instead of blocking the request.",
    detail: "POST /api/submissions → 202 Accepted",
  },
  {
    cmd: "$ execute",
    title: "Judge0 runs it in an isolated sandbox",
    body: "A sandbox worker sends your code to Judge0 and polls for the result — stdout, stderr, pass/fail against test cases — without VerifAI managing any container infrastructure itself.",
    detail: "sandbox worker → Judge0 API → stdout / stderr / status",
  },
  {
    cmd: "$ evaluate",
    title: "An LLM reviews it like a senior engineer",
    body: "The AI worker sends your code plus the Judge0 result to Gemini/Groq with a structured prompt, and parses back a score, strengths, weaknesses, and concrete suggestions — not just pass/fail.",
    detail: "AI worker → Gemini/Groq → { score, strengths[], weaknesses[] }",
  },
  {
    cmd: "$ verify",
    title: "Real-time result, badge on pass",
    body: "The result is saved to MongoDB and pushed to your browser over Socket.io — no polling. Clear the threshold, and a verifiable badge attaches to your public profile.",
    detail: "socket.emit('submission:complete') → badge issued",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    /* bg-base (#0B0B0A) — alternates with bg-raised PipelineSimulator */
    <section
      id="flow"
      className="relative py-20 md:py-28"
      style={{ backgroundColor: "#0B0B0A", borderTop: "1px solid #30302B" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Section header */}
        <div className="mb-12 max-w-xl">
          <p
            className="font-mono text-[10px] uppercase tracking-[0.18em] sm:text-[11px]"
            style={{ color: "#77756D" }}
          >
            03 — Pipeline
          </p>

          <h2
            className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
            style={{ color: "#F2EFE6", letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            Four commands between "submit" and "verified."
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          {/* Step navigation */}
          <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {STEPS.map((s, i) => (
              <button
                key={s.cmd}
                onClick={() => setActive(i)}
                className="flex shrink-0 items-center gap-3 rounded-[4px] border px-4 py-3 text-left font-mono text-sm transition-colors duration-200 md:shrink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  backgroundColor: i === active ? "#171714" : "transparent",
                  borderColor:     i === active ? "#FF6A3D" : "#30302B",
                  color:           i === active ? "#F2EFE6" : "#77756D",
                  focusRingColor:  "#FF6A3D",
                }}
              >
                {/* Accent dot — only on active tab */}
                <span
                  className="h-1.5 w-1.5 rounded-full shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: i === active ? "#FF6A3D" : "#30302B" }}
                />
                {s.cmd}
              </button>
            ))}
          </div>

          {/* Active step panel */}
          <div
            key={active}
            className="relative overflow-hidden rounded-[8px] border px-6 py-7"
            style={{ backgroundColor: "#171714", borderColor: "#30302B" }}
          >
            {/* Mono command label */}
            <p className="font-mono text-xs" style={{ color: "#FF6A3D" }}>
              {step.cmd}
            </p>

            <h3
              className="mt-3 font-display text-xl font-semibold md:text-2xl"
              style={{ color: "#F2EFE6", lineHeight: 1.2 }}
            >
              {step.title}
            </h3>

            <p
              className="mt-4 max-w-xl text-sm leading-relaxed md:text-base"
              style={{ color: "#AAA69B", lineHeight: 1.6 }}
            >
              {step.body}
            </p>

            {/* Detail row — monospace terminal-style */}
            <div
              className="mt-6 rounded-[4px] border px-4 py-3 font-mono text-xs"
              style={{
                backgroundColor: "#0B0B0A",
                borderColor:     "#30302B",
                color:           "#77756D",
              }}
            >
              {step.detail}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
