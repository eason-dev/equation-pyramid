import { useState, useEffect, useRef, useCallback } from 'react';

export interface AudioControls {
  isPlaying: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
  isLoaded: boolean;
}

export function useAudio(src: string, options: {
  volume?: number;
  loop?: boolean;
  autoPlay?: boolean;
  startTime?: number;
  endTime?: number;
} = {}): AudioControls {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(options.volume ?? 0.5);
  const [isLoaded, setIsLoaded] = useState(false);
  const userInteractedRef = useRef(false);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = options.loop ?? false;
    audio.preload = 'auto';

    const handleLoadedData = () => setIsLoaded(true);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [src, options.loop]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle autoplay (only once, only if user hasn't interacted)
  useEffect(() => {
    if (options.autoPlay && isLoaded && !userInteractedRef.current && audioRef.current) {
      if (options.startTime && options.startTime > 0) {
        audioRef.current.currentTime = options.startTime;
      }
      audioRef.current.play().catch(() => {
        // AutoPlay blocked by browser - this is normal
      });
    }
  }, [isLoaded, options.autoPlay, options.startTime]);

  const play = useCallback(() => {
    if (audioRef.current && isLoaded) {
      userInteractedRef.current = true;
      if (options.startTime && options.startTime > 0 && audioRef.current.currentTime === 0) {
        audioRef.current.currentTime = options.startTime;
      }
      audioRef.current.play().catch(() => {
        // Play failed - browser restrictions or other issues
      });
    }
  }, [isLoaded, options.startTime]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      userInteractedRef.current = true;
      audioRef.current.pause();
    }
  }, []);

  const toggle = useCallback(() => {
    userInteractedRef.current = true;
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  }, []);

  return {
    isPlaying,
    volume,
    play,
    pause,
    toggle,
    setVolume,
    isLoaded,
  };
} 