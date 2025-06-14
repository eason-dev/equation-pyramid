"use client";

import { PLAYERS_OPTIONS, ROUNDS_OPTIONS } from "@/constants";

interface GameSettingsViewProps {
  numPlayers: number;
  numRounds: number;
  onConfigUpdate: (config: { numPlayers?: number; numRounds?: number }) => void;
  onStartGame: () => void;
}

export function GameSettingsView({
  numPlayers,
  numRounds,
  onConfigUpdate,
  onStartGame,
}: GameSettingsViewProps) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold text-gray-900">Game Setup</h1>
        <p className="text-gray-600">
          Set the number of players and rounds for the game.
        </p>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <div className="font-medium text-gray-900">Number of Players:</div>
        <div className="flex gap-3">
          {PLAYERS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onConfigUpdate({ numPlayers: option })}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-200
                ${
                  numPlayers === option
                    ? "bg-blue-500 text-white shadow-lg scale-110"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center">
        <div className="font-medium text-gray-900">Number of Rounds:</div>
        <div className="flex gap-3">
          {ROUNDS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onConfigUpdate({ numRounds: option })}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-200
                ${
                  numRounds === option
                    ? "bg-green-500 text-white shadow-lg scale-110"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onStartGame}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        Start
      </button>
    </div>
  );
}
