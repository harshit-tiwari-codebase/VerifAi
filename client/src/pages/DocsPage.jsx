import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Button from "../components/ui/Button.jsx";

const SECTIONS = [
  { id: "overview", label: "Overview & Pipeline" },
  { id: "sandbox", label: "Runtime Sandbox Specs" },
  { id: "anticheat", label: "Anti-Cheat & AST Engine" },
  { id: "badges", label: "Cryptographic Badges" },
  { id: "api", label: "REST API Reference" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070A10] text-mist-100 selection:bg-violet-500/30 selection:text-white flex flex-col justify-between">
      {/* Background Atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-48 -top-48 h-[36rem] w-[36rem] rounded-full bg-violet-600/8 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[32rem] w-[32rem] rounded-full bg-purple-600/8 blur-[140px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="container-xl py-8 sm:py-10 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/[0.08] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 font-mono text-[11px] text-violet-300">
                  Technical Specification
                </span>
                <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  v2.4 Production Spec
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                VerifAI System Documentation
              </h1>
              <p className="mt-1 text-xs font-mono text-mist-400 max-w-2xl">
                Architecture, isolated evaluation sandbox standards, AST validation metrics, and cryptographic badge schemas.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                as={Link}
                to="/playground"
                variant="verify"
                size="sm"
                className="font-sans text-xs font-medium"
              >
                Test in Playground →
              </Button>
            </div>
          </div>

          {/* Section Jump Tabs (Textual & Minimal) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/[0.06] scrollbar-none">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`rounded-lg px-3.5 py-1.5 font-mono text-xs transition-all whitespace-nowrap ${
                  activeSection === sec.id
                    ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] font-medium"
                    : "text-mist-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Section 1: Overview & Pipeline */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/[0.08] bg-[#090D17]/70 p-6 sm:p-8 space-y-5">
                <span className="text-violet-400 font-mono text-xs font-semibold uppercase tracking-wider block">
                  Three-Tier Automated Audit Architecture
                </span>
                <h2 className="font-display text-xl font-bold text-white">
                  Deterministic Execution & AI Structural Synthesis
                </h2>
                <p className="font-mono text-xs text-mist-300 leading-relaxed max-w-3xl">
                  Unlike traditional platforms that only test whether an output matches a string, VerifAI analyzes code across three distinct dimensions:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4 space-y-2">
                    <span className="font-mono text-[11px] font-bold text-violet-400 block">STAGE 1</span>
                    <h3 className="font-display text-sm font-semibold text-white">
                      Sandbox Execution
                    </h3>
                    <p className="font-mono text-[11px] text-mist-400">
                      Isolated ephemeral runtime runs hidden test vectors under strict memory bounds and sub-millisecond timer resolution.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4 space-y-2">
                    <span className="font-mono text-[11px] font-bold text-cyan-400 block">STAGE 2</span>
                    <h3 className="font-display text-sm font-semibold text-white">
                      AST Semantic Verification
                    </h3>
                    <p className="font-mono text-[11px] text-mist-400">
                      Abstract syntax tree analysis prevents hardcoded lookup tables, verifies algorithmic complexity, and flags forbidden APIs.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4 space-y-2">
                    <span className="font-mono text-[11px] font-bold text-emerald-400 block">STAGE 3</span>
                    <h3 className="font-display text-sm font-semibold text-white">
                      Badge Minting
                    </h3>
                    <p className="font-mono text-[11px] text-mist-400">
                      If 100% of test suites pass and AI score ≥ 80, an immutable cryptographic verification badge is anchored to the engineer profile.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Runtime Sandbox Specs */}
          {activeSection === "sandbox" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/[0.08] bg-[#090D17]/70 p-6 sm:p-8 space-y-5">
                <span className="text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider block">
                  Sandboxed Environment Constraints
                </span>
                <h2 className="font-display text-xl font-bold text-white">
                  Kernel Cgroups & Ephemeral Container Limits
                </h2>

                <div className="overflow-x-auto rounded-xl border border-white/[0.07] bg-black/50">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-white/[0.02] text-mist-400 text-[11px]">
                        <th className="px-4 py-3">Constraint</th>
                        <th className="px-4 py-3">Hard Limit</th>
                        <th className="px-4 py-3">Enforcement Mechanism</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05] text-mist-300">
                      <tr>
                        <td className="px-4 py-3 text-white font-semibold">Wall Clock Timeout</td>
                        <td className="px-4 py-3 text-amber-400">2,000 ms</td>
                        <td className="px-4 py-3">SIGKILL signal sent immediately upon expiry</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-white font-semibold">Max Heap Memory</td>
                        <td className="px-4 py-3 text-amber-400">128 MB</td>
                        <td className="px-4 py-3">Linux cgroup v2 memory.max + OOM killer</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-white font-semibold">Network Egress</td>
                        <td className="px-4 py-3 text-rose-400">Disabled (0 bytes)</td>
                        <td className="px-4 py-3">Isolated network namespace with loopback only</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-white font-semibold">File System Access</td>
                        <td className="px-4 py-3 text-purple-300">Read-Only Rootfs</td>
                        <td className="px-4 py-3">overlayfs with temporary tmpfs memory scratchpad</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Anti-Cheat & AST */}
          {activeSection === "anticheat" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/[0.08] bg-[#090D17]/70 p-6 sm:p-8 space-y-5">
                <span className="text-rose-400 font-mono text-xs font-semibold uppercase tracking-wider block">
                  Zero Tolerance Anti-Cheat
                </span>
                <h2 className="font-display text-xl font-bold text-white">
                  AST Static Tree Inspection & Plagiarism Hashing
                </h2>
                <p className="font-mono text-xs text-mist-300 leading-relaxed max-w-3xl">
                  Every submission is parsed into an Abstract Syntax Tree (Babel/Acorn for JS, Tree-sitter for systems languages). We strictly disqualify submissions using:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 space-y-2">
                    <span className="font-mono text-xs font-bold text-rose-400 block">Hardcoded Lookup Tables</span>
                    <p className="font-mono text-[11px] text-mist-400">
                      Direct dictionary mapping of test case inputs to outputs without algorithmic execution triggers instant disqualification.
                    </p>
                  </div>
                  <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-4 space-y-2">
                    <span className="font-mono text-xs font-bold text-rose-400 block">Builtin Prototype Pollution</span>
                    <p className="font-mono text-[11px] text-mist-400">
                      Overwriting Object.prototype or globalThis to intercept hidden test suites results in automated account suspension.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Cryptographic Badges */}
          {activeSection === "badges" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/[0.08] bg-[#090D17]/70 p-6 sm:p-8 space-y-5">
                <span className="text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider block">
                  Verification Credential Standard
                </span>
                <h2 className="font-display text-xl font-bold text-white">
                  Immutable Verification Badge Schema
                </h2>
                <p className="font-mono text-xs text-mist-300 leading-relaxed max-w-3xl">
                  When all tests pass, the backend issues an anchored verification badge. The JSON document contains:
                </p>

                <div className="relative rounded-xl border border-white/[0.08] bg-black/60 p-4 font-mono text-xs text-mist-200">
                  <button
                    onClick={() =>
                      handleCopy(
                        `{
  "badgeId": "bge_098f6bcd4621d373cade4e832627b4f6",
  "challengeId": "65e8a1f49b109e23004d12a9",
  "title": "Token Bucket Rate Limiter",
  "category": "Distributed Systems",
  "score": 96,
  "executionMetrics": {
    "latencyMs": 4,
    "memoryAllocatedMb": 12.4,
    "testSuiteCoverage": "100%"
  },
  "verifiedBy": "VerifAI V8 Isolated Sandbox",
  "issuedAt": "2026-09-04T22:00:00.000Z"
}`,
                        "badge-schema"
                      )
                    }
                    className="absolute right-3 top-3 rounded-lg border border-white/10 bg-white/5 p-1.5 text-mist-400 hover:text-white"
                  >
                    {copiedKey === "badge-schema" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <pre className="overflow-x-auto text-[11px] leading-relaxed text-violet-200">
{`{
  "badgeId": "bge_098f6bcd4621d373cade4e832627b4f6",
  "challengeId": "65e8a1f49b109e23004d12a9",
  "title": "Token Bucket Rate Limiter",
  "category": "Distributed Systems",
  "score": 96,
  "executionMetrics": {
    "latencyMs": 4,
    "memoryAllocatedMb": 12.4,
    "testSuiteCoverage": "100%"
  },
  "verifiedBy": "VerifAI V8 Isolated Sandbox",
  "issuedAt": "2026-09-04T22:00:00.000Z"
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: REST API */}
          {activeSection === "api" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/[0.08] bg-[#090D17]/70 p-6 sm:p-8 space-y-5">
                <span className="text-violet-400 font-mono text-xs font-semibold uppercase tracking-wider block">
                  HTTP Endpoints
                </span>
                <h2 className="font-display text-xl font-bold text-white">
                  Developer Platform REST API
                </h2>

                <div className="space-y-3 font-mono text-xs">
                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded bg-emerald-500/15 text-emerald-400 px-2 py-0.5 font-bold text-[11px]">
                        GET
                      </span>
                      <span className="text-white font-semibold">/api/challenges</span>
                    </div>
                    <span className="text-mist-400 text-[11px]">
                      Query challenge catalog with category, difficulty, pagination
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded bg-emerald-500/15 text-emerald-400 px-2 py-0.5 font-bold text-[11px]">
                        GET
                      </span>
                      <span className="text-white font-semibold">/api/challenges/:id</span>
                    </div>
                    <span className="text-mist-400 text-[11px]">
                      Fetch challenge specifications and public test cases
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded bg-violet-500/20 text-violet-300 px-2 py-0.5 font-bold text-[11px]">
                        POST
                      </span>
                      <span className="text-white font-semibold">/api/challenges</span>
                    </div>
                    <span className="text-mist-400 text-[11px]">
                      Author new challenge with custom test vectors (Mentor / Admin)
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded bg-cyan-500/20 text-cyan-300 px-2 py-0.5 font-bold text-[11px]">
                        POST
                      </span>
                      <span className="text-white font-semibold">/api/auth/login</span>
                    </div>
                    <span className="text-mist-400 text-[11px]">
                      Authenticate user and establish HTTP-only secure cookie session
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
