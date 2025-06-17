import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ClockIcon } from "./ClockIcon";

const meta = {
  component: ClockIcon,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    width: {
      control: { type: "number", min: 16, max: 100, step: 1 },
    },
    height: {
      control: { type: "number", min: 16, max: 100, step: 1 },
    },
    className: {
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof ClockIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 40,
    height: 40,
    className: "text-white",
  },
};
