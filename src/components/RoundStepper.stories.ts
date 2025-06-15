import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RoundStepper } from "./RoundStepper";

const meta = {
  component: RoundStepper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RoundStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstRound: Story = {
  args: {
    currentRound: 1,
    totalRounds: 5,
  },
};

export const MiddleRound: Story = {
  args: {
    currentRound: 3,
    totalRounds: 5,
  },
};

export const LastRound: Story = {
  args: {
    currentRound: 5,
    totalRounds: 5,
  },
};

export const OneRound: Story = {
  args: {
    currentRound: 1,
    totalRounds: 1,
  },
};

export const ThreeRounds: Story = {
  args: {
    currentRound: 2,
    totalRounds: 3,
  },
};

export const TenRounds: Story = {
  args: {
    currentRound: 7,
    totalRounds: 10,
  },
};
