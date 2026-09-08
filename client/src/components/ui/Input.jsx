import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Input({
  label,
  id,
  type = "text",
  error,
  icon: Icon,
  className = "",
  showPasswordToggle = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="font-mono text-xs text-mist-400 font-medium flex items-center justify-between"
        >
          <span>{label}</span>
          {error && <span className="text-[11px] text-red-400 font-normal">{error}</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-mist-500">
            <Icon className="h-4 w-4" />
          </div>
        )}

        <input
          id={id}
          type={inputType}
          className={`w-full rounded-xl border bg-ink-900/90 text-sm text-mist-100 placeholder:text-mist-600 outline-none transition-all duration-200 ${
            Icon ? "pl-10" : "pl-3.5"
          } ${
            showPasswordToggle ? "pr-10" : "pr-3.5"
          } py-2.5 ${
            error
              ? "border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              : "border-ink-600 hover:border-ink-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:shadow-[0_0_20px_rgba(147,51,234,0.12)]"
          } ${className}`}
          {...props}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1 rounded-md text-mist-500 hover:text-mist-200 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
