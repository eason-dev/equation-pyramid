import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { Tile } from "./Tile";

const meta = {
  component: Tile,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tile: {
      number: 1,
      operator: "+",
      label: "1",
    },
    isSelected: false,
    onClick: fn(),
    disabled: false,
  },
};
