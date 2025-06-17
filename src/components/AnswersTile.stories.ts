import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AnswersTile } from "./AnswersTile";
import type { Equation, Tile } from "@/logic/game/types";

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
];

export const WithFoundEquations: Story = {
  args: {
    foundEquations: ["0,1,2", "3,4,5"],
    validEquations: mockValidEquations,
    tiles: mockTiles,
  },
};

export const SingleFoundEquation: Story = {
  args: {
    foundEquations: ["0,1,2"],
    validEquations: mockValidEquations,
    tiles: mockTiles,
  },
};
