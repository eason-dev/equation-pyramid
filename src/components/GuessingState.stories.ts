import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GuessingState } from "./GuessingState";
import { GUESS_DURATION } from "@/constants";

const meta = {
  component: GuessingState,
  parameters: {
    layout: "centered",
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
} satisfies Meta<typeof GuessingState>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTiles = [
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

export const InitialState: Story = {
  args: {
    playerName: "Player 1",
    tiles: mockTiles,
    selectedTiles: [],
    targetNumber: 10,
    countdownSeconds: GUESS_DURATION,
    countdownTotalSeconds: GUESS_DURATION,
    state: "guessing",
  },
};

export const SinglePlayerMode: Story = {
  args: {
    // No playerName provided for single player mode
    tiles: mockTiles,
    selectedTiles: [],
    targetNumber: 10,
    countdownSeconds: GUESS_DURATION,
    countdownTotalSeconds: GUESS_DURATION,
    state: "guessing",
  },
};

export const OneTileSelected: Story = {
  args: {
    ...InitialState.args,
    selectedTiles: [0],
    countdownSeconds: 8,
  },
};

export const OneTileSelectedSinglePlayer: Story = {
  args: {
    ...SinglePlayerMode.args,
    selectedTiles: [0],
    countdownSeconds: 8,
  },
};

export const TwoTilesSelected: Story = {
  args: {
    ...InitialState.args,
    selectedTiles: [0, 1],
    countdownSeconds: 5,
  },
};

export const ThreeTilesSelected: Story = {
  args: {
    ...InitialState.args,
    selectedTiles: [0, 1, 2],
    countdownSeconds: 3,
  },
};

export const ThreeTilesSelectedSinglePlayer: Story = {
  args: {
    ...SinglePlayerMode.args,
    selectedTiles: [0, 1, 2],
    countdownSeconds: 3,
  },
};

export const CorrectAnswer: Story = {
  args: {
    ...InitialState.args,
    selectedTiles: [0, 1, 2],
    countdownSeconds: 0,
    state: "correct",
  },
};

export const CorrectAnswerSinglePlayer: Story = {
  args: {
    ...SinglePlayerMode.args,
    selectedTiles: [0, 1, 2],
    countdownSeconds: 0,
    state: "correct",
  },
};

export const WrongAnswer: Story = {
  args: {
    ...InitialState.args,
    selectedTiles: [0, 1, 2],
    countdownSeconds: 0,
    state: "wrong",
  },
};

export const WrongAnswerSinglePlayer: Story = {
  args: {
    ...SinglePlayerMode.args,
    selectedTiles: [0, 1, 2],
    countdownSeconds: 0,
    state: "wrong",
  },
};

export const LongPlayerName: Story = {
  args: {
    ...InitialState.args,
    playerName: "Super Long Player Name",
    selectedTiles: [0, 1, 2],
  },
};
