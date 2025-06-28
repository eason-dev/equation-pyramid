"use client";

import { MusicButton } from './MusicButton';
import type { AudioControls } from '@/hooks/useAudio';

interface FooterProps {
  audioControls?: AudioControls;
  trackType?: 'main' | 'game';
}

export function Footer({ audioControls, trackType }: FooterProps) {
  return (
    <footer className="flex items-center justify-end p-6">
      {audioControls ? (
        <MusicButton audioControls={audioControls} trackType={trackType} />
      ) : (
        <div className="w-5 h-5 bg-white/20 rounded" />
      )}
    </footer>
  );
}
