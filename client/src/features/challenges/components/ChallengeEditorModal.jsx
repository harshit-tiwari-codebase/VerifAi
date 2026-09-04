import { useEffect, useState } from "react";
import { X, Plus, Trash2, AlertCircle } from "lucide-react";
import { createChallenge, updateChallenge } from "../api/challengeApi.js";
import Button from "../../../components/ui/Button.jsx";
import { ModernCodeIcon } from "../../../components/ui/Icons.jsx";

const CATEGORIES = [
  { value: "dsa", label: "DSA (Algorithms & Data Structures)" },
  { value: "bug-fix", label: "Bug Fix & Refactoring" },
  { value: "api-design", label: "API Design & Concurrency" },
  { value: "schema-modeling", label: "Schema Modeling & DBs" },
  { value: "system-design", label: "System Design & Architecture" },
  { value: "debugging", label: "Performance Debugging" },
];

const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function ChallengeEditorModal({
  isOpen,
  onClose,
  challengeToEdit = null,
  onSaved,
}) {
  const isEditing = Boolean(challengeToEdit?._id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [category, setCategory] = useState("dsa");
  const [executionType, setExecutionType] = useState("testcases");
  const [tagsInput, setTagsInput] = useState("");
  const [starterCode, setStarterCode] = useState("");
  const [evaluationCriteria, setEvaluationCriteria] = useState("");
  const [referenceSolution, setReferenceSolution] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [testCases, setTestCases] = useState([
    { input: "", expectedOutput: "", isHidden: false },
  ]);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (challengeToEdit) {
      setTitle(challengeToEdit.title || "");
      setDescription(challengeToEdit.description || "");
      setDifficulty(challengeToEdit.difficulty || "easy");
      setCategory(challengeToEdit.category || "dsa");
      setExecutionType(challengeToEdit.executionType || "testcases");
      setTagsInput(challengeToEdit.tags ? challengeToEdit.tags.join(", ") : "");
      setStarterCode(challengeToEdit.starterCode || "");
      setEvaluationCriteria(challengeToEdit.evaluationCriteria || "");
      setReferenceSolution(challengeToEdit.referenceSolution || "");
      setIsPublished(challengeToEdit.isPublished ?? true);

      if (
        challengeToEdit.testCases &&
        Array.isArray(challengeToEdit.testCases) &&
        challengeToEdit.testCases.length > 0
      ) {
        setTestCases(
          challengeToEdit.testCases.map((tc) => ({
            input: tc.input || "",
            expectedOutput: tc.expectedOutput || "",
            isHidden: Boolean(tc.isHidden),
          }))
        );
      } else {
        setTestCases([{ input: "", expectedOutput: "", isHidden: false }]);
      }
    } else {
      setTitle("");
      setDescription("");
      setDifficulty("easy");
      setCategory("dsa");
      setExecutionType("testcases");
      setTagsInput("");
      setStarterCode("// Export function or template solution\n");
      setEvaluationCriteria("");
      setReferenceSolution("");
      setIsPublished(true);
      setTestCases([{ input: "", expectedOutput: "", isHidden: false }]);
    }

    setFormError("");
  }, [isOpen, challengeToEdit]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "", isHidden: false }]);
  };

  const handleRemoveTestCase = (index) => {
    if (testCases.length <= 1) return;
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!description.trim()) {
      setFormError("Description is required.");
      return;
    }

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      category,
      executionType,
      tags: parsedTags,
      starterCode,
      referenceSolution,
      isPublished,
    };

    if (executionType === "testcases") {
      const validTestCases = testCases.filter((tc) => tc.expectedOutput.trim() !== "");
      if (validTestCases.length === 0) {
        setFormError("At least one testcase with expected output is required.");
        return;
      }
      payload.testCases = validTestCases.map((tc) => ({
        input: tc.input.trim(),
        expectedOutput: tc.expectedOutput.trim(),
        isHidden: tc.isHidden,
      }));
    } else {
      if (!evaluationCriteria.trim()) {
        setFormError("Evaluation criteria is required for 'review_only' challenges.");
        return;
      }
      payload.evaluationCriteria = evaluationCriteria.trim();
    }

    setLoading(true);
    try {
      if (isEditing) {
        await updateChallenge(challengeToEdit._id, payload);
      } else {
        await createChallenge(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setFormError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.msg ||
          "Failed to save challenge."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="relative flex flex-col w-full max-w-3xl h-[90vh] max-h-[850px] bg-[#0A0D15] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#07090F]">
          <div className="flex items-center gap-2">
            <ModernCodeIcon className="h-4 w-4 text-violet-400" />
            <span className="font-mono text-sm font-semibold text-mist-100">
              {isEditing ? "Edit Challenge Specification" : "Author New Challenge"}
            </span>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-mist-500 hover:text-mist-200 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4 stroke-[1.75]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {formError && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-mono text-rose-300">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 stroke-[1.75]" />
                <span>{formError}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-mono text-mist-400 mb-1.5">
                Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Token Bucket Rate Limiter"
                className="w-full rounded-lg border border-white/[0.07] bg-[#070A10] px-3.5 py-2 text-sm text-mist-100 placeholder:text-mist-600 focus:border-violet-500/80 focus:outline-none"
                required
              />
            </div>

            {/* Difficulty, Category, Execution Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono text-mist-400 mb-1.5">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.07] bg-[#070A10] px-3 py-2 text-xs text-mist-200 focus:border-violet-500/80 focus:outline-none capitalize"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-mist-400 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.07] bg-[#070A10] px-3 py-2 text-xs text-mist-200 focus:border-violet-500/80 focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-mist-400 mb-1.5">Execution Type</label>
                <select
                  value={executionType}
                  onChange={(e) => setExecutionType(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.07] bg-[#070A10] px-3 py-2 text-xs text-mist-200 focus:border-violet-500/80 focus:outline-none"
                >
                  <option value="testcases">Automated Tests</option>
                  <option value="review_only">AI Review Rubric</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono text-mist-400 mb-1.5">
                Description & Constraints <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the problem statement, edge cases, and architectural constraints..."
                className="w-full rounded-lg border border-white/[0.07] bg-[#070A10] p-3 text-xs text-mist-200 placeholder:text-mist-600 focus:border-violet-500/80 focus:outline-none"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-mono text-mist-400 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="redis, concurrency, rate-limiting, algorithms"
                className="w-full rounded-lg border border-white/[0.07] bg-[#070A10] px-3.5 py-2 text-xs text-mist-200 placeholder:text-mist-600 focus:border-violet-500/80 focus:outline-none"
              />
            </div>

            {/* Starter Code */}
            <div>
              <label className="block text-xs font-mono text-mist-400 mb-1.5">
                Starter Code Template
              </label>
              <textarea
                rows={4}
                value={starterCode}
                onChange={(e) => setStarterCode(e.target.value)}
                className="w-full rounded-lg border border-white/[0.07] bg-[#05070B] p-3 font-mono text-xs text-mist-200 focus:border-violet-500/80 focus:outline-none"
                spellCheck="false"
              />
            </div>

            {/* Test cases builder */}
            {executionType === "testcases" ? (
              <div className="rounded-xl border border-white/[0.06] bg-[#070A10] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-mist-400">
                    Test Cases ({testCases.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddTestCase}
                    className="inline-flex items-center gap-1 rounded border border-white/[0.08] bg-[#0C101A] px-2.5 py-1 text-xs font-mono text-mist-300 hover:text-white transition-colors"
                  >
                    <Plus className="h-3 w-3 stroke-[2]" />
                    Add Case
                  </button>
                </div>

                <div className="space-y-2.5">
                  {testCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-white/[0.06] bg-[#0B0F19] p-3 text-xs font-mono space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-violet-400 font-semibold text-[11px]">
                          CASE #{idx + 1}
                        </span>
                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center gap-1.5 text-[11px] text-mist-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tc.isHidden}
                              onChange={(e) =>
                                handleTestCaseChange(idx, "isHidden", e.target.checked)
                              }
                              className="rounded border-white/20 text-violet-600 focus:ring-0"
                            />
                            <span>Hidden test</span>
                          </label>
                          {testCases.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveTestCase(idx)}
                              className="text-mist-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="h-3 w-3 stroke-[1.5]" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <input
                            type="text"
                            value={tc.input}
                            onChange={(e) => handleTestCaseChange(idx, "input", e.target.value)}
                            placeholder="Input: e.g. [2, 7, 11, 15], 9"
                            className="w-full rounded border border-white/[0.06] bg-[#05070B] px-2.5 py-1 text-xs text-mist-200 focus:outline-none focus:border-violet-500"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={tc.expectedOutput}
                            onChange={(e) =>
                              handleTestCaseChange(idx, "expectedOutput", e.target.value)
                            }
                            placeholder="Expected output: e.g. [0, 1]"
                            className="w-full rounded border border-white/[0.06] bg-[#05070B] px-2.5 py-1 text-xs text-mist-200 focus:outline-none focus:border-violet-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-mono text-mist-400 mb-1.5">
                  AI Evaluation Criteria <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={evaluationCriteria}
                  onChange={(e) => setEvaluationCriteria(e.target.value)}
                  placeholder="Rules for the AI architectural review..."
                  className="w-full rounded-lg border border-white/[0.07] bg-[#070A10] p-3 text-xs text-mist-200 focus:border-violet-500/80 focus:outline-none"
                  required
                />
              </div>
            )}

            {/* Reference Solution */}
            <div>
              <label className="block text-xs font-mono text-mist-400 mb-1.5">
                Staff Reference Solution (Confidential)
              </label>
              <textarea
                rows={3}
                value={referenceSolution}
                onChange={(e) => setReferenceSolution(e.target.value)}
                placeholder="// Hidden staff benchmark solution"
                className="w-full rounded-lg border border-white/[0.07] bg-[#05070B] p-3 font-mono text-xs text-mist-300 focus:border-violet-500/80 focus:outline-none"
                spellCheck="false"
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublishedCheck"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded border-white/20 text-violet-600 focus:ring-0"
              />
              <label htmlFor="isPublishedCheck" className="text-xs font-mono text-mist-400 cursor-pointer">
                Publish immediately (if unchecked, saved as draft)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-white/[0.08] bg-[#07090F]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
              className="font-mono text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="verify"
              size="sm"
              disabled={loading}
              className="purple-glow font-mono text-xs"
            >
              {loading ? "Saving..." : isEditing ? "Update Challenge" : "Publish Challenge"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
