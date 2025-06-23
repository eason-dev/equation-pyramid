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
  | "roundOver"
  | "gameOver";

interface GameConfig {
  numPlayers: number;
  numRounds: number;
  currentRound: number;
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

  // Timers
  mainTimerInterval: NodeJS.Timeout | null;
  guessTimerInterval: NodeJS.Timeout | null;
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
  mainTimerInterval: null,
  guessTimerInterval: null,
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
      const { selectedTiles, submitEquation } = get();

      set((state) => {
        if (state.selectedTiles.length < TILES_PER_EQUATION) {
          state.selectedTiles.push(tileIndex);
        }
      });

      if (selectedTiles.length === TILES_PER_EQUATION - 1) {
        submitEquation();
      }
    },

    submitEquation: () => {
      const { startMainTimer } = get();
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
        state.currentState = "game";
      });
      startMainTimer();
    },

    nextRound: () => {
      const { startMainTimer, stopMainTimer, stopGuessTimer } = get();
      set((state) => {
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
          // Timer expired - transition back to game
          set((state) => {
            state.currentState = "game";
            state.guessingPlayerId = null;
            state.selectedTiles = [];
            state.guessTimerInterval = null;
            // deduct point for incorrect equation
            const player = state.players.find(
              (p) => p.id === state.guessingPlayerId,
            );
            if (player) {
              player.score -= 1;
            }
          });
          clearInterval(interval);
          startMainTimer();
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
      });
    },
  })),
);
