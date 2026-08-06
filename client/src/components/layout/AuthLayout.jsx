import { Link } from "react-router-dom";

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* form side */}
      <div className="flex flex-col justify-center px-6 py-12 md:px-16">
        <Link to="/" className="mb-10 flex items-center gap-2">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-md border border-verify/50 bg-verify/10">
            <span className="h-2 w-2 rounded-sm bg-verify" />
          </span>
          <span className="font-display text-lg font-semibold text-mist-100">
            Verif<span className="text-verify">AI</span>
          </span>
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="text-2xl font-semibold text-mist-100 md:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm text-mist-500">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* atmosphere side */}
      <div className="relative hidden overflow-hidden border-l border-ink-600 bg-ink-800/40 md:block">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-verify/10 via-transparent to-signal/10" />
        <div className="flex h-full flex-col justify-center px-14">
          <p className="font-mono text-xs text-mist-500">
            server/controllers/authController.js
          </p>
          <pre className="mt-4 overflow-hidden font-mono text-[13px] leading-6 text-mist-300">
            <code>
              <span className="text-signal">const</span> tokens = {"{"}
              {"\n"}
              {"  "}access: <span className="text-verify">signAccess</span>
              (user), {"\n"}
              {"  "}refresh:{" "}
              <span className="text-verify">rotateRefresh</span>
              (user){"\n"}
              {"};"}
              {"\n\n"}
              <span className="text-mist-700">
                // refresh token rotated on every use
              </span>
              {"\n"}
              <span className="text-mist-700">
                // old token invalidated in DB — detects replay
              </span>
            </code>
          </pre>

          <div className="mt-10 flex items-center gap-3 rounded-lg border border-ink-600 bg-ink-900/60 px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-verify" />
            <p className="font-mono text-xs text-mist-500">
              access token · 15 min · kept in memory, not localStorage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
