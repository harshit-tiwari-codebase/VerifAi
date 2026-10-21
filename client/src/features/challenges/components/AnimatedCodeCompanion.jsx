/**
 * Pixel coding boy. Pure SVG, no image asset, no text, no effects.
 * Each keystroke makes one hand tap the keyboard, alternating left / right.
 * Props: keystrokeCount (number) - increments on every keystroke.
 */
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

const PX = 3; // size of one "pixel" (smaller = smaller boy)
const W = 32;
const H = 30;
const STORAGE_KEY = "verifai_minimal_boy_pos";
const HIDDEN_KEY = "verifai_minimal_boy_hidden";
const ICON_W = 12; // mini "peek" icon grid (shown when hidden)
const ICON_H = 8;

const C = {
  line: "#14151f",
  skin: "#f2c29b",
  skinShade: "#d9a07a",
  blush: "#f0907f",
  hair: "#3b3057",
  hairHi: "#6a58a8",
  hood: "#7c5cff",
  hoodShade: "#5b3fd6",
  sleeve: "#9378ff",
  string: "#e8e8f5",
  phone: "#38bdf8",
  phoneDark: "#0ea5e9",
  glass: "#dbeafe",
  white: "#ffffff",
  desk: "#23263a",
  key: "#3a3e5a",
};

const R = ({ x, y, w, h, c }) => <rect x={x} y={y} width={w} height={h} fill={c} />;

function tap(el) {
  if (!el || !el.animate) return;
  el.getAnimations().forEach((a) => a.cancel()); // restart cleanly on fast typing
  el.animate(
    [
      { transform: "translateY(0px)" },
      { transform: "translateY(-2px)", offset: 0.4 },
      { transform: "translateY(0px)" },
    ],
    { duration: 110, easing: "ease-out" }
  );
}

const clampPos = (p) => ({
  x: Math.min(window.innerWidth - W * PX - 6, Math.max(6, p.x)),
  y: Math.min(window.innerHeight - H * PX - 6, Math.max(50, p.y)),
});

