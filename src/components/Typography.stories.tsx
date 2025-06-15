import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Typography } from "./Typography";

const meta = {
  component: Typography,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["h1", "h2", "label", "p1", "p2", "p3"],
    },
    tag: {
      control: { type: "select" },
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "span",
        "div",
        "label",
      ],
    },
    children: {
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const H1: Story = {
  args: {
    variant: "h1",
    children: "Equation Pyramid",
  },
};

export const H2: Story = {
  args: {
    variant: "h2",
    children: "Equation Pyramid",
  },
};

export const Label: Story = {
  args: {
    variant: "label",
    children: "Equation Pyramid",
  },
};

export const P1: Story = {
  args: {
    variant: "p1",
    children: "Equation Pyramid",
  },
};

export const P2: Story = {
  args: {
    variant: "p2",
    children: "Equation Pyramid",
  },
};

export const P3: Story = {
  args: {
    variant: "p3",
    children: "Equation Pyramid",
  },
};

export const CustomTag: Story = {
  args: {
    variant: "h1",
    tag: "span",
    children: "H1 styled but using span tag",
  },
};

export const AllVariants: Story = {
  args: { variant: "h1" },
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">H1 • Inter / Bold / 32</Typography>
      <Typography variant="h2">H2 • Inter / Bold / 24</Typography>
      <Typography variant="label">Label • Inter / Bold / 16</Typography>
      <Typography variant="p1">P1 • Inter / Regular / 24</Typography>
      <Typography variant="p2">P2 • Inter / Regular / 20</Typography>
      <Typography variant="p3">P3 • Inter / Regular / 16</Typography>
    </div>
  ),
};
