import { Link } from "react-router-dom";
import { Award, Code2 } from "lucide-react";
import Navbar from "../components/layout/Navbar.jsx";
import Badge from "../components/ui/Badge.jsx";
import { useSelector } from "react-redux";
import {
  selectIsAuthLoading,
  selectUser,
} from "../features/auth/authSlice.js";

function formatJoinDate(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function DashboardSkeleton() {
  // Shown while Redux auth status is "idle" — the /auth/refresh bootstrap
  // call is genuinely async on every page load, so without this the page
  // would flash empty name/role before real data arrives.
  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="container-xl py-10">
        <div className="animate-pulse border-b border-ink-600 pb-6">
          <div className="h-7 w-40 rounded bg-ink-800" />
          <div className="mt-2 h-4 w-56 rounded bg-ink-800" />
        </div>
        <div className="mt-8 h-56 animate-pulse rounded-xl bg-ink-800" />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsAuthLoading);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Every field below comes directly from GET /api/auth/me — nothing here
  // is invented or estimated. If a field isn't in that response, it isn't
  // rendered.
  const badges = user?.badges ?? [];
  const name = user?.name?.split(" ")[0] ?? "there";
  const role = user?.role ?? "student";
  const joined = formatJoinDate(user?.createdAt);

  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />

      <main className="container-xl py-10">
        {/* Header — only real fields: name, role, join date */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-600 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <p className="font-display text-2xl font-semibold text-mist-100">
                {name}<span className="text-verify">.</span>
              </p>
              <Badge tone="signal">{role}</Badge>
            </div>
            {joined && (
              <p className="mt-1 text-sm text-mist-500">Member since {joined}</p>
            )}
          </div>

          <Link
            to="/challenges"
            className="flex items-center gap-2 rounded-lg border border-verify/25 bg-verify/10 px-4 py-2 text-sm font-medium text-verify transition-colors hover:bg-verify/15"
          >
            <Code2 className="h-4 w-4" />
            Browse challenges
          </Link>
        </div>

        {/* Badges section — real data only, badges.length is honestly 0 for
            every user right now since nothing in the backend issues a badge
            yet (that happens after Judge0 + AI evaluation, which is Track B,
            not built). No submissions list, no streak, no progress ring —
            none of those have a backing endpoint yet, so they aren't here. */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-mist-100">
            Verified badges
          </h2>

          {badges.length === 0 ? (
            <div className="mt-4 rounded-xl border border-ink-600 bg-ink-800/60 px-8 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-verify/10">
                <Award className="h-5 w-5 text-verify" />
              </div>
              <p className="mt-4 text-sm font-medium text-mist-100">
                No verified badges yet
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-mist-500">
                Solve a real engineering challenge and pass evaluation to earn your first one.
              </p>
              <Link
                to="/challenges"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-verify px-4 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-verify/90"
              >
                Solve your first challenge
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {badges.map((b, i) => (
                <div
                  key={b.challengeId ?? i}
                  className="rounded-xl border border-ink-600 bg-ink-800/60 p-5"
                >
                  <div className="flex items-center justify-between">
                    <Award className="h-4 w-4 text-verify" />
                    <span className="font-mono text-lg font-semibold text-verify">
                      {b.score ?? "—"}
                    </span>
                  </div>
                  {/* NOTE: badges.challengeId is not populated by getMe() right
                      now, so only the raw ObjectId is available — no challenge
                      title to show here. Add
                      .populate("badges.challengeId", "title") to the getMe
                      controller if you want the title displayed instead. */}
                  {b.earnedAt && (
                    <p className="mt-3 text-xs text-mist-500">
                      Earned {new Date(b.earnedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
