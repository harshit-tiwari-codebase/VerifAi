export default function Footer() {
  return (
    <footer className="border-t border-ink-600 py-10">
      <div className="container-xl flex flex-col items-center justify-between gap-4 text-sm text-mist-700 md:flex-row">
        <p className="font-mono text-xs">
          Verif
          <span className="text-violet-400">AI</span>{" "}
          — proof of work, not claims of work.
        </p>

        <p className="font-mono text-xs">
          built on MERN · Judge0 · Gemini/Groq · deployed at ₹0
        </p>
      </div>
    </footer>
  );
}