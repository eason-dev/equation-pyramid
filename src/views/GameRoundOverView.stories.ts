import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import type { Player } from "@/logic/game/types";

import { GameRoundOverView } from "./GameRoundOverView";

const meta = {
  component: GameRoundOverView,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof GameRoundOverView>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPlayers: Player[] = [
  { id: "1", name: "Alice", score: 75 },
  { id: "2", name: "Bob", score: 60 },
];

export const Default: Story = {
  args: {
    players: mockPlayers,
    currentRound: 1,
    onNextRound: fn(),
  },
};

export const WithOnePlayer: Story = {
  args: {
    ...Default.args,
    players: [mockPlayers[0]],
  },
};
