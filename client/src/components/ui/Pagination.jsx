import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable pagination component with page numbers, prev/next, ARIA labels, and ellipsis.
 *
 * @param {{ page: number, totalPages: number, total: number, onPageChange: (p: number) => void }} props
 */
export default function Pagination({ page, totalPages, total, onPageChange }) {
  if (totalPages <= 1) return null;

  // Build page number list with ellipsis
  const getVisiblePages = () => {
    const pages = [];
    const delta = 1; // how many neighbours on each side of current

    const rangeStart = Math.max(2, page - delta);
    const rangeEnd = Math.min(totalPages - 1, page + delta);

    // Always include page 1
    pages.push(1);

    if (rangeStart > 2) pages.push("...");

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) pages.push("...");

    // Always include last page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      aria-label="Page navigation"
      className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.06] pt-5"
    >
      <p className="text-xs font-mono text-mist-500">
        Page {page} of {totalPages} ({total} total)
      </p>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Go to previous page"
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-mono text-mist-400 hover:text-mist-100 hover:bg-white/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-mist-400"
        >
          <ChevronLeft className="h-3 w-3 stroke-[2]" />
          Prev
        </button>

        {/* Page numbers */}
        {visiblePages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1.5 text-xs font-mono text-mist-600 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              disabled={p === page}
              aria-label={`Go to page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`min-w-[28px] rounded-lg px-2 py-1.5 text-xs font-mono transition-colors ${
                p === page
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30 cursor-default"
                  : "text-mist-400 hover:text-mist-100 hover:bg-white/[0.06]"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Go to next page"
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-mono text-mist-400 hover:text-mist-100 hover:bg-white/[0.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-mist-400"
        >
          Next
          <ChevronRight className="h-3 w-3 stroke-[2]" />
        </button>
      </div>
    </nav>
  );
}
