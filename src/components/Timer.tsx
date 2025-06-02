"use client";

interface TimerProps {
  seconds: number;
}

export function Timer({ seconds }: TimerProps) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return (
    <div className="text-2xl font-bold text-gray-900">
      {minutes}:{remainingSeconds.toString().padStart(2, "0")}
    </div>
  );
}
