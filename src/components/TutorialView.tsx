"use client";

import { useTutorialStore, tutorialSteps } from "@/logic/state/tutorialStore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@/components/Typography";
import { GamePlayingView } from "@/views/GamePlayingView";
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

  const currentStepData = tutorialSteps[currentStep - 1];
  const isLastStep = currentStep === tutorialSteps.length;

  const handleHomeClick = () => {
    exitTutorial();
    router.push("/");
  };

  const handleDone = () => {
    exitTutorial();
    router.push("/?showSettings=true");
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
      selectedTiles: currentStepData.selectedTiles || [],
      foundEquations: currentStep === 6 ? [{ key: "7,6,9", foundBy: "tutorial" }] : [],
      mainTimer: 180,
    };

    // Show result for step 4
    if (currentStep === 4 && currentStepData.showResult) {
      return {
        ...baseOverrides,
        currentState: "showingResult" as const,
        selectedTiles: [0, 8, 9],
        currentEquationResult: 10,
        isCurrentEquationCorrect: true,
      };
    }

    return baseOverrides;
  };

  return (
    <>
      {/* Main Game View */}
      <GamePlayingView
        tiles={tutorialTiles}
        players={[tutorialPlayer]}
        selectedPlayerId={null}
        timeRemaining={180}
        onTileClick={() => {}}
        storeOverrides={getStoreOverrides()}
      />

      {/* Tutorial Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center pb-8"
        >
          {/* Semi-transparent overlay for darkening background */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Tutorial Content Box */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative bg-gray-800/95 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-4 border border-gray-700 pointer-events-auto"
          >
            {/* Step 5 & 6 special rendering for side placement */}
            {(currentStep === 5 || currentStep === 6) && (
              <div className="text-center">
                {currentStepData.title && (
                  <Typography variant="h2" className="text-white mb-6">
                    {currentStepData.title}
                  </Typography>
                )}
              </div>
            )}

            {/* Regular content */}
            {currentStep < 5 && (
              <div className="text-center">
                <Typography variant="h1" className="text-white mb-4">
                  Tutorial
                </Typography>
                <Typography variant="p2" className="text-gray-300 mb-2">
                  Let's do a easy tutorial first.
                </Typography>
                <Typography variant="p2" className="text-gray-300 mb-8">
                  Try use 3 tiles to reach the target number!
                </Typography>
              </div>
            )}

            {/* Step Content */}
            <div className="mb-8">
              {Array.isArray(currentStepData.content) ? (
                <ul className="space-y-3 text-left max-w-md mx-auto">
                  {currentStepData.content.map((item, index) => (
                    <li key={index} className="flex items-start text-white">
                      <span className="mr-3">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                currentStepData.content && (
                  <Typography variant="p1" className="text-center text-white">
                    {currentStepData.content}
                  </Typography>
                )
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={currentStep === 1 ? handleHomeClick : previousStep}
                className="flex items-center text-white/80 hover:text-white transition-colors"
              >
                <span className="mr-2">←</span>
                {currentStep === 1 ? "Home" : "Back"}
              </button>

              <div className="flex gap-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index + 1 === currentStep ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={isLastStep ? handleDone : nextStep}
                className="flex items-center text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors"
              >
                {isLastStep ? "Done" : "Next"}
                <span className="ml-2">→</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}