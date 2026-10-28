import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Zap, Sparkles, Volume2, VolumeX, Eye, EyeOff } from "lucide-react";

const PET_TYPES = [
  {
    id: "cat",
    name: "Byte",
    species: "Cat",
    icon: "🐱",
    paws: "🐾",
    runSpeed: 4,
    sleepEmoji: "💤",
    catchPhrases: [
      "Purrfect syntax!",
      "Squashed a bug!",
      "O(1) sprint!",
      "You're on fire!",
    ],
  },
  {
    id: "fox",
    name: "Rusty",
    species: "Fox",
    icon: "🦊",
    paws: "🐾",
    runSpeed: 5,
    sleepEmoji: "🍂",
    catchPhrases: [
      "Fast & nimble!",
      "Clean algorithms!",
      "Sprint mode ON!",
      "Pounced on edge case!",
    ],
  },
  {
    id: "dog",
    name: "Rex",
    species: "Doggo",
    icon: "🐶",
    paws: "🐾",
    runSpeed: 4.5,
    sleepEmoji: "🦴",
    catchPhrases: [
      "Good code! Fetching pass!",
      "Tail wagging fast!",
      "Best developer ever!",
      "10/10 logic!",
    ],
  },
  {
    id: "duck",
    name: "Ducky",
    species: "Rubber Duck",
    icon: "🦆",
    paws: "🌊",
    runSpeed: 3.5,
    sleepEmoji: "🫧",
    catchPhrases: [
      "Quack! Explain it to me!",
      "Debugging in motion!",
      "Smooth quack flow!",
      "No bugs allowed!",
    ],
  },
  {
    id: "crab",
    name: "Ferris",
    species: "Crab",
    icon: "🦀",
    paws: "🫧",
    runSpeed: 4.2,
    sleepEmoji: "🐚",
    catchPhrases: [
      "Snip snip! Zero errors!",
      "Memory safe & sound!",
      "Sideways zoomies!",
      "Rock solid logic!",
    ],
  },
  {
    id: "bot",
    name: "Bit",
    species: "Bot",
    icon: "🤖",
    paws: "⚡",
    runSpeed: 4.8,
    sleepEmoji: "🔋",
    catchPhrases: [
      "CPU cycle optimal.",
      "Buffer clear!",
      "Binary flow at 100%",
      "Compilation clean!",
    ],
  },
];

