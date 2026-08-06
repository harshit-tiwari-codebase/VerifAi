export default function Input({ label, id, error, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="font-mono text-xs text-mist-500">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`rounded-lg border bg-ink-900 px-3.5 py-2.5 text-sm text-mist-100 placeholder:text-mist-700 outline-none transition-colors focus:border-verify ${
          error ? "border-flag" : "border-ink-500"
        } ${className}`}
        {...props}
      />
      {error && <p className="font-mono text-xs text-flag">{error}</p>}
    </div>
  );
}
