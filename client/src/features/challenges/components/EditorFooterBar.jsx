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
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0d0f1c] border-t border-[#1c2033] select-none text-xs font-mono">
      {/* Left: autosave indicator, cursor line/col, language badge */}
      <div className="flex items-center gap-3.5 text-mist-400">
        {/* Autosave status with subtle pulse dot */}
        <div className="flex items-center gap-1.5" title="Cloud synchronizer">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-[11px] text-mist-300">{lastSavedText}</span>
        </div>

        <span className="text-[#2d3245]">|</span>

        {/* Line / Column Count */}
        <div className="text-[11px] text-mist-400">
          Ln <span className="text-mist-200">{cursorPosition.line}</span>, Col{" "}
          <span className="text-mist-200">{cursorPosition.column}</span>
        </div>

        <span className="text-[#2d3245]">|</span>

        {/* Language badge */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-mist-400">
          <span className="px-1.5 py-0.5 rounded bg-[#1c2033] text-amber-300 font-semibold text-[10px]">
            JS
          </span>
          <span>Node.js v20</span>
        </div>
      </div>

      {/* Right: "Run Tests" secondary button and "Submit Solution" primary button */}
      <div className="flex items-center gap-2">
        {/* Run Tests (secondary ghost button, ⌘+Enter hint) */}
        <button
          type="button"
          onClick={onRunTests}
          disabled={isRunningTests || isSubmitting}
          className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1c2033] bg-[#0b0d14] text-mist-200 hover:bg-[#141726] hover:text-white hover:border-[#2d3245] active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          title="Run public test cases against local Judge0 sandbox (⌘+Enter / Ctrl+Enter)"
        >
          {isRunningTests ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
          ) : (
            <Play className="h-3.5 w-3.5 text-amber-400 group-hover:scale-110 transition-transform fill-current" />
          )}
          <span className="text-xs font-mono font-medium">Run Tests</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-[#141724] border border-[#262b40] rounded text-mist-400">
            ⌘↵
          </kbd>
        </button>

        {/* Submit Solution (primary button, solid white-on-dark or amber accent, ⌘+Shift+Enter hint) */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isRunningTests || isSubmitting}
          className="group relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/20 bg-mist-100 text-black hover:bg-white active:scale-95 font-medium transition-all duration-150 shadow-md shadow-black/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          title="Submit solution for AI review, static analysis, anti-cheat & scoring (⌘+Shift+Enter / Ctrl+Shift+Enter)"
        >
          {isSubmitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-black" />
          ) : (
            <Send className="h-3.5 w-3.5 text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          )}
          <span className="text-xs font-mono font-semibold">Submit Solution</span>
          <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-black/10 border border-black/20 rounded text-black/80 font-bold">
            ⌘⇧↵
          </kbd>
        </button>
      </div>
    </div>
  );
}
