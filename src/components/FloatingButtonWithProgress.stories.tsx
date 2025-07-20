import type { Meta, StoryObj } from "@storybook/react";
import { FloatingButtonWithProgress } from "./FloatingButtonWithProgress";

const meta = {
  title: "Components/FloatingButtonWithProgress",
  component: FloatingButtonWithProgress,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A floating button that follows the mouse cursor with optional progress indicator and curved text animation.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    progress: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Progress value from 0 to 1",
    },
    showCompletionText: {
      control: "boolean",
      description: "Show curved completion text around button",
    },
    completionText: {
      control: "text",
      description: "Text to display in curved animation",
    },
    disabled: {
      control: "boolean",
      description: "Disable button interaction",
    },
  },
} satisfies Meta<typeof FloatingButtonWithProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllAnswersCompleted: Story = {
  args: {
    children: "Next Round",
    onClick: () => console.log("Next round!"),
    progress: 1,
    showCompletionText: true,
    completionText: "All Answers Completed",
  },
};

export const TimesUp: Story = {
  args: {
    children: "Next Round",
    onClick: () => console.log("Next round!"),
    progress: 1,
    showCompletionText: true,
    completionText: "Time's Up!",
  },
};

export const EndGame: Story = {
  args: {
    children: "End Game",
    onClick: () => console.log("Game over!"),
    progress: 1,
    showCompletionText: true,
    completionText: "All Answers Completed",
  },
};

export const ProgressAnimation: Story = {
  args: {
    children: "Loading...",
    onClick: () => console.log("Button clicked!"),
    progress: 0,
    showCompletionText: false,
  },
  render: (args) => {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) return 0;
          return prev + 0.1;
        });
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return <FloatingButtonWithProgress {...args} progress={progress} />;
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates animated progress from 0 to 1 and back.",
      },
    },
  },
};

// Add React import for the animated story
import React from "react";
