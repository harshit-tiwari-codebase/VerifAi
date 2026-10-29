import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import InteractivePlayground from "../components/landing/InteractivePlayground.jsx";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0A] text-[#F2EFE6] selection:bg-[#422316] selection:text-[#F2EFE6] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <div className="border-b border-[#30302B] bg-[#0B0B0A]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77756D] mb-3">
                  Interactive Sandbox
                </p>
                <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#F2EFE6]">
                  Code Playground
                </h1>
                <p className="mt-2 text-sm font-sans text-[#77756D] max-w-xl">
                  Test real backend algorithms — rate limiters, distributed locks, auth flows — with live Judge0 execution and AI architectural scoring.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-[4px] border border-[#4FBF94]/25 bg-[#4FBF94]/8 text-[#4FBF94]">
                  V8 Isolated
                </span>
                <Button
                  as={Link}
                  to="/challenges"
                  variant="verify"
                  size="sm"
                >
                  Browse All Challenges →
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Playground Component */}
        <InteractivePlayground />
      </main>

      <Footer />
    </div>
  );
}
