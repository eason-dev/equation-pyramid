import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { TileList } from "./TileList";

const meta = {
  component: TileList,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TileList>;

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

export const Default: Story = {
  args: {
    tiles: mockTiles,
    selectedTiles: [],
    onTileClick: fn(),
    isGuessing: true,
  },
};

export const WithOneSelection: Story = {
  args: {
    tiles: mockTiles,
    selectedTiles: [0],
    onTileClick: fn(),
    isGuessing: true,
  },
};

export const WithThreeSelections: Story = {
  args: {
    tiles: mockTiles,
    selectedTiles: [0, 2, 5],
    onTileClick: fn(),
    isGuessing: true,
  },
};
