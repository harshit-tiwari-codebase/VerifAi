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
      return "border-[#FBBF24]/30 bg-[#FBBF24]/10 text-[#FBBF24]";
    case "Master":
      return "border-[#FF6A3D]/30 bg-[#261912] text-[#FFD1BB]";
    case "Diamond":
      return "border-[#60A5FA]/30 bg-[#60A5FA]/10 text-[#60A5FA]";
    case "Platinum":
      return "border-[#34D399]/30 bg-[#34D399]/10 text-[#34D399]";
    default:
      return "border-[#30302B] bg-[#1C1C19] text-[#AAA69B]";
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
    <div className="relative min-h-screen overflow-x-hidden bg-[#0B0B0A] text-[#F2EFE6] selection:bg-[#422316] selection:text-[#F2EFE6] flex flex-col justify-between font-sans">
      <div className="relative z-10">
        <Navbar />

        <main className="container-xl py-8 sm:py-10 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#30302B] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full border border-[#FF6A3D]/30 bg-[#261912] px-2.5 py-0.5 font-mono text-[11px] text-[#FFD1BB]">
                  Global Engineering Standings
                </span>
                <span className="rounded-full border border-[#34D399]/30 bg-[#34D399]/10 px-2.5 py-0.5 font-mono text-[11px] text-[#34D399]">
                  Cryptographically Verified
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#F2EFE6]">
                Developer Leaderboard
              </h1>
              <p className="mt-1 text-xs font-mono text-[#AAA69B] max-w-2xl">
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

          {/* Telemetry Row */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-[14px] border border-[#30302B] bg-[#1C1C19] p-4 transition-colors hover:border-[#414139]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#77756D]">
                Top Score
              </span>
              <div className="mt-1 font-mono text-xl font-semibold text-[#F2EFE6]">
                9,840 pts
              </div>
              <div className="mt-1 text-[10px] font-mono text-[#34D399]">
                99.8% Test Pass Rate
              </div>
            </div>

            <div className="rounded-[14px] border border-[#30302B] bg-[#1C1C19] p-4 transition-colors hover:border-[#414139]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#77756D]">
                Verified Engineers
              </span>
              <div className="mt-1 font-mono text-xl font-semibold text-[#F2EFE6]">
                3,420
              </div>
              <div className="mt-1 text-[10px] font-mono text-[#FFB08E]">
                Across 42 Countries
              </div>
            </div>

            <div className="rounded-[14px] border border-[#30302B] bg-[#1C1C19] p-4 transition-colors hover:border-[#414139]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#77756D]">
                Badges Minted
              </span>
              <div className="mt-1 font-mono text-xl font-semibold text-[#F2EFE6]">
                14,890
              </div>
              <div className="mt-1 text-[10px] font-mono text-[#34D399]">
                Zero Cheating Tolerance
              </div>
            </div>

            <div className="rounded-[14px] border border-[#30302B] bg-[#1C1C19] p-4 transition-colors hover:border-[#414139]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#77756D]">
                Top Discipline
              </span>
              <div className="mt-1 font-mono text-xl font-semibold text-[#F2EFE6] truncate">
                Concurrency
              </div>
              <div className="mt-1 text-[10px] font-mono text-[#AAA69B]">
                Token Bucket & Locks
              </div>
            </div>
          </section>

          {/* Podium for Top 3 */}
          {selectedCategory === "all" && !search && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {topThree.map((user, idx) => {
                const rankLabels = ["Rank #1", "Rank #2", "Rank #3"];
                const podiumColors = [
                  "border-[#FBBF24]/40 bg-[#171714] shadow-sm",
                  "border-[#FFB08E]/40 bg-[#171714] shadow-sm",
                  "border-[#30302B] bg-[#171714]",
                ];

                return (
                  <div
                    key={user.rank}
                    className={`relative rounded-[14px] border p-5 ${podiumColors[idx]}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-semibold uppercase text-[#AAA69B]">
                        {rankLabels[idx]}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold ${getTierBadgeClass(
                          user.tier
                        )}`}
                      >
                        {user.tier}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 my-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#FF6A3D]/40 bg-[#261912] font-mono text-sm font-bold text-[#FFD1BB]">
                        {user.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-base font-semibold text-[#F2EFE6] truncate">
                          {user.name}
                        </h3>
                        <p className="font-mono text-xs text-[#77756D] truncate">
                          @{user.handle}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#30302B] pt-3 text-center font-mono">
                      <div>
                        <div className="text-[10px] text-[#77756D] uppercase">Score</div>
                        <div className="text-xs font-bold text-[#F2EFE6]">{user.score}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#77756D] uppercase">Solved</div>
                        <div className="text-xs font-bold text-[#34D399]">{user.solved}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#77756D] uppercase">Badges</div>
                        <div className="text-xs font-bold text-[#FFB08E]">{user.badges}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Filter Toolbar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-[14px] border border-[#30302B] bg-[#1C1C19] p-2.5">
            {/* Discipline Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`relative rounded-[8px] px-3 py-1 font-mono text-xs transition-all whitespace-nowrap ${
                    selectedCategory === c.id
                      ? "bg-[#261912] text-[#FFD1BB] border border-[#FF6A3D]/40 font-medium"
                      : "border border-[#30302B] bg-[#171714] text-[#AAA69B] hover:text-[#F2EFE6] hover:bg-[#22221E]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#77756D] stroke-[1.75]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search engineer or skill..."
                className="w-full rounded-[10px] border border-[#30302B] bg-[#171714] pl-8 pr-3 py-1.5 font-mono text-xs text-[#F2EFE6] placeholder:text-[#77756D] focus:border-[#FF6A3D] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-hidden rounded-[14px] border border-[#30302B] bg-[#171714]">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#30302B] bg-[#1C1C19] text-[11px] uppercase tracking-wider text-[#77756D]">
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
                <tbody className="divide-y divide-[#30302B]">
                  {filtered.map((user) => (
                    <tr
                      key={user.rank}
                      className="transition-colors hover:bg-[#22221E] group"
                    >
                      <td className="px-4 py-3.5 text-center font-bold">
                        {user.rank === 1 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40">
                            1
                          </span>
                        ) : user.rank === 2 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#FFB08E]/20 text-[#FFD1BB] border border-[#FF6A3D]/40">
                            2
                          </span>
                        ) : user.rank === 3 ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/40">
                            3
                          </span>
                        ) : (
                          <span className="text-[#77756D]">#{user.rank}</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#261912] border border-[#FF6A3D]/30 font-mono text-[10px] text-[#FFD1BB]">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="font-sans font-medium text-[#F2EFE6]">
                              {user.name}
                            </div>
                            <div className="text-[10px] text-[#77756D]">
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

                      <td className="px-4 py-3.5 text-[#AAA69B]">
                        {user.topSkill}
                      </td>

                      <td className="px-4 py-3.5 text-center text-[#F2EFE6]">
                        {user.solved}
                      </td>

                      <td className="px-4 py-3.5 text-center text-[#FFB08E] font-semibold">
                        {user.badges}
                      </td>

                      <td className="px-4 py-3.5 text-center text-[#34D399] font-semibold">
                        {user.passRate}
                      </td>

                      <td className="px-4 py-3.5 text-right font-bold text-[#F2EFE6]">
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
