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
      <div className="fixed bottom-6 right-6 z-50">
        <MusicButton audioControls={audioControls} trackType={trackType} />
      </div>
    </footer>
  );
}
