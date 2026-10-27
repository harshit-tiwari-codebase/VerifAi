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
          className="font-mono text-xs text-[#A1A1AA] font-medium flex items-center justify-between"
        >
          <span>{label}</span>
          {error && <span className="text-[11px] text-[#F87171] font-normal">{error}</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-[#71717A]">
            <Icon className="h-4 w-4" />
          </div>
        )}

        <input
          id={id}
          type={inputType}
          className={`w-full rounded-[10px] border bg-[#111116] text-sm text-[#FAFAFA] placeholder:text-[#71717A] outline-none transition-all duration-150 ${
            Icon ? "pl-10" : "pl-3.5"
          } ${
            showPasswordToggle ? "pr-10" : "pr-3.5"
          } py-2.5 ${
            error
              ? "border-[#F87171] focus:border-[#F87171] focus:ring-1 focus:ring-[#F87171]/30"
              : "border-[#27272A] hover:border-[#3F3F4A] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/30"
          } ${className}`}
          {...props}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 p-1 rounded-md text-[#71717A] hover:text-[#FAFAFA] transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
