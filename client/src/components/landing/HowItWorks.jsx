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
    <section id="flow" className="container-xl py-24">
      <div className="mb-12 max-w-xl">
        <p className="eyebrow mb-3">the pipeline</p>
        <h2 className="text-3xl font-semibold text-mist-100 md:text-4xl">
          Four commands between "submit" and "verified."
        </h2>
      </div>

      <div className="grid gap-10 md:grid-cols-[280px_1fr]">
        <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {STEPS.map((s, i) => (
            <button
              key={s.cmd}
              onClick={() => setActive(i)}
              className={`flex shrink-0 items-center gap-3 rounded-lg border px-4 py-3 text-left font-mono text-sm transition-all duration-200 md:shrink ${
                i === active
                  ? "border-verify/50 bg-verify/10 text-verify"
                  : "border-ink-600 bg-transparent text-mist-500 hover:border-ink-500 hover:text-mist-300"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  i === active ? "bg-verify" : "bg-ink-500"
                }`}
              />
              {s.cmd}
            </button>
          ))}
        </div>

        <div className="card animate-rise px-7 py-8" key={active}>
          <p className="font-mono text-xs text-signal">{step.cmd}</p>
          <h3 className="mt-3 text-xl font-semibold text-mist-100 md:text-2xl">
            {step.title}
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-mist-300 md:text-base">
            {step.body}
          </p>
          <div className="mt-6 rounded-lg border border-ink-600 bg-ink-900 px-4 py-3 font-mono text-xs text-mist-500">
            {step.detail}
          </div>
        </div>
      </div>
    </section>
  );
}
