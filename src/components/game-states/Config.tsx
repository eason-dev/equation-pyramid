"use client";

interface ConfigProps {
  numPlayers: number;
  numRounds: number;
  onConfigUpdate: (config: { numPlayers?: number; numRounds?: number }) => void;
  onStartGame: () => void;
}

export function Config({
  numPlayers,
  numRounds,
  onConfigUpdate,
  onStartGame,
}: ConfigProps) {
  return (
    <div className="space-y-6">
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
          {[1, 2, 3, 4, 5].map((n) => (
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
        Start Game
      </button>
    </div>
  );
}
