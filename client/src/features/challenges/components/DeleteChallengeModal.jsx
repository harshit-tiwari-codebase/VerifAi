import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { deleteChallenge } from "../api/challengeApi.js";
import Button from "../../../components/ui/Button.jsx";

export default function DeleteChallengeModal({
  isOpen,
  onClose,
  challenge,
  onDeleted,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

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

  if (!isOpen || !challenge) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await deleteChallenge(challenge._id);
      onDeleted();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to delete challenge. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="relative flex flex-col w-full max-w-md bg-[#0A0D15] border border-white/[0.08] rounded-2xl shadow-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertCircle className="h-5 w-5 stroke-[1.75]" />
            <h3 className="font-mono text-sm font-semibold text-mist-100">
              Confirm Deletion
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-mist-500 hover:text-mist-200 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4 stroke-[1.75]" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-xs text-mist-400 leading-relaxed font-sans">
            Permanently delete{" "}
            <span className="font-mono font-semibold text-mist-200">
              "{challenge.title}"
            </span>
            ? This action cannot be reversed.
          </p>

          {error && (
            <p className="mt-3 text-xs font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
              {error}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="font-sans text-xs font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleDelete}
            loading={loading}
            disabled={loading}
            className="font-sans text-xs font-medium"
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </div>
  );
}
