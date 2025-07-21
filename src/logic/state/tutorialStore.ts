import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  calculateTutorialEquation,
  generateTutorialTiles,
  isValidTutorialEquation,
} from "@/logic/game/tutorialLogic";
import type { Tile } from "@/logic/game/types";

// Tutorial stages
export type TutorialStage = "intro" | "guided" | "practice" | "complete";

// Guided demo scenarios
export type GuidedScenario =
  | "basic-addition"
  | "first-operator"
  | "order-of-operations"
  | "error-case"
  | "free-exploration";

interface TutorialStore {
  // State
  currentStage: TutorialStage;
  guidedScenario: GuidedScenario;
  tiles: Tile[];
  selectedTiles: Tile[];
  targetNumber: number;

  // Guided mode
  expectedTiles: Tile[] | null; // Expected tiles for guided scenarios
  lockedSelection: boolean; // Prevent selecting wrong tiles in guided mode

  // Practice mode
  practiceTimer: number; // Main game timer
  guessTimer: number; // Timer for each guess
  score: number;
  foundEquations: Tile[][]; // Equations already found
  validEquations: Tile[][]; // All valid equations
  hintTimer: number;
  showHint: boolean;

  // UI state
  showError: boolean;
  errorMessage: string;
  showSuccess: boolean;
  currentEquationResult: number | null;
  isCurrentEquationCorrect: boolean | null;

  // Actions
  initializeTutorial: () => void;
  startIntro: () => void;
  startGuided: () => void;
  startPractice: () => void;

  // Stage progression
  nextStage: () => void;
  nextScenario: () => void;

  // Tile selection
  selectTile: (tile: Tile) => void;
  unselectTile: (tile: Tile) => void;
  clearSelection: () => void;

  // Validation
  checkEquation: () => boolean;
  validateGuidedSelection: () => boolean;

  // Practice mode
  updatePracticeTimer: (time: number) => void;
  updateGuessTimer: (time: number) => void;
  updateHintTimer: (time: number) => void;
  showHintAnimation: () => void;

  // Complete tutorial
  completeTutorial: () => void;
  reset: () => void;
}

// Shared tilelist for all guided scenarios (same as practice mode)
const SHARED_TILES: Tile[] = [
  { label: "A", number: 1, operator: "+" },
  { label: "B", number: 2, operator: "+" },
  { label: "C", number: 3, operator: "+" },
  { label: "D", number: 4, operator: "+" },
  { label: "E", number: 1, operator: "+" },
  { label: "F", number: 1, operator: "+" },
  { label: "G", number: 3, operator: "*" },
  { label: "H", number: 2, operator: "*" },
  { label: "I", number: 2, operator: "-" },
  { label: "J", number: 5, operator: "+" },
];

// Guided scenario configurations
const GUIDED_SCENARIOS: Record<
  GuidedScenario,
  {
    tiles: Tile[];
    target: number;
    expected: string[];
    instruction: string;
  }
> = {
  "basic-addition": {
    tiles: SHARED_TILES,
    target: 6,
    expected: ["A", "B", "C"], // 1 + 2 + 3 = 6
    instruction: "Select tiles to make 6. Try: 1 + 2 + 3",
  },
  "first-operator": {
    tiles: SHARED_TILES,
    target: 6,
    expected: ["G", "B", "A"], // G(3) * ignored + B(+2) + A(+1) = 3 + 2 + 1 = 6
    instruction: "The first tile's operator is ignored. This equals: 3 + 2 + 1",
  },
  "order-of-operations": {
    tiles: SHARED_TILES,
    target: 10,
    expected: ["D", "C", "H"], // D(4) + C(+3) + H(×2) = 4 + 3 × 2 = 4 + 6 = 10
    instruction: "Multiplication happens first: 4 + 3 × 2 = 10",
  },
  "error-case": {
    tiles: SHARED_TILES,
    target: 6,
    expected: ["J", "A", "B"], // J(5) + A(+1) + B(+2) = 5 + 1 + 2 = 8 ≠ 6 (intentionally wrong)
    instruction: "Not all combinations work. Try this wrong answer!",
  },
  "free-exploration": {
    tiles: SHARED_TILES,
    target: 6,
    expected: [], // Any valid equation
    instruction: "Find any valid equation that equals 6!",
  },
};

