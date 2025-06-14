"use client";

interface GuessingTimerProps {
  seconds: number;
  isVisible: boolean;
}

export function GuessingTimer({ seconds, isVisible }: GuessingTimerProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg">
      <div className="text-center">
        <p className="text-sm font-medium mb-1">Guessing Time!</p>
        <div className="text-2xl font-bold">
          0:{seconds.toString().padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
