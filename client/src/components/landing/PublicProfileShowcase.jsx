import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Award,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Terminal,
  Sparkles,
  GitCommit,
  UserCheck,
} from "lucide-react";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";

const BADGES = [
  {
    id: "badge-1",
    title: "Distributed Systems: Rate Limiter",
    category: "Architecture",
    score: 96,
    date: "Sep 2026",
    hash: "a4f89d12e8c2049ba32e1819d4581298450f367e912384a86b",
    highlights: "O(1) algorithmic token bucket with zero clock skew vulnerability",
    status: "Cryptographically Verified",
  },
  {
    id: "badge-2",
    title: "Redis Distributed Mutex",
    category: "Concurrency",
    score: 98,
    date: "Aug 2026",
    hash: "7c1209e84bfa109845da284195720184bfa2948194e1048b29",
    highlights: "Atomic Lua script execution with auto-expiring UUID tokens",
    status: "Cryptographically Verified",
  },
  {
    id: "badge-3",
    title: "Zero-Trust JWT Token Rotator",
    category: "Security",
    score: 95,
    date: "Aug 2026",
    hash: "3b9281a409581c39058b2940192849da102948bfa928104829",
    highlights: "Automatic token reuse detection & immediate family revocation",
    status: "Cryptographically Verified",
  },
];

export default function PublicProfileShowcase() {
  const [selectedBadge, setSelectedBadge] = useState(BADGES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(
      `https://verifai.dev/verify/${selectedBadge.hash.slice(0, 16)}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="profile" className="container-xl py-24 relative">
      <div className="mb-16 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 font-sans text-xs font-medium mb-3">
          <UserCheck className="h-3.5 w-3.5" />
          <span>The Outcome</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-mist-100 font-display">
          Your public developer profile. Proof of work that recruiters trust.
        </h2>
        <p className="mt-4 text-mist-300 text-base leading-relaxed font-sans">
          Forget listing skills in a bulleted list. VerifAI generates a live portfolio of verified badges backed by real code submissions, execution telemetry, and AI review audits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Mock Public Profile Card (5 cols) */}
        <div className="lg:col-span-5 card p-6 md:p-8 border-ink-600 bg-ink-800/40 relative overflow-hidden shadow-2xl">
          {/* Subtle purple aura */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-600/10 blur-3xl" />

          {/* Profile Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-ink-600">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-800 flex items-center justify-center font-display text-xl font-bold text-white shadow-lg shadow-violet-900/30">
                AT
              </div>
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-ink-900 flex items-center justify-center">
                <Check className="h-3 w-3 text-ink-950 stroke-[3]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-semibold text-mist-100">
                  Alex Tiwari
                </h3>
                <span className="font-sans text-[11px] font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                  PROVER
                </span>
              </div>
              <p className="font-sans text-xs text-mist-400 mt-0.5">verifai.dev/u/alex-tiwari</p>
              <p className="text-xs text-mist-300 mt-1 font-sans">Backend & Distributed Systems Engineer</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 py-5 border-b border-ink-600 font-sans text-center">
            <div className="p-2 rounded-lg bg-ink-900/60 border border-ink-600/60">
              <p className="text-[10px] text-mist-400 font-medium uppercase tracking-wider">Verified</p>
              <p className="text-base font-semibold text-mist-100 mt-0.5">14</p>
            </div>
            <div className="p-2 rounded-lg bg-ink-900/60 border border-ink-600/60">
              <p className="text-[10px] text-mist-400 font-medium uppercase tracking-wider">Avg Score</p>
              <p className="text-base font-semibold text-violet-400 mt-0.5">96.3</p>
            </div>
            <div className="p-2 rounded-lg bg-ink-900/60 border border-ink-600/60">
              <p className="text-[10px] text-mist-400 font-medium uppercase tracking-wider">Percentile</p>
              <p className="text-base font-semibold text-purple-300 mt-0.5">Top 2%</p>
            </div>
          </div>

          {/* Earned Badges List */}
          <div className="pt-5">
            <p className="text-xs font-sans text-mist-400 font-semibold uppercase tracking-wider mb-3">
              Earned Badges (Select to Inspect)
            </p>
            <div className="space-y-2">
              {BADGES.map((b) => {
                const isSelected = selectedBadge.id === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBadge(b)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-violet-500 bg-violet-950/30 text-mist-100 shadow-[0_0_15px_rgba(147,51,234,0.15)]"
                        : "border-ink-600 bg-ink-900/40 text-mist-400 hover:border-ink-500 hover:text-mist-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Award
                        className={`h-4 w-4 ${
                          isSelected ? "text-violet-400" : "text-mist-600"
                        }`}
                      />
                      <span className="text-xs font-medium truncate max-w-[200px]">
                        {b.title}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-violet-400">
                      {b.score}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Credential Verification Certificate (7 cols) */}
        <div className="lg:col-span-7 card p-6 md:p-8 border-violet-500/40 bg-ink-900/80 shadow-2xl relative">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-ink-600">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-violet-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Validated Credential
                </span>
                <h4 className="font-display text-lg font-semibold text-mist-100">
                  {selectedBadge.title}
                </h4>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={handleCopyLink}>
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Share Verification
                </>
              )}
            </Button>
          </div>

          {/* Certificate Detail Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-ink-600">
            <div>
              <p className="text-[11px] font-mono text-mist-500 uppercase">Architecture Score</p>
              <p className="text-2xl font-display font-bold text-violet-400 mt-1">
                {selectedBadge.score} <span className="text-sm font-mono text-mist-500 font-normal">/ 100</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-mono text-mist-500 uppercase">Issued Date</p>
              <p className="text-sm font-mono text-mist-200 mt-1">{selectedBadge.date}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] font-mono text-mist-500 uppercase">Audited Highlight</p>
              <p className="text-xs text-mist-300 mt-1 font-sans">{selectedBadge.highlights}</p>
            </div>
          </div>

          {/* Cryptographic Proof Hash */}
          <div className="pt-6 space-y-3">
            <p className="text-[11px] font-mono text-mist-500 uppercase flex items-center gap-1.5">
              <GitCommit className="h-3 w-3 text-violet-400" />
              Cryptographic Proof Fingerprint (SHA-256)
            </p>
            <div className="p-3 rounded-lg border border-ink-600 bg-[#070A10] font-mono text-xs text-violet-300 break-all select-all">
              {selectedBadge.hash}
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-mist-500 pt-2">
              <span>Verified against Judge0 sandbox container logs</span>
              <span>Gemini 1.5 Senior Code Audit Signed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
