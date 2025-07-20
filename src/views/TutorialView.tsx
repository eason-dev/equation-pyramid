"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { Footer } from "@/components/Footer";
import { GuessingState } from "@/components/GuessingState";
import { ShaderBackground } from "@/components/ShaderBackground";
import { TargetTile } from "@/components/TargetTile";
import { TileList } from "@/components/TileList";
import { TutorialCompleteOverlay } from "@/components/TutorialCompleteOverlay";
import { useAudio } from "@/hooks/useAudio";
import { useButtonSound } from "@/hooks/useButtonSound";
import {
  calculateTutorialEquationRaw,
  isValidTutorialEquation,
} from "@/logic/game/tutorialLogic";
import { useTutorialStore } from "@/logic/state/tutorialStore";

export function TutorialView() {
  const router = useRouter();
  const { playButtonSound } = useButtonSound();
  const hintTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio controls for tutorial music
  const audioControls = useAudio("/audio/main-background-music.ogg", {
    loop: true,
    volume: 0.3,
  });

  const {
    currentState,
    tiles,
    selectedTiles,
    targetNumber,
    showHint,
    validEquations,
    initializeTutorial,
    selectTile,
    unselectTile,
    updateHintTimer,
  } = useTutorialStore();

  // Initialize tutorial on mount
  useEffect(() => {
    initializeTutorial();

    // Start hint timer
    let seconds = 0;
    hintTimerRef.current = setInterval(() => {
      seconds += 0.1;
      updateHintTimer(seconds);
    }, 100);

    return () => {
      if (hintTimerRef.current) {
        clearInterval(hintTimerRef.current);
      }
    };
  }, [initializeTutorial, updateHintTimer]);

  // Stop hint timer when tutorial is complete
  useEffect(() => {
    if (currentState === "complete" && hintTimerRef.current) {
      clearInterval(hintTimerRef.current);
      hintTimerRef.current = null;
    }
  }, [currentState]);

  const handleTileClick = (tileIndex: number) => {
    const tile = tiles[tileIndex];
    if (!tile) return;

    playButtonSound();

    // Check if tile is already selected
    const isSelected = selectedTiles.some((t) => t.label === tile.label);

    if (isSelected) {
      unselectTile(tile);
    } else if (selectedTiles.length < 3) {
      selectTile(tile);
    }
  };

  const handleStartGame = () => {
    playButtonSound();
    router.push("/?showSettings=true");
  };

  // Convert selected tiles to indices for TileList
  const selectedTileIndices = useMemo(() => {
    return selectedTiles
      .map((selectedTile) =>
        tiles.findIndex((tile) => tile.label === selectedTile.label),
      )
      .filter((index) => index !== -1);
  }, [selectedTiles, tiles]);

  // Get hint tile indices
  const hintTileIndices = useMemo(() => {
    if (!showHint || validEquations.length === 0) return [];
    const hintTiles = validEquations[0];
    return hintTiles
      .map((hintTile) =>
        tiles.findIndex((tile) => tile.label === hintTile.label),
      )
      .filter((index) => index !== -1);
  }, [showHint, validEquations, tiles]);

  // Calculate result for GuessingState (shows actual math result)
  const calculatedResult = useMemo(() => {
    if (selectedTiles.length === 3) {
      return calculateTutorialEquationRaw(selectedTiles);
    }
    return null;
  }, [selectedTiles]);

  // Determine state for GuessingState
  const guessingState = useMemo(() => {
    if (selectedTiles.length < 3) return "guessing";
    return isValidTutorialEquation(selectedTiles, targetNumber)
      ? "correct"
      : "wrong";
  }, [selectedTiles, targetNumber]);

  return (
    <div className="relative w-full flex-grow flex flex-col items-center overflow-hidden">
      <ShaderBackground />

      <div className="flex-grow flex flex-col items-center justify-center gap-8 md:gap-12 w-full px-6 md:px-10 py-20 md:py-24">
        <div className="text-center max-w-2xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
            Tutorial
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white leading-relaxed">
            Let&apos;s do an easy tutorial first.
            <br />
            Try to use 3 tiles to reach the target number!
          </p>
        </div>

        {/* Game Area - 3 columns */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 md:gap-10 lg:gap-20 items-center max-w-[1400px] mx-auto w-full">
          {/* Left Column - Empty for symmetry */}
          <div className="flex justify-end">{/* Empty space */}</div>

          {/* Center Column - Tiles */}
          <div className="flex flex-col items-center gap-8">
            <TileList
              tiles={tiles}
              selectedTiles={selectedTileIndices}
              onTileClick={handleTileClick}
              isGuessing={true}
              hintTileIndices={hintTileIndices}
            />

            {/* Guessing State */}
            <div className="mt-4">
              <GuessingState
                tiles={tiles}
                selectedTiles={selectedTileIndices}
                state={guessingState}
                calculatedResult={calculatedResult}
                hideTimer={true}
              />
            </div>
          </div>

          {/* Right Column - Target */}
          <div className="flex justify-start">
            <TargetTile targetNumber={targetNumber} />
          </div>
        </div>
      </div>

      <Footer audioControls={audioControls} trackType="main" />

      {currentState === "complete" && (
        <TutorialCompleteOverlay onStartGame={handleStartGame} />
      )}
    </div>
  );
}
