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
    <div className="relative min-h-screen overflow-x-hidden bg-[#09090B] text-[#FAFAFA] selection:bg-[#38245C] selection:text-[#FAFAFA] flex flex-col justify-between font-sans">
      <div className="relative z-10">
        <Navbar />

        <main className="container-xl py-8 sm:py-10 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#27272A] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full border border-[#8B5CF6]/30 bg-[#211635] px-2.5 py-0.5 font-mono text-[11px] text-[#C4B5FD]">
                  Technical Specification
                </span>
                <span className="font-mono text-[11px] text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20 px-2.5 py-0.5 rounded-full">
                  v2.4 Production Spec
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#FAFAFA]">
                VerifAI System Documentation
              </h1>
              <p className="mt-1 text-xs font-mono text-[#A1A1AA] max-w-2xl">
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

          {/* Section Jump Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#27272A] scrollbar-none">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`rounded-[8px] px-3.5 py-1.5 font-mono text-xs transition-all whitespace-nowrap ${
                  activeSection === sec.id
                    ? "bg-[#211635] text-[#C4B5FD] border border-[#8B5CF6]/40 shadow-[0_0_16px_rgba(139,92,246,0.16)] font-medium"
                    : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A] border border-transparent"
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Section 1: Overview & Pipeline */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              <div className="rounded-[14px] border border-[#27272A] bg-[#14141B] p-6 sm:p-8 space-y-5">
                <span className="text-[#A78BFA] font-mono text-xs font-semibold uppercase tracking-wider block">
                  Three-Tier Automated Audit Architecture
                </span>
                <h2 className="font-display text-xl font-bold text-[#FAFAFA]">
                  Deterministic Execution & AI Structural Synthesis
                </h2>
                <p className="font-mono text-xs text-[#A1A1AA] leading-relaxed max-w-3xl">
                  Unlike traditional platforms that only test whether an output matches a string, VerifAI analyzes code across three distinct dimensions:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="rounded-[10px] border border-[#27272A] bg-[#18181F] p-4 space-y-2">
                    <span className="font-mono text-[11px] font-bold text-[#8B5CF6] block">STAGE 1</span>
                    <h3 className="font-display text-sm font-semibold text-[#FAFAFA]">
                      Sandbox Execution
                    </h3>
                    <p className="font-mono text-[11px] text-[#A1A1AA]">
                      Isolated ephemeral runtime runs hidden test vectors under strict memory bounds and sub-millisecond timer resolution.
                    </p>
                  </div>

                  <div className="rounded-[10px] border border-[#27272A] bg-[#18181F] p-4 space-y-2">
                    <span className="font-mono text-[11px] font-bold text-[#60A5FA] block">STAGE 2</span>
                    <h3 className="font-display text-sm font-semibold text-[#FAFAFA]">
                      AST Semantic Verification
                    </h3>
                    <p className="font-mono text-[11px] text-[#A1A1AA]">
                      Abstract syntax tree analysis prevents hardcoded lookup tables, verifies algorithmic complexity, and flags forbidden APIs.
                    </p>
                  </div>

                  <div className="rounded-[10px] border border-[#27272A] bg-[#18181F] p-4 space-y-2">
                    <span className="font-mono text-[11px] font-bold text-[#34D399] block">STAGE 3</span>
                    <h3 className="font-display text-sm font-semibold text-[#FAFAFA]">
                      Badge Minting
                    </h3>
                    <p className="font-mono text-[11px] text-[#A1A1AA]">
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
              <div className="rounded-[14px] border border-[#27272A] bg-[#14141B] p-6 sm:p-8 space-y-5">
                <span className="text-[#60A5FA] font-mono text-xs font-semibold uppercase tracking-wider block">
                  Sandboxed Environment Constraints
                </span>
                <h2 className="font-display text-xl font-bold text-[#FAFAFA]">
                  Kernel Cgroups & Ephemeral Container Limits
                </h2>

                <div className="overflow-x-auto rounded-[10px] border border-[#27272A] bg-[#18181F]">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-[#27272A] bg-[#14141B] text-[#71717A] text-[11px]">
                        <th className="px-4 py-3">Constraint</th>
                        <th className="px-4 py-3">Hard Limit</th>
                        <th className="px-4 py-3">Enforcement Mechanism</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272A] text-[#A1A1AA]">
                      <tr>
                        <td className="px-4 py-3 text-[#FAFAFA] font-semibold">Wall Clock Timeout</td>
                        <td className="px-4 py-3 text-[#FBBF24]">2,000 ms</td>
                        <td className="px-4 py-3">SIGKILL signal sent immediately upon expiry</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-[#FAFAFA] font-semibold">Max Heap Memory</td>
                        <td className="px-4 py-3 text-[#FBBF24]">128 MB</td>
                        <td className="px-4 py-3">Linux cgroup v2 memory.max + OOM killer</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-[#FAFAFA] font-semibold">Network Egress</td>
                        <td className="px-4 py-3 text-[#F87171]">Disabled (0 bytes)</td>
                        <td className="px-4 py-3">Isolated network namespace with loopback only</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-[#FAFAFA] font-semibold">File System Access</td>
                        <td className="px-4 py-3 text-[#C4B5FD]">Read-Only Rootfs</td>
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
              <div className="rounded-[14px] border border-[#27272A] bg-[#14141B] p-6 sm:p-8 space-y-5">
                <span className="text-[#F87171] font-mono text-xs font-semibold uppercase tracking-wider block">
                  Zero Tolerance Anti-Cheat
                </span>
                <h2 className="font-display text-xl font-bold text-[#FAFAFA]">
                  AST Static Tree Inspection & Plagiarism Hashing
                </h2>
                <p className="font-mono text-xs text-[#A1A1AA] leading-relaxed max-w-3xl">
                  Every submission is parsed into an Abstract Syntax Tree (Babel/Acorn for JS, Tree-sitter for systems languages). We strictly disqualify submissions using:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-[10px] border border-[#F87171]/30 bg-[#F87171]/10 p-4 space-y-2">
                    <span className="font-mono text-xs font-bold text-[#F87171] block">Hardcoded Lookup Tables</span>
                    <p className="font-mono text-[11px] text-[#A1A1AA]">
                      Direct dictionary mapping of test case inputs to outputs without algorithmic execution triggers instant disqualification.
                    </p>
                  </div>
                  <div className="rounded-[10px] border border-[#F87171]/30 bg-[#F87171]/10 p-4 space-y-2">
                    <span className="font-mono text-xs font-bold text-[#F87171] block">Builtin Prototype Pollution</span>
                    <p className="font-mono text-[11px] text-[#A1A1AA]">
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
              <div className="rounded-[14px] border border-[#27272A] bg-[#14141B] p-6 sm:p-8 space-y-5">
                <span className="text-[#34D399] font-mono text-xs font-semibold uppercase tracking-wider block">
                  Verification Credential Standard
                </span>
                <h2 className="font-display text-xl font-bold text-[#FAFAFA]">
                  Immutable Verification Badge Schema
                </h2>
                <p className="font-mono text-xs text-[#A1A1AA] leading-relaxed max-w-3xl">
                  When all tests pass, the backend issues an anchored verification badge. The JSON document contains:
                </p>

                <div className="relative rounded-[10px] border border-[#27272A] bg-[#111116] p-4 font-mono text-xs text-[#FAFAFA]">
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
                    className="absolute right-3 top-3 rounded-[6px] border border-[#27272A] bg-[#18181F] p-1.5 text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
                  >
                    {copiedKey === "badge-schema" ? (
                      <Check className="h-3.5 w-3.5 text-[#34D399]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <pre className="overflow-x-auto text-[11px] leading-relaxed text-[#C4B5FD]">
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
              <div className="rounded-[14px] border border-[#27272A] bg-[#14141B] p-6 sm:p-8 space-y-5">
                <span className="text-[#A78BFA] font-mono text-xs font-semibold uppercase tracking-wider block">
                  HTTP Endpoints
                </span>
                <h2 className="font-display text-xl font-bold text-[#FAFAFA]">
                  Developer Platform REST API
                </h2>

                <div className="space-y-3 font-mono text-xs">
                  <div className="rounded-[10px] border border-[#27272A] bg-[#18181F] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded bg-[#34D399]/15 text-[#34D399] px-2 py-0.5 font-bold text-[11px]">
                        GET
                      </span>
                      <span className="text-[#FAFAFA] font-semibold">/api/challenges</span>
                    </div>
                    <span className="text-[#A1A1AA] text-[11px]">
                      Query challenge catalog with category, difficulty, pagination
                    </span>
                  </div>

                  <div className="rounded-[10px] border border-[#27272A] bg-[#18181F] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded bg-[#34D399]/15 text-[#34D399] px-2 py-0.5 font-bold text-[11px]">
                        GET
                      </span>
                      <span className="text-[#FAFAFA] font-semibold">/api/challenges/:id</span>
                    </div>
                    <span className="text-[#A1A1AA] text-[11px]">
                      Fetch challenge specifications and public test cases
                    </span>
                  </div>

                  <div className="rounded-[10px] border border-[#27272A] bg-[#18181F] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded bg-[#8B5CF6]/20 text-[#C4B5FD] px-2 py-0.5 font-bold text-[11px]">
                        POST
                      </span>
                      <span className="text-[#FAFAFA] font-semibold">/api/challenges</span>
                    </div>
                    <span className="text-[#A1A1AA] text-[11px]">
                      Author new challenge with custom test vectors (Mentor / Admin)
                    </span>
                  </div>

                  <div className="rounded-[10px] border border-[#27272A] bg-[#18181F] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded bg-[#60A5FA]/20 text-[#60A5FA] px-2 py-0.5 font-bold text-[11px]">
                        POST
                      </span>
                      <span className="text-[#FAFAFA] font-semibold">/api/auth/login</span>
                    </div>
                    <span className="text-[#A1A1AA] text-[11px]">
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
