import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  generateTutorialTiles,
  isValidTutorialEquation,
} from "@/logic/game/tutorialLogic";
import type { Tile } from "@/logic/game/types";

export type TutorialState = "playing" | "complete";

interface TutorialStore {
  // State
  currentState: TutorialState;
  tiles: Tile[];
  selectedTiles: Tile[];
  targetNumber: number;
  hintTimer: number;
  showHint: boolean;
  validEquations: Tile[][];

  // Actions
  initializeTutorial: () => void;
  selectTile: (tile: Tile) => void;
  unselectTile: (tile: Tile) => void;
  checkEquation: () => boolean;
  completeTutorial: () => void;
  updateHintTimer: (time: number) => void;
  showHintAnimation: () => void;
  reset: () => void;
}

export const useTutorialStore = create<TutorialStore>()(
  immer((set) => ({
    // Initial state
    currentState: "playing",
    tiles: [],
    selectedTiles: [],
    targetNumber: 6,
    hintTimer: 0,
    showHint: false,
    validEquations: [],

    // Initialize tutorial with simple tiles
    initializeTutorial: () => {
      set((state) => {
        const { tiles, targetNumber, validEquations } = generateTutorialTiles();

        state.tiles = tiles;
        state.targetNumber = targetNumber;
        state.validEquations = validEquations;
        state.currentState = "playing";
        state.selectedTiles = [];
        state.hintTimer = 0;
        state.showHint = false;
      });
    },

    // Select a tile
    selectTile: (tile) => {
      set((state) => {
        if (
          state.selectedTiles.length < 3 &&
          !state.selectedTiles.find((t) => t.label === tile.label)
        ) {
          state.selectedTiles.push(tile);

          // Check equation if 3 tiles selected
          if (state.selectedTiles.length === 3) {
            const isValid = isValidTutorialEquation(
              state.selectedTiles,
              state.targetNumber,
            );
            if (isValid) {
              state.currentState = "complete";
            } else {
              // Wrong answer - clear selection after delay
              setTimeout(() => {
                set((state) => {
                  state.selectedTiles = [];
                });
              }, 1000);
            }
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

    // Check if current equation is valid
    checkEquation: () => {
      let isValid = false;
      set((state) => {
        isValid = isValidTutorialEquation(
          state.selectedTiles,
          state.targetNumber,
        );
      });
      return isValid;
    },

    // Complete the tutorial
    completeTutorial: () => {
      set((state) => {
        state.currentState = "complete";
      });
    },

    // Update hint timer
    updateHintTimer: (time) => {
      set((state) => {
        state.hintTimer = time;
        // Show hint after 5 seconds
        if (time >= 5 && !state.showHint && state.selectedTiles.length === 0) {
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

    // Reset tutorial
    reset: () => {
      set((state) => {
        state.currentState = "playing";
        state.tiles = [];
        state.selectedTiles = [];
        state.targetNumber = 6;
        state.hintTimer = 0;
        state.showHint = false;
        state.validEquations = [];
      });
    },
  })),
);
