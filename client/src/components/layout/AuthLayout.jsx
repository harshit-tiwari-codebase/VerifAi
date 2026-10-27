import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import VerifaiLogo from "../ui/VerifaiLogo.jsx";
import CodeEditorShowcase from "./CodeEditorShowcase.jsx";

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#09090B] text-[#FAFAFA] flex flex-col justify-between overflow-x-hidden font-sans">
      <div className="relative z-10 flex flex-col lg:flex-row h-full w-full lg:overflow-hidden flex-1">
        {/* =====================================================
            LEFT: AUTHENTICATION SIDE
        ====================================================== */}
        <div className="w-full lg:w-[46%] xl:w-[44%] flex flex-col justify-between px-6 py-4 sm:px-10 xl:px-12 lg:h-full lg:overflow-hidden shrink-0 bg-[#09090B]">
          {/* Top Bar: VerifAI Logo & Back Link */}
          <div className="flex items-center justify-between shrink-0 pt-1">
            <Link to="/" className="group flex items-center transition-transform hover:scale-[1.02]">
              <VerifaiLogo size="md" />
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors group px-3 py-1.5 rounded-[10px] border border-[#27272A] hover:border-[#3F3F4A] bg-[#14141B]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to home</span>
            </Link>
          </div>

          {/* Center Form Container */}
          <div className="mx-auto w-full max-w-[400px] my-auto py-4">
            {/* Optional eyebrow / title */}
            {eyebrow && (
              <div className="text-center mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#8B5CF6]/30 bg-[#211635] text-[#C4B5FD] font-mono text-xs">
                  <ArrowUpRight className="h-3 w-3 text-[#A78BFA]" />
                  <span className="uppercase tracking-wider text-[11px] font-medium">{eyebrow}</span>
                </div>
              </div>
            )}

            {title && (
              <div className="text-center mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#FAFAFA]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-1.5 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Main Form Content */}
            <div className="rounded-[14px] border border-[#27272A] bg-[#18181F] p-6 shadow-xl shadow-black/40">
              {children}
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-2 pb-2 text-center text-xs text-[#71717A] font-sans space-y-0.5 select-none shrink-0">
            <p className="text-[#A1A1AA]">
              Secured with <span className="text-[#FAFAFA] font-medium">VerifAI V8 Sandbox Runtime</span>
            </p>
            <p className="text-[11px] text-[#52525B]">
              &copy; {new Date().getFullYear()} VerifAI. All rights reserved.
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT: CODE EDITOR SHOWCASE
        ====================================================== */}
        <div className="hidden lg:flex lg:w-[54%] xl:w-[56%] pt-4 lg:pt-6 xl:pt-7 pb-0 pl-3 lg:pl-5 pr-0 h-full items-start min-h-0 overflow-hidden relative bg-[#0D0D12]">
          <div className="w-[143%] min-w-[143%] h-[132%] min-h-[132%]">
            <CodeEditorShowcase />
          </div>
        </div>
      </div>
    </div>
  );
}
