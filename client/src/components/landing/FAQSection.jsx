import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "How does VerifAI prevent cheating with ChatGPT or Claude?",
    answer:
      "Unlike simple algorithmic questions where solutions can be copy-pasted, VerifAI challenges require real-world architectural design, concurrency handling, and secret edge-case validations. Furthermore, our AI evaluation engine audits the architectural nuance and coding style rather than just checking if standard test cases passed.",
  },
  {
    question: "How does the AI evaluation differ from standard test runners?",
    answer:
      "Standard test runners only tell you if output matches expected values. VerifAI's dual AI engine (Gemini 1.5 Pro + Groq) evaluates the solution like a Staff Engineer would: reviewing time complexity, memory allocation efficiency, potential race conditions, code maintainability, and clean naming patterns.",
  },
  {
    question: "Is untrusted code execution safe?",
    answer:
      "Yes. All user submissions run in sandboxed Judge0 Linux micro-containers. Each container is configured with read-only root filesystems, zero external internet access, disabled syscalls via seccomp, strict 128MB RAM limits, and hard 5-second execution timeouts.",
  },
  {
    question: "Can recruiters and hiring managers verify my badges for free?",
    answer:
      "Absolutely. Every earned badge has a permanent, publicly shareable permalink (e.g. verifai.dev/verify/badge_id). Anyone can view the cryptographic SHA-256 hash, verified test results, execution logs, and AI evaluation report without an account or paywall.",
  },
  {
    question: "How can VerifAI operate at ₹0 infrastructure cost?",
    answer:
      "The entire stack is engineered to leverage generous production-grade free tiers: React & Vite on Vercel, Express on Render, MongoDB Atlas free tier, Upstash Redis for Bull queues, Judge0 API via RapidAPI free tier, and Google Gemini / Groq API free quotas.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="container-xl py-24 relative">
      <div className="mb-16 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 font-sans text-xs font-medium mb-3">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-mist-100 font-display">
          Everything you need to know about VerifAI.
        </h2>
        <p className="mt-4 text-mist-300 text-base leading-relaxed font-sans">
          Have questions about the evaluation pipeline, sandboxing security, or public verification? We've got answers.
        </p>
      </div>

      <div className="max-w-3xl space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`card overflow-hidden border transition-all duration-200 ${
                isOpen ? "border-violet-500/40 bg-ink-800/60" : "border-ink-600 bg-ink-800/30"
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4"
              >
                <span className="font-display font-semibold text-base text-mist-100">
                  {faq.question}
                </span>
                <span
                  className={`h-7 w-7 rounded-lg border border-ink-600 bg-ink-900 flex items-center justify-center shrink-0 text-mist-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-violet-400 border-violet-500/30" : ""
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-6 md:px-6 text-sm text-mist-300 leading-relaxed border-t border-ink-600/50 pt-4 font-sans">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
