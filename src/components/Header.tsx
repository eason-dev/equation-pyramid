"use client";

import { Typography } from "./Typography";
import { useButtonSound } from "@/hooks/useButtonSound";

export function Header() {
  const { playButtonSound } = useButtonSound();
  
  return (
    <header className="flex items-center justify-between p-6">
      {/* Logo */}
      <button
        type="button"
        className="cursor-pointer"
        onClick={() => {
          playButtonSound();
          window.location.reload();
        }}
      >
        <Typography variant="h2">Logo</Typography>
      </button>

      {/* Center - Empty space for game-specific content */}
      <div className="flex-1" />

      {/* Right - Empty space */}
      <div className="w-[60px]" />
    </header>
  );
}
