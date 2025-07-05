import type { Meta, StoryObj } from "@storybook/react";
import { MusicButton } from "./MusicButton";

// Note: MusicButton now uses global state, so these stories show the visual states
// The actual functionality would require the full app context with gameStore

const meta: Meta<typeof MusicButton> = {
  title: "Components/MusicButton",
  component: MusicButton,
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
    trackType: {
      control: "select",
      options: ["main", "game"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MusicButton>;

export const MainMenuAudio: Story = {
  args: {
    trackType: "main",
  },
};

export const GameAudio: Story = {
  args: {
    trackType: "game",
  },
};

export const DefaultAudio: Story = {
  args: {
    // No trackType provided
  },
};
