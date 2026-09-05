import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  User,
  Terminal,
  Award,
  Code2,
  Plus,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuthLoading, selectUser } from "../features/auth/authSlice.js";
import Navbar from "../components/layout/Navbar.jsx";
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
    <div className="h-screen max-h-screen overflow-hidden bg-black text-mist-100 flex flex-col">
      <Navbar />
      <main className="w-full max-w-[100vw] px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1 min-h-0 h-full w-full overflow-hidden">
          <div className="lg:col-span-4 xl:col-span-3 rounded-2xl border border-white/[0.06] bg-[#0c0d12] p-4 sm:p-5 space-y-4 animate-pulse h-full flex flex-col justify-between overflow-hidden">
            <div className="space-y-3">
              <div className="h-6 w-32 rounded bg-white/[0.06]" />
              <div className="w-18 h-18 rounded-full mx-auto bg-white/[0.06]" />
              <div className="h-4 w-28 mx-auto rounded bg-white/[0.06]" />
              <div className="h-11 rounded-xl bg-white/[0.04]" />
              <div className="h-11 rounded-xl bg-white/[0.04]" />
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/[0.06]">
              <div className="h-14 rounded-xl bg-white/[0.04]" />
              <div className="h-14 rounded-xl bg-white/[0.04]" />
            </div>
          </div>
          <div className="lg:col-span-8 xl:col-span-9 rounded-2xl border border-white/[0.06] bg-[#0c0d12] p-5 sm:p-6 space-y-4 animate-pulse h-full flex flex-col justify-between overflow-hidden">
            <div className="h-8 w-64 rounded bg-white/[0.06]" />
            <div className="h-10 rounded-xl bg-white/[0.04]" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2 flex-1 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 rounded-xl bg-white/[0.04]" />
              ))}
            </div>
          </div>
        </div>
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
  const [activeViewTab, setActiveViewTab] = useState("arena"); // 'arena' | 'badges' | 'my-created' | 'audited'
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
  const currentUserId = user?.id || user?._id;
  const userInitial = (
    user?.name?.trim()?.charAt(0) ||
    user?.email?.trim()?.charAt(0) ||
    "U"
  ).toUpperCase();
  const myCreatedChallenges = challenges.filter(
    (challenge) => {
      const challengeOwnerId =
        typeof challenge.createdBy === "object"
          ? challenge.createdBy?._id || challenge.createdBy?.id
          : challenge.createdBy;
      return (
        currentUserId &&
        challengeOwnerId &&
        String(challengeOwnerId) === String(currentUserId)
      );
    }
  );
  const auditedChallenges = myCreatedChallenges.filter(
    (challenge) => challenge.executionType === "review_only"
  );

  return (
    <div className="relative h-screen max-h-screen overflow-hidden bg-black text-mist-100 selection:bg-violet-500/30 selection:text-white flex flex-col">
      <Navbar />

      <main className="w-full max-w-[100vw] px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1 min-h-0 h-full w-full overflow-hidden">
          {/* LEFT PROFILE & NAVIGATION SIDEBAR (Sheryians Inspired) */}
          <aside className="lg:col-span-4 xl:col-span-3 h-full min-h-0 flex flex-col overflow-hidden">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0d12] p-4 sm:p-5 shadow-2xl h-full flex flex-col justify-between overflow-hidden">
              <div className="space-y-4 overflow-y-auto no-scrollbar min-h-0">
                {/* Profile Header Title */}
                <div>
                  <h2 className="text-base font-semibold text-white tracking-tight">
                    My Profile
                  </h2>
                  <p className="text-xs text-mist-400 mt-0.5">
                    Manage your engineering profile and preferences
                  </p>
                </div>

                {/* Sheryians-Style Circular Purple Avatar & User Bio */}
                <div className="flex flex-col items-center text-center pt-1 pb-1">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-violet-600 via-purple-600 to-fuchsia-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-semibold shadow-[0_0_30px_rgba(147,51,234,0.35)] border-2 border-white/20">
                      {userInitial}
                    </div>
                    {user?.isVerified && (
                      <div
                        className="absolute -bottom-1 -right-1 bg-emerald-500 text-black rounded-full p-1 border-2 border-[#0c0d12]"
                        title="Verified Engineer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  <h3 className="mt-2.5 text-base font-semibold text-white tracking-tight">
                    {name}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-violet-300">
                      {role}
                    </span>
                    {isPrivileged && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-amber-300">
                        Staff
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 text-xs text-mist-500 font-mono truncate max-w-[220px]">
                    {user?.email}
                  </p>
                  {joined && (
                    <p className="text-[11px] text-mist-600 font-mono mt-0.5">
                      Joined {joined}
                    </p>
                  )}
                </div>

                {/* Vertical Navigation Tab Stack */}
                <nav className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                  {/* Arena Tab */}
                  <button
                    onClick={() => setActiveViewTab("arena")}
                    className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-all text-left group ${
                      activeViewTab === "arena"
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_4px_20px_rgba(147,51,234,0.35)] border border-white/20"
                        : "bg-[#12141c]/50 hover:bg-[#181a24] border border-white/[0.06] text-mist-300 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${
                          activeViewTab === "arena"
                            ? "bg-white/20 text-white"
                            : "bg-white/[0.04] text-mist-400 group-hover:text-white"
                        }`}
                      >
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Practice Arena</div>
                        <div
                          className={`text-[10px] ${
                            activeViewTab === "arena" ? "text-violet-100" : "text-mist-500"
                          }`}
                        >
                          Browse & solve challenges
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        activeViewTab === "arena"
                          ? "bg-white/20 text-white"
                          : "bg-white/[0.05] text-mist-400"
                      }`}
                    >
                      {challenges.length}
                    </span>
                  </button>

                  {/* Badges Tab */}
                  <button
                    onClick={() => setActiveViewTab("badges")}
                    className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-all text-left group ${
                      activeViewTab === "badges"
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_4px_20px_rgba(147,51,234,0.35)] border border-white/20"
                        : "bg-[#12141c]/50 hover:bg-[#181a24] border border-white/[0.06] text-mist-300 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${
                          activeViewTab === "badges"
                            ? "bg-white/20 text-white"
                            : "bg-white/[0.04] text-mist-400 group-hover:text-white"
                        }`}
                      >
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Verified Badges</div>
                        <div
                          className={`text-[10px] ${
                            activeViewTab === "badges" ? "text-violet-100" : "text-mist-500"
                          }`}
                        >
                          Cryptographic proof records
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        activeViewTab === "badges"
                          ? "bg-white/20 text-white"
                          : "bg-white/[0.05] text-mist-400"
                      }`}
                    >
                      {userBadges.length}
                    </span>
                  </button>

                  {/* Authored Tab (Privileged) */}
                  {isPrivileged && (
                    <button
                      onClick={() => setActiveViewTab("my-created")}
                      className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-all text-left group ${
                        activeViewTab === "my-created"
                          ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_4px_20px_rgba(147,51,234,0.35)] border border-white/20"
                          : "bg-[#12141c]/50 hover:bg-[#181a24] border border-white/[0.06] text-mist-300 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${
                            activeViewTab === "my-created"
                              ? "bg-white/20 text-white"
                              : "bg-white/[0.04] text-mist-400 group-hover:text-white"
                          }`}
                        >
                          <Code2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold">My Authored</div>
                          <div
                            className={`text-[10px] ${
                              activeViewTab === "my-created" ? "text-violet-100" : "text-mist-500"
                            }`}
                          >
                            Manage author test suites
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          activeViewTab === "my-created"
                            ? "bg-white/20 text-white"
                            : "bg-white/[0.05] text-mist-400"
                        }`}
                      >
                        {myCreatedChallenges.length}
                      </span>
                    </button>
                  )}

                  {/* Audited Challenges Tab (Mentor) */}
                  {user?.role === "mentor" && (
                    <button
                      onClick={() => setActiveViewTab("audited")}
                      className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl transition-all text-left group ${
                        activeViewTab === "audited"
                          ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-[0_4px_20px_rgba(147,51,234,0.35)] border border-white/20"
                          : "bg-[#12141c]/50 hover:bg-[#181a24] border border-white/[0.06] text-mist-300 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${
                            activeViewTab === "audited"
                              ? "bg-white/20 text-white"
                              : "bg-white/[0.04] text-mist-400 group-hover:text-white"
                          }`}
                        >
                          <BrainCircuit className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold">Audited Challenges</div>
                          <div
                            className={`text-[10px] ${
                              activeViewTab === "audited" ? "text-violet-100" : "text-mist-500"
                            }`}
                          >
                            Review, edit, or remove
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          activeViewTab === "audited"
                            ? "bg-white/20 text-white"
                            : "bg-white/[0.05] text-mist-400"
                        }`}
                      >
                        {auditedChallenges.length}
                      </span>
                    </button>
                  )}
                </nav>
              </div>

              {/* Bottom 2-Column Mini Stat Cards */}
              <div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-white/[0.06] shrink-0 mt-auto">
                <div className="rounded-xl border border-white/[0.06] bg-[#12141c]/60 p-2.5 sm:p-3">
                  <div className="text-lg sm:text-xl font-bold font-mono text-white">
                    {userBadges.length}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-mist-400 font-sans mt-0.5">
                    Verified Badges
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-[#12141c]/60 p-2.5 sm:p-3">
                  <div className="text-lg sm:text-xl font-bold font-mono text-white">
                    {badgeChallengeIdSet.size}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-mist-400 font-sans mt-0.5">
                    Solved Arena
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT PANEL */}
          <section className="lg:col-span-8 xl:col-span-9 rounded-2xl border border-white/[0.08] bg-[#0c0d12] p-4 sm:p-6 shadow-2xl h-full flex flex-col overflow-hidden min-h-0">
            {/* Header Row: Title on Left, Action Buttons on Right */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 pb-2.5">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {activeViewTab === "arena" && "Engineering Practice Arena"}
                  {activeViewTab === "badges" && "Cryptographic Proof Credentials"}
                  {activeViewTab === "my-created" && "Authored Production Challenges"}
                  {activeViewTab === "audited" && "Audited Challenge Management"}
                </h1>
                <p className="text-xs text-mist-400 mt-0.5">
                  {activeViewTab === "arena" &&
                    "Explore real-world challenges, run test suites in isolated sandboxes, and mint zk-proof credentials."}
                  {activeViewTab === "badges" &&
                    "Tamper-proof verifiable credentials minted after passing automated testing & Staff AI audit."}
                  {activeViewTab === "my-created" &&
                    "Author and manage production challenges, test fixtures, and automated verification rules."}
                  {activeViewTab === "audited" &&
                    "Manage your AI-audited challenges and keep their review criteria current."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                {isPrivileged && (
                  <Button
                    variant="verify"
                    size="sm"
                    onClick={() => {
                      setChallengeToEdit(null);
                      setIsEditorOpen(true);
                    }}
                    className="text-xs font-sans font-medium flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Challenge
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  title="Sign out of your account"
                  className="text-xs font-sans text-mist-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </Button>
              </div>
            </div>

            {/* Icon Section Pill Header */}
            <div className="flex items-center gap-2.5 pt-2.5 pb-2.5 border-t border-white/[0.06] shrink-0">
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm">
                {activeViewTab === "arena" && <Terminal className="h-3.5 w-3.5" />}
                {activeViewTab === "badges" && <Award className="h-3.5 w-3.5" />}
                {activeViewTab === "my-created" && <Code2 className="h-3.5 w-3.5" />}
                {activeViewTab === "audited" && <BrainCircuit className="h-3.5 w-3.5" />}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                {activeViewTab === "arena" && "Active Challenges & Sandboxes"}
                {activeViewTab === "badges" && "Earned Verification Badges"}
                {activeViewTab === "my-created" && "Managed Engineering Challenges"}
                {activeViewTab === "audited" && "Your AI-Audited Challenges"}
              </span>
            </div>

            {/* View 1: Practice Arena */}
            {activeViewTab === "arena" && (
              <div className="flex-1 flex flex-col min-h-0 space-y-3 overflow-hidden">
                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
                  {CATEGORY_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSelectedCategory(tab.id);
                        setPage(1);
                      }}
                      className={`relative rounded-lg px-2.5 py-1 font-sans text-xs transition-all whitespace-nowrap font-medium ${
                        selectedCategory === tab.id
                          ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.35)]"
                          : "border border-white/[0.06] bg-[#07080c] text-mist-400 hover:text-white hover:border-white/10"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Recessed Minimal Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-[#07080c] p-1.5 shrink-0">
                  <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-mist-500 stroke-[1.75]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title, tags, or concepts..."
                      className="w-full rounded-lg border border-white/[0.05] bg-[#0c0d12] pl-8 pr-4 py-1.5 text-xs text-mist-100 placeholder:text-mist-600 focus:border-violet-500/80 focus:outline-none"
                    />
                  </form>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => {
                        setSelectedDifficulty(e.target.value);
                        setPage(1);
                      }}
                      className="rounded-lg border border-white/[0.05] bg-[#0c0d12] px-2.5 py-1.5 text-xs text-mist-300 focus:border-violet-500/80 focus:outline-none capitalize font-sans"
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
                      className="rounded-lg border border-white/[0.05] bg-[#0c0d12] px-2.5 py-1.5 text-xs text-mist-300 focus:border-violet-500/80 focus:outline-none font-sans"
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
                        className="rounded-lg px-2 py-1 font-sans text-xs text-mist-400 hover:text-rose-400 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Challenges Scrollable Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                  {loadingChallenges ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="h-48 animate-pulse rounded-xl border border-white/[0.04] bg-[#12141c]/40 p-4 space-y-3"
                        />
                      ))}
                    </div>
                  ) : challengesError ? (
                    <div className="rounded-xl border border-white/[0.08] bg-[#07080c] p-6 text-center">
                      <p className="text-xs text-rose-400">{challengesError}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchChallengeList}
                        className="mt-3 text-xs"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : challenges.length === 0 ? (
                    <div className="rounded-xl border border-white/[0.06] bg-[#07080c] p-10 text-center space-y-2">
                      <h3 className="text-sm font-semibold text-mist-200">
                        No matching challenges
                      </h3>
                      <p className="text-xs text-mist-500 max-w-sm mx-auto">
                        Try loosening your search filters or check another discipline.
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="text-xs mt-2"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-2">
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
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5 mt-auto shrink-0 text-xs text-mist-500 font-sans">
                    <span>
                      Page {pagination.page} / {pagination.totalPages} ({pagination.total} total)
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="!py-1 !px-2.5 text-xs font-sans"
                      >
                        Prev
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={page >= pagination.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="!py-1 !px-2.5 text-xs font-sans"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* View 2: Verified Badges */}
            {activeViewTab === "badges" && (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                  {userBadges.length === 0 ? (
                    <div className="rounded-xl border border-white/[0.06] bg-[#07080c] px-6 py-12 text-center space-y-2">
                      <ShieldCheck className="mx-auto h-9 w-9 text-mist-600" />
                      <h3 className="text-sm font-semibold text-white">No badges earned yet</h3>
                      <p className="text-xs text-mist-500 max-w-sm mx-auto">
                        Solve an engineering challenge to mint your first verified cryptographic badge.
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
                    <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3 pb-2">
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
                            className="purple-comp rounded-xl p-4 transition-all hover:border-violet-500/50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-[10px] text-violet-300 uppercase tracking-wider font-semibold">
                                VERIFIED BADGE
                              </span>
                              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] text-emerald-400">
                                {b.score ?? 95}/100
                              </span>
                            </div>

                            <h3 className="text-sm font-semibold text-white line-clamp-1">
                              {challengeTitle}
                            </h3>
                            <p className="mt-0.5 font-mono text-[10px] text-mist-400 uppercase">
                              {challengeCategory}
                            </p>

                            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/[0.08] font-mono text-[10px] text-mist-400">
                              <span>
                                {b.earnedAt ? new Date(b.earnedAt).toLocaleDateString() : "Active"}
                              </span>
                              <span className="text-emerald-400">
                                0x
                                {typeof b.challengeId === "object"
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
              </div>
            )}

            {/* View 3: My Authored Challenges */}
            {isPrivileged && activeViewTab === "my-created" && (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                  {myCreatedChallenges.length === 0 ? (
                    <div className="rounded-xl border border-white/[0.06] bg-[#07080c] p-10 text-center space-y-2">
                      <h3 className="text-sm font-semibold text-white">
                        No authored challenges yet
                      </h3>
                      <p className="text-xs text-mist-400 max-w-sm mx-auto">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-2">
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
              </div>
            )}

            {/* View 4: Mentor Audited Challenges */}
            {user?.role === "mentor" && activeViewTab === "audited" && (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
                  {auditedChallenges.length === 0 ? (
                    <div className="rounded-xl border border-white/[0.06] bg-[#07080c] p-10 text-center space-y-2">
                      <BrainCircuit className="mx-auto h-9 w-9 text-mist-600" />
                      <h3 className="text-sm font-semibold text-white">No audited challenges yet</h3>
                      <p className="text-xs text-mist-400 max-w-sm mx-auto">
                        Create a review-only challenge to start building your audited challenge library.
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
                        Create Audited Challenge
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 pb-2">
                      <div className="rounded-xl border border-violet-500/15 bg-violet-500/[0.04] px-4 py-3">
                        <p className="text-xs text-violet-200">
                          These review-only challenges use AI audit criteria. Use the card actions to edit or delete your own challenge.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {auditedChallenges.map((challenge) => (
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
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

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
