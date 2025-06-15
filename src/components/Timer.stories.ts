import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ROUND_DURATION } from "@/constants";
import { Timer } from "./Timer";

const meta = {
  component: Timer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    seconds: ROUND_DURATION,
  },
};

export const Counting: Story = {
  args: {
    seconds: 123,
  },
};

export const LowTime: Story = {
  args: {
    seconds: 15,
  },
};

export const Zero: Story = {
  args: {
    seconds: 0,
  },
};
