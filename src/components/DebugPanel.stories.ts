import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import type { Equation } from "@/logic/game/types";

import { DebugPanel } from "./DebugPanel";

const meta = {
  component: DebugPanel,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof DebugPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

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
    result: 10,
  },
];

export const Default: Story = {
  args: {
    validEquations: mockValidEquations,
    onFinishRound: fn(),
  },
};
