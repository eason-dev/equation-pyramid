"use client";

import { ClockIcon } from "./ClockIcon";

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

  // Calculate rotation degree based on progress
  // totalSeconds - seconds = elapsed time
  // 1 round = 360 degrees
  const elapsedSeconds = totalSeconds - seconds;
  const rotationDegree = (elapsedSeconds / totalSeconds) * 360;

  return (
    <div
      className="transition-transform duration-1000 ease-linear"
      style={{ transform: `rotate(${rotationDegree}deg)` }}
    >
      <ClockIcon width={40} height={40} className="text-white" />
    </div>
  );
}
