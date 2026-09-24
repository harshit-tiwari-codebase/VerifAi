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
    { token: "comment", foreground: "6272a4", fontStyle: "italic" },
    { token: "keyword", foreground: "c084fc", fontStyle: "bold" },
    { token: "identifier", foreground: "f4f6fa" },
    { token: "string", foreground: "34d399" },
    { token: "number", foreground: "fbbf24" },
    { token: "type", foreground: "38bdf8" },
    { token: "delimiter", foreground: "8b93a3" },
  ],
  colors: {
    "editor.background": "#0b0d14",
    "editor.foreground": "#f4f6fa",
    "editorCursor.foreground": "#c084fc",
    "editor.lineHighlightBackground": "#14172280",
    "editorLineNumber.foreground": "#586173",
    "editorLineNumber.activeForeground": "#c084fc",
    "editor.selectionBackground": "#9333ea40",
    "editor.inactiveSelectionBackground": "#9333ea20",
    "editorIndentGuide.background": "#1c2033",
    "editorIndentGuide.activeBackground": "#2d3245",
  },
});

// Configure loader to use local Monaco instance
loader.config({ monaco });

export { monaco };
