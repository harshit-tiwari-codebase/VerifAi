import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, CircleUserRound, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logout, selectIsAuthenticated, selectUser } from "../../features/auth/authSlice.js";
import Button from "../ui/Button.jsx";
import VerifaiLogo from "../ui/VerifaiLogo.jsx";

export default function Navbar({ showNavigation = true }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    {
      label: "Home",
      href: "/",
      active: location.pathname === "/",
    },
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

  const userInitial = (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase();

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await dispatch(logout());
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/[0.06] bg-black/80 backdrop-blur-xl py-3 shadow-lg shadow-black/40"
          : "bg-transparent py-4"
      }`}
    >
      <nav className="container-xl flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2 transition-transform hover:scale-[1.02] shrink-0"
        >
          <VerifaiLogo size="md" />
        </Link>

        {/* Center Navigation: Sheryians-inspired floating pill container */}
        {showNavigation && <div className="hidden md:flex items-center rounded-xl border-x-2 border-t-2 border-white/[0.08] bg-[#0e1017]/80 backdrop-blur-md px-1 py-2">
          <div
            className="flex items-center gap-0.5"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {navLinks.map((link, idx) => {
              const isActive = link.active;

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className="relative px-3.5 py-2 text-xs font-sans font-medium block transition-colors duration-200"
                >
                  {/* Active/Hover Pill */}
                  {isActive && (
                    <motion.span
                      layoutId="navbarActivePill"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]"
                    />
                  )}
                  {hoveredIdx === idx && !isActive && (
                    <motion.span
                      layoutId="navbarHoverPill"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-white/[0.04]"
                    />
                  )}

                  <span
                    className={`relative z-10 transition-colors ${
                      isActive
                        ? "text-white font-semibold"
                        : hoveredIdx === idx
                        ? "text-mist-100"
                        : "text-mist-400"
                    }`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>}

        {/* Right Section: Profile Avatar (Sheryians purple circle with initial) or Auth */}
        <div className="flex items-center gap-3 shrink-0 ">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5 ">
              {/* <Button
                as={Link}
                to="/dashboard"
                variant="verify"
                size="sm"
                className="hidden sm:inline-flex !rounded-lg !px-3.5 !py-1.5"
              >
                Dashboard
              </Button> */}

              {/* Purple Circle Avatar with Initial */}
              <div className="relative">
                <button
                  type="button"
                  title="Open profile menu"
                  aria-label="Open profile menu"
                  aria-expanded={profileMenuOpen}
                  onClick={() => setProfileMenuOpen((isOpen) => !isOpen)}
                  className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-violet-500/40 transition-all group"
                >
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white font-bold text-xs border border-white/20 shadow-[0_0_15px_rgba(147,51,234,0.35)] group-hover:scale-105 transition-transform">
                    {userInitial}
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-black" />
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-mist-500 group-hover:text-white transition-colors hidden sm:inline" />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-lg border border-white/[0.16] bg-[#0e0b0d] shadow-2xl shadow-black/50"
                    >
                      <div className="flex items-center gap-3 border-b border-white/[0.12] px-4 py-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-sm font-bold text-white">
                          {userInitial}
                        </span>
                        <span className="truncate text-sm font-medium text-mist-100">
                          {user?.name || "User"}
                        </span>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-mist-200 transition-colors hover:bg-white/[0.06] hover:text-white"
                      >
                        <CircleUserRound className="h-6 w-6 text-mist-400" />
                        Profile
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 border-t border-white/[0.12] px-4 py-3 text-left text-sm text-mist-200 transition-colors hover:bg-rose-500/[0.08] hover:text-rose-400"
                      >
                        <LogOut className="h-6 w-6 text-rose-500" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2 font-sans text-xs font-medium">
              <Link
                to="/login"
                className="px-3 py-1.5 text-mist-400 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Button as={Link} to="/register" variant="verify" size="sm" className="!rounded-lg">
                Get verified
              </Button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          {showNavigation && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg border border-white/10 text-mist-300 hover:text-white hover:border-violet-500/40"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showNavigation && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/[0.08] bg-black/95 backdrop-blur-xl px-6 py-6 space-y-3 font-sans text-xs"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 transition-all ${
                    link.active
                      ? "bg-violet-600 text-white font-medium"
                      : "text-mist-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-white/[0.08]">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg bg-[#0e1017] p-2.5 border border-white/[0.08]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white font-bold text-xs">
                      {userInitial}
                    </span>
                    <span className="text-white font-medium text-xs">{user?.name || "Dashboard"}</span>
                  </div>
                  <span className="text-[11px] text-violet-400 font-medium">Open →</span>
                </Link>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
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
                    className="w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get verified
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
