import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Button from "../components/ui/Button.jsx";

const LEADERBOARD_DATA = [
  {
    rank: 1,
    name: "Elena Rostova",
    handle: "elena_sys",
    avatar: "ER",
    tier: "Grandmaster",
    category: "concurrency",
    solved: 48,
    badges: 24,
    passRate: "99.8%",
    score: 9840,
    topSkill: "Distributed Consensus",
  },
  {
    rank: 2,
    name: "Devon Vance",
    handle: "devon_v",
    avatar: "DV",
    tier: "Grandmaster",
    category: "systems",
    solved: 46,
    badges: 22,
    passRate: "99.2%",
    score: 9620,
    topSkill: "Lock-free Queues",
  },
  {
    rank: 3,
    name: "Kenji Sato",
    handle: "kenji_dev",
    avatar: "KS",
    tier: "Master",
    category: "security",
    solved: 44,
    badges: 21,
    passRate: "98.7%",
    score: 9350,
    topSkill: "Token Rotation AST",
  },
  {
    rank: 4,
    name: "Sarah Chen",
    handle: "schen_ai",
    avatar: "SC",
    tier: "Master",
    category: "dsa",
    solved: 42,
    badges: 19,
    passRate: "98.4%",
    score: 9110,
    topSkill: "Segment Trees & Cache",
  },
  {
    rank: 5,
    name: "Marcus Aurel",
    handle: "marcus_io",
    avatar: "MA",
    tier: "Diamond",
    category: "systems",
    solved: 39,
    badges: 17,
    passRate: "97.9%",
    score: 8740,
    topSkill: "Database LSM Trees",
  },
  {
    rank: 6,
    name: "Amina Yusuf",
    handle: "amina_cloud",
    avatar: "AY",
    tier: "Diamond",
    category: "security",
    solved: 38,
    badges: 16,
    passRate: "97.5%",
    score: 8590,
    topSkill: "HMAC Verification",
  },
  {
    rank: 7,
    name: "Liam O'Connor",
    handle: "liam_kern",
    avatar: "LO",
    tier: "Platinum",
    category: "concurrency",
    solved: 35,
    badges: 15,
    passRate: "96.8%",
    score: 8210,
    topSkill: "Actor Model Mailbox",
  },
  {
    rank: 8,
    name: "Priyah Sharma",
    handle: "priya_s",
    avatar: "PS",
    tier: "Platinum",
    category: "dsa",
    solved: 33,
    badges: 14,
    passRate: "96.2%",
    score: 7980,
    topSkill: "Dynamic Graph DP",
  },
  {
    rank: 9,
    name: "Alex Rivera",
    handle: "alex_node",
    avatar: "AR",
    tier: "Gold",
    category: "systems",
    solved: 30,
    badges: 12,
    passRate: "95.5%",
    score: 7420,
    topSkill: "Microservice Resiliency",
  },
  {
    rank: 10,
    name: "Taylor Wu",
    handle: "taylor_w",
    avatar: "TW",
    tier: "Gold",
    category: "dsa",
    solved: 28,
    badges: 11,
    passRate: "95.0%",
    score: 7190,
    topSkill: "Bitmask Optimizations",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Disciplines" },
  { id: "concurrency", label: "Concurrency" },
  { id: "systems", label: "Systems Architecture" },
  { id: "security", label: "API Security" },
  { id: "dsa", label: "Algorithms & DSA" },
];

function getTierBadgeClass(tier) {
  switch (tier) {
    case "Grandmaster":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    case "Master":
      return "border-purple-500/30 bg-purple-500/10 text-purple-300";
    case "Diamond":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
    case "Platinum":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    default:
      return "border-white/10 bg-white/5 text-mist-300";
  }
}

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return LEADERBOARD_DATA.filter((user) => {
      const matchesCat =
        selectedCategory === "all" || user.category === selectedCategory;
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.handle.toLowerCase().includes(search.toLowerCase()) ||
        user.topSkill.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, search]);

  const topThree = filtered.slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070A10] text-mist-100 selection:bg-violet-500/30 selection:text-white flex flex-col justify-between">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-48 -top-48 h-[36rem] w-[36rem] rounded-full bg-violet-600/8 blur-[140px]" />
        <div className="absolute right-0 top-1/4 h-[32rem] w-[32rem] rounded-full bg-purple-600/8 blur-[140px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="container-xl py-8 sm:py-10 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/[0.08] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 font-mono text-[11px] text-violet-300">
                  Global Engineering Standings
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] text-emerald-400">
                  Cryptographically Verified
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Developer Leaderboard
              </h1>
              <p className="mt-1 text-xs font-mono text-mist-400 max-w-2xl">
                Rankings determined strictly by deterministic runtime pass rates, AST anti-cheat audits, and AI code review scores.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                as={Link}
                to="/challenges"
                variant="verify"
                size="sm"
                className="font-sans text-xs font-medium"
              >
                Compete in Arena →
              </Button>
            </div>
          </div>

          {/* Clean Telemetry Row without Icon Clutter */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-white/[0.06] bg-[#090D17]/60 p-3.5 transition-colors hover:border-violet-500/30">
              <span className="text-[11px] font-mono uppercase tracking-wider text-mist-500">
                Top Score
              </span>
              <div className="mt-1 font-mono text-xl font-semibold text-white">
                9,840 pts
              </div>
              <div className="mt-1 text-[10px] font-mono text-emerald-400">
                99.8% Test Pass Rate
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#090D17]/60 p-3.5 transition-colors hover:border-violet-500/30">
              <span className="text-[11px] font-mono uppercase tracking-wider text-mist-500">
                Verified Engineers
              </span>
              <div className="mt-1 font-mono text-xl font-semibold text-white">
                3,420
              </div>
              <div className="mt-1 text-[10px] font-mono text-violet-400">
                Across 42 Countries
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#090D17]/60 p-3.5 transition-colors hover:border-violet-500/30">
              <span className="text-[11px] font-mono uppercase tracking-wider text-mist-500">
                Badges Minted
              </span>
              <div className="mt-1 font-mono text-xl font-semibold text-white">
                14,890
              </div>
              <div className="mt-1 text-[10px] font-mono text-emerald-400">
                Zero Cheating Tolerance
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#090D17]/60 p-3.5 transition-colors hover:border-violet-500/30">
              <span className="text-[11px] font-mono uppercase tracking-wider text-mist-500">
                Top Discipline
              </span>
              <div className="mt-1 font-mono text-xl font-semibold text-white truncate">
                Concurrency
              </div>
              <div className="mt-1 text-[10px] font-mono text-mist-400">
                Token Bucket & Locks
              </div>
            </div>
          </section>

          {/* Podium for Top 3 (Minimalist) */}
          {selectedCategory === "all" && !search && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {topThree.map((user, idx) => {
                const rankLabels = ["Rank #1", "Rank #2", "Rank #3"];
                const ringColors = [
                  "border-amber-500/40 bg-amber-500/5 shadow-[0_0_30px_rgba(245,158,11,0.08)]",
                  "border-slate-300/40 bg-slate-300/5 shadow-[0_0_25px_rgba(203,213,225,0.06)]",
                  "border-amber-700/40 bg-amber-700/5 shadow-[0_0_25px_rgba(180,83,9,0.06)]",
                ];

                return (
                  <div
                    key={user.rank}
                    className={`relative rounded-2xl border p-5 backdrop-blur-xl ${ringColors[idx]}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-semibold uppercase text-mist-300">
                        {rankLabels[idx]}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${getTierBadgeClass(
                          user.tier
                        )}`}
                      >
                        {user.tier}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 my-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] font-mono text-sm font-bold text-white shadow-inner">
                        {user.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-base font-semibold text-white truncate">
                          {user.name}
                        </h3>
                        <p className="font-mono text-xs text-mist-400 truncate">
                          @{user.handle}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3 text-center font-mono">
                      <div>
                        <div className="text-[10px] text-mist-500 uppercase">Score</div>
                        <div className="text-xs font-bold text-white">{user.score}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-mist-500 uppercase">Solved</div>
                        <div className="text-xs font-bold text-emerald-400">{user.solved}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-mist-500 uppercase">Badges</div>
                        <div className="text-xs font-bold text-violet-400">{user.badges}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Filter Toolbar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#090D17]/80 p-2.5">
            {/* Discipline Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`relative rounded-lg px-3 py-1 font-mono text-xs transition-all whitespace-nowrap ${
                    selectedCategory === c.id
                      ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] font-medium"
                      : "border border-white/[0.06] bg-[#05070B] text-mist-400 hover:text-white hover:border-white/10"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-mist-500 stroke-[1.75]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search engineer or skill..."
                className="w-full rounded-lg border border-white/[0.06] bg-[#05070B] pl-8 pr-3 py-1.5 font-mono text-xs text-mist-100 placeholder:text-mist-600 focus:border-violet-500/80 focus:outline-none"
              />
            </div>
          </div>

          {/* Leaderboard Table (Full Width) */}
          <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#090D17]/80 backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wider text-mist-500">
                    <th className="px-4 py-3 text-center w-16">Rank</th>
                    <th className="px-4 py-3">Engineer</th>
                    <th className="px-4 py-3">Tier</th>
                    <th className="px-4 py-3">Key Specialty</th>
                    <th className="px-4 py-3 text-center">Challenges</th>
                    <th className="px-4 py-3 text-center">Badges</th>
                    <th className="px-4 py-3 text-center">Pass Rate</th>
                    <th className="px-4 py-3 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map((user) => (
                    <tr
                      key={user.rank}
                      className="transition-colors hover:bg-white/[0.03] group"
                    >
                      <td className="px-4 py-3.5 text-center font-bold">
                        {user.rank === 1 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            1
                          </span>
                        ) : user.rank === 2 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40">
                            2
                          </span>
                        ) : user.rank === 3 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/40">
                            3
                          </span>
                        ) : (
                          <span className="text-mist-500">#{user.rank}</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] border border-white/10 font-mono text-[10px] text-white">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="font-sans font-medium text-white">
                              {user.name}
                            </div>
                            <div className="text-[10px] text-mist-500">
                              @{user.handle}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getTierBadgeClass(
                            user.tier
                          )}`}
                        >
                          {user.tier}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-mist-300">
                        {user.topSkill}
                      </td>

                      <td className="px-4 py-3.5 text-center text-white">
                        {user.solved}
                      </td>

                      <td className="px-4 py-3.5 text-center text-violet-300 font-semibold">
                        {user.badges}
                      </td>

                      <td className="px-4 py-3.5 text-center text-emerald-400 font-semibold">
                        {user.passRate}
                      </td>

                      <td className="px-4 py-3.5 text-right font-bold text-white">
                        {user.score.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
