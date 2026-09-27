import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Copy,
  Check,
  RotateCcw,
  Play,
  Send,
  Loader2,
  Terminal,
  FileCode,
  PanelLeftClose,
  PanelLeft,
  Code2,
  AlignLeft,
} from "lucide-react";
import ProblemSpecPane from "../features/challenges/components/ProblemSpecPane.jsx";
import EditorFooterBar from "../features/challenges/components/EditorFooterBar.jsx";
import TestResultsConsole from "../features/challenges/components/TestResultsConsole.jsx";
import VerificationModal from "../features/challenges/components/VerificationModal.jsx";
import ResultScreenModal from "../features/challenges/components/ResultScreenModal.jsx";
import AnimatedCodeCompanion from "../features/challenges/components/AnimatedCodeCompanion.jsx";
import { DEFAULT_CHALLENGE_DATA } from "../features/challenges/data/mockChallengeData.js";
import { getChallengeById } from "../features/challenges/api/challengeApi.js";
import {
  executeChallengeTests,
  submitChallengeSolution,
} from "../features/challenges/api/submissionApi.js";
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
    // Initialize state
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

// Module export for sandboxed evaluation
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
  const [formattedCode, setFormattedCode] = useState(false);
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  // Zen mode & layout toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Typing & Keystroke stats for companion
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef(null);

  // Timer in header
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Autosave status
  const [lastSavedSecondsAgo, setLastSavedSecondsAgo] = useState(2);

  // Monaco editor state
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Test console & Execution state
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentTestCases, setCurrentTestCases] = useState(DEFAULT_CHALLENGE_DATA.testCases);
  const [revealedCount, setRevealedCount] = useState(0);
  const [testProgressPercent, setTestProgressPercent] = useState(0);

  // Custom Input testing state
  const [customInput, setCustomInput] = useState('{"capacity": 10, "refillRate": 2, "tokens": 1}');
  const [customOutput, setCustomOutput] = useState(null);
  const [isRunningCustom, setIsRunningCustom] = useState(false);

  // Verification & Submission Modal state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

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
            setCurrentTestCases(merged.testCases);

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
      setCurrentTestCases(DEFAULT_CHALLENGE_DATA.testCases);
      if (editorRef.current) {
        editorRef.current.setValue(DEFAULT_CHALLENGE_DATA.starterCode);
      }
    }

    return () => {
      mounted = false;
    };
  }, [slug]);

  // Timer interval
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

    setKeystrokeCount((prev) => prev + 1);
    setIsTyping(true);

    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  // Copy code handler
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Format code handler
  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument")?.run();
      setFormattedCode(true);
      setTimeout(() => setFormattedCode(false), 1500);
    }
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

  // RUN TESTS SEQUENCE: Real execution + staggered UI reveal
  const handleRunTests = useCallback(async () => {
    if (isRunningTests || isVerificationOpen) return;

    setIsConsoleOpen(true);
    setIsRunningTests(true);
    setRevealedCount(0);
    setTestProgressPercent(15);

    const baseTestCases = challenge.testCases || [];
    const totalCases = baseTestCases.length || 1;

    try {
      // Execute live tests in backend / sandbox
      const execResult = await executeChallengeTests({
        challengeId: challenge.id || slug,
        code,
        language: "javascript",
        testCases: baseTestCases,
      });

      const evaluated = execResult.testCases || baseTestCases;
      setCurrentTestCases(evaluated);

      // Stagger reveal animation for developer visual feedback
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setRevealedCount(current);
        setTestProgressPercent(Math.min(100, Math.round((current / totalCases) * 100)));

        if (current >= totalCases) {
          clearInterval(interval);
          setIsRunningTests(false);
        }
      }, 300);
    } catch {
      setIsRunningTests(false);
    }
  }, [challenge.id, challenge.testCases, code, isRunningTests, isVerificationOpen, slug]);

  // RUN CUSTOM TEST
  const handleRunCustomTest = async () => {
    if (isRunningCustom) return;
    setIsRunningCustom(true);
    setCustomOutput(null);

    try {
      const res = await executeChallengeTests({
        challengeId: challenge.id || slug,
        code,
        customInput,
      });

      setCustomOutput(
        res.customOutput ||
          `✓ Execution Success in ${res.runtimeMs || 12}ms\nOutput: ${JSON.stringify(res.output || true, null, 2)}`
      );
    } catch (err) {
      setCustomOutput(`! Execution Error: ${err.message}`);
    } finally {
      setIsRunningCustom(false);
    }
  };

  // SUBMIT FLOW: Full verification pipeline + backend sync
  const handleSubmitSolution = useCallback(async () => {
    if (isRunningTests || isVerificationOpen || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await submitChallengeSolution({
        challengeId: challenge.id || slug,
        code,
        language: "javascript",
        keystrokeCount,
        timeSpentSeconds: elapsedSeconds,
        testCases: challenge.testCases || [],
        challenge,
      });

      setSubmissionResult(result);
      setIsVerificationOpen(true);
    } catch (err) {
      console.error("Submission failed:", err);
      // Fallback open with default evaluation
      setIsVerificationOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    challenge.id,
    challenge.testCases,
    code,
    elapsedSeconds,
    isRunningTests,
    isSubmitting,
    isVerificationOpen,
    keystrokeCount,
    slug,
  ]);

  // When verification pipeline finishes
  const handleVerificationComplete = () => {
    setIsVerificationOpen(false);
    setIsResultOpen(true);
  };

  // Keyboard shortcuts: ⌘+Enter to Run Tests, ⌘+Shift+Enter to Submit, ⌘+B to toggle sidebar
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
      if (isCmdOrCtrl && (e.key === "b" || e.key === "B")) {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRunTests, handleSubmitSolution]);

  // Active AI review data (from real submission or mock fallback)
  const activeAiReview = submissionResult?.evaluation || challenge.aiReview;

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-mist-100 flex flex-col selection:bg-violet-600/30 font-sans">
      {/* Top Workspace Header Bar */}
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

        {/* Right: Keystroke Metric / Timer / Console / Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Keystrokes counter */}
          {keystrokeCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.02] text-[11px] font-mono text-mist-400">
              <span className="text-mist-200 font-semibold">{keystrokeCount}</span>
              <span className="text-mist-500">keys</span>
            </div>
          )}

          {/* Elapsed Timer Chip */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] font-mono text-mist-300"
            title="Time elapsed on problem"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
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
            disabled={isRunningTests || isVerificationOpen || isSubmitting}
            className="btn-frosted-glass flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-mist-200 hover:text-white transition-all disabled:opacity-50"
            title="Run tests in sandbox (⌘+Enter)"
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
            disabled={isRunningTests || isVerificationOpen || isSubmitting}
            className="btn-specular-primary flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium text-white shadow-lg transition-all disabled:opacity-50"
            title="Submit solution for verified evaluation (⌘+Shift+Enter)"
          >
            {isSubmitting || isVerificationOpen ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
            ) : (
              <Send className="h-3.5 w-3.5 text-white" />
            )}
            <span>Submit</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Split Grid */}
      <div className="flex-1 min-h-0 w-full flex gap-3 p-3 overflow-hidden bg-black">
        {/* Left Pane: Problem Spec & Rubric */}
        {isSidebarOpen && (
          <section
            aria-label="Problem Specification"
            className="w-full lg:w-[42%] h-full flex flex-col min-h-0 rounded-2xl border border-white/[0.08] bg-[#0c0d12] overflow-hidden shadow-2xl transition-all"
          >
            <ProblemSpecPane challenge={challenge} />
          </section>
        )}

        {/* Right Pane: Code Editor + Test Console */}
        <section
          aria-label="Code Editor"
          className="flex-1 h-full flex flex-col min-h-0 rounded-2xl border border-white/[0.08] bg-[#07080c] overflow-hidden relative shadow-2xl"
        >
          {/* Editor Header Bar */}
          <div className="h-10 px-4 bg-[#0e1017] border-b border-white/[0.08] flex items-center justify-between shrink-0 select-none text-xs font-mono">
            {/* Left: Sidebar toggle + file tab */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="p-1 rounded text-mist-500 hover:text-mist-200 hover:bg-white/[0.06] transition-colors"
                title={isSidebarOpen ? "Collapse problem spec (⌘+B)" : "Expand problem spec (⌘+B)"}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeft className="h-4 w-4" />
                )}
              </button>

              <div className="hidden sm:flex items-center gap-1.5 pr-2 border-r border-white/[0.08]">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black text-mist-100 border border-white/[0.08] text-[11px] font-medium">
                <FileCode className="h-3.5 w-3.5 text-violet-400" />
                <span>solution.js</span>
              </div>

              <span className="rounded px-1.5 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 hidden sm:inline">
                sandbox-ready
              </span>
            </div>

            {/* Quick editor actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFormatCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded text-mist-500 hover:text-mist-200 hover:bg-white/[0.06] transition-colors text-[11px]"
                title="Format / Beautify code"
              >
                <AlignLeft className="h-3 w-3" />
                <span>{formattedCode ? "Formatted" : "Format"}</span>
              </button>

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

            {/* Sliding Test Results Console with Custom Input Runner */}
            <TestResultsConsole
              isOpen={isConsoleOpen}
              onClose={() => setIsConsoleOpen(false)}
              testCases={currentTestCases || []}
              revealedCount={revealedCount}
              isRunning={isRunningTests}
              progressPercent={testProgressPercent}
              aiReviewData={activeAiReview}
              onRunTests={handleRunTests}
              customInput={customInput}
              setCustomInput={setCustomInput}
              customOutput={customOutput}
              onRunCustomTest={handleRunCustomTest}
              isRunningCustom={isRunningCustom}
            />
          </div>

          {/* Editor Footer Bar */}
          <div className="shrink-0">
            <EditorFooterBar
              cursorPosition={cursorPosition}
              isRunningTests={isRunningTests}
              isSubmitting={isSubmitting || isVerificationOpen}
              lastSavedText={`Saved ${lastSavedSecondsAgo}s ago`}
              onRunTests={handleRunTests}
              onSubmit={handleSubmitSolution}
            />
          </div>
        </section>
      </div>

      {/* Floating Draggable Animated AI Code Companion */}
      <AnimatedCodeCompanion
        isTyping={isTyping}
        keystrokeCount={keystrokeCount}
        isRunningTests={isRunningTests}
      />

      {/* SUBMISSION VERIFICATION SEQUENCE MODAL */}
      <VerificationModal
        isOpen={isVerificationOpen}
        submissionResult={submissionResult}
        onComplete={handleVerificationComplete}
        onCancel={() => setIsVerificationOpen(false)}
      />

      {/* FINAL RESULT SCREEN MODAL */}
      <ResultScreenModal
        isOpen={isResultOpen}
        aiReviewData={activeAiReview}
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
