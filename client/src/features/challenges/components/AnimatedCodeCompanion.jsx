import { useEffect, useRef, useState } from "react";

const WIDTH = 112;
const HEIGHT = 140;
const POSITION_KEY = "verifai_companion_position";

function clampPosition(position) {
  return {
    x: Math.max(12, Math.min(window.innerWidth - WIDTH - 12, position.x)),
    y: Math.max(68, Math.min(window.innerHeight - HEIGHT - 12, position.y)),
  };
}

function readSavedPosition() {
  try {
    const saved = JSON.parse(localStorage.getItem(POSITION_KEY));
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
      return clampPosition(saved);
    }
  } catch {
    // Position persistence is optional; use the default placement when storage is unavailable.
  }

  return clampPosition({
    x: window.innerWidth - WIDTH - 20,
    y: window.innerHeight - HEIGHT - 20,
  });
}

export default function AnimatedCodeCompanion({ keystrokeCount = 0 }) {
  const [position, setPosition] = useState(readSavedPosition);
  const drag = useRef(null);

  useEffect(() => {
    const onResize = () => setPosition((current) => clampPosition(current));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  const handlePointerMove = (event) => {
    if (!drag.current) return;
    setPosition(
      clampPosition({
        x: drag.current.startX + event.clientX - drag.current.pointerX,
        y: drag.current.startY + event.clientY - drag.current.pointerY,
      })
    );
  };

  const handlePointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setPosition((current) => {
      try {
        localStorage.setItem(POSITION_KEY, JSON.stringify(current));
      } catch {
        // Position persistence is optional; dragging still works for this session.
      }
      return current;
    });
  };

  return (
    <div
      aria-hidden="true"
      className="companion-float"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        left: position.x,
        top: position.y,
        touchAction: "none",
      }}
      title={`Coding companion · ${keystrokeCount} keystrokes`}
    >
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox="0 0 112 140"
        role="presentation"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="companion-head-top" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FFB08E" />
            <stop offset="1" stopColor="#FF6A3D" />
          </linearGradient>
          <linearGradient id="companion-head-front" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#383832" />
            <stop offset="1" stopColor="#22221E" />
          </linearGradient>
          <linearGradient id="companion-body-front" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#30302B" />
            <stop offset="1" stopColor="#171714" />
          </linearGradient>
        </defs>

        <ellipse cx="57" cy="128" rx="33" ry="5" fill="#000000" opacity=".42" />

        <path d="M56 19v-7" stroke="#AAA69B" strokeWidth="3" strokeLinecap="round" />
        <circle cx="56" cy="10" r="4" fill="#FF6A3D" />

        <path
          d="m37 28 19-11 20 9v27L57 65 37 54Z"
          fill="#171714"
          stroke="#414139"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="m37 28 19-11 20 9-19 11Z" fill="url(#companion-head-top)" />
        <path d="m37 28 20 9v28L37 54Z" fill="#414139" />
        <path d="m57 37 19-11v27L57 65Z" fill="url(#companion-head-front)" />
        <path
          d="m61 43 4-2v7l-4 2Zm9-5 3-2v7l-3 2Z"
          fill="#FFB08E"
          stroke="#FF6A3D"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path d="m62 55 9-5" stroke="#AAA69B" strokeWidth="1.5" strokeLinecap="round" />

        <path d="M49 63v7h15v-7" fill="#22221E" stroke="#414139" strokeWidth="2" />
        <path
          d="m31 77 25-13 25 12v32l-25 16-25-14Z"
          fill="#171714"
          stroke="#414139"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="m31 77 25-13 25 12-25 13Z" fill="#414139" />
        <path d="m31 77 25 12v35l-25-14Z" fill="#22221E" />
        <path d="m56 89 25-13v32l-25 16Z" fill="url(#companion-body-front)" />

        <path
          d="m40 91 16-8 16 8-16 9Z"
          fill="#1C1C19"
          stroke="#414139"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="m49 91 7-4 7 4-7 4Z" fill="#FF6A3D" />
        <path d="M56 95v-5" stroke="#FFD1BB" strokeWidth="1.5" strokeLinecap="round" />

        <path d="m28 81-7 5v19l8 3m55-31 8 4v18l-9 5" fill="none" stroke="#AAA69B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m34 113 8 5m28 0 8-5" stroke="#414139" strokeWidth="5" strokeLinecap="round" />
        <path d="M47 125h-8m28 0h8" stroke="#AAA69B" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
