"use client";

import type { Player } from "@/logic/game/types";

interface GameOverViewProps {
  players: Player[];
  onNewGame: () => void;
}

export function GameOverView({ players, onNewGame }: GameOverViewProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Game Over!</h2>
      <div className="p-4 bg-green-100 rounded-lg">
        <p className="text-lg font-medium text-green-800">
          Winner: {winner.name} with {winner.score} points!
        </p>
      </div>
      <div className="space-y-4">
        {sortedPlayers.map((player) => (
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
        onClick={onNewGame}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        New Game
      </button>
    </div>
  );
}
