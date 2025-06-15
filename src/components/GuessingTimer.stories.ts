import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GuessingTimer } from "./GuessingTimer";
import { GUESS_DURATION } from "@/constants";

const meta = {
  component: GuessingTimer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GuessingTimer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    seconds: GUESS_DURATION,
    isVisible: true,
  },
};

export const LowTime: Story = {
  args: {
    seconds: 5,
    isVisible: true,
  },
};

export const Zero: Story = {
  args: {
    seconds: 0,
    isVisible: true,
  },
};
