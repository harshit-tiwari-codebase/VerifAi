import { Link } from "react-router-dom";
import VerifaiLogo from "../ui/VerifaiLogo.jsx";
import CinematicTypography from "../ui/CinematicTypography.jsx";

// Custom authentic Instagram icon
function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={`fill-none stroke-current ${className}`} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Custom authentic LinkedIn icon
function LinkedinIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.95 0-1.72.77-1.72 1.72s.77 1.72 1.72 1.72 1.72-.77 1.72-1.72-.77-1.72-1.72-1.72z" />
    </svg>
  );
}

// Custom authentic YouTube icon
function YoutubeIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// Custom authentic Discord icon
function DiscordIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

// Custom authentic X (Twitter) icon
function XIcon({ className = "w-4.5 h-4.5" }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-transparent text-mist-100 border-t border-white/[0.04] overflow-hidden select-none">
      {/* =========================================================
          1. TOP GIANT TRANSPARENT HOVER-GLOW WORDMARK
      ========================================================== */}
      <CinematicTypography />

      {/* =========================================================
          2. BOTTOM CONTENT SECTION (Sheryians Layout)
      ========================================================== */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-6 pb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16">
          {/* Left Column: Brand Logo & Social Icons */}
          <div className="space-y-6 lg:w-[28%] shrink-0">
            <Link to="/" className="inline-block transition-transform hover:scale-[1.02]">
              <VerifaiLogo size="lg" showWordmark={true} />
            </Link>

            <p className="text-xs text-mist-400 font-sans leading-relaxed max-w-xs">
              Cryptographically verified proof of engineering craftsmanship. Built for production rigor, audited by Staff AI.
            </p>

            {/* Social Icons Row (Instagram, LinkedIn, Discord, YouTube, X) */}
            <div className="flex items-center gap-5 text-mist-400 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-white transition-colors duration-200"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="hover:text-white transition-colors duration-200"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>

              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="hover:text-white transition-colors duration-200"
              >
                <DiscordIcon className="w-5 h-5" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="hover:text-white transition-colors duration-200"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="hover:text-white transition-colors duration-200"
              >
                <XIcon className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Right Columns: ABOUT, COMPANY, CONTACT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 flex-1 w-full">
            {/* Column 1: ABOUT */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white font-sans">
                About
              </h3>
              <ul className="space-y-2.5 text-xs text-mist-400 font-sans">
                <li>
                  <Link to="/docs" className="hover:text-white transition-colors block">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@verifai.io" className="hover:text-white transition-colors block">
                    Support
                  </a>
                </li>
                <li>
                  <Link to="/docs" className="hover:text-white transition-colors block">
                    Privacy Policy
                  </Link>
                </li>
               
                <li>
                  <Link to="/docs" className="hover:text-white transition-colors block">
                    Terms and Condition
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: COMPANY */}
            <div className="space-y-3">
              <ul className="space-y-2.5 text-xs text-mist-400 font-sans">
                <li>
                  <Link to="/playground" className="hover:text-white transition-colors block">
                    Resume Checker
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="hover:text-white transition-colors block">
                    Hire From Us
                  </Link>
                </li>
               
               
                <li>
                  <Link to="/dashboard" className="hover:text-white transition-colors block">
                    Submit Projects
                  </Link>
                </li>
                <li>
                  <a href="mailto:feedback@verifai.io" className="hover:text-white transition-colors block">
                    Feedback
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: CONTACT */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white font-sans">
                Contact
              </h3>
              <div className="space-y-2.5 text-xs text-mist-400 font-sans leading-relaxed">
                <div>
                  <span className="text-white font-medium">Online: </span>
                  <span className="text-mist-300">10am - 10pm</span>
                  <span className="text-mist-400 ml-1">+91 90714XXXXX</span>
                </div>

                <div>
                  <span className="text-white font-medium">Offline: </span>
                  <span className="text-mist-300">11am - 8pm</span>
                  <span className="text-mist-400 ml-1">+91 9691XXXXXX</span>
                </div>

                <div>
                  <a
                    href="mailto:hello@verifai.io"
                    className="hover:text-white transition-colors text-mist-300 block"
                  >
                    hello@verifai.io
                  </a>
                </div>

                <div className="pt-1 text-mist-500">
                  IPS ACADEMY, INDORE (MP), 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Hairline & Legal Bar */}
        <div className="border-t border-white/[0.06] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-mist-500 font-sans">
          <p>© {new Date().getFullYear()} VerifAI Inc. All rights reserved.</p>
          <p className="text-mist-600">Proof of work, not claims of work.</p>
        </div>
      </div>
    </footer>
  );
}