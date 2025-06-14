"use client";

interface HomeViewProps {
  onStart: () => void;
  onTutorialClick: () => void;
}

export function HomeView({ onStart, onTutorialClick }: HomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Equation Pyramid</h1>

      <p className="text-center mb-8">
        Using 3 tiles to reach the target number!
      </p>

      <button
        type="button"
        onClick={onStart}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
      >
        Start New Game
      </button>

      <button
        type="button"
        onClick={onTutorialClick}
        className="px-6 py-3 cursor-pointer"
      >
        Tutorial
      </button>
    </div>
  );
}
