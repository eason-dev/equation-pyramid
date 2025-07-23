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
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">✦ Equation Pyramid</h1>
          <div className="flex gap-4 text-sm">
            <button onClick={() => router.push("/about")} className="hover:text-gray-300">
              About
            </button>
            <button className="hover:text-gray-300">♪</button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <TutorialView />
        </main>

        {/* Footer */}
        <div className="p-4 text-center text-sm text-gray-400">
          © 2024 Equation Pyramid
        </div>
      </div>
    </>
  );
}