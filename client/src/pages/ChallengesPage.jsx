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
  { id: "all", label: "All" },
  { id: "dsa", label: "DSA" },
  { id: "bug-fix", label: "Bug fix" },
  { id: "api-design", label: "API design" },
  { id: "schema-modeling", label: "Schema modeling" },
  { id: "system-design", label: "System design" },
  { id: "debugging", label: "Debugging" },
];

const DIFFICULTIES = [
  { id: "all", label: "Any difficulty" },
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

const DEBOUNCE_MS = 400;
const PAGE_SIZE = 12;
const EMPTY_PAGINATION = { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 };

export default function ChallengesPage() {
  const user = useSelector(selectUser);
  const isPrivileged = user && ["mentor", "admin"].includes(user.role);

  // URL-synced filter state
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "all";
  const urlDifficulty = searchParams.get("difficulty") || "all";
  const urlPage = Number(searchParams.get("page")) || 1;

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals
  const [detailId, setDetailId] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [challengeToEdit, setChallengeToEdit] = useState(null);
  const [challengeToDelete, setChallengeToDelete] = useState(null);

  const abortRef = useRef(null);

  const updateParams = useCallback(
    (updates) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(updates)) {
            if (!value || value === "all" || value === "1" || value === 1) {
              next.delete(key);
            } else {
              next.set(key, String(value));
            }
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Debounce typing -> URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== urlSearch) updateParams({ search: trimmed, page: 1 });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput, urlSearch, updateParams]);

  // URL -> input (back/forward, reset) without clobbering what's being typed
  useEffect(() => {
    setSearchInput((prev) => (prev.trim() === urlSearch ? prev : urlSearch));
  }, [urlSearch]);

  // Single fetch path. `refreshKey` is how modals trigger a refetch.
  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");

    const params = { page: urlPage, limit: PAGE_SIZE };
    if (urlSearch) params.search = urlSearch;
    if (urlCategory !== "all") params.category = urlCategory;
    if (urlDifficulty !== "all") params.difficulty = urlDifficulty;

    getChallenges(params, { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        setChallenges(data.challenges || []);
        setPagination(data.pagination || EMPTY_PAGINATION);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(err?.response?.data?.message || "Couldn't load challenges.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [urlPage, urlCategory, urlDifficulty, urlSearch, refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim(), page: 1 });
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

  return (
    <div className="min-h-screen bg-[#0B0B0A] text-[#F2EFE6] flex flex-col justify-between selection:bg-[#422316]">
      <div>
        <Navbar />

        <main className="container-xl py-10 sm:py-14">
          {/* Header */}
          <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <Link
                to="/dashboard"
                className="text-xs text-[#8F8B80] transition-colors hover:text-[#F2EFE6] focus-visible:text-[#F2EFE6] focus-visible:outline-none"
              >
                ← Dashboard
              </Link>
              <h1 className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight">
                Challenges
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#8F8B80]">
                Concurrency, rate limits, migrations and system design. Every solution is reviewed by AI.
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
                className="self-start sm:self-auto text-xs font-medium"
              >
                New challenge
              </Button>
            )}
          </header>

          {/* Filters */}
          <div className="mt-10 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <form onSubmit={handleSearchSubmit} className="relative flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F5D56] stroke-[1.5]"
                />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search challenges"
                  aria-label="Search challenges"
                  className="w-full border-0 border-b border-[#262621] bg-transparent py-2.5 pl-7 pr-8 text-sm text-[#F2EFE6] placeholder:text-[#5F5D56] transition-colors focus:border-[#FF6A3D] focus:outline-none focus:ring-0"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      updateParams({ search: "", page: 1 });
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[#5F5D56] transition-colors hover:text-[#F2EFE6] focus-visible:text-[#F2EFE6] focus-visible:outline-none"
                    aria-label="Clear search"
                  >
                    <XIcon className="h-3.5 w-3.5 stroke-[1.75]" />
                  </button>
                )}
              </form>

              <select
                value={urlDifficulty}
                onChange={(e) => updateParams({ difficulty: e.target.value, page: 1 })}
                aria-label="Filter by difficulty"
                className="cursor-pointer border-0 border-b border-[#262621] bg-transparent py-2.5 pr-6 text-sm text-[#AAA69B] transition-colors hover:text-[#F2EFE6] focus:border-[#FF6A3D] focus:outline-none focus:ring-0 sm:w-40"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#141412]">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category tabs */}
            <div className="flex items-center justify-between gap-4">
              <nav
                aria-label="Category"
                className="-mx-1 flex gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {CATEGORIES.map((c) => {
                  const active = urlCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => updateParams({ category: c.id, page: 1 })}
                      aria-pressed={active}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A3D] ${
                        active
                          ? "bg-[#F2EFE6] font-medium text-[#0B0B0A]"
                          : "text-[#8F8B80] hover:text-[#F2EFE6]"
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </nav>

              <div className="hidden shrink-0 items-center gap-3 text-xs text-[#5F5D56] sm:flex">
                {!loading && !error && (
                  <span className="tabular-nums">
                    {pagination.total} {pagination.total === 1 ? "challenge" : "challenges"}
                  </span>
                )}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-[#8F8B80] transition-colors hover:text-[#F2EFE6] focus-visible:outline-none focus-visible:text-[#F2EFE6]"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="mt-8" aria-live="polite" aria-atomic="true">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-56 animate-pulse rounded-2xl border border-[#1F1F1B] bg-[#121210]"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="py-20 text-center">
                <p className="text-sm text-[#F87171]">{error}</p>
                <Button variant="ghost" size="sm" onClick={refetch} className="mt-4">
                  Try again
                </Button>
              </div>
            ) : challenges.length === 0 ? (
              <div className="py-20 text-center">
                <h3 className="font-display text-base font-medium text-[#F2EFE6]">
                  No challenges match
                </h3>
                <p className="mx-auto mt-1.5 max-w-xs text-sm text-[#8F8B80]">
                  Try a different keyword or remove a filter.
                </p>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters} className="mt-4">
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          {!loading && !error && challenges.length > 0 && (
            <div className="mt-10">
              <Pagination
                page={urlPage}
                totalPages={pagination.totalPages}
                total={pagination.total}
                onPageChange={handlePageChange}
              />
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