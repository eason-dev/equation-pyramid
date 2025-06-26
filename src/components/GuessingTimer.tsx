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
  const radius = 18;
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
        {/* Background fill circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="rgba(11, 11, 11, 0.8)"
          stroke="none"
        />

        {/* Progress circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="rgba(104, 104, 104, 0.75)"
          strokeWidth="1.2"
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
