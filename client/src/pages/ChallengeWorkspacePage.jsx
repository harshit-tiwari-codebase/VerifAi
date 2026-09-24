import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Settings,
  HelpCircle,
  Play,
  Send,
  Loader2,
  Terminal,
  FileCode,
  ShieldCheck,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import ProblemSpecPane from "../features/challenges/components/ProblemSpecPane.jsx";
import EditorFooterBar from "../features/challenges/components/EditorFooterBar.jsx";
import TestResultsConsole from "../features/challenges/components/TestResultsConsole.jsx";
import VerificationModal from "../features/challenges/components/VerificationModal.jsx";
import ResultScreenModal from "../features/challenges/components/ResultScreenModal.jsx";
import { DEFAULT_CHALLENGE_DATA } from "../features/challenges/data/mockChallengeData.js";
import { getChallengeById } from "../features/challenges/api/challengeApi.js";
import VerifaiLogo from "../components/ui/VerifaiLogo.jsx";
import "../utils/monacoConfig.js"; // configure local Monaco worker setup & theme

// Helper to generate clean starter code if a custom challenge has no starterCode template
function generateFallbackStarterCode(ch) {
  if (!ch) return DEFAULT_CHALLENGE_DATA.starterCode;
  const title = ch.title || "Algorithm";
  const className = title
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");

  return `/**
 * Challenge: ${title}
 * Category: ${ch.category || "Distributed Systems"}
 * Difficulty: ${ch.difficulty || "Medium"}
 */

class ${className || "Solution"} {
  constructor() {
    // Initialize required state
  }

  /**
   * Implement solution method
   * @param {any} input
   * @returns {any}
   */
  solve(input) {
    // Write your solution here
    return true;
  }
}

// Module export for Judge0 sandboxed evaluation
if (typeof module !== "undefined") {
  module.exports = { ${className || "Solution"} };
}
`;
}

