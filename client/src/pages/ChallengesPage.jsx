import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X as XIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/auth/authSlice.js";
import Navbar from "../components/layout/Navbar.jsx";
import Button from "../components/ui/Button.jsx";
import Pagination from "../components/ui/Pagination.jsx";
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

const DEBOUNCE_MS = 400;

export default function ChallengesPage() {
  const user = useSelector(selectUser);
  const isPrivileged = user && ["mentor", "admin"].includes(user.role);

  // URL-synced filter state
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "all";
  const urlDifficulty = searchParams.get("difficulty") || "all";
  const urlPage = Number(searchParams.get("page")) || 1;

  // Local search input (for debounce — may differ from URL until debounce fires)
  const [searchInput, setSearchInput] = useState(urlSearch);

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });

  // Modals
  const [detailId, setDetailId] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [challengeToEdit, setChallengeToEdit] = useState(null);
  const [challengeToDelete, setChallengeToDelete] = useState(null);

  // Abort controller ref for cancelling stale requests
  const abortRef = useRef(null);

  // --- Helpers to update URL params ---
  const updateParams = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(updates)) {
          if (!value || value === "all" || value === "1" || value === 1) {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        }
        return next;
      }, { replace: true });
    },
    [setSearchParams]
  );

  // --- Debounced search: sync searchInput → URL after DEBOUNCE_MS ---
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== urlSearch) {
        updateParams({ search: trimmed, page: 1 });
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]); // intentionally only depend on searchInput

  // Keep local input in sync if URL changes externally (e.g. back/forward)
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // --- Fetch challenges when URL filter params change ---
  useEffect(() => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");

    const params = { page: urlPage, limit: 12 };
    if (urlSearch) params.search = urlSearch;
    if (urlCategory !== "all") params.category = urlCategory;
    if (urlDifficulty !== "all") params.difficulty = urlDifficulty;

    getChallenges(params, { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setChallenges(data.challenges || []);
        setPagination(data.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err?.response?.data?.message || "Failed to load engineering challenges.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [urlPage, urlCategory, urlDifficulty, urlSearch]);

  // --- Filter handlers ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    updateParams({ search: trimmed, page: 1 });
  };

  const handleCategoryChange = (value) => {
    updateParams({ category: value, page: 1 });
  };

  const handleDifficultyChange = (value) => {
    updateParams({ difficulty: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = urlSearch || urlCategory !== "all" || urlDifficulty !== "all";

  // Refetch helper for after create/edit/delete
  const refetch = () => {
    // Trigger re-fetch by bumping a dummy param (URL params haven't changed)
    // Simplest: just re-call getChallenges inline
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");

    const params = { page: urlPage, limit: 12 };
    if (urlSearch) params.search = urlSearch;
    if (urlCategory !== "all") params.category = urlCategory;
    if (urlDifficulty !== "all") params.difficulty = urlDifficulty;

    getChallenges(params, { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setChallenges(data.challenges || []);
        setPagination(data.pagination || { total: 0, page: 1, limit: 12, totalPages: 1 });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err?.response?.data?.message || "Failed to load engineering challenges.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-black text-mist-100 flex flex-col justify-between selection:bg-violet-600/30">
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
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#0c0d12] p-2.5">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-mist-500 stroke-[1.75]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search challenges by title, keyword, or concept..."
                className="w-full rounded-lg border border-white/[0.06] bg-[#07080c] pl-9 pr-8 py-1.5 text-xs text-mist-100 placeholder:text-mist-600 focus:border-violet-500/80 focus:outline-none"
                aria-label="Search challenges"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateParams({ search: "", page: 1 });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mist-500 hover:text-mist-200 transition-colors"
                  aria-label="Clear search"
                >
                  <XIcon className="h-3 w-3 stroke-[2]" />
                </button>
              )}
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={urlCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="rounded-lg border border-white/[0.06] bg-[#07080c] px-3 py-1.5 text-xs text-mist-300 focus:border-violet-500/80 focus:outline-none"
                aria-label="Filter by category"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                value={urlDifficulty}
                onChange={(e) => handleDifficultyChange(e.target.value)}
                className="rounded-lg border border-white/[0.06] bg-[#07080c] px-3 py-1.5 text-xs text-mist-300 focus:border-violet-500/80 focus:outline-none capitalize"
                aria-label="Filter by difficulty"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              {hasActiveFilters && (
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
          <div aria-live="polite" aria-atomic="true">
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
                <Button variant="ghost" size="sm" onClick={refetch} className="mt-4">
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
          </div>

          {/* Pagination */}
          {!loading && !error && (
            <Pagination
              page={urlPage}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={handlePageChange}
            />
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
          onSaved={refetch}
        />
      )}

      {challengeToDelete && (
        <DeleteChallengeModal
          isOpen={Boolean(challengeToDelete)}
          challenge={challengeToDelete}
          onClose={() => setChallengeToDelete(null)}
          onDeleted={refetch}
        />
      )}
    </div>
  );
}
