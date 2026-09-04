import React from "react";
import {
  FolderOpen,
  ChevronDown,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function CodeEditorShowcase() {
  return (
    <div className="relative w-full h-full flex flex-col justify-start overflow-hidden rounded-tl-[2.5rem] rounded-tr-none rounded-b-none bg-gradient-to-br from-[#3b0764] via-[#210740] to-[#0c0317] pt-6 lg:pt-7 xl:pt-8 pl-6 lg:pl-8 pr-4 pb-0 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-t border-l border-violet-500/30">
      {/* Dark Ambient Atmosphere Glows */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-purple-900/20 blur-3xl" />

      {/* Top Heading */}
      <div className="relative z-10 mb-5 shrink-0 max-w-[65%]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-400/25 text-violet-300 font-mono text-[11px] mb-2.5 backdrop-blur-sm shadow-sm">
          <Sparkles className="h-3 w-3 text-violet-400" />
          <span>VerifAI Live Sandbox Engine</span>
        </div>
        <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold font-display tracking-tight text-white leading-snug">
          Verify Real Engineering Skills
          <br />
          <span className="text-violet-300/90">With Autonomous AI Evaluation</span>
        </h2>
      </div>

      {/* Code Editor IDE Window */}
      <div className="relative z-10 w-full flex-1 flex flex-col rounded-tl-2xl rounded-tr-none rounded-b-none overflow-hidden bg-[#0d0e15] border-t border-l border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        {/* Clean, Unified Top Tab Bar (Lesser, cleaner tabs) */}
        <div className="flex items-center justify-between bg-[#131420] border-b border-[#212336] px-3 py-1.5 select-none shrink-0">
          <div className="flex items-center gap-2">
            {/* Window control dots */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            </div>

            {/* Clean, Minimalist Tabs */}
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-t bg-[#0d0e15] text-mist-100 border-t-2 border-violet-400 font-medium">
                <span className="text-[9px] bg-amber-500/90 px-1 rounded text-black font-bold">JS</span>
                <span>rate-limiter.js</span>
                <X className="h-2.5 w-2.5 text-mist-500 hover:text-white cursor-pointer ml-1" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 text-mist-400 hover:text-mist-200 cursor-pointer">
                <span className="text-[9px] bg-sky-500 px-1 rounded text-white font-bold">TS</span>
                <span>test-suite.ts</span>
                <X className="h-2.5 w-2.5 text-mist-600 hover:text-white ml-0.5" />
              </div>
            </div>
          </div>

          {/* Minimal Status Pill on the Right */}
          <div className="flex items-center gap-2 pr-2">
            <span className="flex items-center gap-1 text-[10.5px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              12/12 Tests Pass
            </span>
          </div>
        </div>

        {/* Minimal Sub-Bar: Clean breadcrumb path */}
        <div className="flex items-center gap-2 bg-[#10111a] border-b border-[#212336] px-3.5 py-1 text-[10.5px] text-mist-500 font-mono select-none shrink-0">
          <span>verifai-sandbox</span>
          <span>&gt;</span>
          <span>challenges</span>
          <span>&gt;</span>
          <span className="text-mist-300">rate-limiter.js</span>
        </div>

        {/* Editor Main Body: Clean Sidebar + Clean Inner Code */}
        <div className="flex-1 flex overflow-hidden text-xs font-mono">
          {/* Left Explorer Sidebar (Clean & Minimal) */}
          <div className="w-40 xl:w-48 border-r border-[#212336] bg-[#0c0d14] flex flex-col select-none shrink-0 overflow-hidden">
            <div className="px-3 py-2 text-[10px] text-mist-500 font-sans uppercase tracking-wider font-semibold border-b border-[#1a1b28]">
              Explorer
            </div>

            <div className="p-2 space-y-1 text-[11px] text-mist-400">
              <div className="flex items-center gap-1 text-mist-300 font-medium">
                <ChevronDown className="h-3 w-3" />
                <FolderOpen className="h-3.5 w-3.5 text-violet-400" />
                <span>challenges</span>
              </div>

              <div className="pl-4 space-y-0.5">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-violet-600/20 text-violet-200 rounded font-medium border-l-2 border-violet-400">
                  <span className="text-[8px] bg-amber-500 px-1 rounded text-black font-bold">JS</span>
                  <span className="truncate">rate-limiter.js</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-white/5 rounded text-mist-400 cursor-pointer">
                  <span className="text-[8px] bg-sky-500 px-1 rounded text-white font-bold">TS</span>
                  <span className="truncate">test-suite.ts</span>
                </div>
              </div>

              <div className="pt-1 text-mist-500 text-[10px] flex items-center gap-1.5 px-1">
                <span className="text-emerald-400">●</span>
                <span>Judge0 Sandbox Ready</span>
              </div>
            </div>
          </div>

          {/* Right Main Code Pane (Clean, Lesser, Highly Readable Code) */}
          <div className="flex-1 flex flex-col bg-[#08090f] overflow-hidden">
            <div className="flex-1 p-3.5 font-mono text-[12px] leading-[22px]">
              <div className="flex">
                {/* Clean Line Numbers */}
                <div className="select-none text-mist-700 pr-4 text-right shrink-0 w-6 space-y-0">
                  {Array.from({ length: 18 }, (_, i) => (
                    <div key={i + 1}>{i + 1}</div>
                  ))}
                </div>

                {/* Clean, Readable VerifAI Code */}
                <div className="flex-1 text-mist-200 whitespace-pre">
                  <div>
                    <span className="text-mist-500">// VerifAI Challenge · Distributed Rate Limiter</span>
                  </div>
                  <div>
                    <span className="text-pink-400">import</span> {"{"} RedisClient {"}"}{" "}
                    <span className="text-pink-400">from</span>{" "}
                    <span className="text-emerald-300">"@verifai/sandbox"</span>;
                  </div>
                  <div></div>
                  <div>
                    <span className="text-pink-400">export class</span>{" "}
                    <span className="text-amber-300 font-semibold">TokenBucketLimiter</span> {"{"}
                  </div>
                  <div className="pl-4">
                    <span className="text-violet-400">constructor</span>
                    (capacity = <span className="text-amber-300">100</span>, refillRate = <span className="text-amber-300">10</span>) {"{"}
                  </div>
                  <div className="pl-8">
                    <span className="text-pink-400">this</span>.capacity = capacity;
                  </div>
                  <div className="pl-8">
                    <span className="text-pink-400">this</span>.refillRate = refillRate; <span className="text-mist-500">// tokens/sec</span>
                  </div>
                  <div className="pl-4">{"}"}</div>
                  <div></div>
                  <div className="pl-4">
                    <span className="text-pink-400">async</span>{" "}
                    <span className="text-sky-400 font-medium">allow</span>
                    (userId, tokens = <span className="text-amber-300">1</span>) {"{"}
                  </div>
                  <div className="pl-8">
                    <span className="text-violet-400">const</span> key = <span className="text-emerald-300">`rate_limit:${"{"}userId{"}"}`</span>;
                  </div>
                  <div className="pl-8">
                    <span className="text-violet-400">const</span> remaining = <span className="text-pink-400">await</span> RedisClient.refill(key, <span className="text-pink-400">this</span>.refillRate);
                  </div>
                  <div></div>
                  <div className="pl-8">
                    <span className="text-pink-400">if</span> (remaining &gt;= tokens) {"{"}
                  </div>
                  <div className="pl-12">
                    <span className="text-pink-400">await</span> RedisClient.consume(key, tokens);
                  </div>
                  <div className="pl-12">
                    <span className="text-pink-400">return true</span>;
                  </div>
                  <div className="pl-8">{"}"}</div>
                  <div className="pl-8">
                    <span className="text-pink-400">return false</span>;
                  </div>
                  <div className="pl-4">{"}"}</div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
