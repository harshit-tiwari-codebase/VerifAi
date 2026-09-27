/**
 * AnimatedCodeCompanion — Free-floating Draggable AI Coding Companion
 *
 * Features:
 *   - 🖱️ Fully draggable anywhere on screen with mouse (like moving a file/desktop widget)
 *   - 📍 Remembers dragged position via state & optional localStorage
 *   - 🧠 Smart speech bubble positioning based on screen position
 *   - 💤 Idle / Typing frenzy / Sleeping animations
 *   - ✨ Orbiting sparks, Zzz clouds, typing streak meter
 *   - 🤏 Double-click or click "hide" to minimize into a draggable pill
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   Keyframe CSS — injected once into <head>
───────────────────────────────────────────── */
const STYLE_ID = "verifai-draggable-ghost-styles";

function injectStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.textContent = `
    @keyframes ghost-float {
      0%, 100% { transform: translateY(0px) rotate(-1deg); }
      50%       { transform: translateY(-7px) rotate(1deg); }
    }
    @keyframes ghost-zap {
      0%   { transform: translateX(0)   rotate(-3deg) scale(1.05); }
      20%  { transform: translateX(-4px) rotate(4deg) scale(1.08); }
      40%  { transform: translateX(4px)  rotate(-5deg) scale(1.05); }
      60%  { transform: translateX(-3px) rotate(3deg) scale(1.08); }
      80%  { transform: translateX(3px)  rotate(-3deg) scale(1.05); }
      100% { transform: translateX(0)   rotate(0deg) scale(1); }
    }
    @keyframes ghost-sleep {
      0%, 100% { transform: translateY(0px) scale(0.97); opacity: 0.75; }
      50%       { transform: translateY(3px)  scale(1);    opacity: 1; }
    }
    @keyframes blink {
      0%, 90%, 100% { transform: scaleY(1); }
      95%           { transform: scaleY(0.05); }
    }
    @keyframes zap-flicker {
      0%, 100% { opacity: 1; }
      30%      { opacity: 0.3; }
      60%      { opacity: 0.8; }
    }
    @keyframes zzz-float {
      0%   { opacity: 0; transform: translateY(0) scale(0.7); }
      30%  { opacity: 1; }
      100% { opacity: 0; transform: translateY(-18px) scale(1.1); }
    }
    @keyframes bubble-pop {
      0%   { opacity: 0; transform: scale(0.85) translateY(4px); }
      60%  { transform: scale(1.02) translateY(-1px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes orbit {
      from { transform: rotate(0deg) translateX(22px) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(22px) rotate(-360deg); }
    }
    @keyframes orbit-fast {
      from { transform: rotate(0deg) translateX(24px) rotate(0deg); }
      to   { transform: rotate(360deg) translateX(24px) rotate(-360deg); }
    }
    @keyframes pill-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.35); }
      50%       { box-shadow: 0 0 0 5px rgba(139,92,246,0); }
    }
  `;
  document.head.appendChild(tag);
}

