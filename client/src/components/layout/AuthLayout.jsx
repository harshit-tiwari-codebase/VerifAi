import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import VerifaiLogo from "../ui/VerifaiLogo.jsx";
import CodeEditorShowcase from "./CodeEditorShowcase.jsx";

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden bg-[#04030a] text-mist-100 flex flex-col justify-between overflow-x-hidden">
      {/* Dark Ambient Atmosphere (Preserved background styling) */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full bg-violet-600/15 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-[38rem] w-[38rem] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute left-1/3 top-1/2 h-[32rem] w-[32rem] rounded-full bg-indigo-600/10 blur-[160px]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row h-full w-full lg:overflow-hidden flex-1">
        {/* =====================================================
            LEFT: AUTHENTICATION SIDE (Fits completely in 100vh)
        ====================================================== */}
        <div className="w-full lg:w-[46%] xl:w-[44%] flex flex-col justify-between px-6 py-4 sm:px-10 xl:px-12 lg:h-full lg:overflow-hidden shrink-0">
          {/* Top Bar: VerifAI Logo & Back Link */}
          <div className="flex items-center justify-between shrink-0 pt-1">
            <Link to="/" className="group flex items-center transition-transform hover:scale-[1.02]">
              <VerifaiLogo size="md" />
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-mist-400 hover:text-mist-100 transition-colors group px-3 py-1.5 rounded-lg border border-ink-600 hover:border-violet-500/40 bg-ink-800/40"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to home</span>
            </Link>
          </div>

          {/* Center Form Container */}
          <div className="mx-auto w-full max-w-[390px] my-auto py-2">
            {/* Optional eyebrow / title when passed from simple pages like VerifyEmail */}
            {eyebrow && (
              <div className="text-center mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 font-mono text-xs">
                  <Sparkles className="h-3 w-3" />
                  <span className="uppercase tracking-wider text-[11px]">{eyebrow}</span>
                </div>
              </div>
            )}

            {title && (
              <div className="text-center mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-mist-100">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-1 text-xs sm:text-sm text-mist-400 leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Main Form Content */}
            {children}
          </div>

          {/* Bottom Footer matching the screenshot */}
          <div className="pt-2 pb-2 text-center text-xs text-mist-500 font-sans space-y-0.5 select-none shrink-0">
            <p className="text-mist-400">
              Powered by <span className="text-mist-200 font-medium">VerifAI Code Editor</span>
            </p>
            <p className="text-[11px] text-mist-600">
              &copy; {new Date().getFullYear()} VerifAI. All rights reserved.
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT: VERIFAI AI CODE EDITOR SHOWCASE
            (70% visible, 30% hidden on right AND hidden from bottom too)
        ====================================================== */}
        <div className="hidden lg:flex lg:w-[54%] xl:w-[56%] pt-4 lg:pt-6 xl:pt-7 pb-0 pl-3 lg:pl-5 pr-0 h-full items-start min-h-0 overflow-hidden relative">
          {/* Sized to 143% width (30% hidden on right) and 132% height (30% hidden on bottom) */}
          <div className="w-[143%] min-w-[143%] h-[132%] min-h-[132%]">
            <CodeEditorShowcase />
          </div>
        </div>
      </div>
    </div>
  );
}