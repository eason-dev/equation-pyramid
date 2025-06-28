"use client";

import { useState } from 'react';
import type { AudioControls } from '@/hooks/useAudio';

interface MusicButtonProps {
  audioControls: AudioControls;
  trackType?: 'main' | 'game';
}

export function MusicButton({ audioControls, trackType }: MusicButtonProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const { isPlaying, volume, toggle, setVolume, isLoaded } = audioControls;

  const getTrackLabel = () => {
    if (!trackType) return '';
    return trackType === 'game' ? 'Game Music' : 'Menu Music';
  };

  const getTooltip = () => {
    const action = isPlaying ? "Pause" : "Play";
    const track = getTrackLabel();
    return track ? `${action} ${track}` : `${action} music`;
  };

  if (!isLoaded) {
    return (
      <div 
        className="w-5 h-5 bg-white/20 rounded animate-pulse" 
        title={`Loading ${getTrackLabel() || 'music'}...`} 
      />
    );
  }

  return (
    <div className="relative flex items-center gap-2">
      {/* Volume Slider */}
      {showVolumeSlider && (
        <div className="absolute right-full mr-2 flex items-center gap-2 bg-black/50 p-2 rounded">
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="w-20 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-white/70 w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      )}

      {/* Music Control Button */}
      <button
        type="button"
        onClick={toggle}
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
        className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/20 transition-colors"
        title={getTooltip()}
      >
        {isPlaying ? (
          // Pause icon
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <title>Pause</title>
            <rect x="3" y="2" width="4" height="12" />
            <rect x="9" y="2" width="4" height="12" />
          </svg>
        ) : (
          // Play icon
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <title>Play</title>
            <path d="M3 2v12l10-6L3 2z" />
          </svg>
        )}
      </button>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
      `}</style>
    </div>
  );
} 