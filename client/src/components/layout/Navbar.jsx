import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { selectIsAuthenticated } from "../../features/auth/authSlice.js";
import Button from "../ui/Button.jsx";
import VerifaiLogo from "../ui/VerifaiLogo.jsx";

export default function Navbar() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const appLinks = [
    {
      label: "Challenges",
      href: "/challenges",
      active: location.pathname.startsWith("/challenges"),
    },
    {
      label: "Playground",
      href: "/playground",
      active: location.pathname.startsWith("/playground"),
    },
    {
      label: "Leaderboard",
      href: "/leaderboard",
      active: location.pathname.startsWith("/leaderboard"),
    },
    {
      label: "Docs",
      href: "/docs",
      active: location.pathname.startsWith("/docs"),
    },
  ];

  const currentLinks = isAuthenticated ? appLinks : appLinks;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.08] bg-[#070A10]/95 backdrop-blur-md shadow-lg shadow-black/50"
          : "bg-[#070A10]/70 backdrop-blur-sm border-b border-white/[0.04]"
      }`}
    >
      <nav className="container-xl flex h-16 items-center justify-between">
        {/* Brand Logo on Left */}
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="group flex items-center gap-2 transition-transform hover:scale-[1.02]"
        >
          <VerifaiLogo size="md" />
        </Link>

        {/* Center Navigation Links with Fluid Animating Hover Effects */}
        <div
          className="hidden md:flex items-center gap-1"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {currentLinks.map((link, idx) => {
            const isActive = link.active;
            const isExternalAnchor = link.href.startsWith("/#");

            const content = (
              <span className="relative px-3.5 py-1.5 text-xs font-mono block transition-colors duration-200">
                {/* Fluid Spring Hover Pill */}
                {hoveredIdx === idx && (
                  <motion.span
                    layoutId="navbarHoverPill"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/[0.06]"
                  />
                )}

                {/* Animated Active Glowing Underline */}
                {isActive && (
                  <motion.span
                    layoutId="navbarActiveLine"
                    className="absolute bottom-0 left-2.5 right-2.5 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                  />
                )}

                <span
                  className={`relative z-10 transition-colors ${
                    isActive
                      ? "text-white font-medium"
                      : hoveredIdx === idx
                      ? "text-mist-100"
                      : "text-mist-400"
                  }`}
                >
                  {link.label}
                </span>
              </span>
            );

            return isExternalAnchor ? (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHoveredIdx(idx)}
              >
                {content}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                onMouseEnter={() => setHoveredIdx(idx)}
              >
                {content}
              </Link>
            );
          })}
        </div>

        {/* Right Section: Clean, Minimal Profile Icon (or Auth for guests) */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            /* Minimal Profile Icon on Right */
            <Link
              to="/dashboard"
              title="Open Dashboard"
              aria-label="Open Dashboard"
              className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-mist-300 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all duration-200 group"
            >
              <User className="h-4 w-4 stroke-[1.75] text-violet-300 group-hover:scale-110 transition-transform" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#070A10]" />
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
              <Link
                to="/login"
                className="px-3 py-1.5 text-mist-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Button as={Link} to="/register" variant="verify" size="sm" className="purple-glow">
                Get verified
              </Button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-white/10 text-mist-300 hover:text-white hover:border-violet-500/40"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/[0.08] bg-[#070A10]/98 backdrop-blur-xl px-6 py-4 space-y-3 font-mono text-xs"
          >
            {isAuthenticated ? (
              <div className="flex flex-col space-y-1.5">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 flex items-center justify-between transition-all ${
                    location.pathname === "/dashboard"
                      ? "bg-violet-600/90 text-white font-medium"
                      : "text-mist-400 hover:text-white"
                  }`}
                >
                  <span>My Profile & Dashboard</span>
                  <User className="h-3.5 w-3.5 text-violet-300" />
                </Link>

                <div className="h-px bg-white/[0.06] my-1" />

                {appLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-lg px-3 py-2 transition-all ${
                      link.active
                        ? "bg-violet-600/90 text-white font-medium"
                        : "text-mist-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : (
              <>
                <div className="flex flex-col space-y-1.5">
                  {appLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-lg px-3 py-2 transition-all ${
                        link.active
                          ? "bg-violet-600/90 text-white font-medium"
                          : "text-mist-400 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2">
                  <Button
                    as={Link}
                    to="/login"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    variant="verify"
                    size="sm"
                    className="w-full justify-center purple-glow"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get verified
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
