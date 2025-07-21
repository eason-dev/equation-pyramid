"use client";

import { useEffect, useState } from "react";

interface TutorialIntroScreenProps {
  onNext: () => void;
}

export default function TutorialIntroScreen({
  onNext,
}: TutorialIntroScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <div
        data-testid="intro-content"
        className={`max-w-2xl space-y-8 text-center transition-all duration-700 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div>
          <h1 className="mb-2 text-5xl font-bold text-white">
            Equation Pyramid
          </h1>
          <p className="text-xl text-white/80">A mathematical puzzle game</p>
        </div>

        <div className="space-y-4 text-lg text-white/90">
          <p>
            Welcome! In Equation Pyramid, you'll combine numbered tiles with
            mathematical operators to reach target numbers.
          </p>
          <p>This tutorial will teach you:</p>
          <ul className="mx-auto max-w-md space-y-2 text-left">
            <li className="flex items-start">
              <span className="mr-2 text-white/60">•</span>
              <span>How to form equations using tiles</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-white/60">•</span>
              <span>Special rules for operators</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-white/60">•</span>
              <span>Game mechanics like timers and scoring</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-white/60">Estimated time: 3-5 minutes</p>

          <button
            type="button"
            onClick={onNext}
            className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-black transition-all hover:scale-105 hover:shadow-lg"
          >
            Start Tutorial
          </button>
        </div>

        <div
          data-testid="progress-indicator"
          className="flex items-center justify-center space-x-2"
        >
          <div className="h-2 w-8 rounded-full bg-white" />
          <div className="h-2 w-2 rounded-full bg-white/40" />
          <div className="h-2 w-2 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}