/* ─────────────────────────────────────────────
   Ghost SVG — compact & crisp
───────────────────────────────────────────── */
function GhostSVG({ mood }) {
  const isTyping = mood === "typing";
  const isSleep  = mood === "sleeping";

  return (
    <svg
      viewBox="0 0 56 72"
      width="44"
      height="58"
      style={{
        filter: isTyping
          ? "drop-shadow(0 0 8px rgba(139,92,246,0.75))"
          : isSleep
          ? "drop-shadow(0 0 4px rgba(100,100,180,0.3))"
          : "drop-shadow(0 0 6px rgba(139,92,246,0.4))",
        animation: isTyping
          ? "ghost-zap 0.35s ease-in-out infinite"
          : isSleep
          ? "ghost-sleep 3s ease-in-out infinite"
          : "ghost-float 3.5s ease-in-out infinite",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {/* Body */}
      <path
        d="M 8 30 Q 8 8 28 8 Q 48 8 48 30 L 48 62 Q 42 56 36 62 Q 30 56 28 62 Q 26 56 20 62 Q 14 56 8 62 Z"
        fill={isTyping ? "#1a1040" : "#12102a"}
        stroke={isTyping ? "#a78bfa" : "#6d28d9"}
        strokeWidth="2"
      />
      {/* Inner belly highlight */}
      <ellipse
        cx="28"
        cy="40"
        rx="12"
        ry="15"
        fill={isTyping ? "rgba(139,92,246,0.14)" : "rgba(109,40,217,0.08)"}
      />

      {/* Eyes */}
      {isSleep ? (
        <>
          <path d="M 18 30 Q 21 27 24 30" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
          <path d="M 32 30 Q 35 27 38 30" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : isTyping ? (
        <>
          <text
            x="15"
            y="35"
            fontSize="10"
            fill="#c4b5fd"
            style={{ fontFamily: "monospace", animation: "zap-flicker 0.4s infinite" }}
          >
            ✦
          </text>
          <text
            x="29"
            y="35"
            fontSize="10"
            fill="#c4b5fd"
            style={{ fontFamily: "monospace", animation: "zap-flicker 0.4s infinite", animationDelay: "0.1s" }}
          >
            ✦
          </text>
        </>
      ) : (
        <>
          <ellipse
            cx="21"
            cy="30"
            rx="4"
            ry="4.5"
            fill="#c4b5fd"
            style={{ transformOrigin: "center", animation: "blink 4s infinite" }}
          />
          <ellipse
            cx="35"
            cy="30"
            rx="4"
            ry="4.5"
            fill="#c4b5fd"
            style={{ transformOrigin: "center", animation: "blink 4s infinite" }}
          />
          <circle cx="22" cy="30" r="1.8" fill="#1e1b4b" />
          <circle cx="36" cy="30" r="1.8" fill="#1e1b4b" />
          <circle cx="23" cy="28.5" r="0.8" fill="white" opacity="0.9" />
          <circle cx="37" cy="28.5" r="0.8" fill="white" opacity="0.9" />
        </>
      )}

      {/* Mouth */}
      {isSleep ? (
        <path d="M 23 40 Q 28 43 33 40" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      ) : isTyping ? (
        <path d="M 22 40 Q 28 46 34 40" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M 23 40 Q 28 44 33 40" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
      )}

      {/* Cheek blush */}
      {!isTyping && (
        <>
          <ellipse cx="16" cy="35" rx="3.5" ry="2" fill="#ec4899" opacity={isSleep ? "0.15" : "0.25"} />
          <ellipse cx="40" cy="35" rx="3.5" ry="2" fill="#ec4899" opacity={isSleep ? "0.15" : "0.25"} />
        </>
      )}

      {/* Stub hands */}
      <ellipse
        cx="6"
        cy="44"
        rx="4"
        ry="3"
        fill={isTyping ? "#1a1040" : "#12102a"}
        stroke={isTyping ? "#a78bfa" : "#6d28d9"}
        strokeWidth="1.5"
        style={isTyping ? { animation: "ghost-zap 0.2s infinite" } : {}}
      />
      <ellipse
        cx="50"
        cy="44"
        rx="4"
        ry="3"
        fill={isTyping ? "#1a1040" : "#12102a"}
        stroke={isTyping ? "#a78bfa" : "#6d28d9"}
        strokeWidth="1.5"
        style={isTyping ? { animation: "ghost-zap 0.2s infinite", animationDelay: "0.1s" } : {}}
      />

      {/* Typing sparks */}
      {isTyping && (
        <>
          <circle cx="12" cy="60" r="1.8" fill="#a78bfa" style={{ animation: "zap-flicker 0.3s infinite" }} />
          <circle cx="28" cy="66" r="2.2" fill="#7c3aed" style={{ animation: "zap-flicker 0.3s infinite", animationDelay: "0.12s" }} />
          <circle cx="44" cy="60" r="1.8" fill="#a78bfa" style={{ animation: "zap-flicker 0.3s infinite", animationDelay: "0.06s" }} />
        </>
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Orbiting sparkle dot
───────────────────────────────────────────── */
function OrbitDot({ delay = "0s", color = "#a78bfa", fast = false }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 5,
        height: 5,
        marginTop: -2.5,
        marginLeft: -2.5,
        animation: `${fast ? "orbit-fast" : "orbit"} ${fast ? "1.2s" : "2.8s"} linear infinite`,
        animationDelay: delay,
        pointerEvents: "none",
      }}
    >
      <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color, opacity: 0.9 }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Zzz float cloud
───────────────────────────────────────────── */
function ZzzCloud({ delay }) {
  return (
    <span
      style={{
        position: "absolute",
        top: -4,
        right: 2,
        fontSize: 10,
        color: "#818cf8",
        animation: "zzz-float 2.4s ease-out infinite",
        animationDelay: delay,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      z
    </span>
  );
}

/* ─────────────────────────────────────────────
   Message banks
───────────────────────────────────────────── */
const IDLE_MSGS = [
  "Drag me anywhere! 🖱️",
  "Ready when you are 👾",
  "Clean code in progress...",
  "I'm keeping you company 👀",
  "Let's solve this cleanly.",
];
const TYPING_MSGS = [
  "Keep cooking!! ⚡",
  "On fire! 🔥",
  "Speed coding mode!",
  "Great rhythm! ⌨️",
  "AST syntax looking crisp!",
];
const SLEEP_MSGS = [
  "zzz... wake me with code 💤",
  "Napping in the corner...",
  "Dreaming in O(1)...",
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ─────────────────────────────────────────────
   Main Export: Free-Draggable Companion
───────────────────────────────────────────── */
export default function AnimatedCodeCompanion({
  isTyping = false,
  keystrokeCount = 0,
  isRunningTests = false,
}) {
  injectStyles();

  // Position on screen (px from top-left viewport)
  const [position, setPosition] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("verifai_companion_pos");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed.x === "number" && typeof parsed.y === "number") {
            return {
              x: Math.min(window.innerWidth - 60, Math.max(10, parsed.x)),
              y: Math.min(window.innerHeight - 80, Math.max(60, parsed.y)),
            };
          }
        } catch (_) {}
      }
      return { x: window.innerWidth - 72, y: 70 };
    }
    return { x: 500, y: 70 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [mood, setMood] = useState("idle");
  const [bubble, setBubble] = useState(null);
  const [minimized, setMin] = useState(false);
  const [streak, setStreak] = useState(0);

  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0, hasMoved: false });
  const sleepRef = useRef(null);
  const bubbleRef = useRef(null);

  const showBubble = useCallback((msg, ms = 3000) => {
    setBubble(msg);
    clearTimeout(bubbleRef.current);
    bubbleRef.current = setTimeout(() => setBubble(null), ms);
  }, []);

  // Update position on window resize to ensure it stays in bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(window.innerWidth - 60, Math.max(10, prev.x)),
        y: Math.min(window.innerHeight - 80, Math.max(60, prev.y)),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // React to typing prop
  useEffect(() => {
    if (isTyping) {
      if (mood !== "typing") {
        setMood("typing");
        if (streak % 25 === 0) showBubble(rand(TYPING_MSGS));
      }
      setStreak((s) => s + 1);
      clearTimeout(sleepRef.current);
      sleepRef.current = setTimeout(() => {
        setMood("sleeping");
        showBubble(rand(SLEEP_MSGS), 3500);
        setStreak(0);
      }, 7000);
    } else {
      if (mood === "typing") setMood("idle");
    }
  }, [isTyping, keystrokeCount]); // eslint-disable-line

  // Random idle chatter
  useEffect(() => {
    if (minimized || isDragging) return;
    const id = setInterval(() => {
      if (mood === "idle" && Math.random() < 0.35) {
        showBubble(rand(IDLE_MSGS));
      }
    }, 15000);
    return () => clearInterval(id);
  }, [mood, minimized, isDragging, showBubble]);

  /* ─────────────────────────────────────────────
     Mouse Drag Handlers
  ───────────────────────────────────────────── */
  const handleMouseDown = (e) => {
    // Only primary mouse button
    if (e.button !== 0) return;
    e.preventDefault();

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position.x,
      startY: position.y,
      hasMoved: false,
    };

    setIsDragging(true);

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - dragStartRef.current.mouseX;
      const dy = moveEvent.clientY - dragStartRef.current.mouseY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragStartRef.current.hasMoved = true;
      }

      const newX = Math.min(window.innerWidth - 56, Math.max(8, dragStartRef.current.startX + dx));
      const newY = Math.min(window.innerHeight - 70, Math.max(56, dragStartRef.current.startY + dy));

      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      // Save position to localStorage
      setPosition((curr) => {
        try {
          localStorage.setItem("verifai_companion_pos", JSON.stringify(curr));
        } catch (_) {}
        return curr;
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleGhostClick = (e) => {
    if (dragStartRef.current.hasMoved) {
      // It was a drag, ignore click
      return;
    }
    showBubble(rand(mood === "sleeping" ? SLEEP_MSGS : mood === "typing" ? TYPING_MSGS : IDLE_MSGS));
  };

  // Determine speech bubble placement dynamically relative to companion
  const isNearRight = position.x > (typeof window !== "undefined" ? window.innerWidth - 180 : 800);
  const isNearBottom = position.y > (typeof window !== "undefined" ? window.innerHeight - 140 : 600);

  /* ── Minimized pill state (Draggable) ── */
  if (minimized) {
    return (
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 9px",
          borderRadius: 999,
          background: "#0c0d14",
          border: isDragging ? "1px solid #a78bfa" : "1px solid rgba(139,92,246,0.3)",
          color: "#a78bfa",
          fontSize: 10,
          fontFamily: "monospace",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          boxShadow: isDragging ? "0 8px 30px rgba(139,92,246,0.4)" : "0 4px 18px rgba(0,0,0,0.6)",
          transform: isDragging ? "scale(1.06)" : "scale(1)",
          transition: isDragging ? "none" : "transform 0.15s ease, border-color 0.15s ease",
          animation: "pill-pulse 2.5s ease-in-out infinite",
        }}
        onClick={() => {
          if (!dragStartRef.current.hasMoved) setMin(false);
        }}
        title="Drag anywhere • Click to expand"
      >
        <span style={{ fontSize: 13, pointerEvents: "none" }}>👻</span>
        <span style={{ color: "#c4b5fd", pointerEvents: "none" }}>Buddy</span>
        {isTyping && (
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#34d399",
              animation: "zap-flicker 0.5s infinite",
              display: "inline-block",
            }}
          />
        )}
      </div>
    );
  }

  /* ── Full companion (Draggable) ── */
  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 60,
        display: "flex",
        flexDirection: isNearBottom ? "column-reverse" : "column",
        alignItems: isNearRight ? "flex-end" : "flex-start",
        gap: 5,
        userSelect: "none",
        pointerEvents: "auto",
      }}
    >
      {/* ── Speech Bubble ── */}
      {bubble && (
        <div
          style={{
            background: "#0e0f1c",
            border: "1px solid rgba(139,92,246,0.25)",
            borderRadius: 8,
            padding: "4px 8px",
            maxWidth: 150,
            fontSize: 9.5,
            fontFamily: "monospace",
            color: "#c4b5fd",
            lineHeight: 1.35,
            boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
            animation: "bubble-pop 0.2s ease-out forwards",
            position: "relative",
            pointerEvents: "none",
            whiteSpace: "normal",
            textAlign: isNearRight ? "right" : "left",
          }}
        >
          {bubble}
          {/* Bubble Pointer Tail */}
          <span
            style={{
              position: "absolute",
              [isNearBottom ? "bottom" : "top"]: -5,
              [isNearRight ? "right" : "left"]: 14,
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              [isNearBottom ? "borderTop" : "borderBottom"]: "5px solid #0e0f1c",
            }}
          />
        </div>
      )}

      {/* ── Ghost Body (Draggable area) ── */}
      <div
        onMouseDown={handleMouseDown}
        onClick={handleGhostClick}
        onDoubleClick={() => setMin(true)}
        style={{
          position: "relative",
          width: 44,
          height: 58,
          cursor: isDragging ? "grabbing" : "grab",
          transform: isDragging ? "scale(1.1) rotate(4deg)" : "scale(1)",
          transition: isDragging ? "none" : "transform 0.15s ease",
          filter: isDragging ? "drop-shadow(0 8px 24px rgba(139,92,246,0.5))" : "none",
        }}
        title="Click to hold & drag anywhere! • Double click to minimize"
      >
        {/* Orbit dots when typing */}
        {mood === "typing" && (
          <>
            <OrbitDot delay="0s" color="#a78bfa" fast />
            <OrbitDot delay="0.4s" color="#818cf8" fast />
            <OrbitDot delay="0.8s" color="#c084fc" fast />
          </>
        )}

        {/* Idle orbit glow dots */}
        {mood === "idle" && (
          <>
            <OrbitDot delay="0s" color="#6d28d9" />
            <OrbitDot delay="1.4s" color="#7c3aed" />
          </>
        )}

        {/* Zzz clouds when sleeping */}
        {mood === "sleeping" && (
          <>
            <ZzzCloud delay="0s" />
            <ZzzCloud delay="0.9s" />
            <ZzzCloud delay="1.8s" />
          </>
        )}

        {/* Ghost SVG */}
        <GhostSVG mood={mood} />

        {/* Streak badge */}
        {streak > 20 && mood === "typing" && (
          <div
            style={{
              position: "absolute",
              top: -5,
              left: -5,
              background: "#7c3aed",
              border: "1px solid rgba(139,92,246,0.5)",
              borderRadius: 999,
              padding: "1px 4px",
              fontSize: 7.5,
              fontFamily: "monospace",
              color: "#e9d5ff",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            ⚡{streak}
          </div>
        )}

        {/* Drag handle indicator dots */}
        <div
          style={{
            position: "absolute",
            bottom: 2,
            right: -2,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            opacity: isDragging ? 0.8 : 0.35,
            pointerEvents: "none",
          }}
        >
          <div style={{ width: 2, height: 2, borderRadius: "50%", background: "#a78bfa" }} />
          <div style={{ width: 2, height: 2, borderRadius: "50%", background: "#a78bfa" }} />
          <div style={{ width: 2, height: 2, borderRadius: "50%", background: "#a78bfa" }} />
        </div>
      </div>

      {/* Hide / minimize tiny trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setMin(true);
        }}
        title="Minimize companion"
        style={{
          background: "none",
          border: "none",
          color: "rgba(139,92,246,0.3)",
          fontSize: 8.5,
          fontFamily: "monospace",
          cursor: "pointer",
          padding: "1px 3px",
          lineHeight: 1,
          marginTop: -2,
          userSelect: "none",
        }}
      >
        hide
      </button>
    </div>
  );
}
