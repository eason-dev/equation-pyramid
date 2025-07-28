"use client";

import { useEffect, useState } from "react";
import { AnswersTile } from "@/components/AnswersTile";
import { Button } from "@/components/Button";
import { RoundStepper } from "@/components/RoundStepper";
import { ScoreCircle } from "@/components/ScoreCircle";
import { TargetTile } from "@/components/TargetTile";
import { TileList } from "@/components/TileList";
import { Typography } from "@/components/Typography";
import { mergeWithConfig } from "@/lib/utils";
import type { Player } from "@/logic/game/types";
import { type GameStoreState, useGameStore } from "@/logic/state/gameStore";

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

  const {
    config,
    gameState,
    foundEquations = [],
    roundHistory = [],
  } = mergedStore;

  // Mobile pagination state
  const [mobileView, setMobileView] = useState<"score" | "answers">("score");
  
  // Copy to clipboard state
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // State to track which round is currently being viewed
  // Always start with the most recent round that actually exists in history
  const getDefaultSelectedRound = () => {
    if (roundHistory.length > 0) {
      // Find the highest round number in history
      return Math.max(...roundHistory.map((r) => r.roundNumber));
    }
    // If no history exists, use currentRound but this should be rare in GameOver
    return config.currentRound;
  };

  const [selectedRound, setSelectedRound] = useState(getDefaultSelectedRound());

  // Update selectedRound when roundHistory changes to ensure we're showing a valid round
  useEffect(() => {
    if (roundHistory.length > 0) {
      const availableRounds = roundHistory.map((r) => r.roundNumber);
      const maxRound = Math.max(...availableRounds);

      // If the currently selected round doesn't exist in history,
      // reset to the highest available round
      if (!availableRounds.includes(selectedRound)) {
        setSelectedRound(maxRound);
      }
    } else {
      // If round history is empty (new game), reset to current round
      setSelectedRound(config.currentRound);
    }
  }, [roundHistory, selectedRound, config.currentRound]);

  // Get the data for the selected round - this should always exist after the useEffect above
  const selectedRoundData = roundHistory.find(
    (r) => r.roundNumber === selectedRound,
  );

  // Display the selected round's data, or fall back to current game state if no history
  const displayGameState = selectedRoundData?.gameState || gameState;
  const displayFoundEquations =
    selectedRoundData?.foundEquations || foundEquations;

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const isSinglePlayer = players.length === 1;
  
  // Copy to clipboard function
  const handleShare = async () => {
    const score = sortedPlayers[0].score;
    const shareText = `I got ${score} score on Equation Pyramid game, let's play it together! ${window.location.origin}`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Determine crown logic for multiplayer
  const shouldShowCrown = (player: Player) => {
    if (isSinglePlayer) {
      return player.score >= 1; // Show crown for single player if score >= 1
    }

    const highestScore = sortedPlayers[0].score;
    const hasHighestScore = player.score === highestScore;
    const playersWithHighestScore = sortedPlayers.filter(
      (p) => p.score === highestScore,
    );
    const isTied = playersWithHighestScore.length > 1;

    // Show crown if player has highest score
    if (hasHighestScore) {
      // If tied and both have score >= 1, show crown on both
      // If tied and both have score < 1, no crown for anyone
      // If not tied, show crown on the winner if score >= 1
      if (isTied) {
        return highestScore >= 1;
      }
      return highestScore >= 1; // Single winner gets crown if score >= 1
    }

    return false;
  };

  // Debug logging to understand round selection issues
  useEffect(() => {
    console.log("GameOverView - Round State:", {
      roundHistoryLength: roundHistory.length,
      roundNumbers: roundHistory.map((r) => r.roundNumber),
      selectedRound,
      currentRound: config.currentRound,
      numRounds: config.numRounds,
      selectedRoundData: !!selectedRoundData,
      displayGameState: !!displayGameState,
      displayFoundEquations: displayFoundEquations.length,
      timestamp: new Date().toISOString(),
    });
  }, [
    roundHistory,
    selectedRound,
    config,
    selectedRoundData,
    displayGameState,
    displayFoundEquations,
  ]);

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 md:px-6 relative z-10">
      {/* Mobile Pagination Dots */}
      <div className="md:hidden flex items-center gap-2 mb-8">
        <button
          type="button"
          onClick={() => setMobileView("score")}
          className={`w-2 h-2 rounded-full transition-colors ${
            mobileView === "score" ? "bg-white" : "bg-white/30"
          }`}
          aria-label="View scores"
        />
        <button
          type="button"
          onClick={() => setMobileView("answers")}
          className={`w-2 h-2 rounded-full transition-colors ${
            mobileView === "answers" ? "bg-white" : "bg-white/30"
          }`}
          aria-label="View answers"
        />
      </div>

      {/* Mobile View - Score or Answers */}
      <div className="md:hidden w-full">
        {mobileView === "score" ? (
          /* Mobile Score View */
          <div className="flex flex-col items-center gap-8">
            {/* Score Section */}
            <div className="flex flex-col items-center gap-5">
              {isSinglePlayer ? (
                /* Single Player Score Circle */
                <>
                  <Typography
                    variant="h2"
                    className="text-white text-center text-xl"
                  >
                    YOUR SCORE IS
                  </Typography>
                  <div className="flex flex-col items-center gap-2.5">
                    <ScoreCircle
                      score={sortedPlayers[0].score}
                      showCrown={shouldShowCrown(sortedPlayers[0])}
                    />
                  </div>
                </>
              ) : (
                /* Two Player Score Circles */
                <div className="flex items-center gap-14">
                  {sortedPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex flex-col items-center gap-2.5"
                    >
                      <ScoreCircle
                        score={player.score}
                        showCrown={shouldShowCrown(player)}
                      />
                      <Typography variant="h2" className="text-white text-lg">
                        {player.name}
                      </Typography>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* See Answers Button - Mobile Only */}
            <Button
              variant="primary"
              onClick={() => setMobileView("answers")}
              className="w-full max-w-xs"
            >
              See Answers
            </Button>

            {/* Action Buttons - Mobile */}
            <div className="flex gap-4 w-full max-w-xs">
              <Button variant="primary" onClick={onNewGame} className="flex-1">
                Again
              </Button>
              <Button variant="primary" onClick={handleShare} className="flex-1">
                Share
              </Button>
            </div>
          </div>
        ) : (
          /* Mobile Answers View */
          <div className="flex flex-col items-center gap-6">
            {displayGameState && (
              <>
                {/* Round Stepper */}
                {config.numRounds > 1 && (
                  <RoundStepper
                    currentRound={config.currentRound}
                    totalRounds={config.numRounds}
                    selectedRound={selectedRound}
                    onRoundClick={setSelectedRound}
                    showLabels={true}
                  />
                )}

                {/* Compact answer badges at top - same as GamePlayingView */}
                <div className="flex justify-center w-full">
                  <AnswersTile
                    foundEquations={displayFoundEquations}
                    validEquations={displayGameState.validEquations}
                    tiles={displayGameState.tiles}
                    players={players}
                    showAllAnswers={true}
                    compact={true}
                  />
                </div>

                {/* Tile Pyramid with Target - same layout as GamePlayingView */}
                <div className="relative inline-block">
                  <TileList
                    tiles={displayGameState.tiles}
                    selectedTiles={[]}
                    onTileClick={() => {}}
                    isGuessing={false}
                  />

                  {/* Target tile positioned at right top corner - same as GamePlayingView */}
                  <div className="absolute top-0 right-0 sm:-top-2 sm:-right-24">
                    <TargetTile targetNumber={displayGameState.targetNumber} />
                  </div>
                </div>

                {/* Back to Score Button */}
                <Button
                  variant="primary"
                  onClick={() => setMobileView("score")}
                  className="w-full max-w-xs"
                >
                  Back to Score
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Desktop/Tablet View - Original Layout */}
      <div className="hidden md:flex md:flex-col md:items-center">
        {/* Score Section */}
        <div className="flex flex-col items-center gap-5 mb-8 md:mb-12 lg:mb-16">
          {isSinglePlayer ? (
            /* Single Player Score Circle */
            <>
              <Typography variant="h2" className="text-white text-center">
                YOUR SCORE IS
              </Typography>
              <div className="flex flex-col items-center gap-2.5">
                <ScoreCircle
                  score={sortedPlayers[0].score}
                  showCrown={shouldShowCrown(sortedPlayers[0])}
                />
              </div>
            </>
          ) : (
            /* Two Player Score Circles */
            <div className="flex items-center gap-14">
              {sortedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex flex-col items-center gap-2.5"
                >
                  <ScoreCircle
                    score={player.score}
                    showCrown={shouldShowCrown(player)}
                  />
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
          <div className="flex flex-col items-center gap-3 mb-8 md:mb-12 lg:mb-16">
            {/* Round Stepper - show rounds based on total rounds from store */}
            {config.numRounds > 1 && (
              <RoundStepper
                currentRound={config.currentRound}
                totalRounds={config.numRounds}
                selectedRound={selectedRound}
                onRoundClick={setSelectedRound}
                showLabels={true}
              />
            )}

            {/* Game Content */}
            <div className="flex items-start gap-4 md:gap-5 lg:gap-6 h-[300px] md:h-[330px] lg:h-[360px]">
              {/* Answers - show content from selected round */}
              <AnswersTile
                foundEquations={displayFoundEquations}
                validEquations={displayGameState.validEquations}
                tiles={displayGameState.tiles}
                players={players}
                showAllAnswers={true}
              />

              {/* Pyramid - show tiles from selected round */}
              <div className="scale-[0.65] md:scale-[0.7] lg:scale-75 origin-center">
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

        {/* Action Buttons - Desktop/Tablet */}
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Button variant="primary" onClick={onNewGame}>
            Again
          </Button>
          <Button variant="primary" onClick={handleShare}>
            Share
          </Button>
        </div>
      </div>
      
      {/* Copied to clipboard notification */}
      {showCopiedMessage && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-none text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          Copied to clipboard
        </div>
      )}
    </div>
  );
}
