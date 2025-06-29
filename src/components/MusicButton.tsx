"use client";

import type { AudioControls } from '@/hooks/useAudio';
import { useButtonSound } from '@/hooks/useButtonSound';

interface MusicButtonProps {
  audioControls: AudioControls;
  trackType?: 'main' | 'game';
}

export function MusicButton({ audioControls, trackType }: MusicButtonProps) {
  const { playButtonSound } = useButtonSound();
  const { isPlaying, toggle, isLoaded } = audioControls;

  const handleToggle = () => {
    playButtonSound();
    toggle();
  };

  const getTrackLabel = () => {
    if (!trackType) return '';
    return trackType === 'game' ? 'Game Music' : 'Menu Music';
  };

  const getTooltip = () => {
    const action = isPlaying ? "Pause" : "Play";
    const track = getTrackLabel();
    return track ? `${action} ${track}` : `${action} music`;
  };

  if (!isLoaded) {
    return (
      <div 
        className="w-12 h-12 bg-white/20 rounded animate-pulse" 
        title={`Loading ${getTrackLabel() || 'music'}...`} 
      />
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="w-12 h-12 flex items-center justify-center rounded hover:opacity-80 transition-opacity"
      title={getTooltip()}
    >
      <img 
        src="/Music.svg" 
        alt={isPlaying ? "Pause music" : "Play music"}
        className="w-12 h-12"
      />
    </button>
  );
} 