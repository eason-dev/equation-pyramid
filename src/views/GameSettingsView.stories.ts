import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { INITIAL_PLAYERS, INITIAL_ROUNDS } from "@/constants";

import { GameSettingsView } from "./GameSettingsView";

const meta = {
  component: GameSettingsView,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof GameSettingsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    numPlayers: INITIAL_PLAYERS,
    numRounds: INITIAL_ROUNDS,
    onConfigUpdate: fn(),
    onStartGame: fn(),
  },
};

export const TwoPlayers: Story = {
  args: {
    ...Default.args,
    numPlayers: 2,
  },
};

export const OneRound: Story = {
  args: {
    ...Default.args,
    numRounds: 1,
  },
};

export const FiveRounds: Story = {
  args: {
    ...Default.args,
    numRounds: 5,
  },
};
