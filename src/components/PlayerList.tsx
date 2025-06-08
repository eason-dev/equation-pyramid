"use client";

import type { Player } from "@/logic/game/types";

interface PlayerListProps {
  players: Player[];
  selectedPlayerId: string | null;
}

export function PlayerList({ players, selectedPlayerId }: PlayerListProps) {
  return (
    <div className="space-y-2">
      {players.map((player) => (
        <button
          type="button"
          key={player.id}
          className={`w-full p-3 rounded-lg border-2 transition-colors ${
            selectedPlayerId === player.id
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium">{player.name}</span>
            <span className="text-lg font-bold">Score: {player.score}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
