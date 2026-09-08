import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import InteractivePlayground from "../components/landing/InteractivePlayground.jsx";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function PlaygroundPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-mist-100 selection:bg-violet-500/30 selection:text-white flex flex-col justify-between">
      <div className="relative z-10">
        <Navbar />

        <main className="container-xl py-8 sm:py-10 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/[0.08] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 font-mono text-[11px] text-violet-300">
                  Isolated V8 Engine
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] text-emerald-400">
                  0ms Cold Start
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Interactive Code Sandbox
              </h1>
              <p className="mt-1 text-xs font-mono text-mist-400 max-w-2xl">
                Test algorithms, concurrency primitives, and security patterns with live execution, AST checks, and AI architectural reviews.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                as={Link}
                to="/challenges"
                variant="verify"
                size="sm"
                className="font-sans text-xs font-medium"
              >
                Browse All Challenges →
              </Button>
            </div>
          </div>

          {/* Interactive Playground Section */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#090D17]/70 backdrop-blur-xl p-2 sm:p-6 shadow-2xl">
            <InteractivePlayground />
          </div>
        </main>
      </div>

    </div>
  );
}
