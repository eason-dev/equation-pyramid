import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { AnswerButton } from "./AnswerButton";

const meta = {
  component: AnswerButton,
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
    playerName: {
      control: { type: "text" },
    },
    score: {
      control: { type: "number" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof AnswerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    playerName: "Player 1",
    score: 1,
    onClick: fn(),
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const HighScore: Story = {
  args: {
    ...Default.args,
    playerName: "Alice",
    score: 150,
  },
};

export const LongPlayerName: Story = {
  args: {
    ...Default.args,
    playerName: "Super Long Player Name",
    score: 42,
  },
};

export const ZeroScore: Story = {
  args: {
    ...Default.args,
    playerName: "Newbie",
    score: 0,
  },
};
