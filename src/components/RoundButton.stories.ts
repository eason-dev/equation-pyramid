import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RoundButton } from "./RoundButton";

const meta: Meta<typeof RoundButton> = {
  title: "Components/RoundButton",
  component: RoundButton,
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
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
    isActive: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Start",
  },
};

export const Disabled: Story = {
  args: {
    children: "Start",
    disabled: true,
  },
};

export const CustomText: Story = {
  args: {
    children: "Play",
  },
};

export const ShortText: Story = {
  args: {
    children: "Go",
  },
};

export const LongText: Story = {
  args: {
    children: "Let the Game Begin",
  },
};

export const Active: Story = {
  args: {
    children: "Start",
    isActive: true,
  },
};

export const ActiveWithCustomText: Story = {
  args: {
    children: "Playing",
    isActive: true,
  },
};
