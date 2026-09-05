import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice.js";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Button from "../components/ui/Button.jsx";
import { getChallenges } from "../features/challenges/api/challengeApi.js";
import ChallengeCard from "../features/challenges/components/ChallengeCard.jsx";
import ChallengeDetailModal from "../features/challenges/components/ChallengeDetailModal.jsx";
import ChallengeEditorModal from "../features/challenges/components/ChallengeEditorModal.jsx";
import DeleteChallengeModal from "../features/challenges/components/DeleteChallengeModal.jsx";

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "dsa", label: "DSA" },
  { id: "bug-fix", label: "Bug Fix" },
  { id: "api-design", label: "API Design" },
  { id: "schema-modeling", label: "Schema Modeling" },
  { id: "system-design", label: "System Design" },
  { id: "debugging", label: "Debugging" },
];

export default function ChallengesPage() {
  const user = useSelector(selectUser);
  const isPrivileged = user && ["mentor", "admin"].includes(user.role);

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [page, setPage] = useState(1);

  // Modals
  const [detailId, setDetailId] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [challengeToEdit, setChallengeToEdit] = useState(null);
  const [challengeToDelete, setChallengeToDelete] = useState(null);

  const fetchChallengesList = () => {
    setLoading(true);
    setError("");

    const params = { page, limit: 12 };
    if (search.trim()) params.search = search.trim();
    if (category !== "all") params.category = category;
    if (difficulty !== "all") params.difficulty = difficulty;

    getChallenges(params)
      .then((data) => {
        setChallenges(data.challenges || []);
        setPagination(data.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 });
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Failed to load engineering challenges.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChallengesList();
  }, [page, category, difficulty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchChallengesList();
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("all");
    setDifficulty("all");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#070A10] text-mist-100 flex flex-col justify-between selection:bg-violet-600/30">
      <div>
        <Navbar />

        <main className="container-xl py-8 sm:py-10 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1 font-mono text-xs text-mist-400 hover:text-mist-100 transition-colors"
                >
                  ← Dashboard
                </Link>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-mist-100">
                Engineering Challenges
              </h1>
              <p className="mt-1 text-xs font-mono text-mist-400">
                Real-world concurrency, rate limits, schema migrations, and system design audited by AI.
              </p>
            </div>

            {isPrivileged && (
              <Button
                variant="verify"
                size="sm"
                onClick={() => {
                  setChallengeToEdit(null);
                  setIsEditorOpen(true);
                }}
                className="self-start sm:self-auto font-sans text-xs font-medium"
              >
                Author Challenge
              </Button>
            )}
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#0B0F19]/90 p-2.5">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-mist-500 stroke-[1.75]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search challenges by title, keyword, or concept..."
                className="w-full rounded-lg border border-white/[0.06] bg-[#070A10] pl-9 pr-4 py-1.5 text-xs text-mist-100 placeholder:text-mist-600 focus:border-violet-500/80 focus:outline-none"
              />
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-white/[0.06] bg-[#070A10] px-3 py-1.5 text-xs text-mist-300 focus:border-violet-500/80 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-white/[0.06] bg-[#070A10] px-3 py-1.5 text-xs text-mist-300 focus:border-violet-500/80 focus:outline-none capitalize"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              {(search || category !== "all" || difficulty !== "all") && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-mono text-mist-400 hover:text-rose-400 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="h-56 animate-pulse rounded-xl border border-white/[0.05] bg-[#0B0F19]/40 p-5 space-y-4"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-white/[0.08] bg-[#0B0F19] p-8 text-center">
              <p className="text-xs font-mono text-rose-400">{error}</p>
              <Button variant="ghost" size="sm" onClick={fetchChallengesList} className="mt-4">
                Retry
              </Button>
            </div>
          ) : challenges.length === 0 ? (
            <div className="rounded-xl border border-white/[0.06] bg-[#0B0F19]/60 p-12 text-center space-y-2">
              <h3 className="font-display text-sm font-semibold text-mist-100">
                No matching challenges found
              </h3>
              <p className="text-xs text-mist-400 max-w-sm mx-auto">
                Try loosening your filters or clearing search terms.
              </p>
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge._id}
                  challenge={challenge}
                  currentUser={user}
                  onView={(c) => setDetailId(c._id)}
                  onEdit={(c) => {
                    setChallengeToEdit(c);
                    setIsEditorOpen(true);
                  }}
                  onDelete={(c) => setChallengeToDelete(c)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/[0.06] pt-5">
              <p className="text-xs font-mono text-mist-500">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} challenges)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="font-mono text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="font-mono text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

    

      {/* Modals */}
      {detailId && (
        <ChallengeDetailModal
          challengeId={detailId}
          isOpen={Boolean(detailId)}
          onClose={() => setDetailId(null)}
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
          onSaved={fetchChallengesList}
        />
      )}

      {challengeToDelete && (
        <DeleteChallengeModal
          isOpen={Boolean(challengeToDelete)}
          challenge={challengeToDelete}
          onClose={() => setChallengeToDelete(null)}
          onDeleted={fetchChallengesList}
        />
      )}
    </div>
  );
}
