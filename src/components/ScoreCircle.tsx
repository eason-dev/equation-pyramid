"use client";

import { Typography } from "./Typography";

interface ScoreCircleProps {
  score: number;
  showCrown?: boolean;
}

export function ScoreCircle({ score, showCrown = false }: ScoreCircleProps) {
  return (
    <div className="relative">
      {/* Crown for winner */}
      {showCrown && (
        <div className="absolute -top-7 right-0 w-16 h-16 z-10">
          {/* Crown SVG - simplified crown icon */}
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <title>Winner Crown</title>
            <path
              d="M8 32L16 16L32 24L48 16L56 32L52 48H12L8 32Z"
              fill="rgba(250, 240, 127, 0.95)"
              stroke="rgba(250, 240, 127, 0.95)"
              strokeWidth="2"
            />
            <circle cx="16" cy="20" r="3" fill="rgba(250, 240, 127, 0.95)" />
            <circle cx="32" cy="16" r="3" fill="rgba(250, 240, 127, 0.95)" />
            <circle cx="48" cy="20" r="3" fill="rgba(250, 240, 127, 0.95)" />
          </svg>
        </div>
      )}

      <div
        className="flex items-center justify-center rounded-full border"
        style={{
          width: "140px",
          height: "140px",
          background: "rgba(11, 11, 11, 0.8)",
          border: "1px solid rgba(169, 199, 255, 0.75)",
          boxShadow: "4px 4px 20px 0px rgba(163, 163, 163, 0.15)",
        }}
      >
        <Typography variant="h1" className="text-white">
          {score}
        </Typography>
      </div>
    </div>
  );
}
