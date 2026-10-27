import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  CheckCircle2,
  ArrowUpRight,
  Terminal,
  Award,
  RefreshCw,
  Code2,
  FileCode,
  ShieldCheck,
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
      { name: "Lock acquisition creates key with millisecond TTL", passed: true, time: "5ms" },
      { name: "Simultaneous acquire attempts: exactly 1 winner", passed: true, time: "9ms" },
      { name: "Lock auto-releases after TTL expiry without manual intervention", passed: true, time: "12ms" },
      { name: "Token verification prevents deleting another worker's lock", passed: true, time: "4ms" },
    ],
    aiReview: {
      score: 94,
      verdict: "Production Hardened",
      strengths: [
        "Lua script execution guarantees atomicity across distributed nodes.",
        "UUID owner tokens prevent race conditions where expired locks are hijacked.",
        "NX + PX flags ensure atomic test-and-set semantics in a single network round-trip.",
      ],
      optimization: "Implement a Redlock multi-instance quorum consensus algorithm for multi-master Redis architectures.",
      badgeTitle: "Concurrency: Distributed Lock Specialist",
    },
  },
  {
    id: "jwt-rotation",
    title: "Refresh Token Rotation with Blacklist",
    category: "Security & Auth",
    difficulty: "Medium",
    language: "Node.js & Crypto",
    description:
      "Prevent replay attacks by implementing refresh token rotation with single-use detection that invalidates entire token family upon reuse.",
    code: `class TokenManager {
  constructor(db) {
    this.db = db; // persistent session store
  }

  async rotateRefreshToken(familyId, presentedToken) {
    const session = await this.db.findSessionByFamily(familyId);
    
    // Compromise detected: presented token was already used!
    if (session.usedTokens.has(presentedToken)) {
      await this.db.revokeEntireFamily(familyId);
      throw new SecurityBreachError("Token reuse detected! Revoking all sessions.");
    }

    if (session.currentToken !== presentedToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    // Mint fresh pair and retire old token
    const newRefreshToken = crypto.randomBytes(32).toString("hex");
    const newAccessToken = signJwt({ sub: session.userId }, "15m");

    await this.db.updateSession(familyId, {
      currentToken: newRefreshToken,
      usedTokens: session.usedTokens.add(presentedToken),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}`,
    tests: [
      { name: "Valid rotation updates current token and returns new pair", passed: true, time: "6ms" },
      { name: "Replaying a spent refresh token revokes entire session family", passed: true, time: "8ms" },
      { name: "Compromised token generates security alert event", passed: true, time: "4ms" },
      { name: "Mismatched family ID safely rejects with 401 Unauthorized", passed: true, time: "3ms" },
    ],
    aiReview: {
      score: 98,
      verdict: "Enterprise Security Grade",
      strengths: [
        "Cryptographic token-family tracking immediately mitigates stolen refresh tokens.",
        "Immediate session family revocation bounds blast radius of leaked credentials.",
        "Strict single-use token semantics conform with RFC 6749 OAuth 2.0 best practices.",
      ],
      optimization: "Add Redis-backed sliding-window rate limiting to the refresh endpoint to prevent brute-force rotation attempts.",
      badgeTitle: "Security: Cryptographic Auth Architect",
    },
  },
];

