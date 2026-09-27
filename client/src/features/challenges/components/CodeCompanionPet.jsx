import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Heart, Zap, Sparkles, ChevronDown, Check, X, Trophy } from "lucide-react";

const COMPANIONS = {
  cat: {
    id: "cat",
    name: "Byte the Cat",
    tag: "Purr-fect Coder",
    avatar: "🐱",
    quotes: [
      "Purr... that syntax looks clean!",
      "Don't forget the edge cases for empty input!",
      "O(1) logic? You're a wizard.",
      "Stretch your paws for a second!",
      "I'm keeping watch while you code.",
      "That's a smooth algorithm.",
      "Stay in the zone, you got this!",
    ],
  },
  fox: {
    id: "fox",
    name: "Rusty the Fox",
    tag: "Sharp & Agile",
    avatar: "🦊",
    quotes: [
      "Clever solution! Keep typing.",
      "Mind the clock skew delta!",
      "Fast & memory efficient.",
      "You're blazing through this challenge.",
      "Clean modular functions!",
      "Ready to ace this review?",
    ],
  },
  bot: {
    id: "bot",
    name: "Bit the Bot",
    tag: "Neural Buddy",
    avatar: "🤖",
    quotes: [
      "AST syntax tree looking optimal.",
      "Zero compilation anomalies detected.",
      "Neural weights approve this logic.",
      "Buffer allocation is nominal.",
      "Keep computing, engineer.",
      "Execution readiness: 100%.",
    ],
  },
};

export default function CodeCompanionPet({
  keystrokeCount = 0,
  isTyping = false,
  isRunningTests = false,
  testsPassed = false,
}) {
  const [selectedPet, setSelectedPet] = useState("cat");
  const [speechText, setSpeechText] = useState("Ready to code with you!");
  const [showSpeech, setShowSpeech] = useState(true);
  const [petEnergy, setPetEnergy] = useState(100);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPetting, setIsPetting] = useState(false);
  const [combo, setCombo] = useState(0);

  const activePet = COMPANIONS[selectedPet] || COMPANIONS.cat;
  const lastKeyCountRef = useRef(keystrokeCount);
  const speechTimeoutRef = useRef(null);

  // Update combo & thought bubbles when user types
  useEffect(() => {
    if (keystrokeCount > lastKeyCountRef.current) {
      setCombo((prev) => prev + 1);
      lastKeyCountRef.current = keystrokeCount;

      // Random encouraging bubble every ~25 keystrokes
      if (combo > 0 && combo % 28 === 0) {
        const randomQuote =
          activePet.quotes[Math.floor(Math.random() * activePet.quotes.length)];
        setSpeechText(randomQuote);
        setShowSpeech(true);

        clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = setTimeout(() => {
          setShowSpeech(false);
        }, 4000);
      }
    }
  }, [keystrokeCount, combo, activePet]);

  // Reset combo if idle for more than 5s
  useEffect(() => {
    if (!isTyping) {
      const timer = setTimeout(() => {
        setCombo(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  // Handle test run reactions
  useEffect(() => {
    if (isRunningTests) {
      setSpeechText("Running test cases in sandbox… 🤞");
      setShowSpeech(true);
    }
  }, [isRunningTests]);

  // Handle petting interaction
  const handlePet = () => {
    setIsPetting(true);
    setPetEnergy((prev) => Math.min(100, prev + 10));
    setSpeechText("❤️ Purr! +10 Focus Energy");
    setShowSpeech(true);

    setTimeout(() => setIsPetting(false), 800);
    clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => setShowSpeech(false), 3000);
  };

  return (
    <div className="relative flex items-center select-none font-mono">
      {/* Companion Speech Bubble Floating Above */}
      {showSpeech && (
        <div className="absolute -top-11 right-0 sm:right-auto sm:left-0 z-30 pointer-events-none animate-bounce-short">
          <div className="relative px-2.5 py-1 rounded-lg bg-[#0e1017] border border-violet-500/30 text-[11px] text-violet-200 shadow-xl flex items-center gap-1.5 whitespace-nowrap">
            <span>{speechText}</span>
            {/* Bubble arrow tip */}
            <div className="absolute -bottom-1.5 left-4 w-2.5 h-2.5 bg-[#0e1017] border-b border-r border-violet-500/30 transform rotate-45" />
          </div>
        </div>
      )}

      {/* Main Companion Badge Container */}
      <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-white/[0.08] bg-[#0c0d12] hover:border-white/[0.15] transition-all">
        {/* Animated Avatar */}
        <button
          type="button"
          onClick={handlePet}
          title={`Click to pet ${activePet.name}!`}
          className={`relative text-lg cursor-pointer transform transition-transform duration-150 active:scale-125 ${
            isPetting
              ? "scale-125 rotate-6"
              : isRunningTests
              ? "animate-pulse scale-110"
              : isTyping
              ? "animate-bounce-short scale-105"
              : "hover:scale-110"
          }`}
        >
          <span>{activePet.avatar}</span>

          {/* Typing activity indicator dot */}
          {isTyping && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          )}
        </button>

        {/* Pet Name & Combo / Status */}
        <div
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex flex-col cursor-pointer leading-tight text-left"
          title="Switch Companion"
        >
          <div className="flex items-center gap-1 text-[11px] font-medium text-mist-200 hover:text-white">
            <span>{activePet.name.split(" ")[0]}</span>
            <ChevronDown className="h-2.5 w-2.5 text-mist-500" />
          </div>

          <div className="flex items-center gap-1 text-[9.5px]">
            {isRunningTests ? (
              <span className="text-amber-400 font-semibold">Testing…</span>
            ) : combo > 10 ? (
              <span className="text-violet-400 font-semibold flex items-center gap-0.5">
                🔥 {combo} streak
              </span>
            ) : isTyping ? (
              <span className="text-emerald-400">Coding…</span>
            ) : (
              <span className="text-mist-500">Chilling</span>
            )}
          </div>
        </div>
      </div>

      {/* Companion Switcher Dropdown Modal */}
      {isMenuOpen && (
        <>
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-40"
          />
          <div className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-white/[0.08] bg-[#0e1017] p-2 shadow-2xl space-y-1 animate-fade-in">
            <div className="px-2 py-1 text-[10px] text-mist-500 uppercase tracking-wider border-b border-white/[0.06] mb-1">
              Select Coding Companion
            </div>

            {Object.values(COMPANIONS).map((pet) => (
              <button
                key={pet.id}
                onClick={() => {
                  setSelectedPet(pet.id);
                  setIsMenuOpen(false);
                  setSpeechText(`Hey! ${pet.name} is ready.`);
                  setShowSpeech(true);
                  setTimeout(() => setShowSpeech(false), 3000);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                  selectedPet === pet.id
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/30 font-medium"
                    : "text-mist-300 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{pet.avatar}</span>
                  <div className="text-left">
                    <div className="text-[11.5px] leading-none">{pet.name}</div>
                    <div className="text-[9.5px] text-mist-500">{pet.tag}</div>
                  </div>
                </div>

                {selectedPet === pet.id && (
                  <Check className="h-3 w-3 text-violet-400" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
