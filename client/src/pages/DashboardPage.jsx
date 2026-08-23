import { Link } from "react-router-dom";
import { ArrowRight, Award, ShieldCheck, UserRound } from "lucide-react";

import Navbar from "../components/layout/Navbar.jsx";
import Badge from "../components/ui/Badge.jsx";
import { useAuth } from "../features/auth/context/AuthContext.jsx";

export default function DashboardPage() {
  const { user } = useAuth();

  const badgeCount = user?.badges?.length ?? 0;
  const role = user?.role ?? "student";

  return (
    <div className="min-h-screen bg-[#04030A]">
      <Navbar />

      <main className="container-xl relative py-14">
        {/* Dark moon ambient background */}
        <div className="pointer-events-none absolute -top-20 right-0 h-80 w-80 rounded-full bg-violet-600/[0.05] blur-3xl" />

        {/* Header */}
        <section className="relative">
          <p className="eyebrow mb-3 text-violet-400">
            your profile
          </p>

          <h1 className="text-3xl font-semibold text-mist-100 md:text-4xl">
            Welcome
            {user?.name ? `, ${user.name}` : ""}.
          </h1>

          <p className="mt-3 max-w-2xl text-mist-400">
            Your verified engineering profile lives here. Complete
            real-world challenges, earn proof-of-work badges, and
            build a profile backed by evaluated submissions.
          </p>
        </section>

        {/* Profile summary */}
        <section className="relative mt-10 grid gap-4 md:grid-cols-3">
          {/* Badges */}
          <div className="card group relative overflow-hidden px-6 py-6 transition-all duration-300 hover:border-violet-500/20 hover:shadow-[0_0_35px_rgba(139,92,246,0.06)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-600/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-mist-500">
                  badges earned
                </p>

                <Award className="h-4 w-4 text-violet-400/70" />
              </div>

              <p className="mt-3 font-display text-4xl font-semibold text-violet-400">
                {badgeCount}
              </p>

              <p className="mt-1 text-xs text-mist-700">
                verified proof-of-work credentials
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="card group relative overflow-hidden px-6 py-6 transition-all duration-300 hover:border-purple-500/20 hover:shadow-[0_0_35px_rgba(168,85,247,0.05)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-purple-500/8 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-mist-500">
                  role
                </p>

                <UserRound className="h-4 w-4 text-purple-300/70" />
              </div>

              <Badge tone="signal" className="mt-4">
                {role}
              </Badge>
            </div>
          </div>

          {/* Next step */}
          <div className="card group relative flex flex-col justify-between overflow-hidden px-6 py-6 transition-all duration-300 hover:border-violet-500/20 hover:shadow-[0_0_35px_rgba(139,92,246,0.06)]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-600/8 blur-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-mist-500">
                  next step
                </p>

                <ShieldCheck className="h-4 w-4 text-violet-400/70" />
              </div>

              <p className="mt-3 text-sm text-mist-300">
                Put your skills to the test with a real engineering
                challenge.
              </p>
            </div>

            <Link
              to="/"
              className="
                relative mt-5
                inline-flex items-center gap-2
                font-mono text-sm
                text-violet-400
                transition-colors
                hover:text-violet-300
              "
            >
              Browse challenges

              <ArrowRight
                className="
                  h-4 w-4
                  transition-transform duration-200
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}