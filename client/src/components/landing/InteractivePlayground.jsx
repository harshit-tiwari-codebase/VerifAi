import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Play, CheckCircle2, Terminal, Award,
  RefreshCw, Code2, FileCode, Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import Button from "../ui/Button.jsx";

/* ─── Syntax token types ─── */
const KW  = "text-[#FF9B66] font-medium";   // keywords
const TY  = "text-[#93C5FD]";               // type names
const CM  = "text-[#666672] italic";         // comments
const ST  = "text-[#98D8A8]";               // strings
const NU  = "text-[#F8C96B]";               // numbers

/* ─── Highlight a single line ─── */
function hl(line) {
  if (line.trimStart().startsWith("//")) return <span className={CM}>{line}</span>;
  // Tokenise keywords + class names inline via dangerouslySetInnerHTML
  const html = line
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(
      /\b(class|constructor|function|const|let|var|async|await|return|if|else|throw|new|get|put|this)\b/g,
      `<span class="${KW}">$1</span>`
    )
    .replace(
      /\b(TokenBucket|LRUCache|TokenManager|Map|Date|Math|crypto|SecurityBreachError|UnauthorizedError)\b/g,
      `<span class="${TY}">$1</span>`
    )
    .replace(/("(?:[^"\\]|\\.)*")/g, `<span class="${ST}">$1</span>`)
    .replace(/\b(\d+)\b/g, `<span class="${NU}">$1</span>`);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ─── Challenges ─── */
const CHALLENGES = [
  {
    id: "rate-limiter",
    title: "Token Bucket Rate Limiter",
    category: "Distributed Systems",
    difficulty: "Medium",
    language: "JavaScript (Node.js)",
    description: "Implement a thread-safe token bucket rate limiter in O(1) time without looping over elapsed timestamps.",
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
      { name: "Burst capacity allows up to max limit", time: "4ms" },
      { name: "Tokens replenish accurately over 500ms delay", time: "8ms" },
      { name: "Exceeding capacity returns false without dropping state", time: "3ms" },
      { name: "High-frequency concurrent calls prevent race condition", time: "6ms" },
    ],
    logs: [
      ["> Spawning V8 micro-container...", "> Compiling solution.js...", "> Sandbox ready ✓"],
      ["> Running test suite (4 cases)...", "> All assertions passed ✓", "> Execution: 21ms total"],
      ["> Sending to AI review engine...", "> Architectural analysis complete", "> Score computed ✓"],
    ],
    aiReview: {
      score: 96,
      verdict: "Exceptional Architecture",
      strengths: [
        "O(1) time complexity — avoids interval timers or request queuing overhead.",
        "Mathematical delta computation handles arbitrary clock skew gracefully.",
        "Deterministic token reservation ensures zero dropped allocations under peak load.",
      ],
      optimization: "Consider process.hrtime.bigint() for sub-millisecond precision under extreme microservice spikes.",
      badgeTitle: "Distributed Systems: Rate Limiter Master",
    },
  },
  {
    id: "redis-mutex",
    title: "Distributed Mutex with Auto-Expiry",
    category: "Backend Concurrency",
    difficulty: "Hard",
    language: "Node.js & Redis",
    description: "Design an atomic distributed lock engine with UUID ownership, lease auto-expiry, and safe release via Redis Lua scripts.",
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

// Atomic release via Lua — prevents releasing a stolen lock
const RELEASE_SCRIPT = \`
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
\`;

async function releaseLock(redis, resourceKey, lockToken) {
  return await redis.eval(
    RELEASE_SCRIPT, 1,
    \`lock:\${resourceKey}\`,
    lockToken
  );
}`,
    tests: [
      { name: "Lock acquisition creates key with millisecond TTL", time: "5ms" },
      { name: "Simultaneous acquire attempts: exactly 1 winner", time: "9ms" },
      { name: "Lock auto-releases after TTL expiry without intervention", time: "12ms" },
      { name: "Token verification prevents deleting another worker's lock", time: "4ms" },
    ],
    logs: [
      ["> Spawning V8 micro-container...", "> Compiling acquireLock.js...", "> Sandbox ready ✓"],
      ["> Running test suite (4 cases)...", "> Lua atomicity assertions passed ✓", "> Execution: 30ms total"],
      ["> Sending to AI review engine...", "> Concurrency analysis complete", "> Score computed ✓"],
    ],
    aiReview: {
      score: 94,
      verdict: "Production Hardened",
      strengths: [
        "Lua script execution guarantees atomicity across distributed nodes.",
        "UUID owner tokens prevent races where expired locks are hijacked.",
        "NX + PX flags ensure atomic test-and-set in a single network round-trip.",
      ],
      optimization: "Implement Redlock multi-instance quorum consensus for multi-master Redis architectures.",
      badgeTitle: "Concurrency: Distributed Lock Specialist",
    },
  },
  {
    id: "jwt-rotation",
    title: "Refresh Token Rotation & Blacklist",
    category: "Security & Auth",
    difficulty: "Medium",
    language: "Node.js & Crypto",
    description: "Prevent replay attacks with single-use token detection that invalidates entire token families upon reuse.",
    code: `class TokenManager {
  constructor(db) {
    this.db = db; // persistent session store
  }

  async rotateRefreshToken(familyId, presentedToken) {
    const session = await this.db.findSessionByFamily(familyId);

    // Compromise detected: presented token was already used!
    if (session.usedTokens.has(presentedToken)) {
      await this.db.revokeEntireFamily(familyId);
      throw new SecurityBreachError(
        "Token reuse detected — revoking all sessions."
      );
    }

    if (session.currentToken !== presentedToken) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    // Mint fresh pair and retire old token
    const newRefreshToken = crypto.randomBytes(32).toString("hex");
    const newAccessToken  = signJwt({ sub: session.userId }, "15m");

    await this.db.updateSession(familyId, {
      currentToken: newRefreshToken,
      usedTokens:   session.usedTokens.add(presentedToken),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}`,
    tests: [
      { name: "Valid rotation updates current token and returns new pair", time: "6ms" },
      { name: "Replaying a spent refresh token revokes entire session family", time: "8ms" },
      { name: "Compromised token generates security alert event", time: "4ms" },
      { name: "Mismatched family ID safely rejects with 401 Unauthorized", time: "3ms" },
    ],
    logs: [
      ["> Spawning V8 micro-container...", "> Compiling TokenManager.js...", "> Sandbox ready ✓"],
      ["> Running test suite (4 cases)...", "> Replay attack assertions passed ✓", "> Execution: 21ms total"],
      ["> Sending to AI review engine...", "> Security analysis complete", "> Score computed ✓"],
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
  {
    id: "lru-cache",
    title: "LRU Cache with O(1) Ops",
    category: "Data Structures",
    difficulty: "Hard",
    language: "JavaScript (ES2022)",
    description: "Implement a Least-Recently-Used cache with O(1) get and put using a HashMap + doubly-linked list sentinel strategy.",
    code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map  = new Map(); // key → node
    // Doubly-linked sentinel nodes eliminate null checks
    this.head = { key: null, val: null, prev: null, next: null };
    this.tail = { key: null, val: null, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._moveToFront(node); // promote to MRU position
    return node.val;
  }

  put(key, val) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.val = val;
      this._moveToFront(node);
      return;
    }
    // Evict LRU entry when at capacity
    if (this.map.size === this.capacity) {
      const lru = this.tail.prev;
      this._unlink(lru);
      this.map.delete(lru.key);
    }
    const node = { key, val, prev: null, next: null };
    this._insertFront(node);
    this.map.set(key, node);
  }

  _insertFront(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _unlink(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _moveToFront(node) {
    this._unlink(node);
    this._insertFront(node);
  }
}`,
    tests: [
      { name: "get() returns -1 for missing key", time: "1ms" },
      { name: "put() evicts LRU entry at capacity", time: "2ms" },
      { name: "get() promotes accessed node to MRU position", time: "1ms" },
      { name: "Sequence: put 3 into cap-2 cache evicts oldest", time: "2ms" },
    ],
    logs: [
      ["> Spawning V8 micro-container...", "> Compiling LRUCache.js...", "> Sandbox ready ✓"],
      ["> Running test suite (4 cases)...", "> All eviction assertions passed ✓", "> Execution: 6ms total"],
      ["> Sending to AI review engine...", "> Data structure analysis complete", "> Score computed ✓"],
    ],
    aiReview: {
      score: 99,
      verdict: "Textbook Optimal",
      strengths: [
        "O(1) get and put via HashMap + doubly-linked list — the canonical interview gold standard.",
        "Sentinel head/tail nodes eliminate all null-checks in insert and unlink operations.",
        "Map.delete on eviction guarantees no memory leak across arbitrary usage patterns.",
      ],
      optimization: "For thread-safety in concurrent environments, wrap with a Mutex or use a Concurrent LRU variant with read/write locks.",
      badgeTitle: "Data Structures: LRU Cache Expert",
    },
  },
];

/* ─── Step durations (ms) ─── */
const STEP_DURATIONS = [800, 950, 1100];

/* ─── Step log line delay (ms between each line appearing) ─── */
const LOG_LINE_DELAY = 220;

export default function InteractivePlayground() {
  const reduceMotion = useReducedMotion();
  const [selectedIdx, setSelectedIdx]   = useState(0);
  const [activeTab,   setActiveTab]     = useState("code");  // "code" | "tests"
  const [isRunning,   setIsRunning]     = useState(false);
  const [stepIndex,   setStepIndex]     = useState(-1);      // -1 idle, 0/1/2 active, 3 done
  const [stepProgress, setStepProgress] = useState([0, 0, 0]); // 0→1 fill for each bar
  const [logLines,    setLogLines]      = useState([]);      // streaming log
  const [completed,   setCompleted]     = useState(false);
  const timers = useRef([]);
  const challenge = CHALLENGES[selectedIdx];

  /* Clear all pending timers */
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const handleReset = () => {
    clearTimers();
    setIsRunning(false);
    setStepIndex(-1);
    setStepProgress([0, 0, 0]);
    setLogLines([]);
    setCompleted(false);
  };

  /* Run the 3-step pipeline */
  const handleRun = () => {
    if (isRunning) return;
    handleReset();
    setIsRunning(true);

    let elapsed = 0;

    STEP_DURATIONS.forEach((dur, stepIdx) => {
      /* Activate this step */
      const startT = timers.current[timers.current.length] = setTimeout(() => {
        setStepIndex(stepIdx);
        /* Kick off the progress bar fill for this step */
        const barStart = performance.now();
        const tick = () => {
          const frac = Math.min((performance.now() - barStart) / dur, 1);
          setStepProgress(prev => {
            const next = [...prev];
            next[stepIdx] = frac;
            return next;
          });
          if (frac < 1) {
            timers.current.push(requestAnimationFrame(tick));
          }
        };
        timers.current.push(requestAnimationFrame(tick));

        /* Stream log lines */
        const lines = challenge.logs[stepIdx] || [];
        lines.forEach((line, li) => {
          const logT = setTimeout(() => {
            setLogLines(prev => [...prev, line]);
          }, li * LOG_LINE_DELAY + 80);
          timers.current.push(logT);
        });
      }, elapsed);

      elapsed += dur;
    });

    /* Completion */
    const doneT = setTimeout(() => {
      setIsRunning(false);
      setCompleted(true);
      setStepIndex(3);
      try {
        confetti({
          particleCount: 45,
          spread: 65,
          origin: { y: 0.65 },
          colors: ["#FF6A3D", "#FFB08E", "#4FBF94", "#FBBF24"],
          disableForReducedMotion: true,
        });
      } catch { /* optional */ }
    }, elapsed);
    timers.current.push(doneT);
  };

  /* Reset on challenge change */
  useEffect(() => {
    handleReset();
    setActiveTab("code");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdx]);

  /* Cleanup on unmount */
  useEffect(() => () => clearTimers(), []);

  return (
    <section id="playground" className="w-full bg-[#0B0B0A] py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Challenge selector tabs ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          {CHALLENGES.map((item, idx) => {
            const isActive = idx === selectedIdx;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedIdx(idx)}
                className={`text-left p-3.5 rounded-[8px] border transition-all duration-150 ${
                  isActive
                    ? "border-[#FF6A3D] bg-[#171714]"
                    : "border-[#30302B] bg-[#121210] hover:border-[#3E3E38] hover:bg-[#171714]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#77756D]">
                    {item.category}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded-[4px] ${
                      item.difficulty === "Hard"
                        ? "bg-[#E5604D]/10 text-[#E5604D] border border-[#E5604D]/20"
                        : "bg-[#4FBF94]/10 text-[#4FBF94] border border-[#4FBF94]/20"
                    }`}
                  >
                    {item.difficulty}
                  </span>
                </div>
                <p className="font-sans text-xs font-semibold text-[#F2EFE6] leading-snug">{item.title}</p>
              </button>
            );
          })}
        </div>

        {/* ── Main IDE grid ── */}
        <div className="rounded-[8px] border border-[#30302B] grid grid-cols-1 lg:grid-cols-12 bg-[#141412]">

          {/* ── LEFT: Code Editor (7 cols) ── */}
          <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-[#30302B]">

            {/* Editor header */}
            <div className="flex items-center justify-between border-b border-[#30302B] bg-[#1C1C19] px-4 py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#E5604D]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#4FBF94]" />
                </div>
                <span className="font-mono text-xs text-[#AAA69B] flex items-center gap-1.5">
                  <FileCode className="h-3.5 w-3.5 text-[#FF6A3D]" strokeWidth={1.5} />
                  solution.js
                </span>
              </div>

              <div className="flex items-center gap-1">
                {["code", "tests"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-[4px] font-mono text-[11px] font-medium transition-colors duration-150 ${
                      activeTab === tab
                        ? "bg-[#FF6A3D]/10 text-[#FFD1BB] border border-[#FF6A3D]/20"
                        : "text-[#77756D] hover:text-[#AAA69B] hover:bg-[#1E1E1A]"
                    }`}
                  >
                    {tab === "code" ? "Code" : `Tests (${challenge.tests.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor body */}
            <div className="flex-1 p-4 font-mono text-[12px] leading-relaxed overflow-auto min-h-[340px] max-h-[520px] bg-[#141412] text-[#E4E0D5] selection:bg-[#422316]">
              {activeTab === "code" ? (
                <pre>
                  <code>
                    {challenge.code.split("\n").map((line, i) => (
                      <div key={i} className="flex">
                        <span className="w-8 shrink-0 select-none text-right pr-4 text-[#444440] text-[11px]">
                          {i + 1}
                        </span>
                        <span className="flex-1 whitespace-pre">{hl(line)}</span>
                      </div>
                    ))}
                  </code>
                </pre>
              ) : (
                <div className="space-y-2 py-1">
                  <p className="text-[11px] text-[#77756D] mb-3 font-mono">
                    Hidden unit tests executed in Judge0 sandbox:
                  </p>
                  {challenge.tests.map((test, tIdx) => (
                    <div
                      key={tIdx}
                      className="flex items-center justify-between p-2.5 rounded-[8px] border border-[#30302B] bg-[#1C1C19]"
                    >
                      <div className="flex items-center gap-2 text-[#AAA69B]">
                        <Code2 className="h-3.5 w-3.5 text-[#FF6A3D] shrink-0" strokeWidth={1.5} />
                        <span className="text-[11px]">{test.name}</span>
                      </div>
                      <span className="text-[#555550] text-[11px] shrink-0 ml-3 font-mono">{test.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action bar */}
            <div className="border-t border-[#30302B] bg-[#171714] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#77756D]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A3D]" />
                {challenge.language}
              </div>
              <div className="flex items-center gap-2">
                {completed && (
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
                    Reset
                  </Button>
                )}
                <Button
                  variant="verify"
                  size="sm"
                  onClick={handleRun}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" strokeWidth={1.5} />
                      {stepIndex === 0 ? "Compiling..." : stepIndex === 1 ? "Running Tests..." : "AI Review..."}
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

          {/* ── RIGHT: Evaluation Engine (5 cols) ── */}
          <div className="lg:col-span-5 bg-[#1C1C19] flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#30302B]">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#FF6A3D]" strokeWidth={1.5} />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#F2EFE6] font-semibold">
                  Evaluation Engine
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {isRunning && <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A3D] animate-pulse" />}
                {completed && <span className="h-1.5 w-1.5 rounded-full bg-[#4FBF94]" />}
                <span className={`font-mono text-[10px] uppercase tracking-[0.1em] font-semibold ${
                  isRunning ? "text-[#FFD1BB]" : completed ? "text-[#4FBF94]" : "text-[#55524C]"
                }`}>
                  {isRunning ? "PROCESSING" : completed ? "VERIFIED" : "STANDBY"}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col p-5 gap-4">
              {/* ── Stepper ── */}
              <div className="space-y-4">
                {[
                  { title: "Sandbox Compilation",   desc: "Judge0 isolated Linux container",  dur: "~800ms"  },
                  { title: "Unit Test Suite",        desc: `${challenge.tests.length}/4 hidden edge cases`,  dur: "~950ms"  },
                  { title: "Senior AI Code Review",  desc: "Staff-level architectural audit",   dur: "~1.1s"   },
                ].map((st, i) => {
                  const isPast    = stepIndex > i;
                  const isCurrent = stepIndex === i;
                  const fill      = stepProgress[i] ?? 0;
                  return (
                    <div key={i}>
                      <div className="flex items-start gap-3 mb-1.5">
                        <div className="mt-0.5 shrink-0 w-4 h-4 flex items-center justify-center">
                          {isCurrent ? (
                            <span className="h-4 w-4 rounded-full border border-[#FF6A3D] flex items-center justify-center">
                              <span className="h-2 w-2 rounded-full bg-[#FF6A3D] animate-pulse" />
                            </span>
                          ) : isPast ? (
                            <CheckCircle2 className="h-4 w-4 text-[#4FBF94]" strokeWidth={1.5} />
                          ) : (
                            <span className="h-4 w-4 rounded-full border border-[#30302B] bg-[#141412] block" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs font-sans font-medium ${
                              isPast ? "text-[#F2EFE6]" : isCurrent ? "text-[#FFD1BB]" : "text-[#55524C]"
                            }`}>
                              {st.title}
                            </p>
                            {isPast && (
                              <span className="font-mono text-[10px] text-[#4FBF94] shrink-0">{st.dur}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#77756D] font-sans">{st.desc}</p>
                        </div>
                      </div>
                      {/* Progress bar — fills during active step, stays full when past */}
                      <div className="ml-7 h-px bg-[#30302B] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FF6A3D] rounded-full transition-none"
                          style={{
                            width: `${(isPast ? 1 : isCurrent ? fill : 0) * 100}%`,
                            transition: isCurrent && !reduceMotion ? "width 80ms linear" : "none",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Log stream (while running) ── */}
              <AnimatePresence>
                {(isRunning || (completed && logLines.length > 0)) && (
                  <motion.div
                    key="log"
                    initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={reduceMotion ? false : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-[8px] border border-[#30302B] bg-[#141412] p-3 font-mono text-[11px] text-[#77756D] space-y-1 max-h-[96px] overflow-y-auto">
                      {logLines.map((line, i) => (
                        <motion.div
                          key={i}
                          initial={reduceMotion ? false : { opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className={line.includes("✓") ? "text-[#4FBF94]" : "text-[#77756D]"}
                        >
                          {line}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Result panel ── */}
              <AnimatePresence mode="wait">
                {completed ? (
                  <motion.div
                    key="result"
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? false : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="space-y-2.5"
                  >
                    {/* Score banner */}
                    <div className="p-4 rounded-[8px] border border-[#30302B] bg-[#171714] flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#77756D] mb-0.5">Verdict</p>
                        <h4 className="font-display font-semibold text-[#F2EFE6] text-base leading-tight">
                          {challenge.aiReview.verdict}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono text-3xl font-bold text-[#FF6A3D]">
                          {challenge.aiReview.score}
                        </span>
                        <span className="font-mono text-xs text-[#77756D]">/100</span>
                      </div>
                    </div>

                    {/* Key strengths */}
                    <div className="p-3.5 rounded-[8px] border border-[#30302B] bg-[#141412] space-y-2">
                      <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#AAA69B] flex items-center gap-1.5">
                        <Zap className="h-3 w-3 text-[#FF6A3D]" strokeWidth={1.5} />
                        Key Strengths
                      </p>
                      <ul className="space-y-1.5 text-[11px] text-[#77756D] font-sans">
                        {challenge.aiReview.strengths.map((str, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <span className="text-[#4FBF94] mt-0.5 shrink-0 text-[10px]">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Badge */}
                    <div className="p-3 rounded-[8px] border border-[#30302B] bg-[#171714] flex items-center gap-3">
                      <div className="h-8 w-8 rounded-[4px] bg-[#1E1E1A] border border-[#30302B] flex items-center justify-center shrink-0">
                        <Award className="h-4 w-4 text-[#FF6A3D]" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-[#4FBF94] flex items-center gap-1 mb-0.5">
                          <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} />
                          Badge Minted
                        </span>
                        <p className="font-sans text-xs font-medium text-[#F2EFE6] truncate">
                          {challenge.aiReview.badgeTitle}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : !isRunning ? (
                  <motion.div
                    key="idle"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? false : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#30302B] rounded-[8px] bg-[#141412] min-h-[140px]"
                  >
                    <Terminal className="h-7 w-7 text-[#30302B] mb-2.5" strokeWidth={1.5} />
                    <p className="text-xs font-sans font-medium text-[#55524C]">Ready to execute</p>
                    <p className="text-[11px] font-sans text-[#3A3935] mt-1 max-w-[200px] leading-relaxed">
                      Hit "Run Sandboxed Verification" to watch the evaluation pipeline in action.
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Panel footer */}
            <div className="px-5 py-3 border-t border-[#30302B] flex items-center justify-between text-[11px] font-mono text-[#3A3935]">
              <span>Judge0 V8 Isolated Sandbox</span>
              <span>Deterministic AI Scoring</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
