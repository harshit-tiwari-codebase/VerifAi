/**
 * Minimalist Coding Cat Companion – Hand‑only Animation
 *
 * This component renders only the pixel‑art cat with a typing‑bounce
 * animation when the `isTyping` prop is true. No textual UI (terminal,
 * status messages, HUD, or control buttons) is displayed, matching the
 * request for "hand movement of cat and no other text".
 *
 * Props:
 *   - isTyping (boolean) – triggers the cat's typing animation and optional
 *     keyboard‑spark effect.
 */
import React, { useState, useEffect, useRef } from "react";
import catImgUrl from "../../../assets/pixel_cat_transparent.png";

// Animation keyframes injected once per page load
const STYLE_ID = "verifai-minimal-cat-styles";

function injectStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.textContent = `
    @keyframes cat-typing-rhythm {
      0%   { transform: translateY(0px) rotate(0deg); }
      25%  { transform: translateY(-2px) rotate(-0.5deg); }
      50%  { transform: translateY(1px) rotate(0.5deg); }
      75%  { transform: translateY(-1.5px) rotate(-0.3deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    @keyframes keyboard-keys-flash {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50%      { opacity: 1; transform: scale(1.1); filter: drop-shadow(0 0 6px #38bdf8); }
    }
    @keyframes floor-glow-subtle {
      0%, 100% { opacity: 0.55; }
      50%      { opacity: 0.85; }
    }
  `;
  document.head.appendChild(tag);
}

export default function AnimatedCodeCompanion({ isTyping = false }) {
  injectStyles();

  const [position, setPosition] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("verifai_minimal_cat_pos");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (typeof parsed.x === "number" && typeof parsed.y === "number") {
            return {
              x: Math.min(window.innerWidth - 180, Math.max(10, parsed.x)),
              y: Math.min(window.innerHeight - 200, Math.max(60, parsed.y)),
            };
          }
        } catch (_) {}
      }
      return { x: window.innerWidth - 220, y: window.innerHeight - 230 };
    }
    return { x: 800, y: 500 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0, hasMoved: false });

  // Keep cat within viewport on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(window.innerWidth - 180, Math.max(10, prev.x)),
        y: Math.min(window.innerHeight - 200, Math.max(60, prev.y)),
      }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e) => {
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

    const onMouseMove = (move) => {
      const dx = move.clientX - dragStartRef.current.mouseX;
      const dy = move.clientY - dragStartRef.current.mouseY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragStartRef.current.hasMoved = true;
      const newX = Math.min(window.innerWidth - 160, Math.max(6, dragStartRef.current.startX + dx));
      const newY = Math.min(window.innerHeight - 170, Math.max(50, dragStartRef.current.startY + dy));
      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      setPosition((curr) => {
        try {
          localStorage.setItem("verifai_minimal_cat_pos", JSON.stringify(curr));
        } catch (_) {}
        return curr;
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        zIndex: 60,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Ambient floor glow */}
      <div
        style={{
          position: "absolute",
          bottom: 4,
          left: 10,
          width: 120,
          height: 38,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(56, 189, 248, 0.28) 0%, rgba(14, 165, 233, 0.1) 45%, transparent 70%)",
          animation: "floor-glow-subtle 3s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Pixel‑art cat – animates only when typing */}
      <img
        src={catImgUrl}
        alt="Coding Cat"
        style={{
          width: 140,
          height: 140,
          objectFit: "contain",
          imageRendering: "pixelated",
          animation: isTyping ? "cat-typing-rhythm 0.14s infinite ease-in-out" : "none",
          filter: isTyping ? "drop-shadow(0 0 10px rgba(56, 189, 248, 0.45))" : "none",
          transition: "filter 0.2s",
          pointerEvents: "none",
        }}
      />

      {/* Keyboard key-spark animation when typing */}
      {isTyping && (
        <div
          style={{
            position: "absolute",
            bottom: 44,
            left: 48,
            width: 32,
            height: 18,
            pointerEvents: "none",
            transform: "skewY(-14deg) skewX(25deg)",
          }}
        >
          <div
            style={{
              width: 6,
              height: 4,
              background: "#ffffff",
              boxShadow: "0 0 8px #38bdf8",
              position: "absolute",
              top: 2,
              left: 4,
              animation: "keyboard-keys-flash 0.12s infinite alternate",
            }}
          />
          <div
            style={{
              width: 7,
              height: 4,
              background: "#7dd3fc",
              boxShadow: "0 0 6px #38bdf8",
              position: "absolute",
              top: 8,
              left: 14,
              animation: "keyboard-keys-flash 0.15s infinite alternate 0.05s",
            }}
          />
          <div
            style={{
              width: 5,
              height: 3,
              background: "#ffffff",
              boxShadow: "0 0 6px #38bdf8",
              position: "absolute",
              top: 12,
              left: 22,
              animation: "keyboard-keys-flash 0.11s infinite alternate 0.08s",
            }}
          />
        </div>
      )}
    </div>
  );
}
