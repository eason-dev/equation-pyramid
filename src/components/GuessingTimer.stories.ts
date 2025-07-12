import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GUESS_DURATION } from "@/constants";
import { GuessingTimer } from "./GuessingTimer";

const meta = {
  component: GuessingTimer,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof GuessingTimer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    seconds: GUESS_DURATION,
    totalSeconds: GUESS_DURATION,
    isVisible: true,
  },
};

export const LowTime: Story = {
  args: {
    seconds: 5,
    totalSeconds: GUESS_DURATION,
    isVisible: true,
  },
};

export const Zero: Story = {
  args: {
    seconds: 0,
    totalSeconds: GUESS_DURATION,
    isVisible: true,
  },
};

export const PartialProgress: Story = {
  args: {
    seconds: 7,
    totalSeconds: GUESS_DURATION,
    isVisible: true,
  },
};
