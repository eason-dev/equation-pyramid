"use client";

import { useTutorialStore } from "@/logic/state/tutorialStore";
import { useRouter } from "next/navigation";
import { GamePlayingView } from "@/views/GamePlayingView";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import type { Player, Tile as TileType } from "@/logic/game/types";

// Mock tutorial data
const tutorialTiles: TileType[] = [
  { operator: "+", number: 1, label: "A" },
  { operator: "+", number: 1, label: "B" },
  { operator: "+", number: 1, label: "C" },
  { operator: "+", number: 1, label: "D" },
  { operator: "+", number: 1, label: "E" },
  { operator: "+", number: 1, label: "F" },
  { operator: "+", number: 1, label: "G" },
  { operator: "+", number: 1, label: "H" },
  { operator: "+", number: 1, label: "I" },
  { operator: "+", number: 1, label: "J" },
];

const tutorialPlayer: Player = {
  id: "tutorial",
  name: "Tutorial",
  score: 1,
};

const mockGameState = {
  tiles: tutorialTiles,
  targetNumber: 10,
  validEquations: [
    { tiles: [tutorialTiles[7], tutorialTiles[6], tutorialTiles[9]], result: 10 }
  ],
};

export default function TutorialView() {
  const router = useRouter();
  const { isActive, currentStep, nextStep, previousStep, exitTutorial } = useTutorialStore();

  if (!isActive) return null;

  const isLastStep = currentStep === 6;

  const handleExit = () => {
    exitTutorial();
    router.push("/");
  };

  const handleNext = () => {
    if (isLastStep) {
      exitTutorial();
      router.push("/?showSettings=true");
    } else {
      nextStep();
    }
  };

  // Map tutorial steps to game states
  const getStoreOverrides = () => {
    const baseOverrides = {
      currentState: "game" as const,
      gameState: mockGameState,
      config: {
        numPlayers: 1,
        numRounds: 1,
        currentRound: 1,
      },
      selectedTiles: [],
      foundEquations: [],
      mainTimer: 180,
    };

    // Customize based on step
    switch (currentStep) {
      case 2:
        return {
          ...baseOverrides,
          selectedTiles: [0], // Tile A selected
          currentState: "guessing" as const,
          guessingPlayerId: "tutorial",
        };
      case 3:
        return {
          ...baseOverrides,
          selectedTiles: [0, 8], // Tiles A and I selected
          currentState: "guessing" as const,
          guessingPlayerId: "tutorial",
        };
      case 4:
        return {
          ...baseOverrides,
          currentState: "showingResult" as const,
          selectedTiles: [0, 8, 9], // A, I, J
          currentEquationResult: 10,
          isCurrentEquationCorrect: true,
        };
      case 5:
        return {
          ...baseOverrides,
          // Show score button
        };
      case 6:
        return {
          ...baseOverrides,
          foundEquations: [{ key: "7,6,9", foundBy: "tutorial" }], // H, G, J
        };
      default:
        return baseOverrides;
    }
  };

  return (
    <>
      {/* Add wrapper div with tutorial data attributes */}
      <div data-tutorial="game-wrapper" className="relative h-full">
        {/* Tutorial Title - shown above timer for steps 1-4 */}
        {currentStep <= 4 && (
          <div className="text-center pt-20 pb-8">
            <h1 className="text-white text-4xl font-bold mb-4">
              Tutorial
            </h1>
            <p className="text-gray-300 text-xl">
              Let's do a easy tutorial first.
            </p>
            <p className="text-gray-300 text-xl">
              Try use 3 tiles to reach the target number!
            </p>
          </div>
        )}

        {/* Game view with adjusted padding when tutorial title is shown */}
        <div className={currentStep <= 4 ? "" : "h-full"}>
          <GamePlayingView
            tiles={tutorialTiles}
            players={[tutorialPlayer]}
            selectedPlayerId={null}
            timeRemaining={180}
            onTileClick={() => {}}
            storeOverrides={getStoreOverrides()}
          />
        </div>
      </div>

      {/* Tutorial Overlay with highlighting */}
      <TutorialOverlay
        currentStep={currentStep}
        onNext={handleNext}
        onPrevious={previousStep}
        onExit={handleExit}
      />
    </>
  );
}