import { Link } from "react-router-dom";
import Button from "../ui/Button.jsx";
import Badge from "../ui/Badge.jsx";

export default function Hero() {
  return (
    <section className="container-xl relative pt-20 pb-24 md:pt-28">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <div className="animate-rise">
          <Badge tone="signal" className="mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-blink" />
            AI-evaluated · not AI-generated
          </Badge>

          <h1 className="text-4xl font-semibold leading-[1.08] text-mist-100 md:text-6xl">
            Your resume says
            <br />
            <span className="text-mist-500 line-through decoration-flag/60">
              "proficient in Node.js."
            </span>
            <br />
            <span className="text-verify">VerifAI</span> makes it provable.
          </h1>

          <p className="mt-6 max-w-lg text-base text-mist-300 md:text-lg">
            Solve real engineering challenges — API design, debugging, schema
            modeling — in a live sandbox. An AI reviews your code like a
            senior engineer would, and a verified badge lands on your public
            profile. No more self-reported skills.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button as={Link} to="/register" variant="verify" size="lg">
              Start a challenge
              <ArrowIcon />
            </Button>
            <Button as="a" href="#demo" variant="ghost" size="lg">
              Watch it evaluate code
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-6 font-mono text-xs text-mist-700">
            <span>zero paid APIs</span>
            <span className="h-1 w-1 rounded-full bg-ink-500" />
            <span>Judge0 sandboxed execution</span>
            <span className="h-1 w-1 rounded-full bg-ink-500" />
            <span>MERN stack</span>
          </div>
        </div>

        <HeroTerminal />
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 8H12.5M12.5 8L8.5 4M12.5 8L8.5 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroTerminal() {
  return (
    <div className="animate-rise [animation-delay:150ms]">
      <div className="card overflow-hidden shadow-2xl shadow-black/40">
        <div className="flex items-center gap-2 border-b border-ink-600 bg-ink-800/80 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-flag/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-mist-700/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-verify/70" />
          <span className="ml-3 font-mono text-xs text-mist-500">
            submissions/api-rate-limiter.js
          </span>
        </div>
        <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-6 text-mist-300">
          <code>
            <span className="text-signal">function</span>{" "}
            <span className="text-verify">tokenBucket</span>
            {"("}
            <span className="text-mist-100">capacity, refillRate</span>
            {") {"}
            {"\n"}
            {"  "}
            <span className="text-mist-700">
              // O(1) refill — avoids per-request loop
            </span>
            {"\n"}
            {"  "}
            <span className="text-signal">let</span> tokens = capacity;
            {"\n"}
            {"  "}
            <span className="text-signal">let</span> last = Date.now();
            {"\n\n"}
            {"  "}
            <span className="text-signal">return</span> {"{"}
            {"\n"}
            {"    "}allow() {"{"}
            {"\n"}
            {"      "}
            <span className="text-mist-700">/* ... */</span>
            {"\n"}
            {"    "}
            {"}"}
            {"\n"}
            {"  "}
            {"};"}
            {"\n"}
            {"}"}
          </code>
        </pre>
        <div className="flex items-center justify-between border-t border-ink-600 bg-ink-800/60 px-5 py-4">
          <div className="flex items-center gap-2 font-mono text-xs text-verify">
            <CheckIcon />
            AI review: architecture sound · edge cases handled
          </div>
          <Badge tone="verify">score 94</Badge>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8.5L6.2 11.5L13 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
