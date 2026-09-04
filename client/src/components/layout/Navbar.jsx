import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  logout,
  selectIsAuthenticated,
} from "../../features/auth/authSlice.js";
import Button from "../ui/Button.jsx";
import VerifaiLogo from "../ui/VerifaiLogo.jsx";

const LINKS = [
  { label: "Architecture", href: "#architecture" },
  { label: "Playground", href: "#playground" },
  { label: "Features", href: "#features" },
  { label: "Profile", href: "#profile" },
  { label: "Stack", href: "#stack" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink-600 bg-[#070A10]/90 backdrop-blur-md shadow-lg shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <nav className="container-xl flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center transition-transform hover:scale-[1.02]">
          <VerifaiLogo size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-mist-400 hover:text-mist-100 transition-colors relative group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-violet-400 transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Auth CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button as={Link} to="/dashboard" variant="ghost" size="sm">
                Dashboard
              </Button>
              <Button
                variant="verify"
                size="sm"
                onClick={async () => {
                  await dispatch(logout());
                  navigate("/");
                }}
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button as={Link} to="/register" variant="verify" size="sm" className="purple-glow">
                Get verified
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-ink-600 text-mist-300 hover:text-mist-100 hover:border-violet-500/40"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-ink-600 bg-[#070A10]/98 backdrop-blur-xl px-6 py-5 space-y-4"
          >
            <div className="flex flex-col space-y-3 font-mono text-sm">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-mist-400 hover:text-violet-300 py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-ink-600 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <>
                  <Button
                    as={Link}
                    to="/dashboard"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="verify"
                    size="sm"
                    className="w-full justify-center"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await dispatch(logout());
                      navigate("/");
                    }}
                  >
                    Sign out
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
