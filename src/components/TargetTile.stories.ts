import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TargetTile } from "./TargetTile";

const meta = {
  component: TargetTile,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TargetTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    targetNumber: 15,
  },
};

export const SingleDigit: Story = {
  args: {
    targetNumber: 7,
  },
};

export const LargeNumber: Story = {
  args: {
    targetNumber: 142,
  },
};

export const Zero: Story = {
  args: {
    targetNumber: 0,
  },
};

export const NegativeNumber: Story = {
  args: {
    targetNumber: -8,
  },
};
