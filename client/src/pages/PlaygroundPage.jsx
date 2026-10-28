import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import InteractivePlayground from "../components/landing/InteractivePlayground.jsx";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function PlaygroundPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#09090B] text-[#FAFAFA] selection:bg-[#38245C] selection:text-[#FAFAFA] flex flex-col justify-between font-sans">
      <div className="relative z-10">
        <Navbar />

        <main className="container-xl py-8 sm:py-10 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#27272A] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full border border-[#8B5CF6]/30 bg-[#211635] px-2.5 py-0.5 font-mono text-[11px] text-[#C4B5FD]">
                  Isolated V8 Engine
                </span>
                <span className="rounded-full border border-[#34D399]/30 bg-[#34D399]/10 px-2.5 py-0.5 font-mono text-[11px] text-[#34D399]">
                  0ms Cold Start
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#FAFAFA]">
                Interactive Code Sandbox
              </h1>
              <p className="mt-1 text-xs font-mono text-[#A1A1AA] max-w-2xl">
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
          <div className="rounded-[14px] border border-[#27272A] bg-[#14141B] p-2 sm:p-6 shadow-2xl">
            <InteractivePlayground />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
