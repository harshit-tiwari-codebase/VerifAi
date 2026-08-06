import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Badge from "../components/ui/Badge.jsx";
import { useAuth } from "../features/auth/context/AuthContext.jsx";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-ink-900">
      <Navbar />
      <main className="container-xl py-14">
        <p className="eyebrow mb-3">your profile</p>
        <h1 className="text-3xl font-semibold text-mist-100 md:text-4xl">
          Welcome{user?.name ? `, ${user.name}` : ""}.
        </h1>
        <p className="mt-2 max-w-lg text-mist-400">
          This is a placeholder dashboard behind{" "}
          <code className="font-mono text-xs text-signal">ProtectedRoute</code>
          . Wire it up to{" "}
          <code className="font-mono text-xs text-signal">GET /api/challenges</code>{" "}
          and your submissions feed next.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="card px-6 py-6">
            <p className="font-mono text-xs text-mist-500">badges earned</p>
            <p className="mt-2 font-display text-3xl font-semibold text-verify">
              {user?.badges?.length ?? 0}
            </p>
          </div>
          <div className="card px-6 py-6">
            <p className="font-mono text-xs text-mist-500">role</p>
            <Badge tone="signal" className="mt-3">
              {user?.role ?? "student"}
            </Badge>
          </div>
          <div className="card flex flex-col justify-between px-6 py-6">
            <p className="font-mono text-xs text-mist-500">next step</p>
            <Link
              to="/"
              className="mt-3 font-mono text-sm text-verify hover:underline"
            >
              browse challenges →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
