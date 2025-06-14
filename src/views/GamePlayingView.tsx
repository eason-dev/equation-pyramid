"use client";

import { Tile } from "@/components/Tile";
import { TileList } from "@/components/TileList";
import { PlayerList } from "@/components/PlayerList";
import { Timer } from "@/components/Timer";
import { RoundStepper } from "@/components/RoundStepper";
import { TargetTile } from "@/components/TargetTile";
import { AnswersTile } from "@/components/AnswersTile";
import { DebugPanel } from "@/components/DebugPanel";
import { useGameStore } from "@/logic/state/gameStore";
import type { Player, Tile as TileType } from "@/logic/game/types";
import { DEBUG } from "@/constants";

interface GamePlayingViewProps {
  tiles: TileType[];
  players: Player[];
  selectedPlayerId: string | null;
  timeRemaining: number;
  onTileClick: (index: number) => void;
}

export function GamePlayingView({
  tiles,
  players,
  selectedPlayerId,
  timeRemaining,
  onTileClick,
}: GamePlayingViewProps) {
  const {
    currentState,
    selectedTiles,
    gameState,
    guessTimer,
    startGuessing,
    foundEquations,
    config,
    transitionToRoundOver,
  } = useGameStore();

  const isGuessing = currentState === "guessing";
  const canStartGuessing =
    currentState === "game" && selectedTiles.length === 0;

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* Round Stepper */}
      {config.numRounds > 1 && (
        <RoundStepper
          currentRound={config.currentRound}
          totalRounds={config.numRounds}
        />
      )}

      {/* Timer at top center */}
      <div className="flex justify-center">
        <Timer seconds={timeRemaining} />
      </div>

      {/* Main game layout: 3 columns */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left column: Answers tile */}
        <div className="col-span-3">
          {gameState && foundEquations.length > 0 && (
            <AnswersTile
              foundEquations={foundEquations}
              validEquations={gameState.validEquations}
              tiles={tiles}
            />
          )}
        </div>

        {/* Center column: Game content */}
        <div className="col-span-6 space-y-6">
          {/* Player List */}
          <div className="flex justify-center">
            <PlayerList players={players} selectedPlayerId={selectedPlayerId} />
          </div>

          {/* Game Controls */}
          <div className="flex justify-center">
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

          {/* Tile Pyramid */}
          <TileList
            tiles={tiles}
            selectedTiles={selectedTiles}
            onTileClick={onTileClick}
            isGuessing={isGuessing}
          />

          {/* Guessing Timer and Selected Tiles Container */}
          {(selectedTiles.length > 0 || isGuessing) && (
            <div className="flex items-center justify-center space-x-6">
              {/* Guessing Timer */}
              {isGuessing && (
                <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
                  <div className="text-center">
                    <p className="text-sm font-medium mb-1">Guessing Time!</p>
                    <div className="text-xl font-bold">
                      0:{guessTimer.toString().padStart(2, "0")}
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Tiles */}
              {selectedTiles.length > 0 && (
                <div className="p-4">
                  <div className="flex space-x-10">
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
            </div>
          )}
        </div>

        {/* Right column: Target tile */}
        <div className="col-span-3">
          {gameState && <TargetTile targetNumber={gameState.targetNumber} />}
        </div>
      </div>

      {/* Debug Panel */}
      {DEBUG && gameState && (
        <DebugPanel
          validEquations={gameState.validEquations}
          onFinishRound={transitionToRoundOver}
        />
      )}
    </div>
  );
}
