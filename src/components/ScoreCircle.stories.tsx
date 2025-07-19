import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ScoreCircle } from "./ScoreCircle";

const meta = {
  component: ScoreCircle,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#1a1a1a",
        },
      ],
    },
  },
  argTypes: {
    score: {
      control: { type: "number" },
    },
    showCrown: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof ScoreCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    score: 150,
    showCrown: false,
  },
};

export const WithCrown: Story = {
  args: {
    score: 250,
    showCrown: true,
  },
};

export const LowScore: Story = {
  args: {
    score: 25,
    showCrown: false,
  },
};

export const HighScore: Story = {
  args: {
    score: 500,
    showCrown: false,
  },
};

export const Winner: Story = {
  args: {
    score: 350,
    showCrown: true,
  },
};

export const ZeroScore: Story = {
  args: {
    score: 0,
    showCrown: false,
  },
};

export const NegativeScore: Story = {
  args: {
    score: -5,
    showCrown: false,
  },
};
