"use client";

interface MenuProps {
  onStart: () => void;
}

export function Menu({ onStart }: MenuProps) {
  return (
    <button
      type="button"
      onClick={onStart}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Start New Game
    </button>
  );
}
