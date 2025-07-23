"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TutorialView from "@/components/TutorialView";
import { useTutorialStore } from "@/logic/state/tutorialStore";
import { ShaderBackground } from "@/components/ShaderBackground";
import { useAudio } from "@/hooks/useAudio";

export default function TutorialPage() {
  const router = useRouter();
  const { startTutorial, exitTutorial } = useTutorialStore();

  // Tutorial background music
  const audioControls = useAudio("/audio/main-background-music.ogg", {
    volume: 0.5,
    loop: true,
    autoPlay: true,
    startTime: 0.025,
  });

  useEffect(() => {
    startTutorial();
  }, [startTutorial]);

  // Handle tutorial completion
  useEffect(() => {
    const unsubscribe = useTutorialStore.subscribe((state) => {
      if (!state.isActive && state.hasCompletedTutorial) {
        // Navigate back to home with settings flag
        router.push("/?showSettings=true");
      }
    });

    return unsubscribe;
  }, [router]);

  return (
    <>
      <ShaderBackground showControls={false} color="#242b3e" />
      <div className="min-h-screen text-white flex flex-col relative z-10">
        {/* Main Content */}
        <main className="flex-1">
          <TutorialView />
        </main>
      </div>
    </>
  );
}