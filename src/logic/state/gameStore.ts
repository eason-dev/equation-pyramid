import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { GameState, Player } from "@/logic/game/types";
import { generateGameState, calculateEquation } from "@/logic/game/logic";
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
  MAX_ROUNDS,
  MIN_ROUNDS,
  INITIAL_PLAYERS,
  INITIAL_ROUNDS,
  ROUND_DURATION,
  GUESS_DURATION,
  TILES_PER_EQUATION,
} from "@/constants";

export type GameAppState =
  | "menu"
  | "config"
  | "game"
  | "guessing"
  | "showingResult"
  | "roundOver"
  | "gameOver";

interface GameConfig {
  numPlayers: number;
  numRounds: number;
  currentRound: number;
}

interface RoundHistory {
  roundNumber: number;
  gameState: GameState;
  foundEquations: string[];
  playerScores: Record<string, number>;
}

interface GameData {
  // Current app state
  currentState: GameAppState;

  // Game data
  gameState: GameState | null;
  selectedTiles: number[];
  foundEquations: string[];
  config: GameConfig;
  players: Player[];
  mainTimer: number;
  guessTimer: number;
  guessingPlayerId: string | null;

  // Round history
  roundHistory: RoundHistory[];

  // Result display data
  currentEquationResult: number | null;
  isCurrentEquationCorrect: boolean | null;

  // Timers
  mainTimerInterval: NodeJS.Timeout | null;
  guessTimerInterval: NodeJS.Timeout | null;
  resultDelayInterval: NodeJS.Timeout | null;
}

export interface GameStoreState extends GameData {
  // Actions
  start: () => void;
  updateConfig: (config: Partial<GameConfig>) => void;
  startGame: () => void;
  startGuessing: (playerId: string) => void;
  selectTile: (tileIndex: number) => void;
  submitEquation: () => void;
  nextRound: () => void;
  continueGame: () => void;
  exitToMenu: () => void;

  // Timer actions
  startMainTimer: () => void;
  stopMainTimer: () => void;
  startGuessTimer: () => void;
  stopGuessTimer: () => void;
  startResultDelayTimer: () => void;
  stopResultDelayTimer: () => void;

  // Reset actions
  resetGame: () => void;

  // New actions
  transitionToRoundOver: () => void;
}

const initialConfig: GameConfig = {
  numPlayers: INITIAL_PLAYERS,
  numRounds: INITIAL_ROUNDS,
  currentRound: 0,
};

const initialState: GameData = {
  currentState: "menu" as GameAppState,
  gameState: null as GameState | null,
  selectedTiles: [],
  foundEquations: [],
  config: initialConfig,
  players: [],
  mainTimer: ROUND_DURATION,
  guessTimer: GUESS_DURATION,
  guessingPlayerId: null,
  roundHistory: [],
  currentEquationResult: null,
  isCurrentEquationCorrect: null,
  mainTimerInterval: null,
  guessTimerInterval: null,
  resultDelayInterval: null,
};

const createInitialPlayers = (numPlayers: number): Player[] => {
  return Array.from({ length: numPlayers }, (_, i) => ({
    id: `player-${i + 1}`,
    name: `Player ${i + 1}`,
    score: 0,
  }));
};

