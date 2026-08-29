import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04030A]">
      {/* =====================================================
          GLOBAL DARK MOON ATMOSPHERE
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Main moon */}
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-violet-600/[0.055] blur-[130px]" />

        {/* Secondary violet atmosphere */}
        <div className="absolute -bottom-40 right-[-120px] h-[500px] w-[500px] rounded-full bg-purple-600/[0.045] blur-[130px]" />

        {/* Very subtle center light */}
        <div className="absolute left-1/2 top-1/3 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-violet-500/[0.018] blur-[100px]" />
      </div>

      <div className="relative grid min-h-screen md:grid-cols-2">
        {/* =====================================================
            FORM SIDE
        ====================================================== */}

        <div className="relative flex flex-col px-6 py-8 md:justify-center md:px-16 md:py-12">
          {/* Mobile/top logo */}
          <Link
            to="/"
            className="
              group
              mb-12
              flex w-fit items-center gap-2.5
              md:absolute md:left-16 md:top-10
            "
          >
            <span
              className="
                relative flex h-8 w-8 items-center justify-center
                rounded-lg
                border border-violet-400/25
                bg-violet-500/[0.07]
                shadow-[0_0_20px_rgba(139,92,246,0.06)]
                transition-all duration-200
                group-hover:border-violet-400/45
                group-hover:bg-violet-500/[0.11]
              "
            >
              <ShieldCheck
                className="h-4 w-4 text-violet-400"
                strokeWidth={2.2}
              />
            </span>

            <span className="font-display text-lg font-semibold tracking-tight text-mist-100">
              Verif
              <span className="text-violet-400">AI</span>
            </span>
          </Link>

          {/* Form content */}
          <div className="mx-auto w-full max-w-sm">
            {/* Eyebrow */}
            <p className="eyebrow mb-3 text-violet-400">
              {eyebrow}
            </p>

            {/* Title */}
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-mist-100">
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="mt-3 max-w-md text-sm leading-relaxed text-mist-500">
                {subtitle}
              </p>
            )}

            {/* Children */}
            <div className="mt-8">
              {children}
            </div>
          </div>

          {/* Bottom security note */}
          <div className="mt-10 flex items-center justify-center gap-2 md:absolute md:bottom-8 md:left-16">
            <span className="h-1 w-1 rounded-full bg-violet-400/60" />

            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-mist-700">
              secure · verified · proof of work
            </span>
          </div>
        </div>

        {/* =====================================================
            ATMOSPHERE / CODE SIDE
        ====================================================== */}

        <div
          className="
            relative
            hidden
            overflow-hidden
            border-l border-white/[0.06]
            bg-[#07060D]/60
            md:block
          "
        >
          {/* Purple moon gradients */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(124,58,237,0.12),transparent_45%)]" />

          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-600/[0.06] blur-[110px]" />

          <div className="pointer-events-none absolute -bottom-40 left-[-100px] h-96 w-96 rounded-full bg-purple-600/[0.04] blur-[110px]" />

          {/* Subtle grid */}
          <div
            className="
              pointer-events-none absolute inset-0
              opacity-[0.025]
              [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)]
              [background-size:48px_48px]
            "
          />

          <div className="relative flex h-full flex-col justify-center px-14">
            {/* Code label */}
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.7)]" />

              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-mist-600">
                authentication layer
              </p>
            </div>

            <p className="mt-6 font-mono text-xs text-mist-600">
              server/controllers/authController.js
            </p>

            {/* Code block */}
            <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#04030A]/70 p-5 shadow-2xl shadow-black/30 backdrop-blur-sm">
              <pre className="overflow-hidden font-mono text-[13px] leading-6 text-mist-300">
                <code>
                  <span className="text-violet-400">
                    const
                  </span>{" "}
                  tokens = {"{"}
                  {"\n"}

                  {"  "}
                  access:{" "}
                  <span className="text-purple-300">
                    signAccess
                  </span>
                  (user),
                  {"\n"}

                  {"  "}
                  refresh:{" "}
                  <span className="text-purple-300">
                    rotateRefresh
                  </span>
                  (user)
                  {"\n"}

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
            </div>

            {/* Security status */}
            <div className="mt-5 rounded-xl border border-white/[0.06] bg-[#04030A]/60 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-500/[0.06]">
                  <ShieldCheck
                    className="h-3.5 w-3.5 text-violet-400"
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <p className="font-mono text-xs text-violet-300">
                    access token · 15 min
                  </p>

                  <p className="mt-1 font-mono text-[10px] leading-relaxed text-mist-700">
                    kept in memory, not localStorage
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom statement */}
            <p className="mt-8 max-w-sm font-display text-sm leading-relaxed text-mist-600">
              Your credentials authenticate your identity.
              Your submissions prove your skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}