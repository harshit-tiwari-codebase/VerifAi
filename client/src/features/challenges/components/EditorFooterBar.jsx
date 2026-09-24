import React from "react";
import { Play, Send, Loader2 } from "lucide-react";

export default function EditorFooterBar({
  cursorPosition,
  isRunningTests,
  isSubmitting,
  lastSavedText,
  onRunTests,
  onSubmit,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[#0c0d12] border-t border-white/[0.08] select-none text-xs font-mono">
      {/* Left: autosave indicator, cursor line/col, language badge */}
      <div className="flex items-center gap-3.5 text-mist-400">
        {/* Autosave status with subtle pulse dot */}
        <div className="flex items-center gap-1.5" title="Cloud synchronizer">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[11px] text-mist-300 font-mono">{lastSavedText}</span>
        </div>

        <span className="text-white/10">|</span>

        {/* Line / Column Count */}
        <div className="text-[11px] text-mist-400 font-mono">
          Ln <span className="text-mist-200">{cursorPosition.line}</span>, Col{" "}
          <span className="text-mist-200">{cursorPosition.column}</span>
        </div>

        <span className="text-white/10">|</span>

        {/* Language badge */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-mist-400">
          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold text-[9.5px] border border-amber-500/30">
            JS
          </span>
          <span>Node.js v20</span>
        </div>
      </div>

      {/* Right: "Run Tests" secondary button and "Submit Solution" primary button */}
      <div className="flex items-center gap-2.5">
        {/* Run Tests (frosted glass button with ⌘+Enter hint) */}
        <button
          type="button"
          onClick={onRunTests}
          disabled={isRunningTests || isSubmitting}
          className="btn-frosted-glass flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-mist-200 hover:text-white font-mono text-xs transition-all disabled:opacity-50 cursor-pointer"
          title="Run test suite against Judge0 sandbox (⌘+Enter / Ctrl+Enter)"
        >
          {isRunningTests ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
          ) : (
            <Play className="h-3.5 w-3.5 text-amber-400 fill-current" />
          )}
          <span>Run Tests</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[9.5px] font-mono bg-white/[0.06] border border-white/[0.1] rounded text-mist-400">
            ⌘↵
          </kbd>
        </button>

        {/* Submit Solution (signature VerifAI specular primary button with ⌘+Shift+Enter hint) */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isRunningTests || isSubmitting}
          className="btn-specular-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white font-mono text-xs font-semibold shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50 cursor-pointer"
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
