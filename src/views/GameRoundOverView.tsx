"use client";

import type { Player } from "@/logic/game/types";

interface GameRoundOverViewProps {
  players: Player[];
  currentRound: number;
  onNextRound: () => void;
}

export function GameRoundOverView({
  players,
  currentRound,
  onNextRound,
}: GameRoundOverViewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Round {currentRound} Complete!
      </h2>
      <div className="space-y-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow"
          >
            <span className="font-medium text-gray-900">{player.name}</span>
            <span className="text-gray-600">Score: {player.score}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onNextRound}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Next Round
      </button>
    </div>
  );
}
