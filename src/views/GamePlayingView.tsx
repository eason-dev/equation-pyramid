"use client";

import { useRef, useEffect } from "react";
import { TileList } from "@/components/TileList";
import { Timer } from "@/components/Timer";
import { RoundStepper } from "@/components/RoundStepper";
import { TargetTile } from "@/components/TargetTile";
import { AnswersTile } from "@/components/AnswersTile";
import { AnswerButton } from "@/components/AnswerButton";
import { GuessingState } from "@/components/GuessingState";
import { DebugPanel } from "@/components/DebugPanel";
import { Typography } from "@/components/Typography";
import { RoundButton } from "@/components/RoundButton";

import { type GameStoreState, useGameStore } from "@/logic/state/gameStore";
import type { Player, Tile as TileType } from "@/logic/game/types";
import { GUESS_DURATION } from "@/constants";
import { mergeWithConfig } from "@/lib/utils";

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
  } = mergedStore;

  const isGuessing = currentState === "guessing" && !isOver;
  const canStartGuessing =
    currentState === "game" && selectedTiles.length === 0 && !isOver;
  const isSinglePlayer = players.length === 1;
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  // Mouse tracking for floating button with ref-based approach
  const floatingButtonRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const buttonPos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isOver) {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animateButton = () => {
      const dx = mousePos.current.x - buttonPos.current.x;
      const dy = mousePos.current.y - buttonPos.current.y;

      // Spring animation with damping
      const spring = 0.15;
      buttonPos.current.x += dx * spring;
      buttonPos.current.y += dy * spring;

      // Directly update DOM element style
      if (floatingButtonRef.current) {
        floatingButtonRef.current.style.left = `${buttonPos.current.x - 80}px`;
        floatingButtonRef.current.style.top = `${buttonPos.current.y - 80}px`;
      }

      animationRef.current = requestAnimationFrame(animateButton);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animateButton();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOver]);

  return (
    <div className="flex flex-col">
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
            {isGuessing && selectedPlayer && gameState && (
              <GuessingState
                playerName={isSinglePlayer ? undefined : selectedPlayer.name}
                tiles={tiles}
                selectedTiles={selectedTiles}
                targetNumber={gameState.targetNumber}
                countdownSeconds={guessTimer}
                countdownTotalSeconds={GUESS_DURATION}
                state="guessing"
              />
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
                isOver={isOver}
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
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Round Over State - Show disabled answer buttons */}
        {isOver && (
          <div className="flex flex-col items-center gap-6">
            {isSinglePlayer ? (
              /* Single Player Button - Disabled */
              <AnswerButton
                playerName={players[0].name}
                score={players[0].score}
                onClick={() => {}}
                isOver={true}
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
                    isOver={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Round Over Text */}
        {isOver && (
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
      {isOver && (
        <div
          ref={floatingButtonRef}
          className="fixed pointer-events-none z-50"
          style={{
            left: "0px",
            top: "0px",
            transform: "translate3d(0, 0, 0)", // Enable hardware acceleration
          }}
        >
          <div className="pointer-events-auto">
            <RoundButton onClick={nextRound}>Next Round</RoundButton>
          </div>
        </div>
      )}
    </div>
  );
}