export default function ChallengeWorkspacePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Challenge and Code state
  const [challenge, setChallenge] = useState(DEFAULT_CHALLENGE_DATA);
  const [code, setCode] = useState(DEFAULT_CHALLENGE_DATA.starterCode);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  // Timer chip in header (micro-engagement, counts up in seconds)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Autosave status
  const [lastSavedSecondsAgo, setLastSavedSecondsAgo] = useState(2);

  // Monaco editor state
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Test console state
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [testProgressPercent, setTestProgressPercent] = useState(0);

  // Verification & Result Modal state
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  // Load challenge data if real backend has it, otherwise default to rich mock data
  useEffect(() => {
    let mounted = true;

    if (slug && slug !== "rate-limiter" && slug !== "default") {
      setLoadingChallenge(true);
      getChallengeById(slug)
        .then((res) => {
          if (!mounted) return;
          if (res?.challenge) {
            const fetchedChallenge = res.challenge;
            const starter =
              fetchedChallenge.starterCode && fetchedChallenge.starterCode.trim().length > 0
                ? fetchedChallenge.starterCode
                : generateFallbackStarterCode(fetchedChallenge);

            const merged = {
              ...DEFAULT_CHALLENGE_DATA,
              ...fetchedChallenge,
              starterCode: starter,
              testCases:
                fetchedChallenge.testCases && fetchedChallenge.testCases.length > 0
                  ? fetchedChallenge.testCases
                  : DEFAULT_CHALLENGE_DATA.testCases,
              aiReview: {
                ...DEFAULT_CHALLENGE_DATA.aiReview,
                rubric:
                  fetchedChallenge.evaluationCriteria ||
                  DEFAULT_CHALLENGE_DATA.aiReview.rubric,
              },
            };

            setChallenge(merged);
            setCode(starter);

            if (editorRef.current) {
              editorRef.current.setValue(starter);
            }
          }
        })
        .catch(() => {
          // Fallback to default mock data
        })
        .finally(() => {
          if (mounted) setLoadingChallenge(false);
        });
    } else {
      setChallenge(DEFAULT_CHALLENGE_DATA);
      setCode(DEFAULT_CHALLENGE_DATA.starterCode);
      if (editorRef.current) {
        editorRef.current.setValue(DEFAULT_CHALLENGE_DATA.starterCode);
      }
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  // Timer interval for solve timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Autosave simulator
  useEffect(() => {
    const saveTimer = setInterval(() => {
      setLastSavedSecondsAgo((prev) => (prev > 20 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(saveTimer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle Monaco Editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    monaco.editor.setTheme("verifai-dark");

    if (code && editor.getValue() !== code) {
      editor.setValue(code);
    }
  };

  // Handle code change
  const handleCodeChange = (newCode) => {
    const updated = newCode || "";
    setCode(updated);
    setLastSavedSecondsAgo(0);
  };

  // Copy code handler
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Reset starter code
  const handleResetStarterCode = () => {
    const starter = challenge?.starterCode || DEFAULT_CHALLENGE_DATA.starterCode;
    if (window.confirm("Reset editor to starter template? All local changes will be replaced.")) {
      setCode(starter);
      if (editorRef.current) {
        editorRef.current.setValue(starter);
      }
      setLastSavedSecondsAgo(0);
    }
  };

  // RUN TESTS SEQUENCE: staggered reveal 350ms apart
  const handleRunTests = useCallback(() => {
    if (isRunningTests || isVerificationOpen) return;

    setIsConsoleOpen(true);
    setIsRunningTests(true);
    setRevealedCount(0);
    setTestProgressPercent(15);

    const testCases = challenge.testCases || [];
    const totalCases = testCases.length || 1;

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setRevealedCount(current);
      setTestProgressPercent(Math.min(100, Math.round((current / totalCases) * 100)));

      if (current >= totalCases) {
        clearInterval(interval);
        setIsRunningTests(false);
      }
    }, 350);
  }, [challenge.testCases, isRunningTests, isVerificationOpen]);

  // SUBMIT FLOW
  const handleSubmitSolution = useCallback(() => {
    if (isRunningTests || isVerificationOpen) return;
    setIsVerificationOpen(true);
  }, [isRunningTests, isVerificationOpen]);

  // When verification pipeline finishes
  const handleVerificationComplete = () => {
    setIsVerificationOpen(false);
    setIsResultOpen(true);
  };

  // Keyboard shortcuts: ⌘+Enter to Run Tests, ⌘+Shift+Enter to Submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key === "Enter") {
        e.preventDefault();
        if (e.shiftKey) {
          handleSubmitSolution();
        } else {
          handleRunTests();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRunTests, handleSubmitSolution]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-mist-100 flex flex-col selection:bg-violet-600/30 font-sans">
      {/* Top Workspace Header Bar matching Web App Navbar */}
      <header className="h-14 bg-black border-b border-white/[0.08] px-4 flex items-center justify-between gap-3 shrink-0 select-none z-10">
        {/* Left: Brand / Back to Challenges / Challenge Details */}
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="flex items-center gap-2 group mr-1">
            <VerifaiLogo size={24} />
          </Link>

          <span className="text-white/20">/</span>

          <Link
            to="/challenges"
            className="flex items-center gap-1 font-mono text-xs text-mist-400 hover:text-mist-100 transition-colors shrink-0"
            title="Return to Challenges"
          >
            <span>Challenges</span>
          </Link>

          <span className="text-white/20 hidden md:inline">/</span>

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-display text-xs sm:text-sm font-semibold text-white truncate">
              {challenge?.title || "Distributed Token Bucket Rate Limiter"}
            </h1>

            {/* Difficulty Pill */}
            <span
              className={`rounded-full px-2 py-0.5 text-[10.5px] font-mono font-medium border shrink-0 capitalize ${
                challenge?.difficulty === "Hard"
                  ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                  : challenge?.difficulty === "Easy"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-300"
              }`}
            >
              {challenge?.difficulty || "Medium"}
            </span>
          </div>
        </div>

        {/* Right: Timer / Console / Specular Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Elapsed Timer Chip */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] font-mono text-mist-300"
            title="Time elapsed on problem"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>

          {/* Toggle Console */}
          <button
            type="button"
            onClick={() => setIsConsoleOpen((prev) => !prev)}
            className={`btn-frosted-glass flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
              isConsoleOpen ? "text-violet-300 border-violet-500/40" : "text-mist-400"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Console</span>
          </button>

          {/* Run Tests Button */}
          <button
            type="button"
            onClick={handleRunTests}
            disabled={isRunningTests || isVerificationOpen}
            className="btn-frosted-glass flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-mist-200 hover:text-white transition-all disabled:opacity-50"
            title="Run tests (⌘+Enter)"
          >
            {isRunningTests ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
            ) : (
              <Play className="h-3.5 w-3.5 text-amber-400 fill-current" />
            )}
            <span className="hidden sm:inline">Run</span>
          </button>

          {/* Submit Solution Button */}
          <button
            type="button"
            onClick={handleSubmitSolution}
            disabled={isRunningTests || isVerificationOpen}
            className="btn-specular-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium text-white shadow-lg transition-all disabled:opacity-50"
            title="Submit solution for AI evaluation (⌘+Shift+Enter)"
          >
            {isVerificationOpen ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
            ) : (
              <Send className="h-3.5 w-3.5 text-white" />
            )}
            <span>Submit</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Split Grid */}
      <div className="flex-1 min-h-0 w-full grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden bg-black">
        {/* Left Pane: Problem Spec & Rubric (5 cols) */}
        <section
          aria-label="Problem Specification"
          className="lg:col-span-5 h-full flex flex-col min-h-0 rounded-2xl border border-white/[0.08] bg-[#0c0d12] overflow-hidden shadow-2xl"
        >
          <ProblemSpecPane challenge={challenge} />
        </section>

        {/* Right Pane: Code Editor + Test Console (7 cols) */}
        <section
          aria-label="Code Editor"
          className="lg:col-span-7 h-full flex flex-col min-h-0 rounded-2xl border border-white/[0.08] bg-[#07080c] overflow-hidden relative shadow-2xl"
        >
          {/* Editor Header Bar */}
          <div className="h-10 px-4 bg-[#0e1017] border-b border-white/[0.08] flex items-center justify-between shrink-0 select-none text-xs font-mono">
            {/* macOS traffic light dots & active file tab */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 pr-2 border-r border-white/[0.08]">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black text-mist-100 border border-white/[0.08] text-[11px] font-medium">
                <FileCode className="h-3.5 w-3.5 text-violet-400" />
                <span>solution.js</span>
              </div>

              <span className="rounded px-1.5 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                sandbox-ready
              </span>
            </div>

            {/* Quick editor actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetStarterCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-mist-500 hover:text-mist-200 hover:bg-white/[0.06] transition-colors text-[11px]"
                title="Reset to starter code"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-mist-400 hover:text-mist-100 hover:bg-white/[0.06] transition-colors text-[11px]"
                title="Copy code"
              >
                {copiedCode ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Monaco Editor Canvas (Pure Black Background) */}
          <div className="flex-1 min-h-0 w-full relative overflow-hidden bg-black">
            <Editor
              height="100%"
              width="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              theme="verifai-dark"
              options={{
                fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 13,
                lineHeight: 22,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                bracketPairColorization: { enabled: true },
                renderLineHighlight: "all",
                lineNumbersMinChars: 3,
                padding: { top: 14, bottom: 14 },
                automaticLayout: true,
                tabSize: 2,
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                  useShadows: false,
                },
              }}
            />

            {/* Sliding Test Results Console */}
            <TestResultsConsole
              isOpen={isConsoleOpen}
              onClose={() => setIsConsoleOpen(false)}
              testCases={challenge.testCases || []}
              revealedCount={revealedCount}
              isRunning={isRunningTests}
              progressPercent={testProgressPercent}
              aiReviewData={challenge.aiReview}
              onRunTests={handleRunTests}
            />
          </div>

          {/* Editor Footer Bar */}
          <div className="shrink-0">
            <EditorFooterBar
              cursorPosition={cursorPosition}
              isRunningTests={isRunningTests}
              isSubmitting={isVerificationOpen}
              lastSavedText={`Saved ${lastSavedSecondsAgo}s ago`}
              onRunTests={handleRunTests}
              onSubmit={handleSubmitSolution}
            />
          </div>
        </section>
      </div>

      {/* SUBMISSION VERIFICATION SEQUENCE MODAL */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onComplete={handleVerificationComplete}
        onCancel={() => setIsVerificationOpen(false)}
      />

      {/* FINAL RESULT SCREEN MODAL */}
      <ResultScreenModal
        isOpen={isResultOpen}
        aiReviewData={challenge.aiReview}
        onTryAgain={() => {
          setIsResultOpen(false);
          setIsConsoleOpen(false);
        }}
        onBackToChallenges={() => navigate("/challenges")}
        onNextChallenge={() => {
          setIsResultOpen(false);
          navigate("/challenges");
        }}
      />
    </div>
  );
}
