import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-ink-600 bg-ink-900/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="container-xl flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-md border border-verify/50 bg-verify/10">
            <span className="h-2 w-2 rounded-sm bg-verify" />
          </span>
          <span className="font-display text-lg font-semibold text-mist-100">
            Verif<span className="text-verify">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-sm text-mist-500 transition-colors hover:text-mist-100"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button as={Link} to="/dashboard" variant="ghost" size="sm">
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
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button as={Link} to="/register" variant="verify" size="sm">
                Get verified
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
