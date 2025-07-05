import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { Equation, Tile, Player } from "@/logic/game/types";
import type { FoundEquation } from "@/logic/state/gameStore";
import { AnswersTile } from "./AnswersTile";

const meta = {
  component: AnswersTile,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AnswersTile>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTiles: Tile[] = [
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

const mockValidEquations: Equation[] = [
  {
    tiles: [
      { number: 1, operator: "+", label: "A" },
      { number: 2, operator: "-", label: "B" },
      { number: 3, operator: "*", label: "C" },
    ],
    result: 6,
  },
  {
    tiles: [
      { number: 4, operator: "/", label: "D" },
      { number: 5, operator: "+", label: "E" },
      { number: 6, operator: "-", label: "F" },
    ],
    result: 5,
  },
  {
    tiles: [
      { number: 7, operator: "*", label: "G" },
      { number: 8, operator: "/", label: "H" },
      { number: 9, operator: "+", label: "I" },
    ],
    result: 8,
  },
];

const mockSinglePlayer: Player[] = [
  { id: "player-1", name: "Player 1", score: 2 },
];

const mockTwoPlayers: Player[] = [
  { id: "player-1", name: "Player 1", score: 2 },
  { id: "player-2", name: "Player 2", score: 1 },
];

const mockFoundEquationsSingle: FoundEquation[] = [
  { key: "0,1,2", foundBy: "player-1" },
  { key: "3,4,5", foundBy: "player-1" },
];

const mockFoundEquationsMulti: FoundEquation[] = [
  { key: "0,1,2", foundBy: "player-1" },
  { key: "3,4,5", foundBy: "player-2" },
];

export const SinglePlayerGamePlayingView: Story = {
  args: {
    foundEquations: mockFoundEquationsSingle,
    validEquations: mockValidEquations,
    tiles: mockTiles,
    players: mockSinglePlayer,
    showAllAnswers: false,
  },
};

export const TwoPlayerGamePlayingView: Story = {
  args: {
    foundEquations: mockFoundEquationsMulti,
    validEquations: mockValidEquations,
    tiles: mockTiles,
    players: mockTwoPlayers,
    showAllAnswers: false,
  },
};

export const SinglePlayerGameOverView: Story = {
  args: {
    foundEquations: mockFoundEquationsSingle,
    validEquations: mockValidEquations,
    tiles: mockTiles,
    players: mockSinglePlayer,
    showAllAnswers: true,
  },
};

export const TwoPlayerGameOverView: Story = {
  args: {
    foundEquations: mockFoundEquationsMulti,
    validEquations: mockValidEquations,
    tiles: mockTiles,
    players: mockTwoPlayers,
    showAllAnswers: true,
  },
};

export const GameOverViewWithUnfoundEquations: Story = {
  args: {
    foundEquations: [{ key: "0,1,2", foundBy: "player-1" }],
    validEquations: mockValidEquations,
    tiles: mockTiles,
    players: mockTwoPlayers,
    showAllAnswers: true,
  },
};

export const EmptyState: Story = {
  args: {
    foundEquations: [],
    validEquations: mockValidEquations,
    tiles: mockTiles,
    players: mockSinglePlayer,
    showAllAnswers: false,
  },
};