import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Block } from "./Block";
import { Typography } from "./Typography";

const meta = {
  component: Block,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    className: {
      control: { type: "text" },
    },
  },
} satisfies Meta<typeof Block>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Block Content",
  },
};

export const TargetNumber: Story = {
  args: {
    className:
      "flex flex-col items-center justify-center gap-2.5",
    children: (
      <>
        <Typography variant="h2">Target</Typography>
        <Typography variant="p1">10</Typography>
      </>
    ),
  },
};

export const AnswersSingle: Story = {
  args: {
    className: "flex flex-col items-center justify-center gap-4",
    children: (
      <>
        <Typography variant="h2">Answers</Typography>
        <Typography variant="p1">D F B</Typography>
      </>
    ),
  },
};

export const AnswersMultiple: Story = {
  args: {
    className: "flex flex-col items-center justify-center gap-4",
    children: (
      <>
        <Typography variant="h2">Answers</Typography>
        <Typography variant="p1">D F B</Typography>
        <Typography variant="p1">D F B</Typography>
        <Typography variant="p1">D F B</Typography>
      </>
    ),
  },
};
