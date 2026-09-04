import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  CheckCircle2,
  Sparkles,
  Terminal,
  Award,
  RefreshCw,
  Code2,
  FileCode,
  ShieldCheck,
  ChevronRight,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";

const CHALLENGES = [
  {
    id: "rate-limiter",
    title: "Token Bucket Rate Limiter",
    category: "Distributed Systems",
    difficulty: "Medium",
    language: "JavaScript (Node.js)",
    description:
      "Implement a thread-safe token bucket rate limiter in O(1) time without looping over elapsed timestamps on every incoming request.",
    code: `class TokenBucket {
  constructor(capacity, refillRatePerSecond) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRatePerSecond;
    this.lastRefill = Date.now();
  }

  // O(1) algorithmic calculation of token replenishment
  allow(tokensRequested = 1) {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    
    // Replenish tokens based on elapsed delta
    this.tokens = Math.min(
      this.capacity, 
      this.tokens + elapsed * this.refillRate
    );
    this.lastRefill = now;

    if (this.tokens >= tokensRequested) {
      this.tokens -= tokensRequested;
      return true;
    }
    return false;
  }
}`,
    tests: [
      { name: "Burst capacity allows up to max limit", passed: true, time: "4ms" },
      { name: "Tokens replenish accurately over 500ms delay", passed: true, time: "8ms" },
      { name: "Exceeding capacity returns false without dropping state", passed: true, time: "3ms" },
      { name: "High-frequency concurrent calls prevent race condition", passed: true, time: "6ms" },
    ],
    aiReview: {
      score: 96,
      verdict: "Exceptional Architecture",
      strengths: [
        "O(1) time complexity — avoids interval timers or request queuing overhead.",
        "Mathematical delta computation handles arbitrary clock skew gracefully.",
        "Deterministic token reservation ensures zero dropped allocations under peak load.",
      ],
      optimization: "Consider using process.hrtime.bigint() for sub-millisecond precision under extreme microservice spikes.",
      badgeTitle: "Distributed Systems: Rate Limiter Master",
    },
  },
  {
    id: "redis-mutex",
    title: "Distributed Mutex with Auto-Expiry",
    category: "Backend Concurrency",
    difficulty: "Hard",
    language: "Node.js & Redis",
    description:
      "Design an atomic distributed lock engine with unique UUID ownership, lease auto-expiry, and safe release semantics using Redis Lua scripts.",
    code: `async function acquireLock(redis, resourceKey, ttlMs) {
  const lockToken = crypto.randomUUID();
  const acquired = await redis.set(
    \`lock:\${resourceKey}\`,
    lockToken,
    "PX",
    ttlMs,
    "NX"
  );
  return acquired === "OK" ? lockToken : null;
}

// Atomic release via Redis Lua script prevents accidental release of stolen lock
const RELEASE_SCRIPT = \`
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
\`;

async function releaseLock(redis, resourceKey, lockToken) {
  return await redis.eval(RELEASE_SCRIPT, 1, \`lock:\${resourceKey}\`, lockToken);
}`,
    tests: [
      { name: "Atomic SET NX PX acquires uncontested lock", passed: true, time: "7ms" },
      { name: "Second concurrent worker blocked during lease", passed: true, time: "5ms" },
      { name: "Lua script guarantees lock cannot be freed by expired owner", passed: true, time: "9ms" },
      { name: "Safe automatic release upon lease expiration", passed: true, time: "11ms" },
    ],
    aiReview: {
      score: 98,
      verdict: "Production Ready",
      strengths: [
        "Lua script execution is completely atomic on the Redis single thread.",
        "Crypto UUID token prevents dangerous race condition where a lagging worker unlocks a new owner.",
        "PX millisecond precision prevents long deadlock states.",
      ],
      optimization: "For multi-node Redis clusters, consider upgrading to the Redlock quorum algorithm.",
      badgeTitle: "Concurrency: Distributed Mutex Specialist",
    },
  },
  {
    id: "jwt-rotation",
    title: "Cryptographic Refresh Token Rotator",
    category: "API Security",
    difficulty: "Medium",
    language: "Node.js & Crypto",
    description:
      "Implement one-time refresh token rotation with immediate reuse detection and family token revocation to prevent replay hijacking.",
    code: `async function rotateRefreshToken(tokenFamilyId, presentedTokenHash) {
  const session = await Session.findOne({ familyId: tokenFamilyId });
  if (!session) throw new UnauthorizedError("Invalid session");

  // Replay detection: If token was already used, breach detected!
  if (session.usedTokens.includes(presentedTokenHash)) {
    await Session.deleteMany({ familyId: tokenFamilyId }); // Revoke entire family
    throw new SecurityBreachError("Token reuse detected. All sessions revoked.");
  }

  const nextToken = crypto.randomBytes(32).toString("hex");
  const nextHash = crypto.createHash("sha256").update(nextToken).digest("hex");

  session.usedTokens.push(presentedTokenHash);
  session.currentHash = nextHash;
  await session.save();

  return nextToken;
}`,
    tests: [
      { name: "Valid token yields fresh access + rotated refresh pair", passed: true, time: "6ms" },
      { name: "Immediate reuse of previously consumed token triggers breach alarm", passed: true, time: "4ms" },
      { name: "All sessions in compromised family revoked instantly", passed: true, time: "8ms" },
      { name: "SHA-256 hashed storage prevents database leak escalation", passed: true, time: "3ms" },
    ],
    aiReview: {
      score: 95,
      verdict: "High-Assurance Security",
      strengths: [
        "Zero-trust token family invalidation renders stolen token replays harmless.",
        "Hashes stored in MongoDB instead of plaintext protects against DB compromise.",
        "Clear exception stratification for auditing security incidents.",
      ],
      optimization: "Store token family metadata in high-speed Redis TTL cache to reduce MongoDB write pressure.",
      badgeTitle: "API Security: Token Rotation Architect",
    },
  },
];