export const useTutorialStore = create<TutorialStore>()(
  immer((set, get) => ({
    // Initial state
    currentStage: "intro",
    guidedScenario: "basic-addition",
    tiles: [],
    selectedTiles: [],
    targetNumber: 6,

    // Guided mode
    expectedTiles: null,
    lockedSelection: false,

    // Practice mode
    practiceTimer: 180, // 3 minutes, same as real game
    guessTimer: 10,
    score: 0,
    foundEquations: [],
    validEquations: [],
    hintTimer: 0,
    showHint: false,

    // UI state
    showError: false,
    errorMessage: "",
    showSuccess: false,
    currentEquationResult: null,
    isCurrentEquationCorrect: null,

    // Initialize tutorial
    initializeTutorial: () => {
      set((state) => {
        state.currentStage = "intro";
        state.guidedScenario = "basic-addition";
        state.selectedTiles = [];
        state.score = 0;
        state.foundEquations = [];
        state.showError = false;
        state.showSuccess = false;
      });
    },

    // Start intro stage
    startIntro: () => {
      set((state) => {
        state.currentStage = "intro";
      });
    },

    // Start guided demo
    startGuided: () => {
      set((state) => {
        state.currentStage = "guided";
        state.guidedScenario = "basic-addition";
        const scenario = GUIDED_SCENARIOS["basic-addition"];
        state.tiles = scenario.tiles;
        state.targetNumber = scenario.target;
        state.expectedTiles = scenario.expected.map((label) => {
          const tile = scenario.tiles.find((t) => t.label === label);
          if (!tile) throw new Error(`Expected tile ${label} not found`);
          return tile;
        });
        state.selectedTiles = [];
      });
    },

    // Start practice mode
    startPractice: () => {
      set((state) => {
        const { tiles, targetNumber, validEquations } = generateTutorialTiles();
        // Ensure exactly 3 valid equations
        const limitedEquations = validEquations.slice(0, 3);

        state.currentStage = "practice";
        state.tiles = tiles;
        state.targetNumber = targetNumber;
        state.validEquations = limitedEquations;
        state.foundEquations = [];
        state.selectedTiles = [];
        state.practiceTimer = 180; // 3 minutes, same as real game
        state.guessTimer = 10;
        state.score = 0;
        state.hintTimer = 0;
        state.showHint = false;
      });
    },

    // Progress to next stage
    nextStage: () => {
      const currentStage = get().currentStage;

      if (currentStage === "intro") {
        get().startGuided();
      } else if (currentStage === "guided") {
        get().startPractice();
      } else if (currentStage === "practice") {
        set((state) => {
          state.currentStage = "complete";
        });
      }
    },

    // Progress to next guided scenario
    nextScenario: () => {
      const scenarios: GuidedScenario[] = [
        "basic-addition",
        "first-operator",
        "order-of-operations",
        "error-case",
        "free-exploration",
      ];
      const currentIndex = scenarios.indexOf(get().guidedScenario);
      const nextIndex = currentIndex + 1;

      if (nextIndex < scenarios.length) {
        set((state) => {
          const nextScenario = scenarios[nextIndex];
          state.guidedScenario = nextScenario;
          const scenario = GUIDED_SCENARIOS[nextScenario];
          state.tiles = scenario.tiles;
          state.targetNumber = scenario.target;
          state.expectedTiles =
            scenario.expected.length > 0
              ? scenario.expected.map((label) => {
                  const tile = scenario.tiles.find((t) => t.label === label);
                  if (!tile)
                    throw new Error(`Expected tile ${label} not found`);
                  return tile;
                })
              : null;
          state.selectedTiles = [];
          state.showError = false;
          state.showSuccess = false;
        });
      } else {
        get().nextStage();
      }
    },

    // Select a tile
    selectTile: (tile) => {
      set((state) => {
        // Prevent selection if already have 3 tiles or tile already selected
        if (
          state.selectedTiles.length >= 3 ||
          state.selectedTiles.find((t) => t.label === tile.label)
        ) {
          return;
        }

        // In guided mode with expected tiles, check if selection is allowed
        if (state.currentStage === "guided" && state.expectedTiles) {
          const scenario = GUIDED_SCENARIOS[state.guidedScenario];
          if (scenario.expected.length > 0) {
            // For specific expected sequences
            const expectedAtIndex =
              state.expectedTiles[state.selectedTiles.length];
            if (tile.label !== expectedAtIndex.label) {
              state.showError = true;
              state.errorMessage = "Try selecting the highlighted tile";
              setTimeout(() => {
                set((state) => {
                  state.showError = false;
                });
              }, 2000);
              return;
            }
          }
        }

        state.selectedTiles.push(tile);
        state.hintTimer = 0;
        state.showHint = false;

        // Check equation if 3 tiles selected
        if (state.selectedTiles.length === 3) {
          const result = calculateTutorialEquation(state.selectedTiles);
          const isValid = result === state.targetNumber;
          state.currentEquationResult = result;
          state.isCurrentEquationCorrect = isValid;

          if (state.currentStage === "guided") {
            if (state.guidedScenario === "error-case") {
              // For error case, we expect it to be wrong
              state.showError = true;
              state.errorMessage = "Wrong answer! The equation doesn't equal 6";
              state.showSuccess = false;
              setTimeout(() => {
                set((state) => {
                  state.selectedTiles = [];
                  state.showError = false;
                });
                // Auto-progress after showing error
                get().nextScenario();
              }, 2000);
            } else if (isValid) {
              state.showSuccess = true;
              setTimeout(() => {
                set((state) => {
                  state.selectedTiles = [];
                  state.showSuccess = false;
                });
                get().nextScenario();
              }, 1500);
            } else {
              // Unexpected error in guided mode
              state.showError = true;
              state.errorMessage = "Try again!";
              setTimeout(() => {
                set((state) => {
                  state.selectedTiles = [];
                  state.showError = false;
                });
              }, 1000);
            }
          } else if (state.currentStage === "practice") {
            if (isValid) {
              // Check if equation already found
              const equationKey = state.selectedTiles
                .map((t) => t.label)
                .sort()
                .join("");
              const alreadyFound = state.foundEquations.some(
                (eq) =>
                  eq
                    .map((t) => t.label)
                    .sort()
                    .join("") === equationKey,
              );

              if (!alreadyFound) {
                state.foundEquations.push([...state.selectedTiles]);
                state.score += 1;
                state.showSuccess = true;
                
                // Reset hint timer and hide hint when equation found
                state.hintTimer = 0;
                state.showHint = false;

                // Check if all equations found
                if (
                  state.foundEquations.length >= state.validEquations.length
                ) {
                  setTimeout(() => {
                    get().nextStage();
                  }, 1000);
                }
              } else {
                state.showError = true;
                state.errorMessage = "Already found this equation!";
              }
            } else {
              state.score -= 1;
              state.showError = true;
              state.errorMessage = "Wrong answer!";
            }

            // Reset for next guess
            setTimeout(() => {
              set((state) => {
                state.selectedTiles = [];
                state.showError = false;
                state.showSuccess = false;
                state.guessTimer = 10;
                // Reset hint timer when starting new guess
                state.hintTimer = 0;
                state.showHint = false;
              });
            }, 1000);
          }
        }
      });
    },

    // Unselect a tile
    unselectTile: (tile) => {
      set((state) => {
        state.selectedTiles = state.selectedTiles.filter(
          (t) => t.label !== tile.label,
        );
      });
    },

    // Clear selection
    clearSelection: () => {
      set((state) => {
        state.selectedTiles = [];
      });
    },

    // Check if current equation is valid
    checkEquation: () => {
      const state = get();
      return isValidTutorialEquation(state.selectedTiles, state.targetNumber);
    },

    // Validate guided selection
    validateGuidedSelection: () => {
      const state = get();
      if (!state.expectedTiles || state.expectedTiles.length === 0) {
        return true; // Free exploration
      }

      return state.selectedTiles.every(
        (tile, index) => tile.label === state.expectedTiles?.[index]?.label,
      );
    },

    // Update practice timer
    updatePracticeTimer: (time) => {
      set((state) => {
        state.practiceTimer = time;
        if (time <= 0) {
          // Time's up - complete tutorial
          get().nextStage();
        }
      });
    },

    // Update guess timer
    updateGuessTimer: (time) => {
      set((state) => {
        state.guessTimer = time;
        if (time <= 0 && state.selectedTiles.length > 0) {
          // Time's up for this guess
          state.score -= 1;
          state.selectedTiles = [];
          state.showError = true;
          state.errorMessage = "Time's up!";
          setTimeout(() => {
            set((state) => {
              state.showError = false;
              state.guessTimer = 10;
            });
          }, 1000);
        }
      });
    },

    // Update hint timer
    updateHintTimer: (time) => {
      set((state) => {
        state.hintTimer = time;
        // Show hint after 5 seconds in practice mode (reduced from 10)
        if (time >= 5 && !state.showHint && state.selectedTiles.length === 0 && state.currentStage === "practice") {
          state.showHint = true;
        }
      });
    },

    // Show hint animation
    showHintAnimation: () => {
      set((state) => {
        state.showHint = true;
      });
    },

    // Complete the tutorial
    completeTutorial: () => {
      set((state) => {
        state.currentStage = "complete";
      });
    },

    // Reset tutorial
    reset: () => {
      get().initializeTutorial();
    },
  })),
);
