"use client";

import { Tile } from "@/components/Tile";
import { PlayerList } from "@/components/PlayerList";
import { Timer } from "@/components/Timer";
import { useGameStore } from "@/logic/state/gameStore";
import type { Player, Tile as TileType } from "@/logic/game/types";
import { DEBUG } from "@/constants";

interface PlayingProps {
  tiles: TileType[];
  players: Player[];
  selectedPlayerId: string | null;
  timeRemaining: number;
  onTileClick: (index: number) => void;
}

export function Playing({
  tiles,
  players,
  selectedPlayerId,
  timeRemaining,
  onTileClick,
}: PlayingProps) {
  const {
    currentState,
    selectedTiles,
    gameState,
    guessTimer,
    startGuessing,
    foundEquations,
  } = useGameStore();

  const isGuessing = currentState === "guessing";
  const canStartGuessing =
    currentState === "game" && selectedTiles.length === 0;

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
        <PlayerList players={players} selectedPlayerId={selectedPlayerId} />
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
            // TODO: select player
            onClick={() => startGuessing("player-1")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Guessing
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {tiles.map((tile, index) => (
          <Tile
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            tile={tile}
            isSelected={selectedTiles.includes(index)}
            onClick={() => onTileClick(index)}
            disabled={!isGuessing}
          />
        ))}
      </div>

      {/* Selected Tiles Display */}
      {selectedTiles.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Selected Tiles:</h3>
          <div className="flex space-x-2">
            {selectedTiles.map((tileIndex) => {
              const tile = tiles[tileIndex];
              return (
                <Tile
                  key={tileIndex}
                  tile={tile}
                  isSelected={false}
                  onClick={() => {}}
                  disabled
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Equations Progress */}
      {gameState && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Equations Progress</h3>
          <p className="text-gray-600 mb-2">
            Found {foundEquations.length} of {gameState.validEquations.length}{" "}
            valid equations
          </p>
          {foundEquations.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Found Equations:
              </h4>
              <div className="space-y-1">
                {foundEquations.map((equationKey) => {
                  const [i, j, k] = equationKey.split(",").map(Number);
                  const equation = gameState.validEquations.find(
                    (eq) =>
                      eq.tiles[0].number === tiles[i].number &&
                      eq.tiles[1].number === tiles[j].number &&
                      eq.tiles[2].number === tiles[k].number,
                  );
                  return (
                    <div key={equationKey} className="text-sm text-gray-600">
                      {equation?.tiles.map((t) => t.label).join(" ")} ={" "}
                      {equation?.result}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Debug Mode: Show All Valid Equations */}
          {DEBUG && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Debug: All Valid Equations:
              </h4>
              <div className="space-y-1">
                {gameState.validEquations.map((equation) => (
                  <div
                    key={equation.tiles.map((t) => t.label).join("")}
                    className="text-sm text-gray-500"
                  >
                    {equation.tiles.map((t) => t.label).join(" ")} ={" "}
                    {equation.result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
