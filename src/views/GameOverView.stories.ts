import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import type { GameState, Player } from "@/logic/game/types";
import type { GameStoreState } from "@/logic/state/gameStore";

import { GameOverView } from "./GameOverView";

const meta = {
  component: GameOverView,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#1a1a1a",
        },
      ],
    },
  },
} satisfies Meta<typeof GameOverView>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPlayers: Player[] = [
  { id: "1", name: "Alice", score: 250 },
  { id: "2", name: "Bob", score: 180 },
];

const mockGameState = {
  tiles: [
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
  ],
  targetNumber: 15,
  validEquations: [
    {
      tiles: [
        { number: 1, operator: "+", label: "A" },
        { number: 2, operator: "-", label: "B" },
        { number: 3, operator: "*", label: "C" },
      ],
      result: 15,
    },
    {
      tiles: [
        { number: 4, operator: "/", label: "D" },
        { number: 5, operator: "+", label: "E" },
        { number: 6, operator: "-", label: "F" },
      ],
      result: 15,
    },
    {
      tiles: [
        { number: 7, operator: "*", label: "G" },
        { number: 8, operator: "/", label: "H" },
        { number: 9, operator: "+", label: "I" },
      ],
      result: 15,
    },
  ],
} as GameState;

const mockStoreOverrides: Partial<GameStoreState> = {
  config: {
    numPlayers: 2,
    numRounds: 5,
    currentRound: 5,
  },
  gameState: mockGameState,
  foundEquations: ["0,1,2", "3,4,5"],
};

export const Default: Story = {
  args: {
    players: mockPlayers,
    onNewGame: fn(),
    storeOverrides: mockStoreOverrides,
  },
};

export const SinglePlayer: Story = {
  args: {
    players: [{ id: "1", name: "Player 1", score: 150 }],
    onNewGame: fn(),
    storeOverrides: {
      ...mockStoreOverrides,
      config: {
        numPlayers: 1,
        numRounds: 3,
        currentRound: 3,
      },
    },
  },
};

export const TwoPlayers: Story = {
  args: {
    players: [
      { id: "1", name: "Player 1", score: 250 },
      { id: "2", name: "Player 2", score: 180 },
    ],
    onNewGame: fn(),
    storeOverrides: mockStoreOverrides,
  },
};

export const HighScores: Story = {
  args: {
    players: [
      { id: "1", name: "Champion", score: 500 },
      { id: "2", name: "Runner-up", score: 450 },
    ],
    onNewGame: fn(),
    storeOverrides: {
      ...mockStoreOverrides,
      foundEquations: ["0,1,2", "3,4,5", "6,7,8"],
    },
  },
};

export const NoAnswersFound: Story = {
  args: {
    players: [
      { id: "1", name: "Beginner", score: 25 },
      { id: "2", name: "Learner", score: 15 },
    ],
    onNewGame: fn(),
    storeOverrides: {
      ...mockStoreOverrides,
      foundEquations: [],
    },
  },
};

export const SingleRound: Story = {
  args: {
    players: mockPlayers,
    onNewGame: fn(),
    storeOverrides: {
      ...mockStoreOverrides,
      config: {
        numPlayers: 2,
        numRounds: 1,
        currentRound: 1,
      },
    },
  },
};
