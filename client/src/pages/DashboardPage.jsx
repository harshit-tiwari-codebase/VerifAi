import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
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
    <div className="h-screen max-h-screen overflow-hidden bg-[#09090B] text-[#FAFAFA] flex flex-col font-sans">
      <Navbar />
      <main className="w-full max-w-[100vw] px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1 min-h-0 h-full w-full overflow-hidden">
          <div className="lg:col-span-4 xl:col-span-3 rounded-[14px] border border-[#27272A] bg-[#14141B] p-4 sm:p-5 space-y-4 animate-pulse h-full flex flex-col justify-between overflow-hidden">
            <div className="space-y-3">
              <div className="h-6 w-32 rounded bg-[#20202A]" />
              <div className="w-18 h-18 rounded-full mx-auto bg-[#20202A]" />
              <div className="h-4 w-28 mx-auto rounded bg-[#20202A]" />
              <div className="h-11 rounded-[10px] bg-[#18181F]" />
              <div className="h-11 rounded-[10px] bg-[#18181F]" />
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#27272A]">
              <div className="h-14 rounded-[10px] bg-[#18181F]" />
              <div className="h-14 rounded-[10px] bg-[#18181F]" />
            </div>
          </div>
          <div className="lg:col-span-8 xl:col-span-9 rounded-[14px] border border-[#27272A] bg-[#14141B] p-5 sm:p-6 space-y-4 animate-pulse h-full flex flex-col justify-between overflow-hidden">
            <div className="h-8 w-64 rounded bg-[#20202A]" />
            <div className="h-10 rounded-[10px] bg-[#18181F]" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2 flex-1 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 rounded-[10px] bg-[#18181F]" />
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
  const role = user?.role || "candidate";
  const joined = formatJoinDate(user?.createdAt);
  const initial = (name?.[0] || "U").toUpperCase();

  // Filter authored challenges
  const myCreatedChallenges = challenges.filter(
    (c) =>
      c.createdBy &&
      (c.createdBy === user?._id ||
        c.createdBy?._id === user?._id ||
        c.createdBy === user?.id ||
        c.createdBy?.id === user?.id)
  );

  // Filter audited challenges
  const auditedChallenges = challenges.filter(
    (c) =>
      c.executionType === "review_only" &&
      (user?.role === "admin" ||
        c.createdBy === user?._id ||
        c.createdBy?._id === user?._id ||
        c.createdBy === user?.id ||
        c.createdBy?.id === user?.id)
  );

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#09090B] text-[#FAFAFA] flex flex-col font-sans selection:bg-[#38245C]">
      <Navbar />

      <main className="w-full max-w-[100vw] px-4 sm:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1 min-h-0 h-full w-full overflow-hidden">
          {/* LEFT SIDEBAR: User Profile & Navigation */}
          <aside className="lg:col-span-4 xl:col-span-3 rounded-[14px] border border-[#27272A] bg-[#14141B] p-4 sm:p-5 flex flex-col justify-between shadow-2xl h-full overflow-hidden">
            <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar pr-1 space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] font-semibold">
                  Developer Profile
                </span>

                {/* Profile Card Center */}
                <div className="mt-3 flex flex-col items-center text-center pb-3">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] text-white font-bold text-xl sm:text-2xl flex items-center justify-center border-2 border-[#8B5CF6]/50 shadow-[0_0_24px_rgba(139,92,246,0.25)]">
                      {initial}
                    </div>
                    {user?.isVerified && (
                      <div
                        className="absolute -bottom-1 -right-1 bg-[#34D399] text-[#09090B] rounded-full p-1 border-2 border-[#14141B]"
                        title="Verified Engineer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  <h3 className="mt-2.5 text-base font-semibold text-[#FAFAFA] tracking-tight">
                    {name}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="rounded-full border border-[#8B5CF6]/30 bg-[#211635] px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-[#C4B5FD]">
                      {role}
                    </span>
                    {isPrivileged && (
                      <span className="rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#FBBF24]">
                        Staff
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 text-xs text-[#71717A] font-mono truncate max-w-[220px]">
                    {user?.email}
                  </p>
                  {joined && (
                    <p className="text-[11px] text-[#52525B] font-mono mt-0.5">
                      Joined {joined}
                    </p>
                  )}
                </div>

                {/* Vertical Navigation Tab Stack */}
                <nav className="space-y-1.5 pt-2 border-t border-[#27272A]">
                  {/* Arena Tab */}
                  <button
                    onClick={() => setActiveViewTab("arena")}
                    className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-[10px] transition-all text-left group ${
                      activeViewTab === "arena"
                        ? "bg-[#211635] text-[#C4B5FD] border border-[#8B5CF6]/40 shadow-[0_0_16px_rgba(139,92,246,0.16)] font-medium"
                        : "bg-[#18181F] hover:bg-[#20202A] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors ${
                          activeViewTab === "arena"
                            ? "bg-[#38245C] text-[#C4B5FD]"
                            : "bg-[#14141B] text-[#71717A] group-hover:text-[#FAFAFA]"
                        }`}
                      >
                        <Terminal className="w-4 h-4 text-[#8B5CF6]" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Practice Arena</div>
                        <div
                          className={`text-[10px] ${
                            activeViewTab === "arena" ? "text-[#A78BFA]" : "text-[#71717A]"
                          }`}
                        >
                          Browse & solve challenges
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        activeViewTab === "arena"
                          ? "bg-[#38245C] text-[#C4B5FD]"
                          : "bg-[#14141B] text-[#71717A]"
                      }`}
                    >
                      {challenges.length}
                    </span>
                  </button>

                  {/* Badges Tab */}
                  <button
                    onClick={() => setActiveViewTab("badges")}
                    className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-[10px] transition-all text-left group ${
                      activeViewTab === "badges"
                        ? "bg-[#211635] text-[#C4B5FD] border border-[#8B5CF6]/40 shadow-[0_0_16px_rgba(139,92,246,0.16)] font-medium"
                        : "bg-[#18181F] hover:bg-[#20202A] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors ${
                          activeViewTab === "badges"
                            ? "bg-[#38245C] text-[#C4B5FD]"
                            : "bg-[#14141B] text-[#71717A] group-hover:text-[#FAFAFA]"
                        }`}
                      >
                        <Award className="w-4 h-4 text-[#8B5CF6]" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Verified Badges</div>
                        <div
                          className={`text-[10px] ${
                            activeViewTab === "badges" ? "text-[#A78BFA]" : "text-[#71717A]"
                          }`}
                        >
                          Cryptographic proof records
                        </div>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        activeViewTab === "badges"
                          ? "bg-[#38245C] text-[#C4B5FD]"
                          : "bg-[#14141B] text-[#71717A]"
                      }`}
                    >
                      {userBadges.length}
                    </span>
                  </button>

                  {/* Authored Tab (Privileged) */}
                  {isPrivileged && (
                    <button
                      onClick={() => setActiveViewTab("my-created")}
                      className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-[10px] transition-all text-left group ${
                        activeViewTab === "my-created"
                          ? "bg-[#211635] text-[#C4B5FD] border border-[#8B5CF6]/40 shadow-[0_0_16px_rgba(139,92,246,0.16)] font-medium"
                          : "bg-[#18181F] hover:bg-[#20202A] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors ${
                            activeViewTab === "my-created"
                              ? "bg-[#38245C] text-[#C4B5FD]"
                              : "bg-[#14141B] text-[#71717A] group-hover:text-[#FAFAFA]"
                          }`}
                        >
                          <Code2 className="w-4 h-4 text-[#8B5CF6]" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold">My Authored</div>
                          <div
                            className={`text-[10px] ${
                              activeViewTab === "my-created" ? "text-[#A78BFA]" : "text-[#71717A]"
                            }`}
                          >
                            Manage author test suites
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          activeViewTab === "my-created"
                            ? "bg-[#38245C] text-[#C4B5FD]"
                            : "bg-[#14141B] text-[#71717A]"
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
                      className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-[10px] transition-all text-left group ${
                        activeViewTab === "audited"
                          ? "bg-[#211635] text-[#C4B5FD] border border-[#8B5CF6]/40 shadow-[0_0_16px_rgba(139,92,246,0.16)] font-medium"
                          : "bg-[#18181F] hover:bg-[#20202A] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors ${
                            activeViewTab === "audited"
                              ? "bg-[#38245C] text-[#C4B5FD]"
                              : "bg-[#14141B] text-[#71717A] group-hover:text-[#FAFAFA]"
                          }`}
                        >
                          <BrainCircuit className="w-4 h-4 text-[#8B5CF6]" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold">Audited Challenges</div>
                          <div
                            className={`text-[10px] ${
                              activeViewTab === "audited" ? "text-[#A78BFA]" : "text-[#71717A]"
                            }`}
                          >
                            Review, edit, or remove
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          activeViewTab === "audited"
                            ? "bg-[#38245C] text-[#C4B5FD]"
                            : "bg-[#14141B] text-[#71717A]"
                        }`}
                      >
                        {auditedChallenges.length}
                      </span>
                    </button>
                  )}
                </nav>
              </div>

              {/* Bottom Mini Stat Cards */}
              <div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-[#27272A] shrink-0 mt-auto">
                <div className="rounded-[10px] border border-[#27272A] bg-[#18181F] p-2.5 sm:p-3">
                  <div className="text-lg sm:text-xl font-bold font-mono text-[#FAFAFA]">
                    {userBadges.length}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#A1A1AA] font-sans mt-0.5">
                    Verified Badges
                  </div>
                </div>

                <div className="rounded-[10px] border border-[#27272A] bg-[#18181F] p-2.5 sm:p-3">
                  <div className="text-lg sm:text-xl font-bold font-mono text-[#FAFAFA]">
                    {badgeChallengeIdSet.size}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#A1A1AA] font-sans mt-0.5">
                    Solved Arena
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN CONTENT PANEL */}
          <section className="lg:col-span-8 xl:col-span-9 rounded-[14px] border border-[#27272A] bg-[#14141B] p-4 sm:p-6 shadow-2xl h-full flex flex-col overflow-hidden min-h-0">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 pb-2.5">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[#FAFAFA] tracking-tight">
                  {activeViewTab === "arena" && "Engineering Practice Arena"}
                  {activeViewTab === "badges" && "Cryptographic Proof Credentials"}
                  {activeViewTab === "my-created" && "Authored Production Challenges"}
                  {activeViewTab === "audited" && "Audited Challenge Management"}
                </h1>
                <p className="text-xs text-[#A1A1AA] mt-0.5">
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
                  className="text-xs font-sans text-[#A1A1AA] hover:text-[#F87171] hover:bg-[#F87171]/10 border border-transparent hover:border-[#F87171]/20 flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </Button>
              </div>
            </div>

            {/* Section Pill Header */}
            <div className="flex items-center gap-2.5 pt-2.5 pb-2.5 border-t border-[#27272A] shrink-0">
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-[8px] bg-[#211635] text-[#C4B5FD] border border-[#8B5CF6]/30 shadow-sm">
                {activeViewTab === "arena" && <Terminal className="h-3.5 w-3.5 text-[#8B5CF6]" />}
                {activeViewTab === "badges" && <Award className="h-3.5 w-3.5 text-[#8B5CF6]" />}
                {activeViewTab === "my-created" && <Code2 className="h-3.5 w-3.5 text-[#8B5CF6]" />}
                {activeViewTab === "audited" && <BrainCircuit className="h-3.5 w-3.5 text-[#8B5CF6]" />}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#FAFAFA] tracking-wide">
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
                      className={`relative rounded-[8px] px-2.5 py-1 font-sans text-xs transition-all whitespace-nowrap font-medium ${
                        selectedCategory === tab.id
                          ? "bg-[#211635] text-[#C4B5FD] border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.16)]"
                          : "border border-[#27272A] bg-[#18181F] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Minimal Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 rounded-[10px] border border-[#27272A] bg-[#18181F] p-1.5 shrink-0">
                  <form onSubmit={handleSearchSubmit} className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717A] stroke-[1.75]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title, tags, or concepts..."
                      className="w-full rounded-[8px] border border-[#27272A] bg-[#111116] pl-8 pr-4 py-1.5 text-xs text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#8B5CF6] focus:outline-none transition-colors"
                    />
                  </form>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => {
                        setSelectedDifficulty(e.target.value);
                        setPage(1);
                      }}
                      className="rounded-[8px] border border-[#27272A] bg-[#111116] px-2.5 py-1.5 text-xs text-[#FAFAFA] focus:border-[#8B5CF6] focus:outline-none capitalize font-sans cursor-pointer"
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
                      className="rounded-[8px] border border-[#27272A] bg-[#111116] px-2.5 py-1.5 text-xs text-[#FAFAFA] focus:border-[#8B5CF6] focus:outline-none font-sans cursor-pointer"
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
                        className="rounded-[8px] px-2 py-1 font-sans text-xs text-[#A1A1AA] hover:text-[#F87171] hover:bg-[#20202A] transition-colors"
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
                          className="h-48 animate-pulse rounded-[14px] border border-[#27272A] bg-[#18181F] p-4 space-y-3"
                        />
                      ))}
                    </div>
                  ) : challengesError ? (
                    <div className="rounded-[14px] border border-[#27272A] bg-[#18181F] p-6 text-center">
                      <p className="text-xs text-[#F87171]">{challengesError}</p>
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
                    <div className="rounded-[14px] border border-[#27272A] bg-[#18181F] p-10 text-center space-y-2">
                      <h3 className="text-sm font-semibold text-[#FAFAFA]">
                        No matching challenges
                      </h3>
                      <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
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
                  <div className="flex items-center justify-between border-t border-[#27272A] pt-2.5 mt-auto shrink-0 text-xs text-[#71717A] font-sans">
                    <span>
                      Page <strong className="text-[#FAFAFA]">{pagination.page}</strong> / {pagination.totalPages} ({pagination.total} total)
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
                    <div className="rounded-[14px] border border-[#27272A] bg-[#18181F] px-6 py-12 text-center space-y-2">
                      <ShieldCheck className="mx-auto h-9 w-9 text-[#71717A]" />
                      <h3 className="text-sm font-semibold text-[#FAFAFA]">No badges earned yet</h3>
                      <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
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
                            className="rounded-[14px] border border-[#8B5CF6]/30 bg-[#18181F] p-4 transition-all hover:bg-[#20202A] hover:border-[#8B5CF6]/50 shadow-[0_0_16px_rgba(139,92,246,0.10)]"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-[10px] text-[#A78BFA] uppercase tracking-wider font-semibold">
                                VERIFIED BADGE
                              </span>
                              <span className="rounded-full border border-[#34D399]/30 bg-[#34D399]/10 px-2 py-0.5 font-mono text-[11px] text-[#34D399]">
                                {b.score ?? 95}/100
                              </span>
                            </div>

                            <h3 className="text-sm font-semibold text-[#FAFAFA] line-clamp-1">
                              {challengeTitle}
                            </h3>
                            <p className="mt-0.5 font-mono text-[10px] text-[#71717A] uppercase">
                              {challengeCategory}
                            </p>

                            <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-[#27272A] font-mono text-[10px] text-[#71717A]">
                              <span>
                                {b.earnedAt ? new Date(b.earnedAt).toLocaleDateString() : "Active"}
                              </span>
                              <span className="text-[#34D399]">
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
                    <div className="rounded-[14px] border border-[#27272A] bg-[#18181F] p-10 text-center space-y-2">
                      <h3 className="text-sm font-semibold text-[#FAFAFA]">
                        No authored challenges yet
                      </h3>
                      <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
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
                    <div className="rounded-[14px] border border-[#27272A] bg-[#18181F] p-10 text-center space-y-2">
                      <BrainCircuit className="mx-auto h-9 w-9 text-[#71717A]" />
                      <h3 className="text-sm font-semibold text-[#FAFAFA]">No audited challenges yet</h3>
                      <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
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
                      <div className="rounded-[10px] border border-[#8B5CF6]/20 bg-[#211635]/40 px-4 py-3">
                        <p className="text-xs text-[#C4B5FD]">
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
