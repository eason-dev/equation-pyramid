import { useEffect } from "react";
import Confetti from "./Confetti";

interface TutorialCompleteOverlayProps {
  onStartGame: () => void;
}

export function TutorialCompleteOverlay({
  onStartGame,
}: TutorialCompleteOverlayProps) {
  useEffect(() => {
    // Trigger confetti on mount
    const timer = setTimeout(() => {
      // Confetti will auto-trigger
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Confetti />
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[100] animate-fadeIn">
        <div className="flex flex-col items-center gap-16 animate-slideUp">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-4">
              Tutorial Complete!
            </h2>
            <p className="text-2xl text-white">
              You can now start the game. Have fun!
            </p>
          </div>

          <button
            className="w-40 h-40 rounded-full bg-[#0E1112] border border-[rgba(169,199,255,0.75)] shadow-[4px_4px_20px_0px_rgba(191,191,191,0.25)] text-white text-2xl font-bold font-inter cursor-pointer transition-all duration-200 animate-pulse hover:bg-[rgba(14,17,18,0.9)] hover:scale-110 hover:shadow-[0_0_40px_rgba(169,199,255,0.6)] hover:animate-none active:scale-105"
            onClick={onStartGame}
            type="button"
          >
            Start
          </button>
        </div>
      </div>
    </>
  );
}
