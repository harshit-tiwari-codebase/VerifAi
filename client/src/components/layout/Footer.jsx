import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import VerifaiLogo from "../ui/VerifaiLogo.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-ink-600 bg-[#040609] py-14">
      <div className="container-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-ink-600/70">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center transition-transform hover:scale-[1.02]">
              <VerifaiLogo size="md" />
            </Link>
            <p className="text-xs text-mist-400 max-w-sm leading-relaxed">
              Replacing resume buzzwords with verifiable proof of engineering craftsmanship. Solved in a sandbox, reviewed by senior AI, minted as tamper-evident skill credentials.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-ink-600 bg-ink-900 text-[11px] font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Platform Core: Operational</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <p className="font-display text-xs uppercase tracking-wider text-mist-300 font-semibold mb-3">
              Platform
            </p>
            <ul className="space-y-2.5 font-sans text-xs text-mist-400">
              <li>
                <a href="#architecture" className="hover:text-violet-300 transition-colors">
                  4-Stage Pipeline
                </a>
              </li>
              <li>
                <a href="#playground" className="hover:text-violet-300 transition-colors">
                  Interactive Sandbox
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-violet-300 transition-colors">
                  Feature Breakdown
                </a>
              </li>
              <li>
                <a href="#profile" className="hover:text-violet-300 transition-colors">
                  Public Badges & Profile
                </a>
              </li>
              <li>
                <a href="#stack" className="hover:text-violet-300 transition-colors">
                  Zero-Cost Tech Stack
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-violet-300 transition-colors">
                  FAQ & Anti-Cheat
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack & Auth */}
          <div>
            <p className="font-display text-xs uppercase tracking-wider text-mist-300 font-semibold mb-3">
              Get Started
            </p>
            <ul className="space-y-2.5 font-sans text-xs text-mist-400">
              <li>
                <Link to="/register" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                  Create Candidate Profile →
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-mist-200 transition-colors">
                  Sign In to Dashboard
                </Link>
              </li>
              <li className="pt-2 text-[11px] text-mist-500 font-sans">
                Stack: MERN · Monaco · Judge0 · Gemini · Redis
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-mist-500">
          <p>© {new Date().getFullYear()} VerifAI. Proof of work, not claims of work.</p>
          <p className="flex items-center gap-1">
            Built with React 18, Tailwind CSS & Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}