import React from "react";

import type { Preview } from "@storybook/nextjs-vite";

import "../src/styles/globals.css";

const preview: Preview = {
  // Enables auto-generated documentation for all stories
  tags: ["autodocs"],

  parameters: {
    backgrounds: {
      options: {
        // Custom
        game: { name: "Game", value: "#0a0c11" },
        // 👇 Default options
        dark: { name: "Dark", value: "#333" },
        light: { name: "Light", value: "#F7F9F2" },
      },
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },

  initialGlobals: {
    backgrounds: { value: "game" },
  },

  decorators: [
    (Story) => {
      return (
        <main className="min-h-screen bg-[#0a0c11] text-white">
          <Story />
        </main>
      );
    },
  ],
};

export default preview;
