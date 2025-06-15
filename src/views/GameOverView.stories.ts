import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import type { Player } from "@/logic/game/types";

import { GameOverView } from "./GameOverView";

const meta = {
  component: GameOverView,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof GameOverView>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPlayers: Player[] = [
  { id: "1", name: "Alice", score: 250 },
  { id: "2", name: "Bob", score: 180 },
];

export const Default: Story = {
  args: {
    players: mockPlayers,
    onNewGame: fn(),
  },
};

export const SinglePlayer: Story = {
  args: {
    ...Default.args,
    players: [mockPlayers[0]],
  },
};
