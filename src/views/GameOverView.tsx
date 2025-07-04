"use client";

import { useState } from "react";
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

  const { config, gameState, foundEquations, roundHistory } = mergedStore;

  // State to track which round is currently being viewed
  const [selectedRound, setSelectedRound] = useState(config.currentRound);

  // Get the data for the selected round
  const selectedRoundData = roundHistory.find(r => r.roundNumber === selectedRound);
  const displayGameState = selectedRoundData?.gameState || gameState;
  const displayFoundEquations = selectedRoundData?.foundEquations || foundEquations;

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const isSinglePlayer = players.length === 1;

  return (
    <div className="flex flex-col items-center justify-center relative z-10">
      {/* Title */}
      <Typography variant="h1" className="text-white text-center mb-4">
        Equation Pyramid
      </Typography>

      {/* Score Section */}
      <div className="flex flex-col items-center gap-5 mb-16">
        <Typography variant="h2" className="text-white text-center">
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
      {displayGameState && (
        <div className="flex flex-col items-center gap-3 mb-16">
          {/* Round Stepper - show rounds based on total rounds from store */}
          {config.numRounds > 1 && (
            <RoundStepper
              currentRound={config.currentRound}
              totalRounds={config.numRounds}
              selectedRound={selectedRound}
              onRoundClick={setSelectedRound}
            />
          )}

          {/* Game Content */}
          <div className="flex items-start gap-6 h-[360px]">
            {/* Answers - show content from selected round */}
            <AnswersTile
              foundEquations={displayFoundEquations}
              validEquations={displayGameState.validEquations}
              tiles={displayGameState.tiles}
            />

            {/* Pyramid - show tiles from selected round */}
            <div className="scale-75 origin-center">
              <TileList
                tiles={displayGameState.tiles}
                selectedTiles={[]}
                onTileClick={() => {}}
                isGuessing={false}
              />
            </div>

            {/* Target - show target number from selected round */}
            <TargetTile targetNumber={displayGameState.targetNumber} />
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
