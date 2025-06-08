"use client";

import { Tile } from "@/components/Tile";
import { PlayerList } from "@/components/PlayerList";
import { Timer } from "@/components/Timer";
import { useGameStore } from "@/logic/state/gameStore";
import type { Player, Tile as TileType } from "@/logic/game/types";

interface PlayingProps {
  tiles: TileType[];
  players: Player[];
  selectedPlayerId: string | null;
  timeRemaining: number;
  onTileClick: (index: number) => void;
  onPlayerSelect: (playerId: string) => void;
}

export function Playing({
  tiles,
  players,
  selectedPlayerId,
  timeRemaining,
  onTileClick,
  onPlayerSelect,
}: PlayingProps) {
  const {
    currentState,
    selectedTiles,
    gameState,
    guessTimer,
    startGuessing,
    checkEquation,
  } = useGameStore();

  const isGuessing = currentState === "guessing";
  const canStartGuessing =
    currentState === "game" && selectedTiles.length === 0;
  const canSubmitGuess =
    isGuessing && selectedTiles.length === 3 && selectedPlayerId;

  return (
    <div className="space-y-8">
      {/* Target Number Display */}
      {gameState && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Target Number: {gameState.targetNumber}
          </h2>
          <p className="text-gray-600">
            Find an equation using 3 tiles that equals the target number
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <PlayerList
          players={players}
          onSelectPlayer={onPlayerSelect}
          selectedPlayerId={selectedPlayerId}
        />
        <div className="text-center">
          <Timer seconds={isGuessing ? guessTimer : timeRemaining} />
          {isGuessing && (
            <p className="text-sm text-blue-600 mt-1">Guessing Time!</p>
          )}
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex justify-center space-x-4">
        {canStartGuessing && (
          <button
            type="button"
            onClick={startGuessing}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Guessing
          </button>
        )}

        {canSubmitGuess && (
          <button
            type="button"
            onClick={checkEquation}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Submit Equation
          </button>
        )}
      </div>

      {/* Selected Tiles Display */}
      {selectedTiles.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Selected Tiles:</h3>
          <div className="flex space-x-2">
            {selectedTiles.map((tileIndex) => {
              const tile = tiles[tileIndex];
              return (
                <div
                  key={tileIndex}
                  className="px-3 py-2 bg-white border border-blue-200 rounded text-center"
                >
                  <div className="font-bold">{tile.number}</div>
                  <div className="text-sm">{tile.operator}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {tiles.map((tile, index) => (
          <Tile
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            tile={tile}
            isSelected={selectedTiles.includes(index)}
            onClick={() => onTileClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
