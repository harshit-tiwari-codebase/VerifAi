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
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#141412] border-t border-[#30302B] select-none text-xs font-mono">
      {/* Left: autosave indicator, cursor line/col, language badge, terminal button */}
      <div className="flex items-center gap-3.5 text-[#AAA69B]">
        {/* Autosave status with subtle green pulse dot */}
        <div className="flex items-center gap-1.5" title="Cloud synchronizer">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-50" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]" />
          </span>
          <span className="text-[11px] text-[#AAA69B] font-mono">{lastSavedText}</span>
        </div>

        <span className="text-[#30302B]">|</span>

        {/* Line / Column Count */}
        <div className="text-[11px] text-[#AAA69B] font-mono">
          Ln <span className="text-[#F2EFE6]">{cursorPosition.line}</span>, Col{" "}
          <span className="text-[#F2EFE6]">{cursorPosition.column}</span>
        </div>

        <span className="text-[#30302B]">|</span>

        {/* Language badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#AAA69B]">
          <span className="px-1.5 py-0.2 rounded bg-[#FBBF24]/15 text-[#FBBF24] font-semibold text-[9.5px] border border-[#FBBF24]/30">
            JS
          </span>
          <span>Node.js v20</span>
        </div>

        <span className="text-[#30302B]">|</span>

        {/* Quick Terminal toggle button */}
        <button
          type="button"
          onClick={onOpenTerminal || onToggleConsole}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-[8px] text-[11px] font-mono transition-colors ${
            isConsoleOpen
              ? "bg-[#261912] text-[#FFB08E] border border-[#FF6A3D]/30"
              : "text-[#AAA69B] hover:text-[#F2EFE6] hover:bg-[#22221E]"
          }`}
          title="Toggle Terminal & Output Console (⌘+`)"
        >
          <Terminal className="h-3 w-3 text-[#FF6A3D]" />
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
          className="bg-[#22221E] hover:bg-[#30302B] text-[#E4E0D5] hover:text-[#F2EFE6] border border-[#37372F] hover:border-[#414139] flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] font-mono text-xs transition-all duration-150 disabled:opacity-50 cursor-pointer"
          title="Run test suite against sandbox (⌘+Enter / Ctrl+Enter)"
        >
          {isRunningTests ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FBBF24]" />
          ) : (
            <Play className="h-3.5 w-3.5 text-[#FBBF24] fill-current" />
          )}
          <span>Run Tests</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[9.5px] font-mono bg-[#1C1C19] border border-[#30302B] rounded text-[#77756D]">
            ⌘↵
          </kbd>
        </button>

        {/* Submit Solution (primary violet button) */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isRunningTests || isSubmitting}
          className="bg-[#FF6A3D] hover:bg-[#E9562F] text-white flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] font-mono text-xs font-semibold shadow-sm hover:shadow-sm transition-all duration-150 disabled:opacity-50 cursor-pointer"
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
