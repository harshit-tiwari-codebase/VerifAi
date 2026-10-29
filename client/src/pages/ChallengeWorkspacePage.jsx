import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Copy,
  Check,
  RotateCcw,
  Play,
  Loader2,
  PanelLeftClose,
  PanelLeft,
  AlignLeft,
  Bot,
  SquareTerminal,
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
  pollSubmissionStatus,
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

const DIFFICULTY_DOT = {
  Easy: "bg-[#4ADE80]",
  Medium: "bg-[#FBBF24]",
  Hard: "bg-[#F87171]",
};

// Shared look for quiet, text-style controls
const ghostBtn =
  "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-[#8F8B80] transition-colors hover:bg-[#1C1C19] hover:text-[#F2EFE6] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A3D]";

export default function ChallengeWorkspacePage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Challenge and Code state
  const [challenge, setChallenge] = useState(DEFAULT_CHALLENGE_DATA);
  const [code, setCode] = useState(DEFAULT_CHALLENGE_DATA.starterCode);
  const [copiedCode, setCopiedCode] = useState(false);
  const [formattedCode, setFormattedCode] = useState(false);
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  // Layout toggle state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompanionVisible, setIsCompanionVisible] = useState(true);

  // Typing & keystroke stats (sent with submission + used by companion)
  const [keystrokeCount, setKeystrokeCount] = useState(0);

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
  const [consoleTab, setConsoleTab] = useState("tests"); // "tests" | "terminal" | "custom" | "ai"
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentTestCases, setCurrentTestCases] = useState(DEFAULT_CHALLENGE_DATA.testCases);
  const [revealedCount, setRevealedCount] = useState(0);
  const [testProgressPercent, setTestProgressPercent] = useState(0);
  const [compileError, setCompileError] = useState(null);
  const [testsPassed, setTestsPassed] = useState(null);

  // Terminal logs state
  const [terminalLogs, setTerminalLogs] = useState([
    {
      type: "sys",
      text: "VerifAI sandbox ready (Node.js v20.11 / ES2023).",
      timestamp: Date.now(),
    },
    {
      type: "info",
      text: "⌘↵ run tests · ⌘⇧↵ submit · ⌘` toggle terminal",
      timestamp: Date.now(),
    },
  ]);

  // Custom Input testing state
  const [customInput, setCustomInput] = useState('{"capacity": 10, "refillRate": 2, "tokens": 1}');
  const [customOutput, setCustomOutput] = useState(null);
  const [isRunningCustom, setIsRunningCustom] = useState(false);

  // Verification & Submission Modal state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

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

  // RUN TESTS SEQUENCE: Real execution + fast smooth UI reveal + live Terminal streaming
  const handleRunTests = useCallback(async () => {
    if (isRunningTests || isVerificationOpen) return;

    setIsConsoleOpen(true);
    setIsRunningTests(true);
    setRevealedCount(0);
    setTestProgressPercent(15);
    setCompileError(null);

    const baseTestCases = challenge.testCases || [];
    const totalCases = baseTestCases.length || 1;

    // Log test initiation to terminal
    setTerminalLogs((prev) => [
      ...prev,
      {
        type: "sys",
        text: `> node solution.js [Running ${totalCases} test suites in sandbox]`,
        timestamp: Date.now(),
      },
    ]);

    try {
      // Execute live tests in sandbox / backend
      const execResult = await executeChallengeTests({
        challengeId: challenge._id || challenge.id || slug,
        code,
        language: "javascript",
        testCases: baseTestCases,
      });

      // Stream user console.log statements into the terminal
      if (execResult.logs && execResult.logs.length > 0) {
        setTerminalLogs((prev) => [...prev, ...execResult.logs]);
      }

      // Check for compilation / syntax failure
      if (execResult.errorMessage || execResult.compileOutput || execResult.error) {
        const errMsg = execResult.compileOutput || execResult.errorMessage || execResult.error;
        setCompileError(errMsg);
        setTestsPassed(false);
        setTerminalLogs((prev) => [
          ...prev,
          {
            type: "error",
            text: `Syntax/Runtime Error: ${errMsg}`,
            timestamp: Date.now(),
          },
        ]);
      }

      const evaluated = execResult.testCases || baseTestCases;
      setCurrentTestCases(evaluated);

      // Fast, snappy staggered reveal (60ms per case)
      let current = 0;
      const interval = setInterval(() => {
        current++;
        setRevealedCount(current);
        setTestProgressPercent(Math.min(100, Math.round((current / totalCases) * 100)));

        if (current >= totalCases) {
          clearInterval(interval);
          setIsRunningTests(false);

          const passedCount = evaluated.filter((t) => t.passed).length;
          const allPassed = passedCount === totalCases && totalCases > 0;
          setTestsPassed(allPassed);

          setTerminalLogs((prev) => [
            ...prev,
            {
              type: allPassed ? "success" : "warn",
              text: allPassed
                ? `✓ All ${totalCases}/${totalCases} test cases passed successfully in ${execResult.totalTimeMs || 14}ms!`
                : `✗ ${totalCases - passedCount} of ${totalCases} test cases failed. Expand failed cases above for diff details.`,
              timestamp: Date.now(),
            },
          ]);
        }
      }, 60);
    } catch (err) {
      setIsRunningTests(false);
      setCompileError(err.message);
      setTestsPassed(false);
      setTerminalLogs((prev) => [
        ...prev,
        {
          type: "error",
          text: `Test runner exception: ${err.message}`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, [challenge._id, challenge.id, challenge.testCases, code, isRunningTests, isVerificationOpen, slug]);

  // RUN CUSTOM TEST
  const handleRunCustomTest = async () => {
    if (isRunningCustom) return;
    setIsRunningCustom(true);
    setCustomOutput(null);

    setTerminalLogs((prev) => [
      ...prev,
      {
        type: "sys",
        text: `> node -e "runCustomTest()" with payload: ${customInput}`,
        timestamp: Date.now(),
      },
    ]);

    try {
      const res = await executeChallengeTests({
        challengeId: challenge._id || challenge.id || slug,
        code,
        customInput,
      });

      if (res.logs && res.logs.length > 0) {
        setTerminalLogs((prev) => [...prev, ...res.logs]);
      }

      const outText =
        res.customOutput ||
        `✓ Execution Success in ${res.runtimeMs || 10}ms\nOutput: ${JSON.stringify(res.output || true, null, 2)}`;
      setCustomOutput(outText);

      setTerminalLogs((prev) => [
        ...prev,
        {
          type: "success",
          text: outText,
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      const errText = `! Execution Error: ${err.message}`;
      setCustomOutput(errText);
      setTerminalLogs((prev) => [
        ...prev,
        {
          type: "error",
          text: errText,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsRunningCustom(false);
    }
  };

  // REPL evaluator: Run arbitrary JavaScript expressions in the sandbox terminal
  const handleRunTerminalCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === "clear") {
      setTerminalLogs([]);
      return;
    }

    setTerminalLogs((prev) => [
      ...prev,
      {
        type: "log",
        text: `$ ${trimmed}`,
        timestamp: Date.now(),
      },
    ]);

    try {
      const capturedLogs = [];
      const tempConsole = {
        log: (...args) => capturedLogs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
        error: (...args) => capturedLogs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
        warn: (...args) => capturedLogs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
        info: (...args) => capturedLogs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
      };

      const replFunction = new Function(
        "console",
        `
        "use strict";
        const exports = {};
        const module = { exports };
        ${code}
        try {
          return (${trimmed});
        } catch (_) {
          return eval(${JSON.stringify(trimmed)});
        }
      `
      );

      const result = replFunction(tempConsole);

      const logsToAdd = [];
      capturedLogs.forEach((l) => {
        logsToAdd.push({ type: "log", text: l, timestamp: Date.now() });
      });

      const formattedResult =
        typeof result === "object" && result !== null
          ? JSON.stringify(result, null, 2)
          : String(result !== undefined ? result : "undefined");

      logsToAdd.push({
        type: "info",
        text: `→ ${formattedResult}`,
        timestamp: Date.now(),
      });

      setTerminalLogs((prev) => [...prev, ...logsToAdd]);
    } catch (err) {
      setTerminalLogs((prev) => [
        ...prev,
        {
          type: "error",
          text: `Evaluation Error: ${err.message}`,
          timestamp: Date.now(),
        },
      ]);
    }
  };

  // SUBMIT FLOW: Full verification pipeline + backend sync
  const handleSubmitSolution = useCallback(async () => {
    if (isRunningTests || isVerificationOpen || isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    const challengeId = challenge._id || challenge.id || slug;

    try {
      // 1. Submit solution to canonical endpoint
      const initRes = await submitChallengeSolution({
        challengeId,
        code,
        language: "javascript",
        keystrokeCount,
        timeSpentSeconds: elapsedSeconds,
      });

      // Show verification modal in queued state
      setSubmissionResult({
        _id: initRes.submissionId,
        status: "queued",
        challenge,
      });
      setIsVerificationOpen(true);

      // 2. Poll for terminal state
      const completedSub = await pollSubmissionStatus(
        initRes.submissionId,
        (updated) => {
          setSubmissionResult(updated);
        }
      );

      setSubmissionResult(completedSub);
    } catch (err) {
      console.error("Submission failed:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Submission failed. Your code remains safe in the editor.";
      setSubmissionError(errMsg);
      setSubmissionResult({
        status: "failed",
        errorMessage: errMsg,
      });
      setIsVerificationOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    challenge,
    code,
    elapsedSeconds,
    isRunningTests,
    isSubmitting,
    isVerificationOpen,
    keystrokeCount,
    slug,
  ]);

  // When verification pipeline finishes
  const handleVerificationComplete = (finalSub) => {
    setIsVerificationOpen(false);
    if (finalSub && finalSub.status === "completed") {
      setIsResultOpen(true);
    }
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
      if (isCmdOrCtrl && (e.key === "`" || e.key === "~")) {
        e.preventDefault();
        setIsConsoleOpen((prev) => {
          if (!prev) setConsoleTab("terminal");
          return !prev;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRunTests, handleSubmitSolution]);

  // Active AI review data (from real submission or mock fallback)
  const activeAiReview = submissionResult?.evaluation || challenge.aiReview;

  const busy = isRunningTests || isVerificationOpen || isSubmitting;
  const difficulty = challenge?.difficulty || "Medium";

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0B0B0A] text-[#F2EFE6] flex flex-col selection:bg-[#422316] font-sans">
      {/* Header */}
      <header className="h-12 px-4 flex items-center justify-between gap-4 shrink-0 select-none border-b border-[#1F1F1B]">
        {/* Left: breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="shrink-0" aria-label="VerifAI home">
            <VerifaiLogo size={22} />
          </Link>

          <span className="text-[#35352F]" aria-hidden="true">/</span>

          <Link
            to="/challenges"
            className="shrink-0 text-xs text-[#8F8B80] transition-colors hover:text-[#F2EFE6] focus-visible:outline-none focus-visible:text-[#F2EFE6]"
          >
            Challenges
          </Link>

          <span className="hidden md:inline text-[#35352F]" aria-hidden="true">/</span>

          <h1 className="hidden md:block truncate font-display text-sm font-medium text-[#F2EFE6]">
            {challenge?.title || "Distributed Token Bucket Rate Limiter"}
          </h1>

          <span className="hidden sm:flex shrink-0 items-center gap-1.5 text-xs text-[#8F8B80]">
            <span className={`h-1.5 w-1.5 rounded-full ${DIFFICULTY_DOT[difficulty] || DIFFICULTY_DOT.Medium}`} />
            {difficulty}
          </span>
        </div>

        {/* Right: tools + actions */}
        <div className="flex items-center gap-1 shrink-0">
          <span
            className="px-2 text-xs tabular-nums font-mono text-[#5F5D56]"
            title={`Time on problem · ${keystrokeCount} keystrokes`}
          >
            {formatTimer(elapsedSeconds)}
          </span>

          <button
            type="button"
            onClick={() => setIsCompanionVisible((visible) => !visible)}
            aria-pressed={isCompanionVisible}
            aria-label={`${isCompanionVisible ? "Hide" : "Show"} coding companion`}
            title={`${isCompanionVisible ? "Hide" : "Show"} coding companion`}
            className={`${ghostBtn} ${isCompanionVisible ? "!text-[#F2EFE6]" : ""}`}
          >
            <Bot className="h-4 w-4 stroke-[1.5]" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (isConsoleOpen) {
                setIsConsoleOpen(false);
              } else {
                setIsConsoleOpen(true);
                setConsoleTab("tests");
              }
            }}
            aria-pressed={isConsoleOpen}
            title="Toggle console (⌘`)"
            className={`${ghostBtn} ${isConsoleOpen ? "!text-[#F2EFE6] bg-[#1C1C19]" : ""}`}
          >
            <SquareTerminal className="h-4 w-4 stroke-[1.5]" />
            <span className="hidden sm:inline">Console</span>
          </button>

          <div className="mx-2 h-4 w-px bg-[#262621]" aria-hidden="true" />

          <button
            type="button"
            onClick={handleRunTests}
            disabled={busy}
            title="Run tests (⌘↵)"
            className="flex items-center gap-1.5 rounded-lg border border-[#2E2E28] px-3 py-1.5 text-xs font-medium text-[#E4E0D5] transition-colors hover:bg-[#1C1C19] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A3D] disabled:opacity-40 disabled:hover:bg-transparent"
          >
            {isRunningTests ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3 w-3 fill-current" />
            )}
            <span>Run</span>
          </button>

          <button
            type="button"
            onClick={handleSubmitSolution}
            disabled={busy}
            title="Submit solution (⌘⇧↵)"
            className="ml-1 flex items-center gap-1.5 rounded-lg bg-[#FF6A3D] px-3.5 py-1.5 text-xs font-medium text-[#0B0B0A] transition-colors hover:bg-[#FF7F58] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A3D]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0A] disabled:opacity-40"
          >
            {isSubmitting || isVerificationOpen ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : null}
            <span>Submit</span>
          </button>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 min-h-0 w-full flex gap-2 p-2 overflow-hidden">
        {/* Left: Problem */}
        {isSidebarOpen && (
          <section
            aria-label="Problem specification"
            className="w-full lg:w-[42%] h-full flex flex-col min-h-0 rounded-xl border border-[#1F1F1B] bg-[#101010] overflow-hidden"
          >
            <ProblemSpecPane challenge={challenge} />
          </section>
        )}

        {/* Right: Editor + console */}
        <section
          aria-label="Code editor"
          className="flex-1 h-full flex flex-col min-h-0 rounded-xl border border-[#1F1F1B] bg-[#101010] overflow-hidden relative"
        >
          {/* Editor bar */}
          <div className="h-10 px-2 flex items-center justify-between shrink-0 select-none border-b border-[#1F1F1B]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="rounded-lg p-1.5 text-[#5F5D56] transition-colors hover:bg-[#1C1C19] hover:text-[#F2EFE6] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A3D]"
                aria-label={isSidebarOpen ? "Collapse problem spec" : "Expand problem spec"}
                title={isSidebarOpen ? "Collapse problem spec (⌘B)" : "Expand problem spec (⌘B)"}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="h-4 w-4 stroke-[1.5]" />
                ) : (
                  <PanelLeft className="h-4 w-4 stroke-[1.5]" />
                )}
              </button>

              <span className="font-mono text-xs text-[#AAA69B]">solution.js</span>
            </div>

            <div className="flex items-center gap-0.5">
              <button type="button" onClick={handleFormatCode} className={ghostBtn} title="Format code">
                <AlignLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                <span className="hidden sm:inline">{formattedCode ? "Formatted" : "Format"}</span>
              </button>

              <button type="button" onClick={handleResetStarterCode} className={ghostBtn} title="Reset to starter code">
                <RotateCcw className="h-3.5 w-3.5 stroke-[1.5]" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button type="button" onClick={handleCopyCode} className={ghostBtn} title="Copy code">
                {copiedCode ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#34D399]" />
                    <span className="hidden sm:inline text-[#34D399]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 stroke-[1.5]" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Monaco */}
          <div className="flex-1 min-h-0 w-full relative overflow-hidden bg-[#141412]">
            <Editor
              height="100%"
              width="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorDidMount}
              theme="verifai-dark"
              options={{
                fontFamily: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 13,
                lineHeight: 22,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                bracketPairColorization: { enabled: true },
                renderLineHighlight: "line",
                lineNumbersMinChars: 3,
                padding: { top: 16, bottom: 16 },
                automaticLayout: true,
                tabSize: 2,
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                scrollbar: {
                  vertical: "auto",
                  horizontal: "auto",
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                  useShadows: false,
                },
              }}
            />

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
              activeTab={consoleTab}
              onTabChange={setConsoleTab}
              terminalLogs={terminalLogs}
              onClearTerminal={() => setTerminalLogs([])}
              onRunTerminalCommand={handleRunTerminalCommand}
              compileError={compileError}
            />
          </div>

          {/* Footer */}
          <div className="shrink-0">
            <EditorFooterBar
              cursorPosition={cursorPosition}
              isRunningTests={isRunningTests}
              isSubmitting={isSubmitting || isVerificationOpen}
              lastSavedText={`Saved ${lastSavedSecondsAgo}s ago`}
              onRunTests={handleRunTests}
              onSubmit={handleSubmitSolution}
              isConsoleOpen={isConsoleOpen}
              onToggleConsole={() => setIsConsoleOpen((prev) => !prev)}
              onOpenTerminal={() => {
                setIsConsoleOpen(true);
                setConsoleTab("terminal");
              }}
            />
          </div>
        </section>
      </div>

      {/* Floating coding companion */}
      {isCompanionVisible && <AnimatedCodeCompanion keystrokeCount={keystrokeCount} />}

      {/* Submission verification modal */}
      <VerificationModal
        isOpen={isVerificationOpen}
        submission={submissionResult}
        status={submissionResult?.status || "queued"}
        error={submissionError}
        onComplete={handleVerificationComplete}
        onCancel={() => setIsVerificationOpen(false)}
        onRetry={handleSubmitSolution}
      />

      {/* Final result modal */}
      <ResultScreenModal
        isOpen={isResultOpen}
        aiReviewData={submissionResult}
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