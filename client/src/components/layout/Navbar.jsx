import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../features/auth/context/AuthContext.jsx";
import Button from "../ui/Button.jsx";

const LINKS = [
  { label: "Flow", href: "#flow" },
  { label: "Live demo", href: "#demo" },
  { label: "Stack", href: "#stack" },
];

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink-600 bg-[#04030A]/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="container-xl flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2.5"
        >
          <span
            className="
              relative flex h-9 w-9 items-center justify-center
              rounded-lg
              border border-violet-400/25
              bg-violet-500/[0.08]
              shadow-[0_0_18px_rgba(139,92,246,0.06)]
              transition-all duration-200
              group-hover:border-violet-400/50
              group-hover:bg-violet-500/[0.14]
              group-hover:shadow-[0_0_22px_rgba(139,92,246,0.12)]
            "
          >
            <ShieldCheck
              className="h-[18px] w-[18px] text-violet-400"
              strokeWidth={2.25}
            />
          </span>

          <span className="font-display text-lg font-semibold tracking-tight text-mist-100">
            Verif
            <span className="text-violet-400">AI</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="
                group relative
                font-mono text-sm
                text-mist-500
                transition-colors
                hover:text-mist-100
              "
            >
              {link.label}

              <span
                className="
                  absolute -bottom-1 left-0
                  h-px w-0
                  bg-violet-400
                  shadow-[0_0_6px_rgba(167,139,250,0.5)]
                  transition-all duration-300
                  group-hover:w-full
                "
              />
            </a>
          ))}
        </div>

        {/* Auth actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                as={Link}
                to="/dashboard"
                variant="ghost"
                size="sm"
              >
                Dashboard
              </Button>

              <Button
                variant="verify"
                size="sm"
                onClick={async () => {
                  await logout();
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
              >
                Sign in
              </Button>

              <Button
                as={Link}
                to="/register"
                variant="verify"
                size="sm"
              >
                Get verified
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}