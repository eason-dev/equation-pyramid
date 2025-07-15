"use client";

import { AnswerButton } from "@/components/AnswerButton";
import { AnswersTile } from "@/components/AnswersTile";
import { DebugPanel } from "@/components/DebugPanel";
import { FloatingButton } from "@/components/FloatingButton";
import { GuessingState } from "@/components/GuessingState";
import { RoundStepper } from "@/components/RoundStepper";
import { TargetTile } from "@/components/TargetTile";
import { TileList } from "@/components/TileList";
import { Timer } from "@/components/Timer";
import { Typography } from "@/components/Typography";
import { GUESS_DURATION } from "@/constants";
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
    foundEquations,
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Timer and Round Stepper Section */}
      <div className="flex flex-col items-center gap-10">
        {config.numRounds > 1 && (
          <RoundStepper
            currentRound={config.currentRound}
            totalRounds={config.numRounds}
          />
        )}
        <Timer seconds={timeRemaining} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center gap-14 p-6">
        {/* Game Content */}
        <div className="flex items-start gap-10 w-full max-w-[1100px]">
          {/* Left Column: Answers tile */}
          <div className="flex-shrink-0 w-[200px]">
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
          <div className="flex-1 flex flex-col items-center gap-8">
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

          {/* Right Column: Target tile */}
          <div className="flex-shrink-0 w-[200px] flex justify-end">
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
              <div className="flex items-center gap-24">
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
              <div className="flex items-center gap-24">
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

        {/* Round Over Text */}
        {shouldShowCompletion && (
          <div className="flex justify-center">
            <Typography variant="h1" className="text-white">
              All Answers Completed
            </Typography>
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

      {/* Floating Next Round Button */}
      {shouldShowCompletion && (
        <FloatingButton onClick={nextRound}>
          {config.currentRound >= config.numRounds ? "End Game" : "Next Round"}
        </FloatingButton>
      )}
    </div>
  );
}