export default function InteractivePlayground() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const [stepIndex, setStepIndex] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const playgroundRef = useRef(null);

  const challenge = CHALLENGES[selectedIdx];

  const handleRunVerification = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompleted(false);
    setStepIndex(0);

    // Stage 1: Compiling & dispatching to Judge0
    setTimeout(() => {
      setStepIndex(1);
    }, 700);

    // Stage 2: Running test cases
    setTimeout(() => {
      setStepIndex(2);
    }, 1800);

    // Stage 3: AI Code review
    setTimeout(() => {
      setStepIndex(3);
      setCompleted(true);
      setIsRunning(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ["#9333EA", "#C084FC", "#38BDF8", "#34D399"],
        });
      } catch {
        // Fallback gracefully
      }
    }, 3200);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCompleted(false);
    setStepIndex(-1);
  };

  return (
    <section id="playground" className="container-xl py-24 relative" ref={playgroundRef}>
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-purple-600/10 blur-3xl" />

      {/* Header */}
      <div className="mb-12 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 font-mono text-xs mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Sandbox Simulator</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-mist-100 font-display">
          Experience VerifAI live. Test real engineering challenges.
        </h2>
        <p className="mt-4 text-mist-300 text-base leading-relaxed">
          Select a real backend challenge below. Hit <strong className="text-violet-400 font-normal">"Run Sandboxed Verification"</strong> to simulate Judge0 executing unit tests and the AI review engine grading your architecture.
        </p>
      </div>

      {/* Challenge Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {CHALLENGES.map((item, idx) => {
          const isActive = idx === selectedIdx;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedIdx(idx);
                handleReset();
              }}
              className={`text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                isActive
                  ? "border-violet-500 bg-violet-950/20 shadow-[0_0_25px_rgba(147,51,234,0.15)]"
                  : "border-ink-600 bg-ink-800/40 hover:border-ink-500 hover:bg-ink-800/70"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs text-violet-400">{item.category}</span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                    item.difficulty === "Hard"
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {item.difficulty}
                </span>
              </div>
              <h3 className="font-display text-sm font-semibold text-mist-100">{item.title}</h3>
              <p className="text-xs text-mist-500 mt-1 line-clamp-1">{item.description}</p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive IDE & Result Container */}
      <div className="card overflow-hidden border-ink-600 grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
        {/* Left Side: Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-ink-600 bg-[#070A10]">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-ink-600 bg-ink-800/80 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <span className="font-mono text-xs text-mist-400 flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5 text-violet-400" />
                solution.js
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("code")}
                className={`px-2.5 py-1 rounded font-mono text-xs transition-colors ${
                  activeTab === "code"
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-mist-500 hover:text-mist-300"
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`px-2.5 py-1 rounded font-mono text-xs transition-colors ${
                  activeTab === "tests"
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-mist-500 hover:text-mist-300"
                }`}
              >
                Test Suite ({challenge.tests.length})
              </button>
            </div>
          </div>

          {/* Editor Content Area */}
          <div className="p-4 flex-1 font-mono text-[12.5px] leading-relaxed overflow-x-auto no-scrollbar min-h-[320px] bg-[#070A10]/95 text-mist-300">
            {activeTab === "code" ? (
              <pre className="selection:bg-violet-500/30 no-scrollbar">
                <code>
                  {challenge.code.split("\n").map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-8 select-none text-right pr-4 text-mist-700 font-mono text-xs">
                        {idx + 1}
                      </span>
                      <span className="flex-1 whitespace-pre">
                        {line.includes("//") ? (
                          <span className="text-mist-500 italic">{line}</span>
                        ) : line.includes("class") || line.includes("function") || line.includes("const") || line.includes("async") || line.includes("return") ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: line
                                .replace(/\b(class|constructor|function|const|let|async|await|return|if|else|throw|new)\b/g, '<span class="text-violet-400 font-medium">$1</span>')
                                .replace(/\b(TokenBucket|Date|Math|crypto|Session|UnauthorizedError|SecurityBreachError)\b/g, '<span class="text-amber-300">$1</span>'),
                            }}
                          />
                        ) : (
                          line
                        )}
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            ) : (
              <div className="space-y-2 py-2">
                <p className="text-xs text-mist-500 mb-3 font-mono">Hidden Unit Tests executed in Judge0 sandbox:</p>
                {challenge.tests.map((test, tIdx) => (
                  <div
                    key={tIdx}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-ink-600 bg-ink-800/40 font-mono text-xs"
                  >
                    <div className="flex items-center gap-2 text-mist-300">
                      <Code2 className="h-3.5 w-3.5 text-violet-400" />
                      <span>{test.name}</span>
                    </div>
                    <span className="text-mist-500 text-[11px]">{test.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="border-t border-ink-600 bg-ink-800/60 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs text-mist-500">
              <span className="h-2 w-2 rounded-full bg-violet-400" />
              <span>Language: {challenge.language}</span>
            </div>

            <div className="flex items-center gap-2">
              {completed && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Reset
                </Button>
              )}
              <Button
                variant="verify"
                size="sm"
                onClick={handleRunVerification}
                disabled={isRunning}
                className="purple-glow"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Evaluating ({stepIndex === 0 ? "Judge0..." : stepIndex === 1 ? "Running Tests..." : "AI Review..."})
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1.5 fill-current" />
                    Run Sandboxed Verification
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Execution & AI Evaluation Telemetry (5 cols) */}
        <div className="lg:col-span-5 bg-ink-900/60 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink-600">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-violet-400" />
                <span className="font-mono text-xs uppercase tracking-wider text-mist-300 font-semibold">
                  Evaluation Engine
                </span>
              </div>
              <span className="font-mono text-[11px] text-mist-500">
                {isRunning ? "PROCESSING" : completed ? "VERIFIED" : "STANDBY"}
              </span>
            </div>

            {/* Stepper Progress */}
            <div className="space-y-3 mb-5">
              {[
                { title: "Sandbox compilation", desc: "Judge0 isolated Linux container" },
                { title: "Unit test suite", desc: "4/4 edge cases validated" },
                { title: "Senior AI code review", desc: "Gemini / Groq architectural audit" },
              ].map((st, i) => {
                const isPast = stepIndex > i;
                const isCurrent = stepIndex === i;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 relative flex items-center justify-center">
                      {isCurrent ? (
                        <span className="h-4 w-4 rounded-full border border-violet-400 flex items-center justify-center">
                          <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                        </span>
                      ) : isPast ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-ink-500 bg-ink-800" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-xs font-mono font-medium ${
                          isPast ? "text-mist-100" : isCurrent ? "text-violet-300" : "text-mist-600"
                        }`}
                      >
                        {st.title}
                      </p>
                      <p className="text-[11px] text-mist-500">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Review Output / Idle State */}
            <AnimatePresence mode="wait">
              {completed ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Score & Verdict Banner */}
                  <div className="p-4 rounded-xl border border-violet-500/40 bg-violet-950/20 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-mono uppercase text-violet-400">Verdict</p>
                      <h4 className="font-display font-semibold text-mist-100 text-base">
                        {challenge.aiReview.verdict}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-2xl font-bold text-violet-400">
                        {challenge.aiReview.score}
                      </span>
                      <span className="font-mono text-xs text-mist-500">/100</span>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="p-3.5 rounded-lg border border-ink-600 bg-ink-800/50 space-y-2">
                    <p className="text-[11px] font-mono text-mist-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="h-3 w-3 text-violet-400" />
                      Key Strengths Identified
                    </p>
                    <ul className="space-y-1.5 text-xs text-mist-300">
                      {challenge.aiReview.strengths.map((str, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Issued Badge Preview */}
                  <div className="p-3.5 rounded-lg border border-violet-500/30 bg-violet-950/30 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-violet-500/20 border border-violet-400/40 flex items-center justify-center shrink-0">
                      <Award className="h-5 w-5 text-violet-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Badge Minted
                      </span>
                      <p className="font-display text-xs font-semibold text-mist-100 truncate">
                        {challenge.aiReview.badgeTitle}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : isRunning ? (
                <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed border-ink-600 rounded-xl">
                  <RefreshCw className="h-8 w-8 text-violet-400 animate-spin mb-3" />
                  <p className="text-xs font-mono text-mist-200">Executing sandbox verification...</p>
                  <p className="text-[11px] text-mist-500 mt-1">Collecting stdout & AI critique</p>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed border-ink-600 rounded-xl bg-ink-800/20">
                  <Terminal className="h-8 w-8 text-mist-600 mb-2" />
                  <p className="text-xs font-mono text-mist-400">Ready to execute</p>
                  <p className="text-[11px] text-mist-600 mt-1 max-w-xs">
                    Click "Run Sandboxed Verification" to watch the automated evaluation pipeline in action.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-4 border-t border-ink-600 flex items-center justify-between text-[11px] font-mono text-mist-600">
            <span>Judge0 v1.13 Isolated</span>
            <span>Gemini 1.5 Pro</span>
          </div>
        </div>
      </div>
    </section>
  );
}
