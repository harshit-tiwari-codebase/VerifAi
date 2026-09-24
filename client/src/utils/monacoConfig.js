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

// Define custom theme matching VerifAI's exact visual language (#0b0d14 canvas, #0d0f1c panels, #1c2033 borders)
monaco.editor.defineTheme("verifai-dark", {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "64748b", fontStyle: "italic" },
    { token: "keyword", foreground: "c084fc", fontStyle: "bold" },
    { token: "keyword.control", foreground: "c084fc", fontStyle: "bold" },
    { token: "identifier", foreground: "f1f5f9" },
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
    "editor.background": "#0b0d14",
    "editor.foreground": "#f1f5f9",
    "editorCursor.foreground": "#a855f7",
    "editor.lineHighlightBackground": "#131627",
    "editorLineNumber.foreground": "#475569",
    "editorLineNumber.activeForeground": "#c084fc",
    "editor.selectionBackground": "#9333ea38",
    "editor.inactiveSelectionBackground": "#9333ea18",
    "editorIndentGuide.background": "#1c2033",
    "editorIndentGuide.activeBackground": "#334155",
    "editorBracketMatch.background": "#9333ea25",
    "editorBracketMatch.border": "#a855f7",
    "editorGutter.background": "#0b0d14",
    "scrollbarSlider.background": "#1e293b66",
    "scrollbarSlider.hoverBackground": "#33415599",
    "scrollbarSlider.activeBackground": "#475569cc",
  },
});

// Configure loader to use local Monaco instance
loader.config({ monaco });

export { monaco };
