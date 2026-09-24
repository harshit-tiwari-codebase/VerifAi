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
} from "lucide-react";
import Navbar from "../components/layout/Navbar.jsx";
import ProblemSpecPane from "../features/challenges/components/ProblemSpecPane.jsx";
import EditorFooterBar from "../features/challenges/components/EditorFooterBar.jsx";
import TestResultsConsole from "../features/challenges/components/TestResultsConsole.jsx";
import VerificationModal from "../features/challenges/components/VerificationModal.jsx";
import ResultScreenModal from "../features/challenges/components/ResultScreenModal.jsx";
import { DEFAULT_CHALLENGE_DATA } from "../features/challenges/data/mockChallengeData.js";
import { getChallengeById } from "../features/challenges/api/challengeApi.js";
import "../utils/monacoConfig.js"; // configure local Monaco worker setup & theme

export default function ChallengeWorkspacePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Challenge state
  const [challenge, setChallenge] = useState(DEFAULT_CHALLENGE_DATA);
  const [code, setCode] = useState(DEFAULT_CHALLENGE_DATA.starterCode);
  const [copiedCode, setCopiedCode] = useState(false);

  // Timer chip in header (micro-engagement, counts up in seconds)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Autosave status
  const [lastSavedSecondsAgo, setLastSavedSecondsAgo] = useState(2);

  // Monaco editor state
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const editorRef = useRef(null);

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
      getChallengeById(slug)
        .then((res) => {
          if (!mounted) return;
          if (res?.challenge) {
            setChallenge((prev) => ({
              ...prev,
              ...res.challenge,
              testCases:
                res.challenge.testCases && res.challenge.testCases.length > 0
                  ? res.challenge.testCases
                  : prev.testCases,
            }));
            if (res.challenge.starterCode) {
              setCode(res.challenge.starterCode);
            }
          }
        })
        .catch(() => {
          // Fallback to default challenge mock data
        });
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

  // Autosave simulator (increments "Saved X s ago" every few seconds)
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

    // Track cursor movements
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    // Custom verifai-dark theme is loaded via monacoConfig
    monaco.editor.setTheme("verifai-dark");
  };

  // Handle code change
  const handleCodeChange = (newCode) => {
    setCode(newCode || "");
    setLastSavedSecondsAgo(0); // instant reset on edit
  };

  // Copy code handler
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Reset starter code
  const handleResetStarterCode = () => {
    if (window.confirm("Reset editor to starter template? All changes will be replaced.")) {
      setCode(challenge.starterCode);
      setLastSavedSecondsAgo(0);
    }
  };

  // RUN TESTS SEQUENCE: staggered reveal 350ms apart
  const handleRunTests = useCallback(() => {
    if (isRunningTests || isVerificationOpen) return;

    setIsConsoleOpen(true);
    setIsRunningTests(true);
    setRevealedCount(0);
    setTestProgressPercent(10);

    const testCases = challenge.testCases || [];
    const totalCases = testCases.length;

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

  // SUBMIT FLOW: opens full-screen verification modal
  const handleSubmitSolution = useCallback(() => {
    if (isRunningTests || isVerificationOpen) return;
    setIsVerificationOpen(true);
  }, [isRunningTests, isVerificationOpen]);

  // When verification pipeline finishes, open result screen
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
    <div className="min-h-screen bg-[#0b0d14] text-mist-100 flex flex-col justify-between selection:bg-violet-600/30 font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col overflow-hidden px-2 sm:px-4 py-3 max-w-[1720px] w-full mx-auto">
        {/* Workspace Top Header Bar with window chrome, difficulty pill, timer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 mb-3 rounded-xl border border-[#1c2033] bg-[#0d0f1c] select-none">
          {/* Left: macOS dots, back button, title, difficulty */}
          <div className="flex items-center gap-3">
            {/* macOS traffic light window dots */}
            <div className="flex items-center gap-1.5 pr-2 border-r border-[#1c2033]">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>

            <Link
              to="/challenges"
              className="p-1 rounded text-mist-500 hover:text-mist-200 transition-colors"
              title="Return to challenges list"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2">
              <h1 className="font-mono text-sm font-semibold text-mist-100">
                {challenge?.title || "Distributed Token Bucket Rate Limiter"}
              </h1>

              {/* Difficulty pill: amber text on translucent amber */}
              <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-mono text-amber-300 font-medium">
                {challenge?.difficulty || "Medium"}
              </span>
            </div>
          </div>

          {/* Right: Timer chip, helper button */}
          <div className="flex items-center gap-3">
            {/* Live elapsed timer chip */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#1c2033] bg-[#0b0d14] text-xs font-mono text-mist-300"
              title="Time elapsed on this problem"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            <button
              onClick={() => setIsConsoleOpen((prev) => !prev)}
              className="px-2.5 py-1 rounded-lg border border-[#1c2033] bg-[#0b0d14] text-[11px] font-mono text-mist-400 hover:text-mist-200 transition-colors"
            >
              Console ({isConsoleOpen ? "Hide" : "Show"})
            </button>
          </div>
        </div>

        {/* Split Screen Workspace Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[600px] lg:h-[calc(100vh-170px)] overflow-hidden">
          {/* Left Pane: Problem Spec (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col rounded-2xl border border-[#1c2033] bg-[#0d0f1c] overflow-hidden">
            {/* Spec Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#090b14] border-b border-[#1c2033] select-none">
              <span className="font-mono text-xs text-mist-400 font-semibold tracking-wider uppercase">
                SPECIFICATION & EVALUATION
              </span>
              <span className="text-[10px] font-mono text-mist-500">
                v2.1 · Real-Time AST
              </span>
            </div>

            <ProblemSpecPane challenge={challenge} />
          </div>

          {/* Right Pane: Code Editor + Results Console (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl border border-[#1c2033] bg-[#0b0d14] overflow-hidden relative">
            {/* Editor Header Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#0d0f1c] border-b border-[#1c2033] select-none text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-mist-200 font-medium">starter_code.js</span>
                {/* Bordered mono chip in cyan/blue tint */}
                <span className="rounded px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/30 bg-cyan-500/10">
                  sandbox-active
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetStarterCode}
                  className="flex items-center gap-1 px-2 py-1 rounded text-mist-500 hover:text-mist-300 hover:bg-[#141724] transition-colors text-[11px]"
                  title="Reset to starter template"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded text-mist-400 hover:text-mist-200 hover:bg-[#141724] transition-colors text-[11px] font-mono"
                  title="Copy code to clipboard"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Monaco Editor Container */}
            <div className="flex-1 w-full h-full relative overflow-hidden bg-[#0b0d14]">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={handleCodeChange}
                onMount={handleEditorDidMount}
                theme="verifai-dark"
                options={{
                  fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: 13,
                  lineHeight: 21,
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
                }}
              />

              {/* Collapsible Results Console sliding up from bottom of editor pane (~40% height) */}
              <TestResultsConsole
                isOpen={isConsoleOpen}
                onClose={() => setIsConsoleOpen(false)}
                testCases={challenge.testCases || []}
                revealedCount={revealedCount}
                isRunning={isRunningTests}
                progressPercent={testProgressPercent}
                aiReviewData={challenge.aiReview}
              />
            </div>

            {/* Editor Footer Bar (Autosave, Line/Col, Run Tests, Submit Solution) */}
            <EditorFooterBar
              cursorPosition={cursorPosition}
              isRunningTests={isRunningTests}
              isSubmitting={isVerificationOpen}
              lastSavedText={`Saved ${lastSavedSecondsAgo}s ago`}
              onRunTests={handleRunTests}
              onSubmit={handleSubmitSolution}
            />
          </div>
        </div>
      </main>

      {/* SUBMISSION VERIFICATION SEQUENCE MODAL (Full screen overlay) */}
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
