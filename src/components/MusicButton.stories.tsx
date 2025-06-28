import type { Meta, StoryObj } from '@storybook/react';
import { MusicButton } from './MusicButton';
import type { AudioControls } from '@/hooks/useAudio';

// Mock audio controls for Storybook
const createMockAudioControls = (overrides: Partial<AudioControls> = {}): AudioControls => ({
  isPlaying: false,
  volume: 0.5,
  play: () => console.log('Play clicked'),
  pause: () => console.log('Pause clicked'),
  toggle: () => console.log('Toggle clicked'),
  setVolume: (volume) => console.log('Volume set to:', volume),
  isLoaded: true,
  ...overrides,
});

const meta: Meta<typeof MusicButton> = {
  title: 'Components/MusicButton',
  component: MusicButton,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1a1a1a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    audioControls: {
      control: false,
    },
    trackType: {
      control: 'select',
      options: ['main', 'game'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MusicButton>;

export const MainMenuPaused: Story = {
  args: {
    audioControls: createMockAudioControls({ isPlaying: false }),
    trackType: 'main',
  },
};

export const MainMenuPlaying: Story = {
  args: {
    audioControls: createMockAudioControls({ isPlaying: true }),
    trackType: 'main',
  },
};

export const GameMusicPaused: Story = {
  args: {
    audioControls: createMockAudioControls({ isPlaying: false }),
    trackType: 'game',
  },
};

export const GameMusicPlaying: Story = {
  args: {
    audioControls: createMockAudioControls({ isPlaying: true }),
    trackType: 'game',
  },
};

export const Loading: Story = {
  args: {
    audioControls: createMockAudioControls({ isLoaded: false }),
    trackType: 'main',
  },
};

export const LowVolume: Story = {
  args: {
    audioControls: createMockAudioControls({ isPlaying: true, volume: 0.1 }),
    trackType: 'game',
  },
};

export const HighVolume: Story = {
  args: {
    audioControls: createMockAudioControls({ isPlaying: true, volume: 0.9 }),
    trackType: 'main',
  },
};

export const NoTrackType: Story = {
  args: {
    audioControls: createMockAudioControls({ isPlaying: true }),
    // trackType not provided
  },
}; 