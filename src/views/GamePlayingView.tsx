"use client";

import { AnswerButton } from "@/components/AnswerButton";
import { AnswersTile } from "@/components/AnswersTile";
import { DebugPanel } from "@/components/DebugPanel";
import { FloatingButtonWithProgress } from "@/components/FloatingButtonWithProgress";
import { GuessingState } from "@/components/GuessingState";
import { RoundStepper } from "@/components/RoundStepper";
import { TargetTile } from "@/components/TargetTile";
import { TileList } from "@/components/TileList";
import { Timer } from "@/components/Timer";
import { Typography } from "@/components/Typography";
import { GUESS_DURATION, ROUND_DURATION } from "@/constants";
import { mergeWithConfig } from "@/lib/utils";
import type { Player, Tile as TileType } from "@/logic/game/types";
import { type GameStoreState, useGameStore } from "@/logic/state/gameStore";

interface GamePlayingViewProps {
  tiles: TileType[];
  players: Player[];
  selectedPlayerId: string | null;
  timeRemaining: number;
  onTileClick: (index: number) => void;
  DEBUG?: boolean;
  isOver?: boolean;

  // Optional store state override for testing/Storybook
  storeOverrides?: Partial<GameStoreState>;
}

export function GamePlayingView({
  tiles,
  players,
  selectedPlayerId,
  timeRemaining,
  onTileClick,
  storeOverrides,
  DEBUG = false,
  isOver = false,
}: GamePlayingViewProps) {
  const hookStore = useGameStore();

  // Use clean merge utility to handle nested objects properly
  const mergedStore = mergeWithConfig(hookStore, storeOverrides);

  const {
    currentState,
    selectedTiles,
    gameState,
    guessTimer,
    startGuessing,
    foundEquations = [],
    config,
    transitionToRoundOver,
    nextRound,
    currentEquationResult,
    isCurrentEquationCorrect,
  } = mergedStore;

  const isGuessing = currentState === "guessing" && !isOver;
  const isShowingResult = currentState === "showingResult" && !isOver;
  const canStartGuessing =
    currentState === "game" && selectedTiles.length === 0 && !isOver;
  const isSinglePlayer = players.length === 1;
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  // Check if all equations have been found
  const allEquationsFound = gameState
    ? foundEquations.length >= gameState.validEquations.length
    : false;
  const shouldShowCompletion = !!isOver || allEquationsFound;

  // Calculate progress for the floating button
  const timeProgress = 1 - (timeRemaining / ROUND_DURATION);
  const answersProgress = gameState
    ? foundEquations.length / gameState.validEquations.length
    : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start md:justify-center px-4 md:px-6 py-4 md:py-6 landscape:py-2">
      {/* Timer and Round Stepper Section */}
      <div className="flex flex-col items-center gap-4 md:gap-6 lg:gap-10 landscape:gap-2">
        {config.numRounds > 1 && (
          <RoundStepper
            currentRound={config.currentRound}
            totalRounds={config.numRounds}
          />
        )}
        <Timer seconds={timeRemaining} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center gap-6 md:gap-10 lg:gap-14 w-full">
        {/* Mobile: Show compact answer badges at top */}
        <div className="md:hidden flex items-center gap-2 h-8">
          {gameState && foundEquations && foundEquations.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto">
              {foundEquations.map((foundEq, idx) => {
                // Parse the key to get tile indices
                const tileIndices = foundEq.key.split(',').map(Number);
                // Get the actual equation from validEquations
                const equation = gameState.validEquations.find(eq => {
                  const eqIndices = eq.tiles.map((eqTile) =>
                    tiles.findIndex(
                      (tile) => tile.number === eqTile.number && tile.label === eqTile.label,
                    ),
                  );
                  return eqIndices.join(',') === foundEq.key;
                });
                
                if (!equation) return null;
                
                return (
                  <div key={idx} className="text-xs font-semibold text-white/80 whitespace-nowrap">
                    {equation.result === gameState.targetNumber ? "✓" : "✗"} {tileIndices.map(i => tiles[i]?.label || "").join("")}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Game Content - 3 column on desktop, stacked on mobile */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 lg:gap-10 w-full max-w-[1100px]">
          {/* Left Column: Answers tile - Hidden on mobile */}
          <div className="hidden md:block flex-shrink-0 w-[160px] lg:w-[200px]">
            {gameState &&
              (foundEquations.length > 0 || shouldShowCompletion) && (
                <AnswersTile
                  foundEquations={foundEquations}
                  validEquations={gameState.validEquations}
                  tiles={tiles}
                  players={players}
                  showAllAnswers={shouldShowCompletion}
                />
              )}
          </div>

          {/* Center Column: Game content */}
          <div className="flex-1 flex flex-col items-center gap-4 md:gap-6 lg:gap-8 order-2 md:order-1">
            {/* Tile Pyramid */}
            <TileList
              tiles={tiles}
              selectedTiles={selectedTiles}
              onTileClick={onTileClick}
              isGuessing={isGuessing || isShowingResult}
            />

            {/* Guessing State UI */}
            {(isGuessing || isShowingResult) && selectedPlayer && gameState && (
              <GuessingState
                playerName={isSinglePlayer ? undefined : selectedPlayer.name}
                tiles={tiles}
                selectedTiles={selectedTiles}
                countdownSeconds={guessTimer}
                countdownTotalSeconds={GUESS_DURATION}
                state={
                  isShowingResult
                    ? isCurrentEquationCorrect === true
                      ? "correct"
                      : isCurrentEquationCorrect === false
                        ? "wrong"
                        : "guessing"
                    : "guessing"
                }
                calculatedResult={
                  isShowingResult ? currentEquationResult : null
                }
              />
            )}
          </div>

          {/* Right Column: Target tile - Different position on mobile */}
          <div className="flex-shrink-0 w-auto md:w-[160px] lg:w-[200px] flex justify-center md:justify-end order-1 md:order-2">
            {gameState && <TargetTile targetNumber={gameState.targetNumber} />}
          </div>
        </div>

        {/* Player Interaction Area */}
        {canStartGuessing && !shouldShowCompletion && (
          <div className="flex flex-col items-center gap-6">
            {isSinglePlayer ? (
              /* Single Player Button */
              <AnswerButton
                playerName={players[0].name}
                score={players[0].score}
                onClick={() => startGuessing(players[0].id)}
                isOver={isOver}
                isSinglePlayer={isSinglePlayer}
              />
            ) : (
              /* Multi-Player Buttons */
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 lg:gap-24">
                {players.map((player) => (
                  <AnswerButton
                    key={player.id}
                    playerName={player.name}
                    score={player.score}
                    onClick={() => startGuessing(player.id)}
                    isOver={isOver}
                    isSinglePlayer={isSinglePlayer}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Round Over State - Show disabled answer buttons */}
        {shouldShowCompletion && (
          <div className="flex flex-col items-center gap-6">
            {isSinglePlayer ? (
              /* Single Player Button - Disabled */
              <AnswerButton
                playerName={players[0].name}
                score={players[0].score}
                onClick={() => {}}
                isOver={shouldShowCompletion}
                isSinglePlayer={isSinglePlayer}
              />
            ) : (
              /* Multi-Player Buttons - Disabled */
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 lg:gap-24">
                {players.map((player) => (
                  <AnswerButton
                    key={player.id}
                    playerName={player.name}
                    score={player.score}
                    onClick={() => {}}
                    isOver={shouldShowCompletion}
                    isSinglePlayer={isSinglePlayer}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Debug Panel */}
      {DEBUG && gameState && (
        <DebugPanel
          validEquations={gameState.validEquations}
          onFinishRound={transitionToRoundOver}
        />
      )}

      {/* Floating Button - Only visible when round is complete */}
      {shouldShowCompletion && (
        <FloatingButtonWithProgress 
          onClick={nextRound}
          progress={1}
          showCompletionText={true}
          completionText={allEquationsFound ? "Answers Completed" : "Time's Up!"}
        >
          {config.currentRound >= config.numRounds ? "End Game" : "Next Round"}
        </FloatingButtonWithProgress>
      )}
    </div>
  );
}