export default function WorkspacePetRunner({
  isTyping = false,
  keystrokeCount = 0,
  isRunningTests = false,
}) {
  const [petId, setPetId] = useState("cat");
  const [posX, setPosX] = useState(40); // percentage 0 - 95
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [isSleeping, setIsSleeping] = useState(false);
  const [speech, setSpeech] = useState(null);
  const [isJumping, setIsJumping] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [bugsSquashed, setBugsSquashed] = useState(0);

  // Target item on the track to catch (bug / coffee / token)
  const [targetItem, setTargetItem] = useState({ x: 75, icon: "🐛", id: 1 });
  const [floatingPoints, setFloatingPoints] = useState([]);

  const activePet = PET_TYPES.find((p) => p.id === petId) || PET_TYPES[0];
  const lastKeyCount = useRef(keystrokeCount);
  const trackRef = useRef(null);

  // Animation frame loop for running movement when typing
  useEffect(() => {
    if (!isVisible) return;

    let animId;
    let lastTime = performance.now();

    const loop = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isTyping || isRunningTests) {
        setIsSleeping(false);
        setPosX((prev) => {
          const speed = (isRunningTests ? activePet.runSpeed * 1.6 : activePet.runSpeed) * 4.5;
          let next = prev + direction * speed * delta;

          // Hit boundaries -> Turn around
          if (next >= 92) {
            next = 92;
            setDirection(-1);
          } else if (next <= 3) {
            next = 3;
            setDirection(1);
          }

          // Check if caught target item
          if (Math.abs(next - targetItem.x) < 3.5) {
            // Squashed target item!
            setBugsSquashed((b) => b + 1);
            setFloatingPoints((fp) => [
              ...fp,
              {
                id: Date.now(),
                x: next,
                text: `+10 ${targetItem.icon}`,
              },
            ]);

            // Spawn next target on opposite side
            const nextTargetX = next < 50 ? Math.random() * 35 + 55 : Math.random() * 35 + 8;
            const itemIcons = ["🐛", "☕", "🪙", "⚡", "🍪"];
            const nextIcon = itemIcons[Math.floor(Math.random() * itemIcons.length)];
            setTargetItem({ x: nextTargetX, icon: nextIcon, id: Date.now() });

            // Trigger quick reaction
            setSpeech(activePet.catchPhrases[Math.floor(Math.random() * activePet.catchPhrases.length)]);
            setTimeout(() => setSpeech(null), 2500);
          }

          return next;
        });
      } else {
        // Idle: after 3 seconds of no typing, go to sleep
        const sleepTimer = setTimeout(() => {
          setIsSleeping(true);
        }, 2800);
        return () => clearTimeout(sleepTimer);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isTyping, isRunningTests, direction, activePet, targetItem, isVisible]);

  // Handle jump & petting
  const handlePetClick = () => {
    setIsJumping(true);
    setIsSleeping(false);
    setSpeech(`❤️ ${activePet.name} loves your code!`);
    setTimeout(() => setIsJumping(false), 600);
    setTimeout(() => setSpeech(null), 3000);
  };

  // Clean floating points
  useEffect(() => {
    if (floatingPoints.length > 0) {
      const timer = setTimeout(() => {
        setFloatingPoints((prev) => prev.slice(1));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [floatingPoints]);

  if (!isVisible) {
    return (
      <div className="flex items-center justify-end px-3 py-1 bg-[#090b10] border-t border-white/[0.05] text-[10.5px] font-mono select-none">
        <button
          type="button"
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-1.5 text-mist-500 hover:text-mist-200 transition-colors"
        >
          <span>{activePet.icon}</span>
          <span>Show Coding Companion</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-8 bg-[#08090e] border-t border-white/[0.06] select-none font-mono flex items-center overflow-hidden shrink-0">
      {/* Running Track Lane */}
      <div ref={trackRef} className="relative w-full h-full flex items-center px-4">
        {/* Subtle dashed runner guide line */}
        <div className="absolute inset-x-4 top-1/2 h-[1px] border-b border-dashed border-white/[0.06] -translate-y-1/2" />

        {/* Target Item (e.g. Bug to squash) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 text-sm transition-all duration-300 transform hover:scale-125"
          style={{ left: `${targetItem.x}%` }}
        >
          <span className="inline-block animate-bounce">{targetItem.icon}</span>
        </div>

        {/* Floating "+10" points particles */}
        {floatingPoints.map((fp) => (
          <div
            key={fp.id}
            className="absolute top-0 text-[10px] font-bold text-violet-300 animate-fade-in-up pointer-events-none whitespace-nowrap z-20"
            style={{ left: `${fp.x}%` }}
          >
            {fp.text}
          </div>
        ))}

        {/* Animated Pet Runner */}
        <div
          className="absolute top-1/2 -translate-y-1/2 z-10 transition-transform duration-75 cursor-pointer flex flex-col items-center"
          style={{
            left: `${posX}%`,
            transform: `translate(-50%, -50%) ${direction < 0 ? "scaleX(-1)" : "scaleX(1)"}`,
          }}
          onClick={handlePetClick}
          title={`Click to pet ${activePet.name}! (${bugsSquashed} bugs caught)`}
        >
          {/* Speech bubble */}
          {speech && (
            <div
              className={`absolute -top-7 whitespace-nowrap px-2 py-0.5 rounded bg-[#10131e] border border-violet-500/40 text-[10px] text-violet-200 shadow-xl pointer-events-none ${
                direction < 0 ? "scale-x-[-1]" : ""
              }`}
            >
              {speech}
            </div>
          )}

          {/* Avatar Sprite */}
          <div
            className={`text-lg transition-transform duration-150 ${
              isJumping
                ? "animate-bounce scale-125"
                : isTyping || isRunningTests
                ? "animate-bounce-short scale-110"
                : isSleeping
                ? "scale-95 opacity-80"
                : "scale-100"
            }`}
          >
            <span>{activePet.icon}</span>
            {isSleeping && (
              <span className="absolute -top-2 -right-2 text-[9px] text-mist-500 animate-pulse">
                {activePet.sleepEmoji}
              </span>
            )}
          </div>
        </div>

        {/* Status Chip / Pet Selector on Right side */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-20 bg-[#08090e]/90 pl-3">
          {/* Score Counter */}
          {bugsSquashed > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-violet-300 px-1.5 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">
              <span>{bugsSquashed} caught</span>
            </span>
          )}

          {/* Switch Pet Button */}
          <button
            type="button"
            onClick={() => setIsPickerOpen((prev) => !prev)}
            className="flex items-center gap-1 text-[10.5px] text-mist-400 hover:text-mist-200 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] transition-colors"
            title="Change Companion"
          >
            <span>{activePet.icon}</span>
            <span className="hidden sm:inline">{activePet.name}</span>
            <ChevronDown className="h-2.5 w-2.5" />
          </button>

          {/* Hide button */}
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1 text-mist-600 hover:text-mist-400 transition-colors"
            title="Minimize companion track"
          >
            <EyeOff className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Pet Selection Dropdown Modal */}
      {isPickerOpen && (
        <>
          <div
            onClick={() => setIsPickerOpen(false)}
            className="fixed inset-0 z-40"
          />
          <div className="absolute right-3 bottom-9 z-50 w-48 rounded-xl border border-white/[0.08] bg-[#0c0d14] p-1.5 shadow-2xl space-y-1 animate-fade-in text-xs font-mono">
            <div className="px-2 py-1 text-[9.5px] text-mist-500 uppercase tracking-wider border-b border-white/[0.06]">
              Choose Workspace Buddy
            </div>

            {PET_TYPES.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPetId(p.id);
                  setIsPickerOpen(false);
                  setSpeech(`${p.name} joined the track!`);
                  setTimeout(() => setSpeech(null), 2500);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                  petId === p.id
                    ? "bg-violet-500/15 text-violet-300 border border-violet-500/30"
                    : "text-mist-300 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{p.icon}</span>
                  <span>{p.name}</span>
                </div>
                {petId === p.id && <Check className="h-3 w-3 text-violet-400" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