export default function InteractivePlayground() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("code"); // "code" | "tests"
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1); // -1: idle, 0: compiling, 1: tests, 2: ai review
  const [completed, setCompleted] = useState(false);

  const challenge = CHALLENGES[selectedIdx];

  const handleReset = () => {
    setIsRunning(false);
    setStepIndex(-1);
    setCompleted(false);
  };

  const handleRunVerification = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCompleted(false);
    setStepIndex(0);

    // Step 0: Sandbox Compilation
    setTimeout(() => {
      setStepIndex(1);

      // Step 1: Unit Test Suite
      setTimeout(() => {
        setStepIndex(2);

        // Step 2: Senior AI Code Review & Scoring
        setTimeout(() => {
          setIsRunning(false);
          setCompleted(true);
          setStepIndex(3);

          try {
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.7 },
              colors: ["#8B5CF6", "#7C3AED", "#A78BFA", "#34D399", "#FBBF24"],
              disableForReducedMotion: true,
            });
          } catch {
            // Confetti optional
          }
        }, 1100);
      }, 950);
    }, 800);
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto font-sans">
      {/* Eyebrow & Title */}
      <div className="mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#8B5CF6]/30 bg-[#211635] text-[#C4B5FD] font-mono text-xs font-medium mb-3">
          <ArrowUpRight className="h-3.5 w-3.5 text-[#A78BFA]" />
          <span>Interactive Sandbox Simulator</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-[#FAFAFA] font-display tracking-tight">
          Experience VerifAI live. Test real engineering challenges.
        </h2>
        <p className="mt-3 text-[#A1A1AA] text-sm sm:text-base leading-relaxed font-sans">
          Select a real backend challenge below. Hit <strong className="text-[#C4B5FD] font-medium">"Run Sandboxed Verification"</strong> to simulate Judge0 executing unit tests and the AI review engine grading your architecture.
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
              className={`text-left p-4 rounded-[14px] border transition-all duration-150 relative overflow-hidden ${
                isActive
                  ? "border-[#8B5CF6] bg-[#211635] shadow-[0_0_24px_rgba(139,92,246,0.16)]"
                  : "border-[#27272A] bg-[#18181F] hover:border-[#3F3F4A] hover:bg-[#20202A]"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-sans text-xs font-medium text-[#A78BFA]">{item.category}</span>
                <span
                  className={`text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded ${
                    item.difficulty === "Hard"
                      ? "bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30"
                      : "bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30"
                  }`}
                >
                  {item.difficulty}
                </span>
              </div>
              <h3 className="font-display text-sm font-semibold text-[#FAFAFA]">{item.title}</h3>
              <p className="text-xs text-[#A1A1AA] mt-1 line-clamp-1 font-sans">{item.description}</p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive IDE & Result Container */}
      <div className="rounded-[14px] overflow-hidden border border-[#27272A] grid grid-cols-1 lg:grid-cols-12 shadow-2xl bg-[#0D0D12]">
        {/* Left Side: Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-[#27272A] bg-[#0D0D12]">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-[#27272A] bg-[#14141B] px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
              </div>
              <span className="font-mono text-xs text-[#FAFAFA] flex items-center gap-1.5 font-medium">
                <FileCode className="h-3.5 w-3.5 text-[#8B5CF6]" />
                solution.js
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab("code")}
                className={`px-3 py-1 rounded-[8px] font-sans text-xs font-medium transition-colors ${
                  activeTab === "code"
                    ? "bg-[#211635] text-[#C4B5FD] border border-[#8B5CF6]/30"
                    : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A]"
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`px-3 py-1 rounded-[8px] font-sans text-xs font-medium transition-colors ${
                  activeTab === "tests"
                    ? "bg-[#211635] text-[#C4B5FD] border border-[#8B5CF6]/30"
                    : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A]"
                }`}
              >
                Test Suite ({challenge.tests.length})
              </button>
            </div>
          </div>

          {/* Editor Content Area */}
          <div className="p-4 flex-1 font-mono text-[12px] leading-relaxed overflow-x-auto no-scrollbar min-h-[320px] bg-[#0D0D12] text-[#E4E4E7]">
            {activeTab === "code" ? (
              <pre className="selection:bg-[#38245C] no-scrollbar">
                <code>
                  {challenge.code.split("\n").map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-8 select-none text-right pr-4 text-[#666675] font-mono text-xs">
                        {idx + 1}
                      </span>
                      <span className="flex-1 whitespace-pre">
                        {line.includes("//") ? (
                          <span className="text-[#858592] italic">{line}</span>
                        ) : line.includes("class") || line.includes("function") || line.includes("const") || line.includes("async") || line.includes("return") ? (
                          <span
                            dangerouslySetInnerHTML={{
                              __html: line
                                .replace(/\b(class|constructor|function|const|let|async|await|return|if|else|throw|new)\b/g, '<span class="text-[#C084FC] font-medium">$1</span>')
                                .replace(/\b(TokenBucket|Date|Math|crypto|Session|UnauthorizedError|SecurityBreachError)\b/g, '<span class="text-[#93C5FD]">$1</span>'),
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
                <p className="text-xs text-[#71717A] mb-3 font-mono">Hidden Unit Tests executed in Judge0 sandbox:</p>
                {challenge.tests.map((test, tIdx) => (
                  <div
                    key={tIdx}
                    className="flex items-center justify-between p-2.5 rounded-[10px] border border-[#27272A] bg-[#14141B] font-mono text-xs"
                  >
                    <div className="flex items-center gap-2 text-[#FAFAFA]">
                      <Code2 className="h-3.5 w-3.5 text-[#8B5CF6]" />
                      <span>{test.name}</span>
                    </div>
                    <span className="text-[#71717A] text-[11px]">{test.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="border-t border-[#27272A] bg-[#111116] p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs text-[#71717A]">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
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
                className="group"
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
        <div className="lg:col-span-5 bg-[#14141B] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#27272A]">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#8B5CF6]" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#FAFAFA] font-semibold">
                  Evaluation Engine
                </span>
              </div>
              <span className="font-mono text-xs font-medium text-[#71717A]">
                {isRunning ? "PROCESSING" : completed ? "VERIFIED" : "STANDBY"}
              </span>
            </div>

            {/* Stepper Progress */}
            <div className="space-y-3 mb-5">
              {[
                { title: "Sandbox compilation", desc: "Judge0 isolated Linux container" },
                { title: "Unit test suite", desc: "4/4 edge cases validated" },
                { title: "Senior AI code review", desc: "Staff AI architectural audit" },
              ].map((st, i) => {
                const isPast = stepIndex > i;
                const isCurrent = stepIndex === i;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 relative flex items-center justify-center">
                      {isCurrent ? (
                        <span className="h-4 w-4 rounded-full border border-[#8B5CF6] flex items-center justify-center">
                          <span className="h-2 w-2 rounded-full bg-[#8B5CF6] animate-pulse" />
                        </span>
                      ) : isPast ? (
                        <CheckCircle2 className="h-4 w-4 text-[#34D399]" />
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-[#27272A] bg-[#18181F]" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-xs font-sans font-medium ${
                          isPast ? "text-[#FAFAFA]" : isCurrent ? "text-[#C4B5FD]" : "text-[#71717A]"
                        }`}
                      >
                        {st.title}
                      </p>
                      <p className="text-[11px] text-[#71717A] font-sans">{st.desc}</p>
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
                  <div className="p-4 rounded-[12px] border border-[#8B5CF6]/30 bg-[#211635] flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-mono font-semibold uppercase text-[#A78BFA]">Verdict</p>
                      <h4 className="font-display font-semibold text-[#FAFAFA] text-base">
                        {challenge.aiReview.verdict}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-2xl font-bold text-[#FAFAFA]">
                        {challenge.aiReview.score}
                      </span>
                      <span className="font-mono text-xs text-[#A78BFA]">/100</span>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="p-3.5 rounded-[10px] border border-[#27272A] bg-[#18181F] space-y-2">
                    <p className="text-[11px] font-mono font-semibold text-[#FAFAFA] uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="h-3 w-3 text-[#8B5CF6]" />
                      Key Strengths Identified
                    </p>
                    <ul className="space-y-1.5 text-xs text-[#A1A1AA] font-sans">
                      {challenge.aiReview.strengths.map((str, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <span className="text-[#34D399] mt-0.5">✓</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Issued Badge Preview */}
                  <div className="p-3.5 rounded-[12px] border border-[#8B5CF6]/30 bg-[#211635] flex items-center gap-3">
                    <div className="h-10 w-10 rounded-[8px] bg-[#38245C] border border-[#8B5CF6]/40 flex items-center justify-center shrink-0">
                      <Award className="h-5 w-5 text-[#C4B5FD]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono font-semibold uppercase text-[#34D399] flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Badge Minted
                      </span>
                      <p className="font-display text-xs font-semibold text-[#FAFAFA] truncate">
                        {challenge.aiReview.badgeTitle}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : isRunning ? (
                <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#27272A] rounded-[12px] bg-[#111116]">
                  <RefreshCw className="h-8 w-8 text-[#8B5CF6] animate-spin mb-3" />
                  <p className="text-xs font-sans font-medium text-[#FAFAFA]">Executing sandbox verification...</p>
                  <p className="text-[11px] font-sans text-[#71717A] mt-1">Collecting stdout & AI critique</p>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#27272A] rounded-[12px] bg-[#111116]">
                  <Terminal className="h-8 w-8 text-[#71717A] mb-2" />
                  <p className="text-xs font-sans font-medium text-[#A1A1AA]">Ready to execute</p>
                  <p className="text-[11px] font-sans text-[#71717A] mt-1 max-w-xs">
                    Click "Run Sandboxed Verification" to watch the automated evaluation pipeline in action.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-4 border-t border-[#27272A] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
            <span>Judge0 V8 Isolated Sandbox</span>
            <span>Deterministic AI Scoring</span>
          </div>
        </div>
      </div>
    </section>
  );
}
