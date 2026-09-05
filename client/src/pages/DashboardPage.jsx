import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuthLoading, selectUser } from "../features/auth/authSlice.js";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Button from "../components/ui/Button.jsx";
import { getChallenges } from "../features/challenges/api/challengeApi.js";
import ChallengeCard from "../features/challenges/components/ChallengeCard.jsx";
import ChallengeDetailModal from "../features/challenges/components/ChallengeDetailModal.jsx";
import ChallengeEditorModal from "../features/challenges/components/ChallengeEditorModal.jsx";
import DeleteChallengeModal from "../features/challenges/components/DeleteChallengeModal.jsx";

const CATEGORY_TABS = [
  { id: "all", label: "All Disciplines" },
  { id: "dsa", label: "DSA" },
  { id: "bug-fix", label: "Bug Fix" },
  { id: "api-design", label: "API Design" },
  { id: "schema-modeling", label: "Schema Modeling" },
  { id: "system-design", label: "System Design" },
  { id: "debugging", label: "Debugging" },
];

function formatJoinDate(isoString) {
  if (!isoString) return null;
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#070A10] text-mist-100">
      <Navbar />
      <main className="container-xl py-10 space-y-6">
        <div className="animate-pulse rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6 space-y-3">
          <div className="h-6 w-48 rounded bg-white/[0.06]" />
          <div className="h-4 w-64 rounded bg-white/[0.04]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-ink-800/40 border border-white/[0.04]" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-xl bg-ink-800/30 border border-white/[0.04]" />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthLoading = useSelector(selectIsAuthLoading);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  // Challenges state
  const [challenges, setChallenges] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 9, totalPages: 1 });
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [challengesError, setChallengesError] = useState("");

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedExecutionType, setSelectedExecutionType] = useState("all");
  const [activeViewTab, setActiveViewTab] = useState("arena"); // 'arena' | 'badges' | 'my-created'
  const [page, setPage] = useState(1);

  // Modals state
  const [detailChallengeId, setDetailChallengeId] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [challengeToEdit, setChallengeToEdit] = useState(null);
  const [challengeToDelete, setChallengeToDelete] = useState(null);

  const isPrivileged = user && ["mentor", "admin"].includes(user.role);

  // User badges set for quick solved-lookup
  const userBadges = useMemo(() => user?.badges ?? [], [user]);
  const badgeChallengeIdSet = useMemo(() => {
    const set = new Set();
    userBadges.forEach((b) => {
      if (b.challengeId) {
        const id = typeof b.challengeId === "object" ? b.challengeId._id : b.challengeId;
        if (id) set.add(String(id));
      }
    });
    return set;
  }, [userBadges]);

  // Load challenges
  const fetchChallengeList = () => {
    setLoadingChallenges(true);
    setChallengesError("");

    const params = {
      page,
      limit: 9,
    };

    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (selectedDifficulty !== "all") params.difficulty = selectedDifficulty;

    getChallenges(params)
      .then((data) => {
        let list = data.challenges || [];
        if (selectedExecutionType !== "all") {
          list = list.filter((c) => c.executionType === selectedExecutionType);
        }
        setChallenges(list);
        setPagination(data.pagination || { total: list.length, page: 1, limit: 9, totalPages: 1 });
      })
      .catch((err) => {
        setChallengesError(
          err?.response?.data?.message || "Unable to load challenges at this moment."
        );
      })
      .finally(() => {
        setLoadingChallenges(false);
      });
  };

  useEffect(() => {
    fetchChallengeList();
  }, [page, selectedCategory, selectedDifficulty, selectedExecutionType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchChallengeList();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDifficulty("all");
    setSelectedExecutionType("all");
    setPage(1);
  };

  if (isAuthLoading) {
    return <DashboardSkeleton />;
  }

  const name = user?.name || "Developer";
  const role = user?.role ?? "student";
  const joined = formatJoinDate(user?.createdAt);
  const myCreatedChallenges = challenges.filter(
    (c) => c.createdBy?._id === user?.id || c.createdBy === user?.id
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070A10] text-mist-100 selection:bg-violet-500/30 selection:text-white flex flex-col justify-between">
      {/* Ambient Atmospheric Glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-48 -top-48 h-[36rem] w-[36rem] rounded-full bg-violet-600/8 blur-[140px]" />
        <div className="absolute right-0 top-1/4 h-[32rem] w-[32rem] rounded-full bg-purple-600/8 blur-[140px]" />
      </div>

      <div className="relative z-10">
        <Navbar />

        <main className="container-xl py-6 sm:py-8 space-y-6">
          {/* 1. Minimal Header — Profile Info Left, Actions & Logout Top Right */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-[#090D17]/80 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-violet-300 shadow-sm">
                <User className="h-4 w-4 stroke-[1.75]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-lg font-semibold tracking-tight text-white">
                    {name}
                  </h1>
                  <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.2 font-mono text-[11px] text-violet-300">
                    {role}
                  </span>
                  {user?.isVerified && (
                    <span className="inline-flex items-center font-mono text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 rounded-full">
                      verified
                    </span>
                  )}
                </div>
                <p className="font-mono text-[11px] text-mist-500">
                  {user?.email} {joined && `• Member since ${joined}`}
                </p>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              {isPrivileged && (
                <Button
                  variant="verify"
                  size="sm"
                  onClick={() => {
                    setChallengeToEdit(null);
                    setIsEditorOpen(true);
                  }}
                  className="!px-3 !py-1 text-xs font-sans font-medium"
                >
                  New Challenge
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                title="Sign out of your account"
                className="!px-3 !py-1 text-xs font-sans text-mist-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10"
              >
                Sign out
              </Button>
            </div>
          </section>

          {/* 2. Compact Telemetry Strip */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-white/[0.06] bg-[#090D17]/60 p-3.5 transition-colors hover:border-violet-500/30">
              <span className="text-[11px] font-mono uppercase tracking-wider text-mist-500">
                Verified Badges
              </span>
              <div className="mt-1.5 font-mono text-xl font-semibold text-white">
                {userBadges.length}
              </div>
              <div className="mt-1 text-[10px] font-mono text-emerald-400">
                Anchored
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#090D17]/60 p-3.5 transition-colors hover:border-violet-500/30">
              <span className="text-[11px] font-mono uppercase tracking-wider text-mist-500">
                Available
              </span>
              <div className="mt-1.5 font-mono text-xl font-semibold text-white">
                {pagination.total || challenges.length}
              </div>
              <div className="mt-1 text-[10px] font-mono text-mist-500">
                Production Challenges
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#090D17]/60 p-3.5 transition-colors hover:border-violet-500/30">
              <span className="text-[11px] font-mono uppercase tracking-wider text-mist-500">
                Solved
              </span>
              <div className="mt-1.5 font-mono text-xl font-semibold text-white">
                {badgeChallengeIdSet.size}
              </div>
              <div className="mt-1 text-[10px] font-mono text-mist-500">
                Passed Sandboxed Tests
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#090D17]/60 p-3.5 transition-colors hover:border-violet-500/30">
              <span className="text-[11px] font-mono uppercase tracking-wider text-mist-500">
                Tier
              </span>
              <div className="mt-1.5 font-mono text-base font-semibold text-white capitalize">
                {role}
              </div>
              <div className="mt-1 text-[10px] font-mono text-violet-400">
                {isPrivileged ? "Authoring & Sandbox" : "Full Evaluation Rights"}
              </div>
            </div>
          </section>

          {/* 3. Segmented Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveViewTab("arena")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs transition-all ${
                  activeViewTab === "arena"
                    ? "bg-white/[0.08] text-white shadow-sm font-medium"
                    : "text-mist-400 hover:text-white"
                }`}
              >
                Practice Arena
                <span className="rounded bg-white/[0.06] px-1.5 py-0.2 text-[10px] text-mist-300">
                  {challenges.length}
                </span>
              </button>

              <button
                onClick={() => setActiveViewTab("badges")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs transition-all ${
                  activeViewTab === "badges"
                    ? "bg-white/[0.08] text-white shadow-sm font-medium"
                    : "text-mist-400 hover:text-white"
                }`}
              >
                My Badges
                <span className="rounded bg-white/[0.06] px-1.5 py-0.2 text-[10px] text-mist-300">
                  {userBadges.length}
                </span>
              </button>

              {isPrivileged && (
                <button
                  onClick={() => setActiveViewTab("my-created")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs transition-all ${
                    activeViewTab === "my-created"
                      ? "bg-white/[0.08] text-white shadow-sm font-medium"
                      : "text-mist-400 hover:text-white"
                  }`}
                >
                  My Authored
                  <span className="rounded bg-white/[0.06] px-1.5 py-0.2 text-[10px] text-mist-300">
                    {myCreatedChallenges.length}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* 4. Tab 1: Practice Arena */}
          {activeViewTab === "arena" && (
            <div className="space-y-4">
              {/* Category Filter Pills with animated selection */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedCategory(tab.id);
                      setPage(1);
                    }}
                    className={`relative rounded-lg px-3 py-1 font-mono text-xs transition-all whitespace-nowrap ${
                      selectedCategory === tab.id
                        ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                        : "border border-white/[0.06] bg-[#090D17]/70 text-mist-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Minimal Search & Filters Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 rounded-xl border border-white/[0.06] bg-[#090D17]/60 p-2">
                <form onSubmit={handleSearchSubmit} className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-mist-500 stroke-[1.75]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, tags, or concepts..."
                    className="w-full rounded-lg border border-white/[0.05] bg-[#05070B] pl-8 pr-4 py-1.5 font-mono text-xs text-mist-100 placeholder:text-mist-600 focus:border-violet-500/80 focus:outline-none"
                  />
                </form>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => {
                      setSelectedDifficulty(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-lg border border-white/[0.05] bg-[#05070B] px-2.5 py-1.5 font-mono text-xs text-mist-300 focus:border-violet-500/80 focus:outline-none capitalize"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>

                  <select
                    value={selectedExecutionType}
                    onChange={(e) => {
                      setSelectedExecutionType(e.target.value);
                      setPage(1);
                    }}
                    className="rounded-lg border border-white/[0.05] bg-[#05070B] px-2.5 py-1.5 font-mono text-xs text-mist-300 focus:border-violet-500/80 focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="testcases">Test Cases</option>
                    <option value="review_only">AI Review</option>
                  </select>

                  {(searchQuery ||
                    selectedCategory !== "all" ||
                    selectedDifficulty !== "all" ||
                    selectedExecutionType !== "all") && (
                    <button
                      onClick={handleClearFilters}
                      className="rounded-lg px-2 py-1 font-mono text-xs text-mist-400 hover:text-rose-400 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Challenges Grid with Smooth Micro-interactions */}
              {loadingChallenges ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="h-48 animate-pulse rounded-xl border border-white/[0.04] bg-[#090D17]/40 p-4 space-y-3"
                    />
                  ))}
                </div>
              ) : challengesError ? (
                <div className="rounded-xl border border-white/[0.08] bg-[#090D17] p-6 text-center">
                  <p className="font-mono text-xs text-rose-400">{challengesError}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchChallengeList}
                    className="mt-3 font-mono text-xs"
                  >
                    Retry
                  </Button>
                </div>
              ) : challenges.length === 0 ? (
                <div className="rounded-xl border border-white/[0.06] bg-[#090D17]/40 p-10 text-center space-y-2">
                  <h3 className="font-mono text-sm text-mist-200">No matching challenges</h3>
                  <p className="font-mono text-xs text-mist-500 max-w-sm mx-auto">
                    Try loosening your search filters or check another category.
                  </p>
                  <Button variant="ghost" size="sm" onClick={handleClearFilters} className="font-mono text-xs mt-2">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {challenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge._id}
                      challenge={challenge}
                      currentUser={user}
                      hasBadge={badgeChallengeIdSet.has(challenge._id)}
                      onView={(c) => setDetailChallengeId(c._id)}
                      onEdit={(c) => {
                        setChallengeToEdit(c);
                        setIsEditorOpen(true);
                      }}
                      onDelete={(c) => setChallengeToDelete(c)}
                    />
                  ))}
                </div>
              )}

              {/* Minimal Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 font-mono text-xs text-mist-500">
                  <span>
                    Page {pagination.page} / {pagination.totalPages} ({pagination.total} total)
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="!py-1 !px-2.5 text-xs font-mono"
                    >
                      Prev
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={page >= pagination.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="!py-1 !px-2.5 text-xs font-mono"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. Tab 2: Verified Badges */}
          {activeViewTab === "badges" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-base font-semibold text-white">
                  Verified Badges
                </h2>
                <p className="font-mono text-xs text-mist-400">
                  Tamper-proof credentials minted after passing automated testing & Staff AI audit.
                </p>
              </div>

              {userBadges.length === 0 ? (
                <div className="rounded-xl border border-white/[0.06] bg-[#090D17]/40 px-6 py-12 text-center space-y-2">
                  <ModernBadgeIcon className="mx-auto h-8 w-8 text-mist-600" />
                  <h3 className="font-mono text-sm text-white">No badges earned yet</h3>
                  <p className="font-mono text-xs text-mist-500 max-w-sm mx-auto">
                    Solve an engineering challenge to mint your first verified badge.
                  </p>
                  <Button
                    variant="verify"
                    size="sm"
                    onClick={() => setActiveViewTab("arena")}
                    className="mt-3 font-sans text-xs font-medium"
                  >
                    Explore Arena
                  </Button>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {userBadges.map((b, i) => {
                    const challengeTitle =
                      typeof b.challengeId === "object" && b.challengeId?.title
                        ? b.challengeId.title
                        : "Core Engineering Challenge";

                    const challengeCategory =
                      typeof b.challengeId === "object" && b.challengeId?.category
                        ? b.challengeId.category
                        : "System Architecture";

                    return (
                      <div
                        key={b.challengeId?._id || b.challengeId || i}
                        className="rounded-xl border border-white/[0.08] bg-[#090D17] p-4 transition-all hover:border-violet-500/40"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[11px] text-mist-300 uppercase tracking-wider">
                            VERIFIED
                          </span>
                          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.2 font-mono text-[11px] text-emerald-400">
                            {b.score ?? 95}/100
                          </span>
                        </div>

                        <h3 className="font-display text-sm font-semibold text-white line-clamp-1">
                          {challengeTitle}
                        </h3>
                        <p className="mt-0.5 font-mono text-[10px] text-mist-500 uppercase">
                          {challengeCategory}
                        </p>

                        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/[0.05] font-mono text-[10px] text-mist-500">
                          <span>{b.earnedAt ? new Date(b.earnedAt).toLocaleDateString() : "Active"}</span>
                          <span className="text-emerald-400 font-mono">
                            0x{typeof b.challengeId === "object"
                              ? b.challengeId?._id?.slice(-6)
                              : String(b.challengeId || "").slice(-6) || "9E74A1"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 6. Tab 3: My Authored Challenges */}
          {isPrivileged && activeViewTab === "my-created" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-base font-semibold text-white">
                    Authored Challenges
                  </h2>
                  <p className="font-mono text-xs text-mist-400">
                    Manage challenges, test suites, and grading criteria.
                  </p>
                </div>

                <Button
                  variant="verify"
                  size="sm"
                  onClick={() => {
                    setChallengeToEdit(null);
                    setIsEditorOpen(true);
                  }}
                  className="font-sans text-xs font-medium"
                >
                  New Challenge
                </Button>
              </div>

              {myCreatedChallenges.length === 0 ? (
                <div className="rounded-xl border border-white/[0.06] bg-[#090D17]/40 p-10 text-center space-y-2">
                  <h3 className="font-sans text-sm font-semibold text-white">No authored challenges yet</h3>
                  <p className="font-sans text-xs text-mist-400 max-w-sm mx-auto">
                    Create production challenges for candidates to solve in the isolated sandbox.
                  </p>
                  <Button
                    variant="verify"
                    size="sm"
                    onClick={() => {
                      setChallengeToEdit(null);
                      setIsEditorOpen(true);
                    }}
                    className="mt-2 font-sans text-xs font-medium"
                  >
                    Author First Challenge
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                  {myCreatedChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge._id}
                      challenge={challenge}
                      currentUser={user}
                      onView={(c) => setDetailChallengeId(c._id)}
                      onEdit={(c) => {
                        setChallengeToEdit(c);
                        setIsEditorOpen(true);
                      }}
                      onDelete={(c) => setChallengeToDelete(c)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* Interactive Modals */}
      {detailChallengeId && (
        <ChallengeDetailModal
          challengeId={detailChallengeId}
          isOpen={Boolean(detailChallengeId)}
          onClose={() => setDetailChallengeId(null)}
        />
      )}

      {isEditorOpen && (
        <ChallengeEditorModal
          isOpen={isEditorOpen}
          challengeToEdit={challengeToEdit}
          onClose={() => {
            setIsEditorOpen(false);
            setChallengeToEdit(null);
          }}
          onSaved={fetchChallengeList}
        />
      )}

      {challengeToDelete && (
        <DeleteChallengeModal
          isOpen={Boolean(challengeToDelete)}
          challenge={challengeToDelete}
          onClose={() => setChallengeToDelete(null)}
          onDeleted={fetchChallengeList}
        />
      )}
    </div>
  );
}
