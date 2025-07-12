import { useCallback } from "react";
import { useGameStore } from "@/logic/state/gameStore";
import { useAudio } from "./useAudio";

export function useAnswerSounds() {
  const isAudioEnabled = useGameStore((state) => state.isAudioEnabled);

  const correctAudioControls = useAudio("/audio/correct-answer.mp3", {
    volume: 0.8,
    loop: false,
    autoPlay: false,
  });

  const incorrectAudioControls = useAudio("/audio/incorrect-answer.mp3", {
    volume: 0.4,
    loop: false,
    autoPlay: false,
  });

  const playCorrectSound = useCallback(() => {
    if (correctAudioControls.isLoaded && isAudioEnabled) {
      correctAudioControls.play();
    }
  }, [correctAudioControls, isAudioEnabled]);

  const playIncorrectSound = useCallback(() => {
    if (incorrectAudioControls.isLoaded && isAudioEnabled) {
      incorrectAudioControls.play();
    }
  }, [incorrectAudioControls, isAudioEnabled]);

  return {
    playCorrectSound,
    playIncorrectSound,
    isCorrectSoundLoaded: correctAudioControls.isLoaded,
    isIncorrectSoundLoaded: incorrectAudioControls.isLoaded,
  };
}
