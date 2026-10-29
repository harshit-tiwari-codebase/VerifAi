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
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#0B0B0A] text-[#F2EFE6] flex flex-col justify-between overflow-x-hidden font-sans">
      <div className="relative z-10 flex flex-col lg:flex-row h-full w-full lg:overflow-hidden flex-1">
        {/* =====================================================
            LEFT: AUTHENTICATION SIDE
        ====================================================== */}
        <div className="w-full lg:w-[46%] xl:w-[44%] flex flex-col justify-between px-6 py-4 sm:px-10 xl:px-12 lg:h-full lg:overflow-hidden shrink-0 bg-[#0B0B0A]">
          {/* Top Bar: VerifAI Logo & Back Link */}
          <div className="flex items-center justify-between shrink-0 pt-1">
            <Link to="/" className="group flex items-center transition-transform hover:scale-[1.02]">
              <VerifaiLogo size="md" />
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[#AAA69B] hover:text-[#F2EFE6] transition-colors group px-3 py-1.5 rounded-[10px] border border-[#30302B] hover:border-[#414139] bg-[#1C1C19]"
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#FF6A3D]/30 bg-[#261912] text-[#FFD1BB] font-mono text-xs">
                  <ArrowUpRight className="h-3 w-3 text-[#FFB08E]" />
                  <span className="uppercase tracking-wider text-[11px] font-medium">{eyebrow}</span>
                </div>
              </div>
            )}

            {title && (
              <div className="text-center mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#F2EFE6]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-1.5 text-xs sm:text-sm text-[#AAA69B] leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Main Form Content */}
            <div className="rounded-[14px] border border-[#30302B] bg-[#171714] p-6 shadow-xl shadow-black/40">
              {children}
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-2 pb-2 text-center text-xs text-[#77756D] font-sans space-y-0.5 select-none shrink-0">
            <p className="text-[#AAA69B]">
              Secured with <span className="text-[#F2EFE6] font-medium">VerifAI V8 Sandbox Runtime</span>
            </p>
            <p className="text-[11px] text-[#66645D]">
              &copy; {new Date().getFullYear()} VerifAI. All rights reserved.
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT: CODE EDITOR SHOWCASE
        ====================================================== */}
        <div className="hidden lg:flex lg:w-[54%] xl:w-[56%] pt-4 lg:pt-6 xl:pt-7 pb-0 pl-3 lg:pl-5 pr-0 h-full items-start min-h-0 overflow-hidden relative bg-[#141412]">
          <div className="w-[143%] min-w-[143%] h-[132%] min-h-[132%]">
            <CodeEditorShowcase />
          </div>
        </div>
      </div>
    </div>
  );
}
