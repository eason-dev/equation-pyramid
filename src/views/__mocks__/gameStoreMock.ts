import type { GameAppState } from "@/logic/state/gameStore";
import type { GameState, Tile } from "@/logic/game/types";
import { GUESS_DURATION } from "@/constants";
import { fn } from "storybook/test";

export interface MockGameStoreState {
  currentState: GameAppState;
  selectedTiles: number[];
  gameState: GameState | null;
  guessTimer: number;
  startGuessing: (playerId: string) => void;
  foundEquations: string[];
  config: {
    numPlayers: number;
    numRounds: number;
    currentRound: number;
  };
  transitionToRoundOver: () => void;
}

const defaultMockTiles: Tile[] = [
  { number: 1, operator: "+", label: "A" },
  { number: 2, operator: "-", label: "B" },
  { number: 3, operator: "*", label: "C" },
  { number: 4, operator: "/", label: "D" },
  { number: 5, operator: "+", label: "E" },
  { number: 6, operator: "-", label: "F" },
  { number: 7, operator: "*", label: "G" },
  { number: 8, operator: "/", label: "H" },
  { number: 9, operator: "+", label: "I" },
  { number: 10, operator: "-", label: "J" },
];

const defaultMockGameState: GameState = {
  tiles: defaultMockTiles,
  targetNumber: 15,
  validEquations: [
    {
      tiles: [defaultMockTiles[0], defaultMockTiles[1], defaultMockTiles[2]],
      result: 15,
    },
    {
      tiles: [defaultMockTiles[3], defaultMockTiles[4], defaultMockTiles[5]],
      result: 15,
    },
  ],
};

export function createMockGameStore(
  overrides: Partial<MockGameStoreState> = {},
): MockGameStoreState {
  return {
    currentState: "game",
    selectedTiles: [],
    gameState: defaultMockGameState,
    guessTimer: GUESS_DURATION,
    startGuessing: fn(),
    foundEquations: [],
    config: {
      numPlayers: 2,
      numRounds: 3,
      currentRound: 1,
    },
    transitionToRoundOver: fn(),
    ...overrides,
  };
}

export { defaultMockTiles, defaultMockGameState };