export const useGameStore = create<GameStoreState>()(
  immer((set, get) => ({
    ...initialState,

    start: () => {
      set((state) => {
        state.currentState = "config";
      });
    },

    updateConfig: (newConfig) => {
      set((state) => {
        // Update config with validation
        if (newConfig.numPlayers !== undefined) {
          state.config.numPlayers = Math.max(
            MIN_PLAYERS,
            Math.min(MAX_PLAYERS, newConfig.numPlayers),
          );
        }
        if (newConfig.numRounds !== undefined) {
          state.config.numRounds = Math.max(
            MIN_ROUNDS,
            Math.min(MAX_ROUNDS, newConfig.numRounds),
          );
        }
      });
    },

    startGame: () => {
      const { startMainTimer } = get();
      set((state) => {
        state.currentState = "game";
        state.config.currentRound = 1;
        state.gameState = generateGameState();
        state.players = createInitialPlayers(state.config.numPlayers);
        state.selectedTiles = [];
        state.foundEquations = [];
        state.mainTimer = ROUND_DURATION;
        state.guessTimer = GUESS_DURATION;
        state.guessingPlayerId = null;
      });
      startMainTimer();
    },

    startGuessing: (playerId) => {
      const { stopMainTimer, startGuessTimer } = get();
      stopMainTimer();
      set((state) => {
        state.currentState = "guessing";
        state.guessingPlayerId = playerId;
        state.guessTimer = GUESS_DURATION;
      });
      startGuessTimer();
    },

    selectTile: (tileIndex) => {
      const { selectedTiles, stopGuessTimer } = get();

      set((state) => {
        if (state.selectedTiles.length < TILES_PER_EQUATION) {
          state.selectedTiles.push(tileIndex);
        }
      });

      // When 3rd tile is selected, calculate result and show it with delay
      if (selectedTiles.length === TILES_PER_EQUATION - 1) {
        const state = get();
        if (state.gameState) {
          const [i, j, k] = [...state.selectedTiles, tileIndex];
          const equation = {
            tiles: [
              state.gameState.tiles[i],
              state.gameState.tiles[j],
              state.gameState.tiles[k],
            ] as [
              (typeof state.gameState.tiles)[0],
              (typeof state.gameState.tiles)[0],
              (typeof state.gameState.tiles)[0],
            ],
          };

          const result = calculateEquation(equation.tiles);
          const equationKey = `${i},${j},${k}`;
          const isDuplicate = state.foundEquations.includes(equationKey);
          const isCorrect = result === state.gameState.targetNumber && !isDuplicate;
          
          stopGuessTimer();

          set((state) => {
            state.currentState = "showingResult";
            state.currentEquationResult = result;
            state.isCurrentEquationCorrect = isCorrect;
            // Keep the current guessTimer value instead of resetting
          });

          // Auto-submit after 5 seconds to give more time to see the result
          setTimeout(() => {
            const { submitEquation } = get();
            submitEquation();
          }, 2500);
        }
      }
    },

    submitEquation: () => {
      const { startMainTimer, transitionToRoundOver } = get();
      set((state) => {
        if (
          state.selectedTiles.length !== TILES_PER_EQUATION ||
          !state.gameState ||
          !state.guessingPlayerId
        ) {
          return;
        }

        const [i, j, k] = state.selectedTiles;
        const equation = {
          tiles: [
            state.gameState.tiles[i],
            state.gameState.tiles[j],
            state.gameState.tiles[k],
          ] as [
            (typeof state.gameState.tiles)[0],
            (typeof state.gameState.tiles)[0],
            (typeof state.gameState.tiles)[0],
          ],
        };

        const equationKey = `${i},${j},${k}`;
        const result = calculateEquation(equation.tiles);

        const player = state.players.find(
          (p) => p.id === state.guessingPlayerId,
        );

        if (state.foundEquations.includes(equationKey)) {
          // Deduct point for duplicate equation
          if (player) {
            player.score -= 1;
          }
        } else if (result === state.gameState.targetNumber) {
          // Award point for correct equation
          if (player) {
            player.score += 1;
          }
          state.foundEquations.push(equationKey);
        } else {
          // Deduct point for incorrect equation
          if (player) {
            player.score -= 1;
          }
        }

        // Reset selection and return to game state
        state.selectedTiles = [];
        state.guessingPlayerId = null;
        state.currentEquationResult = null;
        state.isCurrentEquationCorrect = null;
        state.currentState = "game";
      });

      // Check if all equations have been found after updating the state
      const currentState = get();
      if (currentState.gameState && 
          currentState.foundEquations.length >= currentState.gameState.validEquations.length) {
        // All answers completed - transition to round over
        transitionToRoundOver();
      } else {
        // Continue the round
        startMainTimer();
      }
    },

    nextRound: () => {
      const { startMainTimer, stopMainTimer, stopGuessTimer } = get();
      set((state) => {
        // Save current round to history before moving to next round or ending game
        // (Only if not already saved by transitionToRoundOver)
        if (state.gameState && state.config.currentRound > 0) {
          const existingRound = state.roundHistory.find(r => r.roundNumber === state.config.currentRound);
          
          if (!existingRound) {
            const playerScores: Record<string, number> = {};
            state.players.forEach(player => {
              playerScores[player.id] = player.score;
            });
            
            state.roundHistory.push({
              roundNumber: state.config.currentRound,
              gameState: { ...state.gameState },
              foundEquations: [...state.foundEquations],
              playerScores
            });
          }
        }

        if (state.config.currentRound >= state.config.numRounds) {
          state.currentState = "gameOver";
        } else {
          state.config.currentRound += 1;
          state.currentState = "game";
          state.gameState = generateGameState();
          state.selectedTiles = [];
          state.foundEquations = [];
          state.mainTimer = ROUND_DURATION;
          state.guessTimer = GUESS_DURATION;
          state.guessingPlayerId = null;
        }
      });

      if (get().currentState === "game") {
        startMainTimer();
      } else if (get().currentState === "gameOver") {
        // Stop all timers when game is over
        stopMainTimer();
        stopGuessTimer();
      }
    },

    continueGame: () => {
      set((state) => {
        state.currentState = "config";
        state.config.currentRound = 0;
      });
    },

    exitToMenu: () => {
      const { resetGame } = get();
      resetGame();
    },

    startMainTimer: () => {
      const { stopMainTimer } = get();
      stopMainTimer(); // Clear any existing timer

      const interval = setInterval(() => {
        const currentState = get();
        if (currentState.mainTimer > 0) {
          set((state) => {
            state.mainTimer -= 1;
          });
        } else {
          // Timer expired - transition to round over
          get().transitionToRoundOver();
          clearInterval(interval);
        }
      }, 1000);

      set((state) => {
        state.mainTimerInterval = interval;
      });
    },

    transitionToRoundOver: () => {
      const { stopMainTimer } = get();
      stopMainTimer();

      set((state) => {
        // Save current round to history when round ends
        if (state.gameState && state.config.currentRound > 0) {
          // Check if this round is already in history (to avoid duplicates)
          const existingRound = state.roundHistory.find(r => r.roundNumber === state.config.currentRound);
          
          if (!existingRound) {
            const playerScores: Record<string, number> = {};
            state.players.forEach(player => {
              playerScores[player.id] = player.score;
            });
            
            state.roundHistory.push({
              roundNumber: state.config.currentRound,
              gameState: { ...state.gameState },
              foundEquations: [...state.foundEquations],
              playerScores
            });
          }
        }
        
        state.currentState = "roundOver";
      });
    },

    stopMainTimer: () => {
      const state = get();
      if (state.mainTimerInterval) {
        clearInterval(state.mainTimerInterval);
        set((state) => {
          state.mainTimerInterval = null;
        });
      }
    },

    startGuessTimer: () => {
      const { stopGuessTimer, startMainTimer } = get();
      stopGuessTimer(); // Clear any existing timer

      const interval = setInterval(() => {
        const currentState = get();
        if (currentState.guessTimer > 0) {
          set((state) => {
            state.guessTimer -= 1;
          });
        } else {
          // Timer expired - show wrong effect first, then transition back to game
          set((state) => {
            state.currentState = "showingResult";
            state.currentEquationResult = null; // null indicates timeout
            state.isCurrentEquationCorrect = false; // Show wrong effect
            state.guessTimerInterval = null;
            // deduct point for timeout
            const player = state.players.find(
              (p) => p.id === state.guessingPlayerId,
            );
            if (player) {
              player.score -= 1;
            }
          });
          clearInterval(interval);
          
          // Auto-transition back to game after showing wrong effect
          setTimeout(() => {
            set((state) => {
              state.currentState = "game";
              state.guessingPlayerId = null;
              state.selectedTiles = [];
              state.currentEquationResult = null;
              state.isCurrentEquationCorrect = null;
            });
            startMainTimer();
          }, 2500); // Same delay as normal equation submission
        }
      }, 1000);

      set((state) => {
        state.guessTimerInterval = interval;
      });
    },

    stopGuessTimer: () => {
      const state = get();
      if (state.guessTimerInterval) {
        clearInterval(state.guessTimerInterval);
        set((state) => {
          state.guessTimerInterval = null;
        });
      }
    },

          startResultDelayTimer: () => {
        const { stopResultDelayTimer } = get();
        stopResultDelayTimer();
      },

      stopResultDelayTimer: () => {
        const state = get();
        if (state.resultDelayInterval) {
          clearInterval(state.resultDelayInterval);
          set((state) => {
            state.resultDelayInterval = null;
          });
        }
      },

    resetGame: () => {
      const { stopMainTimer, stopGuessTimer } = get();
      stopMainTimer();
      stopGuessTimer();

      set((state) => {
        state.currentState = "menu";
        state.gameState = null;
        state.selectedTiles = [];
        state.foundEquations = [];
        state.config = { ...initialConfig };
        state.players = createInitialPlayers(INITIAL_PLAYERS);
        state.mainTimer = ROUND_DURATION;
        state.guessTimer = GUESS_DURATION;
        state.guessingPlayerId = null;
        state.roundHistory = [];
        state.currentEquationResult = null;
        state.isCurrentEquationCorrect = null;
      });
    },
  })),
);
