import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
      "The entire stack is engineered to use production-grade free tiers: React & Vite on Vercel, Express on Render, MongoDB Atlas, Upstash Redis for Bull queues, Judge0 via RapidAPI, and Google Gemini / Groq API free quotas.",
  },
];

export default function FAQSection() {
  const [openIdx, setOpenIdx]   = useState(0);
  const [visible, setVisible]   = useState(false);
  const sectionRef              = useRef(null);
  const shouldReduce            = useReducedMotion();

  /* Fires ONCE when the section enters the viewport — not scroll-triggered fade-up */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative py-24"
      style={{ backgroundColor: "#0B0B0A", borderTop: "1px solid #30302B" }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">

        {/* Header — fades in once on enter */}
        <motion.div
          className="mb-14 max-w-2xl"
          initial={shouldReduce ? {} : { opacity: 0, y: 14 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <div className="mb-3 flex items-center gap-2">
            <HelpCircle className="h-3.5 w-3.5" style={{ color: "#FF6A3D" }} strokeWidth={1.5} />
            <p
              className="font-mono text-[10px] uppercase tracking-[0.18em] sm:text-[11px]"
              style={{ color: "#77756D" }}
            >
              05 — FAQ
            </p>
          </div>
          <h2
            className="font-display text-3xl font-semibold md:text-4xl"
            style={{ color: "#F2EFE6", letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            Everything you need to know about VerifAI.
          </h2>
          <p
            className="mt-4 text-base leading-relaxed font-sans"
            style={{ color: "#AAA69B", lineHeight: 1.6 }}
          >
            Questions about the evaluation pipeline, sandbox security, or public verification?
          </p>
        </motion.div>

        {/* FAQ list — staggered entrance (fires once, not on every scroll) */}
        <div className="max-w-3xl space-y-2.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <motion.div
                key={idx}
                initial={shouldReduce ? {} : { opacity: 0, y: 10 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.24,
                  ease: "easeOut",
                  delay: shouldReduce ? 0 : 0.06 + idx * 0.07,
                }}
                className="overflow-hidden rounded-[8px] border transition-colors duration-200"
                style={{
                  backgroundColor: isOpen ? "#171714" : "#111110",
                  borderColor:     isOpen ? "rgba(255,106,61,0.45)" : "#30302B",
                }}
              >
                {/* Question row */}
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full px-5 py-4 md:px-6 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ focusRingColor: "#FF6A3D" }}
                  aria-expanded={isOpen}
                >
                  <span
                    className="font-display font-semibold text-base leading-snug transition-colors duration-200"
                    style={{ color: isOpen ? "#F2EFE6" : "#D5D1C8" }}
                  >
                    {faq.question}
                  </span>

                  {/* Animated chevron */}
                  <motion.span
                    animate={shouldReduce ? {} : { rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="h-7 w-7 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors duration-200"
                    style={{
                      borderColor:     isOpen ? "rgba(255,106,61,0.35)" : "#30302B",
                      backgroundColor: isOpen ? "rgba(255,106,61,0.08)" : "#1C1C19",
                      color:           isOpen ? "#FF6A3D" : "#77756D",
                    }}
                  >
                    <ChevronDown className="h-4 w-4" strokeWidth={1.5} />
                  </motion.span>
                </button>

                {/* Answer panel — height + opacity animate */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={shouldReduce ? {} : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={shouldReduce ? {} : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        className="px-5 pb-5 md:px-6 pt-0 font-sans text-sm leading-relaxed"
                        style={{
                          borderTop: "1px solid #30302B",
                          color: "#AAA69B",
                          lineHeight: 1.6,
                          paddingTop: "1rem",
                        }}
                      >
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
