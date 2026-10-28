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
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "border-b border-[#27272A] bg-[#0D0D12]/90 backdrop-blur-xl py-3 shadow-lg shadow-black/60"
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

        {/* Center Navigation: Floating pill container */}
        {showNavigation && (
          <div className="hidden md:flex items-center rounded-xl border border-[#27272A] bg-[#14141B]/90 backdrop-blur-md px-1.5 py-1">
            <div
              className="flex items-center gap-1"
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {navLinks.map((link, idx) => {
                const isActive = link.active;

                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    className="relative px-3.5 py-1.5 text-xs font-sans font-medium block transition-colors duration-150"
                  >
                    {/* Active Pill: #211635 with subtle violet border */}
                    {isActive && (
                      <motion.span
                        layoutId="navbarActivePill"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                        className="absolute inset-0 rounded-[8px] bg-[#211635] border border-[#8B5CF6]/30"
                      />
                    )}
                    {hoveredIdx === idx && !isActive && (
                      <motion.span
                        layoutId="navbarHoverPill"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                        className="absolute inset-0 rounded-[8px] bg-[#20202A]"
                      />
                    )}

                    <span
                      className={`relative z-10 transition-colors ${
                        isActive
                          ? "text-[#A78BFA] font-semibold"
                          : hoveredIdx === idx
                          ? "text-[#FAFAFA]"
                          : "text-[#A1A1AA]"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Right Section: Profile Avatar or Auth Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              {/* Violet Circle Avatar with Initial */}
              <div className="relative">
                <button
                  type="button"
                  title="Open profile menu"
                  aria-label="Open profile menu"
                  aria-expanded={profileMenuOpen}
                  onClick={() => setProfileMenuOpen((isOpen) => !isOpen)}
                  className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-[#8B5CF6]/50 transition-all group"
                >
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] text-white font-bold text-xs border border-[#8B5CF6]/40 shadow-[0_0_16px_rgba(139,92,246,0.25)] group-hover:scale-105 transition-transform">
                    {userInitial}
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#34D399] ring-2 ring-[#0D0D12]" />
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#71717A] group-hover:text-[#FAFAFA] transition-colors hidden sm:inline" />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-xl border border-[#27272A] bg-[#18181F] shadow-2xl shadow-black/80"
                    >
                      <div className="flex items-center gap-3 border-b border-[#27272A] px-4 py-3 bg-[#14141B]">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] text-sm font-bold text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]">
                          {userInitial}
                        </span>
                        <div className="min-w-0">
                          <span className="truncate text-sm font-medium text-[#FAFAFA] block">
                            {user?.name || "Developer"}
                          </span>
                          <span className="truncate text-xs text-[#71717A] block">
                            {user?.email || ""}
                          </span>
                        </div>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-[#A1A1AA] transition-colors hover:bg-[#20202A] hover:text-[#FAFAFA]"
                      >
                        <CircleUserRound className="h-4 w-4 text-[#A78BFA]" />
                        Dashboard Profile
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 border-t border-[#27272A] px-4 py-2.5 text-left text-xs text-[#A1A1AA] transition-colors hover:bg-[#F87171]/10 hover:text-[#F87171]"
                      >
                        <LogOut className="h-4 w-4 text-[#F87171]" />
                        Sign Out
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
                className="px-3 py-1.5 text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
              >
                Sign in
              </Link>
              <Button as={Link} to="/register" variant="verify" size="sm">
                Get verified
              </Button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          {showNavigation && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-[10px] border border-[#27272A] bg-[#14141B] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#8B5CF6]/50"
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
            className="md:hidden border-b border-[#27272A] bg-[#0D0D12]/98 backdrop-blur-xl px-6 py-6 space-y-3 font-sans text-xs"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-[10px] px-3 py-2 transition-all ${
                    link.active
                      ? "bg-[#211635] text-[#A78BFA] border border-[#8B5CF6]/30 font-medium"
                      : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-[#27272A]">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-[10px] bg-[#18181F] p-2.5 border border-[#27272A]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8B5CF6] text-white font-bold text-xs">
                      {userInitial}
                    </span>
                    <span className="text-[#FAFAFA] font-medium text-xs">{user?.name || "Dashboard"}</span>
                  </div>
                  <span className="text-[11px] text-[#A78BFA] font-medium">Open →</span>
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
