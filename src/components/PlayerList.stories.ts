import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlayerList } from "./PlayerList";

const meta = {
  component: PlayerList,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof PlayerList>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPlayers = [
  { id: "1", name: "Alice", score: 150 },
  { id: "2", name: "Bob", score: 120 },
  { id: "3", name: "Charlie", score: 90 },
  { id: "4", name: "Diana", score: 200 },
];

export const Default: Story = {
  args: {
    players: mockPlayers,
    selectedPlayerId: null,
  },
};

export const WithSelection: Story = {
  args: {
    players: mockPlayers,
    selectedPlayerId: "2",
  },
};

export const SinglePlayer: Story = {
  args: {
    players: [{ id: "1", name: "Solo Player", score: 75 }],
    selectedPlayerId: null,
  },
};

export const HighScores: Story = {
  args: {
    players: [
      { id: "1", name: "Champion", score: 500 },
      { id: "2", name: "Runner-up", score: 450 },
      { id: "3", name: "Third Place", score: 400 },
    ],
    selectedPlayerId: "1",
  },
};
