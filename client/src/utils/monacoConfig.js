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

// Define custom theme matching VerifAI's Black + Electric Violet design system
monaco.editor.defineTheme("verifai-dark", {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "858592", fontStyle: "italic" },
    { token: "keyword", foreground: "C084FC", fontStyle: "bold" },
    { token: "keyword.control", foreground: "C084FC", fontStyle: "bold" },
    { token: "string", foreground: "A7F3D0" },
    { token: "string.escape", foreground: "A7F3D0" },
    { token: "number", foreground: "FBBF24" },
    { token: "regexp", foreground: "F0ABFC" },
    { token: "type", foreground: "93C5FD", fontStyle: "bold" },
    { token: "type.identifier", foreground: "93C5FD" },
    { token: "identifier", foreground: "E4E4E7" },
    { token: "variable", foreground: "E4E4E7" },
    { token: "variable.parameter", foreground: "E4E4E7" },
    { token: "variable.name", foreground: "E4E4E7" },
    { token: "operator", foreground: "F0ABFC" },
    { token: "delimiter", foreground: "A1A1AA" },
    { token: "delimiter.bracket", foreground: "E4E4E7" },
    { token: "function", foreground: "93C5FD" },
    { token: "tag", foreground: "C084FC" },
    { token: "attribute.name", foreground: "93C5FD" },
    { token: "attribute.value", foreground: "A7F3D0" },
    { token: "error", foreground: "F87171" },
  ],
  colors: {
    "editor.background": "#141412",
    "editor.foreground": "#E4E0D5",
    "editorGutter.background": "#171714",
    "editor.lineHighlightBackground": "#191522",
    "editor.lineHighlightBorder": "#00000000",
    "editorLineNumber.foreground": "#666675",
    "editorLineNumber.activeForeground": "#FFD1BB",
    "editor.selectionBackground": "#422316",
    "editor.inactiveSelectionBackground": "#42231680",
    "editor.selectionHighlightBackground": "#42231660",
    "editorCursor.foreground": "#FF6A3D",
    "editorIndentGuide.background": "#30302B",
    "editorIndentGuide.activeBackground": "#414139",
    "editorBracketMatch.background": "#42231650",
    "editorBracketMatch.border": "#FF6A3D",
    "editorOverviewRuler.border": "#30302B",
    "editorError.foreground": "#F87171",
    "editorWarning.foreground": "#FBBF24",
    "editorInfo.foreground": "#60A5FA",
    "scrollbarSlider.background": "#30302B80",
    "scrollbarSlider.hoverBackground": "#414139B0",
    "scrollbarSlider.activeBackground": "#FF6A3D80",
  },
});

// Configure loader to use local Monaco instance
loader.config({ monaco });

export { monaco };
