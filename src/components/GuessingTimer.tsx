"use client";
import { Typography } from "./Typography";

interface GuessingTimerProps {
  seconds: number;
  totalSeconds: number;
  isVisible: boolean;
}

export function GuessingTimer({
  seconds,
  totalSeconds,
  isVisible,
}: GuessingTimerProps) {
  if (!isVisible) return null;

  // Calculate progress percentage (100% at start, 0% at end)
  const progress = (seconds / totalSeconds) * 100;
  
  // Calculate circumference for a circle with radius 24
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Circular progress border */}
      <svg
        className="absolute inset-0 w-full h-full transform -rotate-90"
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="3"
        />
        {/* Progress circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      
      {/* daisyUI countdown component - centered */}
      <div className="relative z-10 flex items-center justify-center">
        <span className="sr-only">{seconds} seconds remaining</span>
        <span className="countdown" aria-live="polite">
          <span 
            style={{"--value": seconds} as React.CSSProperties}
          >
            <Typography variant="p2" className="text-white">
              {seconds}
            </Typography>
          </span>
        </span>
      </div>
    </div>
  );
}
