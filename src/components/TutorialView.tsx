"use client";

import { useTutorialStore } from "@/logic/state/tutorialStore";
import { useRouter } from "next/navigation";
import { GamePlayingView } from "@/views/GamePlayingView";
import { TutorialOverlay } from "@/components/TutorialOverlay";
import type { Player, Tile as TileType } from "@/logic/game/types";
import { useState, useEffect } from "react";
import { FloatingButtonWithProgress } from "@/components/FloatingButtonWithProgress";

// Animation overlay component
function AnimationOverlay({ phase, step }: { phase: string; step: number }) {
  const [answerButtonRect, setAnswerButtonRect] = useState<DOMRect | null>(null);
  const [tileRects, setTileRects] = useState<(DOMRect | null)[]>([null, null, null]);

  useEffect(() => {
    // Get answer button position
    const answerButton = document.querySelector('[data-tutorial="answer-button"]');
    if (answerButton) {
      setAnswerButtonRect(answerButton.getBoundingClientRect());
    }

    // Get tile positions
    const tiles = [];
    tiles[0] = document.querySelector('[data-tutorial="tile-0"]')?.getBoundingClientRect() || null;
    tiles[1] = document.querySelector('[data-tutorial="tile-8"]')?.getBoundingClientRect() || null;
    tiles[2] = document.querySelector('[data-tutorial="tile-9"]')?.getBoundingClientRect() || null;
    setTileRects(tiles);
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Step 2 animations */}
      {step === 2 && (
        <>
          {/* Highlight answer button during pressing phase */}
          {phase === "pressing" && answerButtonRect && (
            <>
              <div 
                className="absolute bg-white/10 rounded-xl animate-pulse"
                style={{
                  top: answerButtonRect.top - 5,
                  left: answerButtonRect.left - 5,
                  width: answerButtonRect.width + 10,
                  height: answerButtonRect.height + 10,
                  boxShadow: "0 0 40px rgba(169, 199, 255, 0.8)",
                }}
              />
              <div 
                className="absolute text-white text-2xl font-bold animate-bounce"
                style={{
                  top: answerButtonRect.top - 60,
                  left: answerButtonRect.left + answerButtonRect.width / 2 - 20,
                }}
              >
                Click!
              </div>
            </>
          )}
          
          {/* Highlight first tile during selecting phase */}
          {phase === "selecting" && tileRects[0] && (
            <>
              <div 
                className="absolute rounded-lg animate-pulse"
                style={{
                  top: tileRects[0].top - 5,
                  left: tileRects[0].left - 5,
                  width: tileRects[0].width + 10,
                  height: tileRects[0].height + 10,
                  border: "3px solid rgba(169, 199, 255, 0.8)",
                  boxShadow: "0 0 30px rgba(169, 199, 255, 0.8)",
                }}
              />
              <div 
                className="absolute text-white text-xl font-bold"
                style={{
                  top: tileRects[0].top - 40,
                  left: tileRects[0].left + tileRects[0].width / 2 - 30,
                }}
              >
                Select A
              </div>
            </>
          )}
        </>
      )}
      
      {/* Step 3 animations */}
      {step === 3 && (
        <>
          {/* Highlight second tile (I) */}
          {phase === "selecting2" && tileRects[1] && (
            <>
              <div 
                className="absolute rounded-lg animate-pulse"
                style={{
                  top: tileRects[1].top - 5,
                  left: tileRects[1].left - 5,
                  width: tileRects[1].width + 10,
                  height: tileRects[1].height + 10,
                  border: "3px solid rgba(169, 199, 255, 0.8)",
                  boxShadow: "0 0 30px rgba(169, 199, 255, 0.8)",
                }}
              />
              <div 
                className="absolute text-white text-xl font-bold"
                style={{
                  top: tileRects[1].top - 40,
                  left: tileRects[1].left + tileRects[1].width / 2 - 30,
                }}
              >
                Select I
              </div>
            </>
          )}
          
          {/* Highlight third tile (J) */}
          {phase === "selecting3" && tileRects[2] && (
            <>
              <div 
                className="absolute rounded-lg animate-pulse"
                style={{
                  top: tileRects[2].top - 5,
                  left: tileRects[2].left - 5,
                  width: tileRects[2].width + 10,
                  height: tileRects[2].height + 10,
                  border: "3px solid rgba(169, 199, 255, 0.8)",
                  boxShadow: "0 0 30px rgba(169, 199, 255, 0.8)",
                }}
              />
              <div 
                className="absolute text-white text-xl font-bold"
                style={{
                  top: tileRects[2].top - 40,
                  left: tileRects[2].left + tileRects[2].width / 2 - 30,
                }}
              >
                Select J
              </div>
            </>
          )}
          
          {/* Show result phase */}
          {phase === "showResult" && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-white text-4xl font-bold animate-bounce">
                = 10 ✓
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

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
  const [isAnimatingStep2, setIsAnimatingStep2] = useState(false);
  const [step2AnimationPhase, setStep2AnimationPhase] = useState<"idle" | "pressing" | "selecting" | "done">("idle");
  const [isAnimatingStep3, setIsAnimatingStep3] = useState(false);
  const [step3AnimationPhase, setStep3AnimationPhase] = useState<"idle" | "selecting2" | "selecting3" | "showResult" | "done">("idle");
  const [showOverlay, setShowOverlay] = useState(true);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  useEffect(() => {
    // When entering step 2, start the animation sequence
    if (currentStep === 2 && step2AnimationPhase === "idle") {
      setIsAnimatingStep2(true);
      setShowOverlay(false);
      setStep2AnimationPhase("pressing");
      
      // Phase 1: Show answer button being pressed
      setTimeout(() => {
        setStep2AnimationPhase("selecting");
      }, 1500);
      
      // Phase 2: Show tile selection
      setTimeout(() => {
        setStep2AnimationPhase("done");
        setIsAnimatingStep2(false);
        // Add longer delay before showing overlay to ensure guessing state is rendered
        setTimeout(() => {
          setShowOverlay(true);
        }, 500);
      }, 3000);
    }
  }, [currentStep, step2AnimationPhase]);

  // Animation for step 3 (now showing the equation result)
  useEffect(() => {
    if (currentStep === 3 && step3AnimationPhase === "idle") {
      setIsAnimatingStep3(true);
      setShowOverlay(false);
      setStep3AnimationPhase("selecting2");
      
      // Phase 1: Select second tile (I)
      setTimeout(() => {
        setStep3AnimationPhase("selecting3");
      }, 1000);
      
      // Phase 2: Select third tile (J)
      setTimeout(() => {
        setStep3AnimationPhase("showResult");
      }, 2000);
      
      // Phase 3: Show result and overlay
      setTimeout(() => {
        setStep3AnimationPhase("done");
        setIsAnimatingStep3(false);
        setTimeout(() => {
          setShowOverlay(true);
        }, 500);
      }, 3000);
    }
  }, [currentStep, step3AnimationPhase]);

  // Reset animation states when changing steps
  useEffect(() => {
    if (currentStep !== 2) {
      setStep2AnimationPhase("idle");
      if (currentStep !== 3) {
        setShowOverlay(true);
      }
    }
    if (currentStep !== 3) {
      setStep3AnimationPhase("idle");
      if (currentStep !== 2) {
        setShowOverlay(true);
      }
    }
  }, [currentStep]);

  if (!isActive && !tutorialCompleted) return null;

  const isLastStep = currentStep === 5;

  const handleExit = () => {
    exitTutorial();
    router.push("/");
  };

  const handleTutorialComplete = () => {
    // Just exit the tutorial, the tutorial page will handle navigation
    exitTutorial();
  };

  const handleNext = () => {
    if (isLastStep) {
      setTutorialCompleted(true);
      setShowOverlay(false);
    } else {
      nextStep();
    }
  };

  // Map tutorial steps to game states
  const getStoreOverrides = (): any => {
    // If tutorial is completed, show the completion state
    if (tutorialCompleted) {
      return {
        currentState: "roundOver" as const,
        gameState: mockGameState,
        config: {
          numPlayers: 1,
          numRounds: 1,
          currentRound: 1,
        },
        selectedTiles: [],
        foundEquations: [
          { key: "0,8,9", foundBy: "tutorial" }, // A, I, J
          { key: "7,6,9", foundBy: "tutorial" }, // H, G, J
        ],
        mainTimer: 0,
        guessingPlayerId: null,
        guessTimer: 0,
        players: [{ ...tutorialPlayer, score: 2 }],
      };
    }

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
      guessingPlayerId: null,
      guessTimer: 0,
    };

    // Customize based on step
    switch (currentStep) {
      case 2:
        // Handle animation phases for step 2
        if (step2AnimationPhase === "pressing" || step2AnimationPhase === "selecting") {
          return {
            ...baseOverrides,
            selectedTiles: step2AnimationPhase === "selecting" ? [0] : [],
            currentState: step2AnimationPhase === "selecting" ? "guessing" as const : "game" as const,
            guessingPlayerId: step2AnimationPhase === "selecting" ? "tutorial" : undefined,
            guessTimer: 10,
          };
        }
        return {
          ...baseOverrides,
          selectedTiles: [0], // Tile A selected
          currentState: "guessing" as const,
          guessingPlayerId: "tutorial",
          guessTimer: 10,
        };
      case 3:
        // Handle animation phases for step 3 (equation result)
        if (step3AnimationPhase === "selecting2") {
          return {
            ...baseOverrides,
            selectedTiles: [0, 8], // Tiles A and I selected
            currentState: "guessing" as const,
            guessingPlayerId: "tutorial",
            guessTimer: 10,
          };
        } else if (step3AnimationPhase === "selecting3") {
          return {
            ...baseOverrides,
            selectedTiles: [0, 8, 9], // Tiles A, I, and J selected
            currentState: "guessing" as const,
            guessingPlayerId: "tutorial",
            guessTimer: 10,
          };
        } else if (step3AnimationPhase === "showResult" || step3AnimationPhase === "done") {
          return {
            ...baseOverrides,
            selectedTiles: [0, 8, 9], // A, I, J
            currentState: "showingResult" as const,
            currentEquationResult: 10,
            isCurrentEquationCorrect: true,
            guessingPlayerId: "tutorial",
          };
        }
        return {
          ...baseOverrides,
          selectedTiles: [0, 8, 9], // A, I, J
          currentState: "showingResult" as const,
          currentEquationResult: 10,
          isCurrentEquationCorrect: true,
          guessingPlayerId: "tutorial",
        };
      case 4:
        // Step 4 is now the scoring rules (previous step 5)
        return {
          ...baseOverrides,
          currentState: "game" as const,
          selectedTiles: [],
          foundEquations: [{ key: "0,8,9", foundBy: "tutorial" }], // A, I, J found
          players: [{ ...tutorialPlayer, score: 1 }], // Score increased
        };
      case 5:
        // Step 5 is now the bonus tip (previous step 6)
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
        {/* Tutorial Title - shown above timer for steps 1-3 */}
        {currentStep <= 3 && (
          <div className="text-center pt-20 pb-8">
            <h1 className="text-white text-4xl font-bold mb-4">
              Tutorial
            </h1>

          </div>
        )}

        {/* Game view with adjusted padding when tutorial title is shown */}
        <div className={currentStep <= 3 ? "" : "h-full"}>
          <GamePlayingView
            tiles={tutorialTiles}
            players={tutorialCompleted ? getStoreOverrides().players : [tutorialPlayer]}
            selectedPlayerId={getStoreOverrides().guessingPlayerId || null}
            timeRemaining={tutorialCompleted ? 0 : 180}
            onTileClick={() => {}}
            storeOverrides={getStoreOverrides()}
            isTutorial={true}
            isOver={tutorialCompleted}
          />
        </div>
      </div>

      {/* Tutorial Overlay with highlighting */}
      {showOverlay && (
        <TutorialOverlay
          currentStep={currentStep}
          onNext={handleNext}
          onPrevious={previousStep}
          onExit={handleExit}
        />
      )}

      {/* Animation indicators for step 2 */}
      {isAnimatingStep2 && (
        <AnimationOverlay phase={step2AnimationPhase} step={2} />
      )}
      
      {/* Animation indicators for step 3 */}
      {isAnimatingStep3 && (
        <AnimationOverlay phase={step3AnimationPhase} step={3} />
      )}
      
      {/* Floating button when tutorial is completed */}
      {tutorialCompleted && (
        <FloatingButtonWithProgress
          onClick={handleTutorialComplete}
          progress={1}
          showCompletionText={true}
          completionText="Tutorial Finish"
        >
          Start Game
        </FloatingButtonWithProgress>
      )}
    </>
  );
}