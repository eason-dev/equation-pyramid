"use client";

import { useEffect, useState } from "react";
import { GuessingState } from "@/components/GuessingState";
import { TargetTile } from "@/components/TargetTile";
import { TileList } from "@/components/TileList";
import { GUESS_DURATION } from "@/constants";
import { useTutorialStore } from "@/logic/state/tutorialStore";
import { generateTutorialTiles } from "@/logic/game/tutorialLogic";

const GUIDED_INSTRUCTIONS: Record<
  string,
  {
    title: string;
    subtitle: string;
  }
> = {
  "basic-addition": {
    title: "Basic Equation",
    subtitle: "Select tiles in order to form an equation",
  },
  "first-operator": {
    title: "First Operator Rule",
    subtitle: "The first tile's operator is always ignored",
  },
  "order-of-operations": {
    title: "Math Order",
    subtitle: "Multiplication and division happen first",
  },
  "error-case": {
    title: "Wrong Answers",
    subtitle: "Not all combinations reach the target",
  },
  "free-exploration": {
    title: "Your Turn!",
    subtitle: "Find any equation that equals the target",
  },
};

export default function TutorialGuidedScreen() {
  const [fadeIn, setFadeIn] = useState(false);
  const {
    guidedScenario,
    tiles,
    selectedTiles,
    targetNumber,
    expectedTiles,
    showError,
    errorMessage,
    showSuccess,
    selectTile,
    currentEquationResult,
  } = useTutorialStore();

  const instruction = GUIDED_INSTRUCTIONS[guidedScenario];

  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Highlight expected tiles for guided scenarios, or valid equation tiles for free exploration
  const getHintTileIndices = () => {
    // For guided scenarios with specific expected tiles
    if (expectedTiles && expectedTiles.length > 0) {
      // Only highlight the next expected tile
      if (selectedTiles.length < expectedTiles.length) {
        const nextExpectedTile = expectedTiles[selectedTiles.length];
        const tileIndex = tiles.findIndex(
          (tile) => tile.label === nextExpectedTile.label,
        );
        return tileIndex >= 0 ? [tileIndex] : [];
      }
      return [];
    }

    // For free exploration mode, show hints for any valid equation
    if (guidedScenario === "free-exploration" && selectedTiles.length === 0) {
      try {
        const { validEquations } = generateTutorialTiles();
        if (validEquations.length > 0) {
          // Show hints for the first valid equation
          const firstEquation = validEquations[0];
          const hintIndices = firstEquation.map(tile => 
            tiles.findIndex(t => t.label === tile.label)
          ).filter(index => index >= 0);
          return hintIndices;
        }
      } catch (error) {
        console.warn("Failed to generate hint tiles for free exploration:", error);
      }
    }
    
    return [];
  };

  const hintTileIndices = getHintTileIndices();

  // Convert tile selection to index-based for TileList
  const handleTileClick = (index: number) => {
    const tile = tiles[index];
    if (tile) {
      selectTile(tile);
    }
  };

  // Find indices of selected tiles
  const selectedTileIndices = selectedTiles.map((selectedTile) =>
    tiles.findIndex((tile) => tile.label === selectedTile.label),
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header with instructions */}
      <div className="mb-4 text-center">
        <div
          className={`transition-all duration-500 ${
            fadeIn ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <h2 className="mb-2 text-3xl font-bold text-white">
            {instruction.title}
          </h2>
          <p className="mb-3 text-lg text-white/80">{instruction.subtitle}</p>

          {/* Scenario-specific instruction */}
          <div className="mx-auto max-w-2xl rounded-lg bg-white/10 px-6 py-3 backdrop-blur-sm">
            <p className="text-white">
              {guidedScenario === "basic-addition" &&
                "Select tiles to make 6. Try: A(1) + B(2) + C(3) = 6"}
              {guidedScenario === "first-operator" &&
                "The × on G is ignored! Try: G(3) + B(2) + A(1) = 6"}
              {guidedScenario === "order-of-operations" &&
                "Multiplication happens first! Try: D(4) + C(3) + H(×2) = 10"}
              {guidedScenario === "error-case" &&
                "Try: J(5) + A(1) + B(2) = 8 (Not 6!)"}
              {guidedScenario === "free-exploration" &&
                "Find any valid equation that equals 6!"}
            </p>
          </div>
        </div>
      </div>

      {/* Game area using real game layout */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col sm:flex-row sm:justify-center items-center sm:items-start gap-6 sm:gap-8 md:gap-10 w-full sm:w-auto">
          {/* Center Column: Tiles and equation */}
          <div className="flex flex-col items-center gap-6">
            {/* Tile Pyramid with Target */}
            <div className="relative inline-block">
              <TileList
                tiles={tiles}
                selectedTiles={selectedTileIndices}
                onTileClick={handleTileClick}
                isGuessing={true}
                hintTileIndices={hintTileIndices}
              />

              {/* Target tile positioned at right for mobile/tablet */}
              <div className="md:hidden absolute top-0 right-0 sm:-top-2 sm:-right-24">
                <TargetTile targetNumber={targetNumber} />
              </div>
            </div>

            {/* Guessing State UI */}
            {selectedTiles.length > 0 && (
              <GuessingState
                tiles={tiles}
                selectedTiles={selectedTileIndices}
                countdownSeconds={10}
                countdownTotalSeconds={GUESS_DURATION}
                state={
                  showSuccess ? "correct" : showError ? "wrong" : "guessing"
                }
                calculatedResult={currentEquationResult}
                hideTimer={true}
              />
            )}

            {/* Error/Success message */}
            {(showError || showSuccess) && (
              <div
                className={`mt-2 rounded-lg px-4 py-2 text-sm font-medium ${
                  showError
                    ? "bg-red-500/20 text-red-200"
                    : "bg-green-500/20 text-green-200"
                }`}
              >
                {showError ? errorMessage : "Correct! Well done!"}
              </div>
            )}
          </div>

          {/* Right Column: Target (desktop only) */}
          <div className="hidden md:block flex-shrink-0 md:w-[160px] lg:w-[200px]">
            <div className="flex flex-col items-center">
              <h3 className="mb-4 text-lg font-semibold text-white">Target</h3>
              <TargetTile targetNumber={targetNumber} />
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        <div className="h-2 w-2 rounded-full bg-white/40" />
        <div className="h-2 w-8 rounded-full bg-white" />
        <div className="h-2 w-2 rounded-full bg-white/40" />
      </div>
    </div>
  );
}
