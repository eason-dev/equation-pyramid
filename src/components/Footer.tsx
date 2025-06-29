"use client";

import { MusicButton } from './MusicButton';
import type { AudioControls } from '@/hooks/useAudio';

interface FooterProps {
  audioControls?: AudioControls;
  trackType?: 'main' | 'game';
}

export function Footer({ audioControls, trackType }: FooterProps) {
  return (
    <footer className="relative">
      {audioControls ? (
        <div className="fixed bottom-6 right-6 z-50">
          <MusicButton audioControls={audioControls} trackType={trackType} />
        </div>
      ) : (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="w-12 h-12 bg-white/20 rounded" />
        </div>
      )}
    </footer>
  );
}
