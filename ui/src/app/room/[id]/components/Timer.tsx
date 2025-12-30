"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomCard } from "@/components/layout/Card"; // Import the new card
import { cn } from "@/lib/utils";

type TimerMode = "focus" | "shortBreak" | "longBreak";

const modes = {
  focus: { label: "Study Time", minutes: 25, color: "bg-white" },
  shortBreak: { label: "Short Break", minutes: 5, color: "bg-green-50" },
  longBreak: { label: "Long Break", minutes: 15, color: "bg-blue-50" },
};

export function Timer() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    else if (timeLeft === 0) setIsActive(false);
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(modes[newMode].minutes * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <RoomCard className={cn("flex flex-col items-center justify-center p-6 md:p-8 transition-colors duration-300 relative overflow-hidden", modes[mode].color)}>

      <div className="flex gap-2 mb-6 z-10 flex-wrap justify-center">
        {(Object.keys(modes) as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border-2",
              mode === m 
                ? "bg-slate-900 text-white border-slate-900" 
                : "bg-transparent border-transparent text-slate-500 hover:bg-black/5"
            )}
          >
            {modes[m].label}
          </button>
        ))}
      </div>

      {/* Clock */}
      <div className="text-[4rem] md:text-[5rem] lg:text-[6rem] font-black leading-none font-mono tracking-tighter tabular-nums mb-6 z-10 text-slate-900">
        {formatTime(timeLeft)}
      </div>

      <div className="flex items-center gap-3 z-10">
        <Button 
          onClick={() => setIsActive(!isActive)}
          className="h-12 px-8 rounded-xl text-lg font-bold bg-slate-900 text-white hover:bg-blue-600 hover:-translate-y-0.5 transition-all shadow-sm"
        >
          {isActive ? <Pause className="mr-2 w-5 h-5" /> : <Play className="mr-2 w-5 h-5" />}
          {isActive ? "Pause" : "Start"}
        </Button>

        <Button 
          variant="outline"
          onClick={() => { setIsActive(false); setTimeLeft(modes[mode].minutes * 60); }}
          size="icon"
          className="h-12 w-12 rounded-xl border-2 border-slate-200 hover:border-slate-400"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>
    </RoomCard>
  );
}