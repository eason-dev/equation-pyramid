"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AudioControls } from "@/hooks/useAudio";
import { useButtonSound } from "@/hooks/useButtonSound";
import { MusicButton } from "./MusicButton";
import { Typography } from "./Typography";

interface FooterProps {
  audioControls?: AudioControls;
  trackType?: "main" | "game";
}

export function Footer({ audioControls, trackType }: FooterProps) {
  const { playButtonSound } = useButtonSound();
  const pathname = usePathname();

  const handleAboutClick = () => {
    playButtonSound();
  };

  // Show about button on homepage
  const showAboutButton = pathname === "/";

  return (
    <footer className="relative">
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center gap-4">
          {showAboutButton && (
            <Link href="/about" onClick={handleAboutClick}>
              <Typography
                variant="p2"
                className="text-white font-bold cursor-pointer hover:text-gray-300 transition-colors"
              >
                About
              </Typography>
            </Link>
          )}
          <MusicButton audioControls={audioControls} trackType={trackType} />
        </div>
      </div>
    </footer>
  );
}
