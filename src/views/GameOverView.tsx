"use client";

import type { Player } from "@/logic/game/types";
import { Typography } from "@/components/Typography";
import { Button } from "@/components/Button";
import { RoundStepper } from "@/components/RoundStepper";
import { TileList } from "@/components/TileList";
import { AnswersTile } from "@/components/AnswersTile";
import { TargetTile } from "@/components/TargetTile";
import { ScoreCircle } from "@/components/ScoreCircle";
import { useGameStore, type GameStoreState } from "@/logic/state/gameStore";
import { mergeWithConfig } from "@/lib/utils";

interface GameOverViewProps {
  players: Player[];
  onNewGame: () => void;
  // Optional store state override for testing/Storybook
  storeOverrides?: Partial<GameStoreState>;
}

export function GameOverView({
  players,
  onNewGame,
  storeOverrides,
}: GameOverViewProps) {
  const hookStore = useGameStore();

  // Use clean merge utility to handle nested objects properly
  const mergedStore = mergeWithConfig(hookStore, storeOverrides);

  const { config, gameState, foundEquations } = mergedStore;

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const isSinglePlayer = players.length === 1;

  return (
    <div className="flex flex-col items-center justify-center relative z-10">
      {/* Title */}
      <Typography variant="h1" className="text-white text-center mb-16">
        Equation Pyramid
      </Typography>

      {/* Score Section */}
      <div className="flex flex-col items-center gap-5 mb-16">
        <Typography variant="h1" className="text-white text-center">
          YOUR SCORE IS
        </Typography>

        {isSinglePlayer ? (
          /* Single Player Score Circle */
          <div className="flex flex-col items-center gap-2.5">
            <ScoreCircle score={sortedPlayers[0].score} showCrown={false} />
          </div>
        ) : (
          /* Two Player Score Circles */
          <div className="flex items-center gap-14">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex flex-col items-center gap-2.5"
              >
                <ScoreCircle score={player.score} showCrown={index === 0} />
                <Typography variant="h2" className="text-white">
                  {player.name}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Game Summary Section */}
      {gameState && (
        <div className="flex flex-col items-center gap-3 mb-16">
          {/* Round Stepper - show rounds based on total rounds from store */}
          {config.numRounds > 1 && (
            <RoundStepper
              currentRound={config.currentRound}
              totalRounds={config.numRounds}
            />
          )}

          {/* Game Content */}
          <div className="flex items-start gap-10">
            {/* Answers - show content from store */}
            {foundEquations.length > 0 && (
              <AnswersTile
                foundEquations={foundEquations}
                validEquations={gameState.validEquations}
                tiles={gameState.tiles}
              />
            )}

            {/* Pyramid - show tiles from last round */}
            <div className="scale-75 origin-center">
              <TileList
                tiles={gameState.tiles}
                selectedTiles={[]}
                onTileClick={() => {}}
                isGuessing={false}
              />
            </div>

            {/* Target - show target number from store */}
            <TargetTile targetNumber={gameState.targetNumber} />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-10">
        <Button variant="primary" onClick={onNewGame}>
          Start Again
        </Button>
        <Button variant="primary" onClick={() => {}}>
          Share
        </Button>
      </div>
    </div>
  );
}
