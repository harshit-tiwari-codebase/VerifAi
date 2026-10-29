import React from "react";
import {
  FolderOpen,
  ChevronDown,
  X,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export default function CodeEditorShowcase() {
  return (
    <div className="relative w-full h-full flex flex-col justify-start overflow-hidden rounded-tl-[2rem] rounded-tr-none rounded-b-none bg-[#0B0B0A] pt-6 lg:pt-7 xl:pt-8 pl-6 lg:pl-8 pr-4 pb-0 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-t border-l border-[#30302B]">
      {/* Top Heading */}
      <div className="relative z-10 mb-5 shrink-0 max-w-[65%]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#261912] border border-[#FF6A3D]/30 text-[#FFD1BB] font-mono text-[11px] mb-2.5 backdrop-blur-sm shadow-sm">
          <ArrowUpRight className="h-3 w-3 text-[#FFB08E]" />
          <span>VerifAI Sandbox Engine</span>
        </div>
        <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold font-display tracking-tight text-[#F2EFE6] leading-snug">
          Verify Real Engineering Skills
          <br />
          <span className="text-[#FFB08E]">With Autonomous AI Evaluation</span>
        </h2>
      </div>

      {/* Code Editor IDE Window */}
      <div className="relative z-10 w-full flex-1 flex flex-col rounded-tl-2xl rounded-tr-none rounded-b-none overflow-hidden bg-[#141412] border-t border-l border-[#30302B] shadow-2xl">
        {/* Top Tab Bar */}
        <div className="flex items-center justify-between bg-[#1C1C19] border-b border-[#30302B] px-3 py-1.5 select-none shrink-0">
          <div className="flex items-center gap-2">
            {/* Window control dots */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#34D399]" />
            </div>

            {/* Editor Tabs */}
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-t bg-[#141412] text-[#F2EFE6] border-t-2 border-[#FF6A3D] font-medium border-x border-[#30302B]">
                <span className="text-[9px] bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/30 px-1 rounded font-bold">JS</span>
                <span>rate-limiter.js</span>
                <X className="h-2.5 w-2.5 text-[#77756D] hover:text-[#F2EFE6] cursor-pointer ml-1" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 text-[#AAA69B] hover:text-[#F2EFE6] cursor-pointer">
                <span className="text-[9px] bg-[#60A5FA]/20 text-[#60A5FA] border border-[#60A5FA]/30 px-1 rounded font-bold">TS</span>
                <span>test-suite.ts</span>
                <X className="h-2.5 w-2.5 text-[#66645D] hover:text-[#F2EFE6] ml-0.5" />
              </div>
            </div>
          </div>

          {/* Status Pill */}
          <div className="flex items-center gap-2 pr-2">
            <span className="flex items-center gap-1 text-[10.5px] font-mono text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded border border-[#34D399]/25">
              <CheckCircle2 className="h-3 w-3" />
              12/12 Tests Pass
            </span>
          </div>
        </div>

        {/* Sub-Bar: Breadcrumb path */}
        <div className="flex items-center gap-2 bg-[#171714] border-b border-[#30302B] px-3.5 py-1 text-[10.5px] text-[#77756D] font-mono select-none shrink-0">
          <span>verifai-sandbox</span>
          <span>&gt;</span>
          <span>challenges</span>
          <span>&gt;</span>
          <span className="text-[#AAA69B]">rate-limiter.js</span>
        </div>

        {/* Editor Main Body */}
        <div className="flex-1 flex overflow-hidden text-xs font-mono">
          {/* Left Explorer Sidebar */}
          <div className="w-40 xl:w-48 border-r border-[#30302B] bg-[#171714] flex flex-col select-none shrink-0 overflow-hidden">
            <div className="px-3 py-2 text-[10px] text-[#77756D] font-sans uppercase tracking-wider font-semibold border-b border-[#30302B]">
              Explorer
            </div>

            <div className="p-2 space-y-1 text-[11px] text-[#AAA69B]">
              <div className="flex items-center gap-1 text-[#F2EFE6] font-medium">
                <ChevronDown className="h-3 w-3" />
                <FolderOpen className="h-3.5 w-3.5 text-[#FF6A3D]" />
                <span>challenges</span>
              </div>

              <div className="pl-4 space-y-0.5">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[#261912] text-[#FFD1BB] rounded font-medium border-l-2 border-[#FF6A3D]">
                  <span className="text-[8px] bg-[#FBBF24]/20 text-[#FBBF24] px-1 rounded font-bold">JS</span>
                  <span className="truncate">rate-limiter.js</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-[#22221E] rounded text-[#AAA69B] cursor-pointer">
                  <span className="text-[8px] bg-[#60A5FA]/20 text-[#60A5FA] px-1 rounded font-bold">TS</span>
                  <span className="truncate">test-suite.ts</span>
                </div>
              </div>

              <div className="pt-2 text-[#77756D] text-[10px] flex items-center gap-1.5 px-1 border-t border-[#30302B] mt-2">
                <span className="text-[#34D399]">●</span>
                <span>Isolated V8 Ready</span>
              </div>
            </div>
          </div>

          {/* Right Main Code Pane with exact specified syntax colors */}
          <div className="flex-1 flex flex-col bg-[#141412] overflow-hidden">
            <div className="flex-1 p-3.5 font-mono text-[12px] leading-[22px]">
              <div className="flex">
                {/* Line Numbers: #666675 */}
                <div className="select-none text-[#666675] pr-4 text-right shrink-0 w-6 space-y-0">
                  {Array.from({ length: 18 }, (_, i) => (
                    <div key={i + 1} className={i + 1 === 10 ? "text-[#FFD1BB] font-semibold" : ""}>{i + 1}</div>
                  ))}
                </div>

                {/* Syntax colors: keywords #FF9B66, strings #A7F3D0, functions #93C5FD, variables #E4E0D5, numbers #FBBF24, comments #858592, operators #F0ABFC */}
                <div className="flex-1 text-[#E4E0D5] whitespace-pre">
                  <div>
                    <span className="text-[#858592]">// VerifAI Challenge · Distributed Rate Limiter</span>
                  </div>
                  <div>
                    <span className="text-[#FF9B66]">import</span> {"{"} RedisClient {"}"}{" "}
                    <span className="text-[#FF9B66]">from</span>{" "}
                    <span className="text-[#A7F3D0]">"@verifai/sandbox"</span>;
                  </div>
                  <div></div>
                  <div>
                    <span className="text-[#FF9B66]">export class</span>{" "}
                    <span className="text-[#93C5FD] font-semibold">TokenBucketLimiter</span> {"{"}
                  </div>
                  <div className="pl-4">
                    <span className="text-[#93C5FD]">constructor</span>
                    (capacity <span className="text-[#F0ABFC]">=</span> <span className="text-[#FBBF24]">100</span>, refillRate <span className="text-[#F0ABFC]">=</span> <span className="text-[#FBBF24]">10</span>) {"{"}
                  </div>
                  <div className="pl-8">
                    <span className="text-[#FF9B66]">this</span>.capacity <span className="text-[#F0ABFC]">=</span> capacity;
                  </div>
                  <div className="pl-8">
                    <span className="text-[#FF9B66]">this</span>.refillRate <span className="text-[#F0ABFC]">=</span> refillRate; <span className="text-[#858592]">// tokens/sec</span>
                  </div>
                  <div className="pl-4">{"}"}</div>
                  <div></div>
                  <div className="pl-4 bg-[#191522] -mx-3.5 px-3.5 rounded">
                    <span className="text-[#FF9B66]">async</span>{" "}
                    <span className="text-[#93C5FD] font-medium">allow</span>
                    (userId, tokens <span className="text-[#F0ABFC]">=</span> <span className="text-[#FBBF24]">1</span>) {"{"}
                  </div>
                  <div className="pl-8">
                    <span className="text-[#FF9B66]">const</span> key <span className="text-[#F0ABFC]">=</span> <span className="text-[#A7F3D0]">`rate_limit:${"{"}userId{"}"}`</span>;
                  </div>
                  <div className="pl-8">
                    <span className="text-[#FF9B66]">const</span> remaining <span className="text-[#F0ABFC]">=</span> <span className="text-[#FF9B66]">await</span> RedisClient.<span className="text-[#93C5FD]">refill</span>(key, <span className="text-[#FF9B66]">this</span>.refillRate);
                  </div>
                  <div></div>
                  <div className="pl-8">
                    <span className="text-[#FF9B66]">if</span> (remaining <span className="text-[#F0ABFC]">&gt;=</span> tokens) {"{"}
                  </div>
                  <div className="pl-12">
                    <span className="text-[#FF9B66]">await</span> RedisClient.<span className="text-[#93C5FD]">consume</span>(key, tokens);
                  </div>
                  <div className="pl-12">
                    <span className="text-[#FF9B66]">return true</span>;
                  </div>
                  <div className="pl-8">{"}"}</div>
                  <div className="pl-8">
                    <span className="text-[#FF9B66]">return false</span>;
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
