"use client";

import { cn } from "@/lib/utils";

interface GameTimerProps {
  timeLeft: number;
  isActive?: boolean;
  warningThreshold?: number;
  compact?: boolean;
}

export default function GameTimer({
  timeLeft,
  isActive = true,
  warningThreshold = 30,
  compact = false,
}: GameTimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= warningThreshold;

  return (
    <div
      className={cn(
        "rounded-lg px-3 py-1.5 font-mono font-bold transition-colors",
        compact ? "text-sm" : "text-lg",
        isActive && isWarning
          ? "bg-red-500/20 text-red-400"
          : "bg-white/10 text-white",
      )}
    >
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}
