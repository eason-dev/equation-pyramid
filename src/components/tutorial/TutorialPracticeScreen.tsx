"use client";

import { useEffect, useRef } from "react";
import GameTimer from "@/components/GameTimer";
import { TargetTile } from "@/components/TargetTile";
import TutorialGuessingState from "@/components/tutorial/TutorialGuessingState";
import TutorialTileList from "@/components/tutorial/TutorialTileList";
import { calculateTutorialEquationRaw } from "@/logic/game/tutorialLogic";
import { useTutorialStore } from "@/logic/state/tutorialStore";

export default function TutorialPracticeScreen() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    tiles,
    selectedTiles,
    targetNumber,
    practiceTimer,
    guessTimer,
    score,
    foundEquations,
    validEquations,
    showHint,
    showError,
    errorMessage,
    showSuccess,
    selectTile,
    unselectTile,
    updatePracticeTimer,
    updateGuessTimer,
    updateHintTimer,
  } = useTutorialStore();

  // Timer management
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const store = useTutorialStore.getState();

      // Update main timer
      if (store.practiceTimer > 0) {
        updatePracticeTimer(store.practiceTimer - 1);
      }

      // Update guess timer when tiles are selected
      if (store.selectedTiles.length > 0 && store.guessTimer > 0) {
        updateGuessTimer(store.guessTimer - 1);
      }

      // Update hint timer when no tiles selected
      if (store.selectedTiles.length === 0) {
        updateHintTimer(store.hintTimer + 1);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updatePracticeTimer, updateGuessTimer, updateHintTimer]);

  // Get tiles to highlight for hints
  const getHintTiles = () => {
    if (!showHint || selectedTiles.length > 0) return [];

    // Find an equation that hasn't been found yet
    for (const validEq of validEquations) {
      const validKey = validEq
        .map((t) => t.label)
        .sort()
        .join("");
      const isFound = foundEquations.some(
        (foundEq) =>
          foundEq
            .map((t) => t.label)
            .sort()
            .join("") === validKey,
      );

      if (!isFound) {
        return validEq.map((t) => t.label);
      }
    }

    return [];
  };

  const highlightedTiles = getHintTiles();

  return (
    <div className="flex h-full flex-col">
      {/* Header with game info */}
      <div className="mb-6">
        <div className="text-center">
          <h2 className="mb-2 text-3xl font-bold text-white">Practice Game</h2>
          <p className="mb-4 text-lg text-white/80">
            Find all {validEquations.length} equations before time runs out!
          </p>
          <p className="text-sm text-white/60">
            You have 3 minutes, just like in the real game.
          </p>
        </div>

        {/* Game stats bar */}
        <div className="mx-auto flex max-w-4xl items-center justify-between rounded-lg bg-white/10 px-6 py-3 backdrop-blur-sm">
          {/* Main timer */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Time:</span>
            <GameTimer
              timeLeft={practiceTimer}
              isActive={true}
              warningThreshold={30}
            />
          </div>

          {/* Score */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Score:</span>
            <span className="text-xl font-bold text-white">{score}</span>
          </div>

          {/* Equations found */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Found:</span>
            <span className="text-xl font-bold text-white">
              {foundEquations.length}/{validEquations.length}
            </span>
          </div>
        </div>
      </div>

      {/* Game area */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex gap-8">
          {/* Found equations list */}
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-lg font-semibold text-white">Found</h3>
            <div className="w-48 space-y-2">
              {foundEquations.map((equation) => (
                <div
                  key={equation.map((t) => t.label).join("-")}
                  className="rounded-lg bg-green-500/20 px-3 py-2 text-center text-sm text-green-200"
                >
                  {equation.map((t) => `${t.number}`).join(" ")} ={" "}
                  {targetNumber}
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({
                length: validEquations.length - foundEquations.length,
              }).map((_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: Empty slots are static placeholders
                  key={`empty-${index}`}
                  className="rounded-lg border-2 border-dashed border-white/20 px-3 py-2 text-center text-sm text-white/40"
                >
                  ???
                </div>
              ))}
            </div>
          </div>

          {/* Tiles and equation */}
          <div className="flex flex-col items-center gap-6">
            {/* Tiles */}
            <div>
              <h3 className="mb-4 text-center text-lg font-semibold text-white">
                Tiles
              </h3>
              <TutorialTileList
                tiles={tiles}
                onTileClick={selectTile}
                selectedTiles={selectedTiles}
                disabledTiles={[]}
                highlightedTiles={highlightedTiles}
              />
            </div>

            {/* Equation with guess timer */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Equation</h3>
                {selectedTiles.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">Guess:</span>
                    <GameTimer
                      timeLeft={guessTimer}
                      isActive={true}
                      warningThreshold={3}
                      compact
                    />
                  </div>
                )}
              </div>
              <TutorialGuessingState
                selectedTiles={selectedTiles}
                onTileClick={unselectTile}
                calculateEquation={calculateTutorialEquationRaw}
                targetNumber={targetNumber}
                showError={showError}
                showSuccess={showSuccess}
              />

              {/* Messages */}
              {(showError || showSuccess) && (
                <div
                  className={`mt-2 rounded-lg px-4 py-2 text-center text-sm font-medium ${
                    showError
                      ? "bg-red-500/20 text-red-200"
                      : "bg-green-500/20 text-green-200"
                  }`}
                >
                  {showError ? errorMessage : "Correct! Keep going!"}
                </div>
              )}

              {/* Hint message */}
              {showHint && selectedTiles.length === 0 && (
                <div className="mt-2 rounded-lg bg-blue-500/20 px-4 py-2 text-center text-sm text-blue-200">
                  Hint: Look for highlighted tiles!
                </div>
              )}
            </div>
          </div>

          {/* Target */}
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-lg font-semibold text-white">Target</h3>
            <TargetTile targetNumber={targetNumber} />
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 flex items-center justify-center space-x-2">
        <div className="h-2 w-2 rounded-full bg-white/40" />
        <div className="h-2 w-2 rounded-full bg-white/40" />
        <div className="h-2 w-8 rounded-full bg-white" />
      </div>
    </div>
  );
}
