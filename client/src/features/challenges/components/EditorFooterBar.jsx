import React from "react";
import { Play, Send, Loader2, Terminal } from "lucide-react";

export default function EditorFooterBar({
  cursorPosition,
  isRunningTests,
  isSubmitting,
  lastSavedText,
  onRunTests,
  onSubmit,
  isConsoleOpen,
  onToggleConsole,
  onOpenTerminal,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#0D0D12] border-t border-[#27272A] select-none text-xs font-mono">
      {/* Left: autosave indicator, cursor line/col, language badge, terminal button */}
      <div className="flex items-center gap-3.5 text-[#A1A1AA]">
        {/* Autosave status with subtle green pulse dot */}
        <div className="flex items-center gap-1.5" title="Cloud synchronizer">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]" />
          </span>
          <span className="text-[11px] text-[#A1A1AA] font-mono">{lastSavedText}</span>
        </div>

        <span className="text-[#27272A]">|</span>

        {/* Line / Column Count */}
        <div className="text-[11px] text-[#A1A1AA] font-mono">
          Ln <span className="text-[#FAFAFA]">{cursorPosition.line}</span>, Col{" "}
          <span className="text-[#FAFAFA]">{cursorPosition.column}</span>
        </div>

        <span className="text-[#27272A]">|</span>

        {/* Language badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#A1A1AA]">
          <span className="px-1.5 py-0.2 rounded bg-[#FBBF24]/15 text-[#FBBF24] font-semibold text-[9.5px] border border-[#FBBF24]/30">
            JS
          </span>
          <span>Node.js v20</span>
        </div>

        <span className="text-[#27272A]">|</span>

        {/* Quick Terminal toggle button */}
        <button
          type="button"
          onClick={onOpenTerminal || onToggleConsole}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-[8px] text-[11px] font-mono transition-colors ${
            isConsoleOpen
              ? "bg-[#211635] text-[#A78BFA] border border-[#8B5CF6]/30"
              : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20202A]"
          }`}
          title="Toggle Terminal & Output Console (⌘+`)"
        >
          <Terminal className="h-3 w-3 text-[#8B5CF6]" />
          <span>Terminal</span>
        </button>
      </div>

      {/* Right: "Run Tests" secondary button and "Submit Solution" primary button */}
      <div className="flex items-center gap-2.5">
        {/* Run Tests (secondary button) */}
        <button
          type="button"
          onClick={onRunTests}
          disabled={isRunningTests || isSubmitting}
          className="bg-[#20202A] hover:bg-[#27272A] text-[#E4E4E7] hover:text-[#FAFAFA] border border-[#30303A] hover:border-[#3F3F4A] flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] font-mono text-xs transition-all duration-150 disabled:opacity-50 cursor-pointer"
          title="Run test suite against sandbox (⌘+Enter / Ctrl+Enter)"
        >
          {isRunningTests ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FBBF24]" />
          ) : (
            <Play className="h-3.5 w-3.5 text-[#FBBF24] fill-current" />
          )}
          <span>Run Tests</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[9.5px] font-mono bg-[#14141B] border border-[#27272A] rounded text-[#71717A]">
            ⌘↵
          </kbd>
        </button>

        {/* Submit Solution (primary violet button) */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isRunningTests || isSubmitting}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] font-mono text-xs font-semibold shadow-[0_0_24px_rgba(139,92,246,0.16)] hover:shadow-[0_0_28px_rgba(139,92,246,0.28)] transition-all duration-150 disabled:opacity-50 cursor-pointer"
          title="Submit solution for AI architectural review and scoring (⌘+Shift+Enter / Ctrl+Shift+Enter)"
        >
          {isSubmitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
          ) : (
            <Send className="h-3.5 w-3.5 text-white" />
          )}
          <span>Submit Solution</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[9.5px] font-mono bg-white/20 border border-white/30 rounded text-white font-bold">
            ⌘⇧↵
          </kbd>
        </button>
      </div>
    </div>
  );
}
