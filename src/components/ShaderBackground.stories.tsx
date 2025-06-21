import type { Meta, StoryObj } from '@storybook/react';
import { ShaderBackground } from './ShaderBackground';

const meta: Meta<typeof ShaderBackground> = {
  title: 'Components/ShaderBackground',
  component: ShaderBackground,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    showControls: {
      control: 'boolean',
      description: 'Show Leva controls for adjusting shader parameters',
    },
    className: {
      control: 'text',
      description: 'CSS class name for the container',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showControls: true,
    className: "fixed top-0 left-0 w-full h-full overflow-hidden",
  },
};

export const WithoutControls: Story = {
  args: {
    showControls: false,
    className: "fixed top-0 left-0 w-full h-full overflow-hidden",
  },
};

export const Background: Story = {
  args: {
    showControls: false,
    className: "fixed top-0 left-0 w-full h-full overflow-hidden -z-10",
  },
  render: (args) => (
    <>
      <ShaderBackground {...args} />
      <div className="relative z-10 p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Shader Background Demo</h1>
        <p className="text-lg">This text is displayed over the animated shader background.</p>
        <div className="mt-8 p-4 bg-black/20 rounded-lg backdrop-blur-sm">
          <p>The shader creates a beautiful animated background effect that works perfectly behind UI elements.</p>
        </div>
      </div>
    </>
  ),
}; 