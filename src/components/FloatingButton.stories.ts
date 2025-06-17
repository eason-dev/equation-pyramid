import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { FloatingButton } from "./FloatingButton";

const meta = {
  component: FloatingButton,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    children: {
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof FloatingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClick: fn(),
    children: "Next Round",
  },
};
