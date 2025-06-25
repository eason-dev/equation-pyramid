import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { Tile } from "./Tile";

const meta = {
  component: Tile,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1a1a" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  argTypes: {
    tile: {
      control: { type: "object" },
    },
    isSelected: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    isFirstSelected: {
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tile: {
      number: 1,
      operator: "+",
      label: "A",
    },
    isSelected: false,
    onClick: fn(),
    disabled: false,
    isFirstSelected: false,
  },
};

export const Selected: Story = {
  args: {
    ...Default.args,
    isSelected: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const FirstSelectedWithAnimation: Story = {
  args: {
    ...Default.args,
    isSelected: true,
    disabled: true,
    isFirstSelected: true,
  },
};

export const WithSubtraction: Story = {
  args: {
    tile: {
      number: 5,
      operator: "-",
      label: "B",
    },
    isSelected: false,
    onClick: fn(),
    disabled: false,
    isFirstSelected: false,
  },
};

export const WithMultiplication: Story = {
  args: {
    tile: {
      number: 3,
      operator: "*",
      label: "C",
    },
    isSelected: false,
    onClick: fn(),
    disabled: false,
    isFirstSelected: false,
  },
};

export const WithDivision: Story = {
  args: {
    tile: {
      number: 2,
      operator: "/",
      label: "D",
    },
    isSelected: false,
    onClick: fn(),
    disabled: false,
    isFirstSelected: false,
  },
};
