"use client";

import { Typography } from "./Typography";

export function Header() {
  return (
    <header className="flex items-center justify-between p-6">
      {/* Logo */}
      <button
        type="button"
        className="cursor-pointer"
        onClick={() => window.location.reload()}
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
