import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Header } from "./Header";

const meta = {
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
