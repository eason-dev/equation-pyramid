"use client";

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
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-2xl font-bold text-gray-900">Game Setup</h1>
        <p className="text-gray-600">
          Set the number of players and rounds for the game.
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <label htmlFor="numPlayers" className="font-medium text-gray-900">
          Number of Players:
        </label>
        <select
          id="numPlayers"
          value={numPlayers}
          onChange={(e) =>
            onConfigUpdate({ numPlayers: Number.parseInt(e.target.value) })
          }
          className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[1, 2].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 items-center">
        <label htmlFor="numRounds" className="font-medium text-gray-900">
          Number of Rounds:
        </label>
        <select
          id="numRounds"
          value={numRounds}
          onChange={(e) =>
            onConfigUpdate({ numRounds: Number.parseInt(e.target.value) })
          }
          className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[1, 3, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
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
