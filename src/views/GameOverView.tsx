"use client";

import { useState, useEffect } from "react";
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
  // Default to the highest round number in history, or currentRound if no history exists
  const getDefaultSelectedRound = () => {
    if (roundHistory.length > 0) {
      // Find the highest round number in history
      return Math.max(...roundHistory.map(r => r.roundNumber));
    }
    // If no history, default to currentRound (but this should be rare)
    return config.currentRound;
  };
  
  const [selectedRound, setSelectedRound] = useState(getDefaultSelectedRound());

  // Update selectedRound when roundHistory changes (in case new rounds are added)
  useEffect(() => {
    if (roundHistory.length > 0) {
      const newDefaultRound = Math.max(...roundHistory.map(r => r.roundNumber));
      setSelectedRound(newDefaultRound);
    }
  }, [roundHistory]);

  // Get the data for the selected round with robust fallbacks
  let selectedRoundData = roundHistory.find(r => r.roundNumber === selectedRound);
  
  // If selected round not found, try to use the most recent round from history
  if (!selectedRoundData && roundHistory.length > 0) {
    const mostRecentRound = roundHistory[roundHistory.length - 1];
    selectedRoundData = mostRecentRound;
    // Update the selected round to match the fallback
    setSelectedRound(mostRecentRound.roundNumber);
  }
  
  // Use selectedRoundData if available, otherwise fall back to current game state
  const displayGameState = selectedRoundData?.gameState || gameState;
  const displayFoundEquations = selectedRoundData?.foundEquations || foundEquations;

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const isSinglePlayer = players.length === 1;
  
  // Determine crown logic for multiplayer
  const shouldShowCrown = (player: Player, index: number) => {
    if (isSinglePlayer) {
      return player.score >= 1; // Show crown for single player if score >= 1
    }
    
    const highestScore = sortedPlayers[0].score;
    const hasHighestScore = player.score === highestScore;
    const playersWithHighestScore = sortedPlayers.filter(p => p.score === highestScore);
    const isTied = playersWithHighestScore.length > 1;
    
    // Show crown if player has highest score
    if (hasHighestScore) {
      // If tied and both have score >= 1, show crown on both
      // If tied and both have score < 1, no crown for anyone
      // If not tied, show crown on the winner if score >= 1
      if (isTied) {
        return highestScore >= 1;
      } else {
        return highestScore >= 1; // Single winner gets crown if score >= 1
      }
    }
    
    return false;
  };

  // Temporary debugging for multiplayer issues
  useEffect(() => {
    if (!isSinglePlayer) {
      console.log('Multiplayer GameOverView - Round History:', {
        roundHistoryLength: roundHistory.length,
        roundNumbers: roundHistory.map(r => r.roundNumber),
        selectedRound,
        currentRound: config.currentRound,
        numRounds: config.numRounds
      });
    }
  }, [roundHistory, selectedRound, config, isSinglePlayer]);

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
            <ScoreCircle score={sortedPlayers[0].score} showCrown={shouldShowCrown(sortedPlayers[0], 0)} />
          </div>
        ) : (
          /* Two Player Score Circles */
          <div className="flex items-center gap-14">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex flex-col items-center gap-2.5"
              >
                <ScoreCircle score={player.score} showCrown={shouldShowCrown(player, index)} />
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
              showAllAnswers={true}
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
