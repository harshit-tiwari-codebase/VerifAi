import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable pagination component styled with the Black + Electric Violet design tokens.
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

    pages.push(1);

    if (rangeStart > 2) pages.push("...");

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav
      aria-label="Page navigation"
      className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#27272A] pt-5"
    >
      <p className="text-xs font-mono text-[#71717A]">
        Page <span className="text-[#FAFAFA] font-medium">{page}</span> of{" "}
        <span className="text-[#FAFAFA] font-medium">{totalPages}</span> ({total} total)
      </p>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Go to previous page"
          className="inline-flex items-center gap-1 rounded-[10px] px-2.5 py-1.5 text-xs font-mono text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A] border border-transparent hover:border-[#27272A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#A1A1AA]"
        >
          <ChevronLeft className="h-3 w-3 stroke-[2]" />
          Prev
        </button>

        {/* Page numbers */}
        {visiblePages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1.5 text-xs font-mono text-[#71717A] select-none"
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
              className={`min-w-[30px] rounded-[10px] px-2 py-1.5 text-xs font-mono transition-colors ${
                p === page
                  ? "bg-[#211635] text-[#C4B5FD] border border-[#8B5CF6]/40 font-medium cursor-default"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A] border border-transparent hover:border-[#27272A]"
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
          className="inline-flex items-center gap-1 rounded-[10px] px-2.5 py-1.5 text-xs font-mono text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A] border border-transparent hover:border-[#27272A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#A1A1AA]"
        >
          Next
          <ChevronRight className="h-3 w-3 stroke-[2]" />
        </button>
      </div>
    </nav>
  );
}
