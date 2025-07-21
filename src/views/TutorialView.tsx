"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { ShaderBackground } from "@/components/ShaderBackground";
import { TutorialCompleteOverlay } from "@/components/TutorialCompleteOverlay";
import TutorialGuidedScreen from "@/components/tutorial/TutorialGuidedScreen";
import TutorialIntroScreen from "@/components/tutorial/TutorialIntroScreen";
import TutorialPracticeScreen from "@/components/tutorial/TutorialPracticeScreen";
import { useAudio } from "@/hooks/useAudio";
import { useButtonSound } from "@/hooks/useButtonSound";
import { useTutorialStore } from "@/logic/state/tutorialStore";

export default function TutorialView() {
  const router = useRouter();
  const { playButtonSound } = useButtonSound();

  // Audio controls for tutorial music
  const audioControls = useAudio("/audio/main-background-music.ogg", {
    loop: true,
    volume: 0.3,
  });

  const { currentStage, initializeTutorial, nextStage } = useTutorialStore();

  // Initialize tutorial on mount
  useEffect(() => {
    initializeTutorial();
  }, [initializeTutorial]);

  const handleStartGame = () => {
    playButtonSound();
    router.push("/?showSettings=true");
  };

  const handleNextStage = () => {
    playButtonSound();
    nextStage();
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative z-10">
      <ShaderBackground />

      <main className="flex-1">
        <div className="flex h-full flex-col items-center justify-center px-6 py-20 md:px-10 md:py-24">
          {currentStage === "intro" && (
            <TutorialIntroScreen onNext={handleNextStage} />
          )}

          {currentStage === "guided" && <TutorialGuidedScreen />}

          {currentStage === "practice" && <TutorialPracticeScreen />}
        </div>
      </main>

      <Footer audioControls={audioControls} trackType="main" />

      {currentStage === "complete" && (
        <TutorialCompleteOverlay onStartGame={handleStartGame} />
      )}
    </div>
  );
}
