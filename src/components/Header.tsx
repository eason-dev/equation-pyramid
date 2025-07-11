"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useButtonSound } from "@/hooks/useButtonSound";

export function Header() {
  const { playButtonSound } = useButtonSound();
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    playButtonSound();
    if (pathname === "/") {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <header className="flex items-center justify-between p-6">
      {/* Logo */}
      <Link href="/" onClick={handleLogoClick} className="cursor-pointer">
        <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
      </Link>

      {/* Center - Empty space for game-specific content */}
      <div className="flex-1" />

      {/* Right - Empty space */}
      <div className="w-[60px]" />
    </header>
  );
}