export default function AnimatedCodeCompanion({ keystrokeCount = 0 }) {
  const leftHand = useRef(null);
  const rightHand = useRef(null);
  const prevCount = useRef(keystrokeCount);
  const nextIsLeft = useRef(true);

  // Tap exactly once per new keystroke, alternating hands
  useLayoutEffect(() => {
    if (keystrokeCount === prevCount.current) return;
    prevCount.current = keystrokeCount;
    tap(nextIsLeft.current ? leftHand.current : rightHand.current);
    nextIsLeft.current = !nextIsLeft.current;
  }, [keystrokeCount]);

  // Draggable, position remembered
  const [pos, setPos] = useState(() => {
    if (typeof window === "undefined") return { x: 800, y: 500 };
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved.x === "number" && typeof saved.y === "number") {
        return clampPos(saved);
      }
    } catch (_) {}
    return clampPos({ x: window.innerWidth - 130, y: window.innerHeight - 120 });
  });
  const drag = useRef(null);

  // Click the boy to hide him, click the tiny icon to bring him back
  const [hidden, setHidden] = useState(() => {
    try {
      return localStorage.getItem(HIDDEN_KEY) === "1";
    } catch (_) {
      return false;
    }
  });
  const setHiddenSaved = (v) => {
    setHidden(v);
    try {
      localStorage.setItem(HIDDEN_KEY, v ? "1" : "0");
    } catch (_) {}
  };

  useEffect(() => {
    const onResize = () => setPos((p) => clampPos(p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { mx: e.clientX, my: e.clientY, sx: pos.x, sy: pos.y, moved: false };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    if (Math.abs(e.clientX - drag.current.mx) > 4 || Math.abs(e.clientY - drag.current.my) > 4) {
      drag.current.moved = true;
    }
    setPos(
      clampPos({
        x: drag.current.sx + e.clientX - drag.current.mx,
        y: drag.current.sy + e.clientY - drag.current.my,
      })
    );
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    const wasClick = !drag.current.moved;
    drag.current = null;
    if (wasClick) {
      setHiddenSaved(true);
      return;
    }
    setPos((p) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
      } catch (_) {}
      return p;
    });
  };

  if (hidden) {
    return (
      <button
        type="button"
        aria-label="Show coding boy"
        onClick={() => setHiddenSaved(false)}
        style={{
          position: "fixed",
          left: pos.x + (W * PX - ICON_W * PX) / 2,
          top: pos.y + H * PX - ICON_H * PX,
          zIndex: 60,
          padding: 0,
          border: 0,
          background: "transparent",
          cursor: "pointer",
          lineHeight: 0,
        }}
      >
        <svg
          width={ICON_W * PX}
          height={ICON_H * PX}
          viewBox={`0 0 ${ICON_W} ${ICON_H}`}
          shapeRendering="crispEdges"
          style={{ display: "block" }}
        >
          <R x={4} y={0} w={4} h={1} c={C.hair} />
          <R x={2} y={1} w={8} h={2} c={C.hair} />
          <R x={2} y={3} w={8} h={5} c={C.skin} />
          <R x={0} y={3} w={2} h={4} c={C.phone} />
          <R x={10} y={3} w={2} h={4} c={C.phone} />
          <R x={3} y={4} w={2} h={2} c={C.line} />
          <R x={7} y={4} w={2} h={2} c={C.line} />
          <R x={5} y={4} w={2} h={1} c={C.line} />
        </svg>
      </button>
    );
  }

  return (
    <div
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 60,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <svg
        width={W * PX}
        height={H * PX}
        viewBox={`0 0 ${W} ${H}`}
        shapeRendering="crispEdges"
        style={{ display: "block", imageRendering: "pixelated" }}
      >
        {/* Hoodie body */}
        <R x={5} y={17} w={22} h={8} c={C.line} />
        <R x={6} y={18} w={20} h={7} c={C.hood} />
        <R x={10} y={17} w={12} h={2} c={C.hoodShade} />
        <R x={13} y={19} w={1} h={3} c={C.string} />
        <R x={18} y={19} w={1} h={3} c={C.string} />

        {/* Neck */}
        <R x={14} y={16} w={4} h={2} c={C.skinShade} />
        <R x={15} y={18} w={2} h={1} c={C.skinShade} />

        {/* Head */}
        <R x={8} y={4} w={16} h={13} c={C.line} />
        <R x={9} y={5} w={14} h={11} c={C.skin} />

        {/* Hair */}
        <R x={10} y={1} w={3} h={2} c={C.hair} />
        <R x={14} y={0} w={4} h={3} c={C.hair} />
        <R x={19} y={1} w={3} h={2} c={C.hair} />
        <R x={15} y={0} w={2} h={1} c={C.hairHi} />
        <R x={10} y={1} w={1} h={1} c={C.hairHi} />
        <R x={9} y={3} w={14} h={4} c={C.hair} />
        <R x={9} y={7} w={2} h={3} c={C.hair} />
        <R x={21} y={7} w={2} h={3} c={C.hair} />
        <R x={12} y={7} w={2} h={1} c={C.hair} />
        <R x={16} y={7} w={1} h={1} c={C.hair} />
        <R x={18} y={7} w={2} h={1} c={C.hair} />
        <R x={12} y={5} w={4} h={1} c={C.hairHi} />
        <R x={18} y={6} w={2} h={1} c={C.hairHi} />

        {/* Headphones */}
        <R x={7} y={3} w={18} h={1} c={C.phoneDark} />
        <R x={7} y={3} w={1} h={6} c={C.phoneDark} />
        <R x={24} y={3} w={1} h={6} c={C.phoneDark} />
        <R x={5} y={8} w={4} h={7} c={C.line} />
        <R x={6} y={9} w={2} h={5} c={C.phone} />
        <R x={6} y={9} w={1} h={1} c={C.white} />
        <R x={23} y={8} w={4} h={7} c={C.line} />
        <R x={24} y={9} w={2} h={5} c={C.phone} />
        <R x={25} y={9} w={1} h={1} c={C.white} />

        {/* Glasses + face */}
        <R x={10} y={9} w={5} h={4} c={C.line} />
        <R x={11} y={10} w={3} h={2} c={C.glass} />
        <R x={12} y={10} w={2} h={2} c={C.line} />
        <R x={11} y={10} w={1} h={1} c={C.white} />
        <R x={17} y={9} w={5} h={4} c={C.line} />
        <R x={18} y={10} w={3} h={2} c={C.glass} />
        <R x={18} y={10} w={2} h={2} c={C.line} />
        <R x={20} y={10} w={1} h={1} c={C.white} />
        <R x={15} y={10} w={2} h={1} c={C.line} />
        <R x={15} y={12} w={2} h={1} c={C.skinShade} />
        <R x={10} y={14} w={2} h={1} c={C.blush} />
        <R x={20} y={14} w={2} h={1} c={C.blush} />
        <R x={14} y={14} w={1} h={1} c={C.line} />
        <R x={17} y={14} w={1} h={1} c={C.line} />
        <R x={15} y={15} w={2} h={1} c={C.line} />

        {/* Sleeves (arms reach to the keyboard) */}
        <R x={6} y={18} w={5} h={8} c={C.line} />
        <R x={7} y={18} w={3} h={7} c={C.sleeve} />
        <R x={21} y={18} w={5} h={8} c={C.line} />
        <R x={22} y={18} w={3} h={7} c={C.sleeve} />

        {/* Keyboard */}
        <R x={2} y={24} w={28} h={6} c={C.desk} />
        <R x={2} y={24} w={28} h={1} c={C.key} />
        {[4, 7, 10, 13, 16, 19, 22, 25].map((x) => (
          <R key={`a${x}`} x={x} y={26} w={2} h={1} c={C.key} />
        ))}
        {[5, 8, 11, 14, 17, 20, 23].map((x) => (
          <R key={`b${x}`} x={x} y={28} w={2} h={1} c={C.key} />
        ))}

        {/* Hands: the only moving parts */}
        <g ref={leftHand}>
          <R x={10} y={22} w={5} h={4} c={C.line} />
          <R x={11} y={23} w={3} h={2} c={C.skin} />
          <R x={12} y={24} w={1} h={1} c={C.skinShade} />
        </g>
        <g ref={rightHand}>
          <R x={17} y={22} w={5} h={4} c={C.line} />
          <R x={18} y={23} w={3} h={2} c={C.skin} />
          <R x={19} y={24} w={1} h={1} c={C.skinShade} />
        </g>
      </svg>
    </div>
  );
}