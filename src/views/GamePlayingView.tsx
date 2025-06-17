"use client";

import { Tile } from "@/components/Tile";
import { TileList } from "@/components/TileList";
import { Timer } from "@/components/Timer";
import { RoundStepper } from "@/components/RoundStepper";
import { TargetTile } from "@/components/TargetTile";
import { AnswersTile } from "@/components/AnswersTile";
import { AnswerButton } from "@/components/AnswerButton";
import { GuessingTimer } from "@/components/GuessingTimer";
import { DebugPanel } from "@/components/DebugPanel";
import { Typography } from "@/components/Typography";
import { useGameStore } from "@/logic/state/gameStore";
import type { Player, Tile as TileType } from "@/logic/game/types";
import { DEBUG, GUESS_DURATION } from "@/constants";

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
  const isSinglePlayer = players.length === 1;
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="flex items-center justify-between p-6">
        {/* Logo */}
        <div className="w-[60px]">
          <Typography variant="h2">Logo</Typography>
        </div>

        {/* Center - Timer and Round Stepper */}
        <div className="flex flex-col items-center gap-10">
          {config.numRounds > 1 && (
            <RoundStepper
              currentRound={config.currentRound}
              totalRounds={config.numRounds}
            />
          )}
          <Timer seconds={timeRemaining} />
        </div>

        {/* Music Icon Placeholder */}
        <div className="w-[60px] flex justify-end">
          <div className="w-5 h-5 bg-white/20 rounded" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center gap-14 px-6 pb-6">
        {/* Game Content */}
        <div className="flex items-start gap-10 w-full max-w-[1100px]">
          {/* Left Column: Answers tile */}
          <div className="flex-shrink-0 w-[200px]">
            {gameState && foundEquations.length > 0 && (
              <AnswersTile
                foundEquations={foundEquations}
                validEquations={gameState.validEquations}
                tiles={tiles}
              />
            )}
          </div>

          {/* Center Column: Game content */}
          <div className="flex-1 flex flex-col items-center gap-8">
            {/* Tile Pyramid */}
            <TileList
              tiles={tiles}
              selectedTiles={selectedTiles}
              onTileClick={onTileClick}
              isGuessing={isGuessing}
            />

            {/* Guessing State UI */}
            {isGuessing && (
              <div className="flex flex-col items-center gap-6">
                {/* Guessing Timer */}
                <div className="flex items-center gap-6 bg-gray-200 text-black px-6 py-4 rounded-lg">
                  <GuessingTimer
                    seconds={guessTimer}
                    totalSeconds={GUESS_DURATION}
                    isVisible={true}
                  />
                  <div className="flex flex-col items-center">
                    {selectedPlayer && (
                      <Typography variant="label" className="text-black mb-1">
                        {selectedPlayer.name}
                      </Typography>
                    )}
                    <Typography variant="p2" className="text-black">
                      Guessing Time!
                    </Typography>
                  </div>
                </div>

                {/* Selected Tiles Display */}
                {selectedTiles.length > 0 && (
                  <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    {selectedTiles.map((tileIndex, index) => {
                      const tile = tiles[tileIndex];
                      return (
                        <div
                          key={tileIndex}
                          className="flex items-center gap-3"
                        >
                          <Tile
                            tile={tile}
                            isSelected={false}
                            onClick={() => {}}
                            disabled
                          />
                          {index < selectedTiles.length - 1 && (
                            <Typography variant="h2" className="text-white/60">
                              →
                            </Typography>
                          )}
                        </div>
                      );
                    })}
                    <Typography variant="h2" className="mx-4 text-white">
                      =
                    </Typography>
                    <div className="w-[72px] h-[72px] bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                      <Typography variant="h2" className="text-white">
                        {gameState?.targetNumber || "?"}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Target tile */}
          <div className="flex-shrink-0 w-[200px] flex justify-end">
            {gameState && <TargetTile targetNumber={gameState.targetNumber} />}
          </div>
        </div>

        {/* Player Interaction Area */}
        {canStartGuessing && (
          <div className="flex flex-col items-center gap-6">
            {isSinglePlayer ? (
              /* Single Player Button */
              <AnswerButton
                playerName={players[0].name}
                score={players[0].score}
                onClick={() => startGuessing(players[0].id)}
              />
            ) : (
              /* Multi-Player Buttons */
              <div className="flex items-center gap-24">
                {players.map((player) => (
                  <AnswerButton
                    key={player.id}
                    playerName={player.name}
                    score={player.score}
                    onClick={() => startGuessing(player.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

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
