import { motion } from "framer-motion";
import {
  Code2,
  Sparkles,
  Shield,
  Award,
  Zap,
  CheckCircle,
  GitPullRequest,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: Code2,
    badge: "Pillar 01",
    title: "Real-World Engineering, Not Toy Puzzles",
    subtitle: "Say goodbye to inverting binary trees",
    description:
      "Modern software engineering is about concurrency, API rate limits, database transactions, and graceful degradation. VerifAI tests candidates on actual production code challenges designed by staff engineers.",
    highlights: [
      "Distributed lock managers & Redis Lua atomic scripts",
      "Token bucket & leaky bucket rate limiters",
      "Database schema migration scripts & deadlock prevention",
      "JWT replay guards and security hardening",
    ],
    codePreview: `// Real-world scenario: Distributed cache stampede defense
const data = await cache.getOrSet(key, async () => {
  return await fetchFromSlowDatabase();
}, { ttl: 300, lockTtl: 10 });`,
  },
  {
    icon: Sparkles,
    badge: "Pillar 02",
    title: "Dual-Model Senior AI Reviewer",
    subtitle: "Automated feedback like a Staff Engineer",
    description:
      "Unit tests only prove code didn't crash on sample inputs. VerifAI's dual AI engine (Gemini 1.5 Pro & Groq) audits your code quality, naming conventions, memory leaks, algorithmic complexity, and idiomatic style.",
    highlights: [
      "O(n) time & space complexity verification",
      "Anti-pattern & code smell detection",
      "Actionable refactoring recommendations",
      "Comprehensive 0–100 architecture scoring rubric",
    ],
    codePreview: `// AI Senior Code Review Telemetry
{
  "score": 94,
  "verdict": "Architecture Sound · Edge Cases Handled",
  "strengths": ["Zero thread blocking", "O(1) memory delta"]
}`,
  },
  {
    icon: Shield,
    badge: "Pillar 03",
    title: "Sandboxed Deterministic Execution",
    subtitle: "Zero-trust container isolation via Judge0",
    description:
      "Every submission runs in an isolated Linux micro-container. CPU usage, memory allocations, network traffic, and system calls are strictly constrained, protecting against malicious payloads and ensuring fair benchmarks.",
    highlights: [
      "Hardened Linux namespace & cgroup constraints",
      "128MB RAM limit & 5-second hard execution timeout",
      "Direct stdout, stderr, and exit-code capture",
      "Deterministic test runs with zero side-effects",
    ],
    codePreview: `// Judge0 Sandbox Constraints
docker_container: {
  memory_limit: "128m",
  cpu_quota: "50000",
  network_disabled: true,
  read_only_rootfs: true
}`,
  },
  {
    icon: Award,
    badge: "Pillar 04",
    title: "Cryptographic Skill Credentials",
    subtitle: "Permanent proof recruiters can verify in 1 click",
    description:
      "Passed challenges earn tamper-proof badges attached to your public VerifAI developer profile. Each badge is cryptographically anchored with a unique SHA-256 hash containing your test logs and AI review transcript.",
    highlights: [
      "Public profile link (verifai.dev/u/your-handle)",
      "Recruiter-friendly 1-click verification portal",
      "Exportable badge embeds for GitHub READMEs & LinkedIn",
      "Permanent record of code quality and execution timestamps",
    ],
    codePreview: `// Verifiable Credential Permalink
https://verifai.dev/verify/badge_9f82d4bc
Hash: 8f4a1...c03b (SHA-256 Validated)`,
  },
];

export default function FeatureShowcase() {
  return (
    <section id="features" className="container-xl py-24 relative">
      <div className="mb-16 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 font-mono text-xs mb-3">
          <Zap className="h-3.5 w-3.5" />
          <span>Core Capabilities</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-mist-100 font-display">
          Everything you need to prove senior-level engineering competence.
        </h2>
        <p className="mt-4 text-mist-300 text-base leading-relaxed">
          VerifAI combines modern sandboxing, cutting-edge AI reasoning, and verifiable credentials into a single unified platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="card p-7 md:p-8 flex flex-col justify-between border-ink-600 hover:border-violet-500/30 hover:shadow-[0_0_35px_rgba(147,51,234,0.1)] transition-all duration-300 relative group overflow-hidden"
            >
              {/* Subtle top glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-violet-600/10 blur-2xl group-hover:bg-violet-600/20 transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 group-hover:border-violet-400/40 transition-all">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-mono text-xs text-mist-500 uppercase tracking-widest px-2.5 py-1 rounded border border-ink-600 bg-ink-900">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold text-mist-100 group-hover:text-violet-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs font-mono text-violet-400 mt-1">{feature.subtitle}</p>

                <p className="text-sm text-mist-300 mt-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlights List */}
                <ul className="mt-6 space-y-2.5 border-t border-ink-600 pt-5">
                  {feature.highlights.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-mist-300">
                      <CheckCircle className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code Snippet Box */}
              <div className="mt-6 rounded-lg border border-ink-600 bg-[#070A10] p-3 font-mono text-[11px] text-mist-400 overflow-x-auto no-scrollbar leading-relaxed">
                <pre className="no-scrollbar">
                  <code>{feature.codePreview}</code>
                </pre>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
