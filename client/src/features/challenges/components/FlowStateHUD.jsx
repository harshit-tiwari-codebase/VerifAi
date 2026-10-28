import React, { useEffect, useState } from "react";
import { Zap, Flame, Volume2, VolumeX, Eye, Sparkles } from "lucide-react";

export default function FlowStateHUD({ isTyping = false, keystrokeCount = 0 }) {
  const [streak, setStreak] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [flowLevel, setFlowLevel] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Calculate flow streak and simulated WPM from typing bursts
  useEffect(() => {
    if (isTyping) {
      setStreak((prev) => prev + 1);
      setWpm((prev) => Math.min(135, Math.max(45, prev + Math.floor(Math.random() * 8) + 2)));
    } else {
      const timer = setTimeout(() => {
        setStreak(0);
        setWpm(0);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isTyping, keystrokeCount]);

  useEffect(() => {
    if (streak > 80) setFlowLevel(3);
    else if (streak > 30) setFlowLevel(2);
    else setFlowLevel(1);
  }, [streak]);

  // Optional subtle mechanical key click via Web Audio API
  const playClick = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  };

  useEffect(() => {
    if (isTyping && soundEnabled) {
      playClick();
    }
  }, [keystrokeCount]);

  return (
    <div className="flex items-center gap-3 select-none font-mono text-xs">
      {/* Keystroke Flow & Streak indicator */}
      {streak > 5 ? (
        <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 animate-fade-in text-[11px]">
          <Zap className="h-3 w-3 text-violet-400 animate-pulse" />
          <span>
            {flowLevel === 3 ? "⚡ Deep Flow" : flowLevel === 2 ? "🔥 In the Zone" : "Focused"}
          </span>
          <span className="text-white/20">·</span>
          <span className="text-mist-200">{streak} streak</span>
          {wpm > 0 && <span className="text-mist-500 text-[10px]">({wpm} WPM)</span>}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-mist-500 text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
          <span>Flow Ready</span>
        </div>
      )}

      {/* Subtle Mechanical Click Ambience Toggle */}
      <button
        type="button"
        onClick={() => setSoundEnabled((prev) => !prev)}
        className={`p-1 rounded transition-colors ${
          soundEnabled
            ? "text-violet-300 bg-violet-500/15"
            : "text-mist-600 hover:text-mist-400"
        }`}
        title={soundEnabled ? "Mute typing click sounds" : "Enable tactile typing audio feedback"}
      >
        {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
