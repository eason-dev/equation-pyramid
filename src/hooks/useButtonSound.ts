import { useCallback } from "react";
import { useGameStore } from "@/logic/state/gameStore";
import { useAudio } from "./useAudio";

export function useButtonSound() {
  const isAudioEnabled = useGameStore((state) => state.isAudioEnabled);

  const buttonAudioControls = useAudio("/audio/button-sound.mp3", {
    volume: 0.7,
    loop: false,
    autoPlay: false,
  });

  const playButtonSound = useCallback(() => {
    if (buttonAudioControls.isLoaded && isAudioEnabled) {
      // Reset audio to beginning and play
      buttonAudioControls.play();
    }
  }, [buttonAudioControls, isAudioEnabled]);

  return { playButtonSound };
}
