import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import type { Player, Tile } from "@/logic/game/types";
import { ROUND_DURATION } from "@/constants";

import { GamePlayingView } from "./GamePlayingView";

const meta = {
  component: GamePlayingView,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof GamePlayingView>;

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

const mockPlayers: Player[] = [
  { id: "1", name: "Alice", score: 85 },
  { id: "2", name: "Bob", score: 92 },
];

export const Default: Story = {
  args: {
    tiles: mockTiles,
    players: mockPlayers,
    selectedPlayerId: null,
    timeRemaining: ROUND_DURATION,
    onTileClick: fn(),
  },
};

export const SinglePlayer: Story = {
  args: {
    ...Default.args,
    players: [mockPlayers[1]],
  },
};

export const LowTime: Story = {
  args: {
    ...Default.args,
    timeRemaining: 15,
  },
};
