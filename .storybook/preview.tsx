import type { Preview } from "@storybook/nextjs-vite";

import "../src/styles/globals.css";
import { ShaderBackground } from "../src/components/ShaderBackground";

const preview: Preview = {
  // Enables auto-generated documentation for all stories
  tags: ["autodocs"],

  parameters: {
    backgrounds: {
      options: {
        // Custom
        game: { name: "Game", value: "#020306" },
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
        <>
          {/* Background Shader for all stories */}
          <ShaderBackground
            showControls={false}
            className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10"
          />

          {/* Story content */}
          <main className="text-white relative z-10">
            <Story />
          </main>
        </>
      );
    },
  ],
};

export default preview;
