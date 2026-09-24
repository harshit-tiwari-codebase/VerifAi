import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
import editorWorker from "monaco-editor/editor/editor.worker.js?worker";
import tsWorker from "monaco-editor/language/typescript/ts.worker.js?worker";

// Configure Monaco Environment for local bundling with Vite ?worker imports (no CDN)
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

// Define custom theme matching VerifAI's exact pitch black visual language (#000000 canvas, #0e1017 panels, white/[0.08] borders)
monaco.editor.defineTheme("verifai-dark", {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "64748b", fontStyle: "italic" },
    { token: "keyword", foreground: "c084fc", fontStyle: "bold" },
    { token: "keyword.control", foreground: "c084fc", fontStyle: "bold" },
    { token: "identifier", foreground: "f4f6fa" },
    { token: "string", foreground: "34d399" },
    { token: "string.escape", foreground: "6ee7b7" },
    { token: "number", foreground: "fbbf24" },
    { token: "type", foreground: "38bdf8", fontStyle: "bold" },
    { token: "type.identifier", foreground: "38bdf8" },
    { token: "delimiter", foreground: "94a3b8" },
    { token: "delimiter.bracket", foreground: "cbd5e1" },
    { token: "variable.parameter", foreground: "cbd5e1" },
    { token: "variable.name", foreground: "f8fafc" },
  ],
  colors: {
    "editor.background": "#000000",
    "editor.foreground": "#f4f6fa",
    "editorCursor.foreground": "#c084fc",
    "editor.lineHighlightBackground": "#0c0e17",
    "editorLineNumber.foreground": "#475569",
    "editorLineNumber.activeForeground": "#c084fc",
    "editor.selectionBackground": "#9333ea40",
    "editor.inactiveSelectionBackground": "#9333ea20",
    "editorIndentGuide.background": "#161926",
    "editorIndentGuide.activeBackground": "#2d3245",
    "editorBracketMatch.background": "#9333ea25",
    "editorBracketMatch.border": "#a855f7",
    "editorGutter.background": "#000000",
    "scrollbarSlider.background": "#ffffff15",
    "scrollbarSlider.hoverBackground": "#ffffff25",
    "scrollbarSlider.activeBackground": "#9333ea50",
  },
});

// Configure loader to use local Monaco instance
loader.config({ monaco });

export { monaco };
