import { useCallback } from 'react';
import { useAudio } from './useAudio';

export function useButtonSound() {
  const buttonAudioControls = useAudio('/audio/button-sound.mp3', {
    volume: 0.7,
    loop: false,
    autoPlay: false,
  });

  const playButtonSound = useCallback(() => {
    if (buttonAudioControls.isLoaded) {
      // Reset audio to beginning and play
      buttonAudioControls.play();
    }
  }, [buttonAudioControls]);

  return { playButtonSound };
} 