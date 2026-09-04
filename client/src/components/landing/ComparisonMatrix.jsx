import { motion } from "framer-motion";
import { Check, X, Sparkles, Scale } from "lucide-react";

const COMPARISONS = [
  {
    dimension: "Challenge Type",
    resume: "Bullet points claiming 'Expert in Node.js'",
    leetcode: "Abstract algorithmic puzzles (reverse a tree)",
    verifai: "Real-world engineering (rate limiters, distributed locks, schema design)",
    verifaiWin: true,
  },
  {
    dimension: "Evaluation Depth",
    resume: "Zero proof — keyword matching by ATS bots",
    leetcode: "Binary pass/fail on edge cases only",
    verifai: "Dual AI Senior Review (Gemini/Groq) analyzing architecture & complexity",
    verifaiWin: true,
  },
  {
    dimension: "Cheating Resistance",
    resume: "Easily exaggerated or forged",
    leetcode: "Solutions easily copy-pasted from ChatGPT",
    verifai: "Sandboxed execution + hidden test suites + architectural audit",
    verifaiWin: true,
  },
  {
    dimension: "Recruiter Verification",
    resume: "Requires multiple 60-min manual screening calls",
    leetcode: "No persistent verifiable public portfolio",
    verifai: "1-Click public profile with cryptographic SHA-256 validation",
    verifaiWin: true,
  },
  {
    dimension: "Actionable Feedback",
    resume: "None (automated rejection emails)",
    leetcode: "Memory & time percentile ranking only",
    verifai: "Detailed code review: Strengths, anti-patterns, refactoring suggestions",
    verifaiWin: true,
  },
];

export default function ComparisonMatrix() {
  return (
    <section className="container-xl py-24 relative">
      <div className="mb-16 max-w-2xl text-center mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 font-mono text-xs mb-3">
          <Scale className="h-3.5 w-3.5" />
          <span>The Better Standard</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-mist-100 font-display">
          Why VerifAI replaces resumes and algorithmic trivia.
        </h2>
        <p className="mt-4 text-mist-300 text-base leading-relaxed">
          See how VerifAI compares against conventional resumes and LeetCode-style puzzle platforms.
        </p>
      </div>

      <div className="card overflow-x-auto no-scrollbar border-ink-600 shadow-2xl">
        <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="border-b border-ink-600 bg-ink-900/80 font-mono text-xs text-mist-400">
              <th className="p-4 md:p-5 w-1/4">Evaluation Vector</th>
              <th className="p-4 md:p-5 w-1/4 text-mist-500">Traditional Resumes</th>
              <th className="p-4 md:p-5 w-1/4 text-mist-500">LeetCode / Autograders</th>
              <th className="p-4 md:p-5 w-1/4 text-violet-400 bg-violet-950/20 font-semibold border-l border-violet-500/30">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  VerifAI Platform
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-600 text-xs md:text-sm">
            {COMPARISONS.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-ink-800/30 transition-colors group"
              >
                <td className="p-4 md:p-5 font-semibold text-mist-200 font-display">
                  {row.dimension}
                </td>
                <td className="p-4 md:p-5 text-mist-500">
                  <div className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-400/70 shrink-0 mt-0.5" />
                    <span>{row.resume}</span>
                  </div>
                </td>
                <td className="p-4 md:p-5 text-mist-500">
                  <div className="flex items-start gap-2">
                    <X className="h-4 w-4 text-amber-400/70 shrink-0 mt-0.5" />
                    <span>{row.leetcode}</span>
                  </div>
                </td>
                <td className="p-4 md:p-5 text-mist-100 bg-violet-950/15 border-l border-violet-500/30 group-hover:bg-violet-950/25 transition-colors">
                  <div className="flex items-start gap-2 font-medium">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-violet-200">{row.verifai}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
