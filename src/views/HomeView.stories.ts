import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { HomeView } from "./HomeView";

const meta = {
  component: HomeView,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof HomeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onStart: fn(),
    onTutorialClick: fn(),
  },
};
