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
  startTime?: number; // Time in seconds to skip from the beginning
  endTime?: number; // Time in seconds to skip from the end
} = {}): AudioControls {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(options.volume ?? 0.5);
  const [isLoaded, setIsLoaded] = useState(false);
  const [duration, setDuration] = useState(0);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = false; // We'll handle looping manually for endTime support
    audio.volume = volume;
    audio.preload = 'auto';

    // Event listeners
    const handleLoadedData = () => {
      setIsLoaded(true);
      setDuration(audio.duration);
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      // Handle manual looping if enabled
      if (options.loop && audioRef.current) {
        const startTime = options.startTime || 0;
        audioRef.current.currentTime = startTime;
        audioRef.current.play().catch(e => console.warn('Loop play prevented:', e));
      }
    };
    
    const handleTimeUpdate = () => {
      // Check if we should stop before the end
      if (options.endTime && options.endTime > 0 && duration > 0) {
        const stopTime = duration - options.endTime;
        if (audio.currentTime >= stopTime) {
          audio.pause();
          // If looping, restart from beginning (plus startTime offset)
          if (options.loop) {
            const startTime = options.startTime || 0;
            audio.currentTime = startTime;
            audio.play().catch(e => console.warn('Loop play prevented:', e));
          } else {
            setIsPlaying(false);
          }
        }
      }
    };
    
    const handleError = (e: Event) => {
      console.error('Audio loading error:', e);
      setIsLoaded(false);
    };

    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;

    // Auto play if specified
    if (options.autoPlay && isLoaded) {
      // Set start time if specified
      if (options.startTime && options.startTime > 0) {
        audio.currentTime = options.startTime;
      }
      audio.play().catch(e => console.warn('Auto-play prevented:', e));
    }

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, [src, options.loop, options.autoPlay, options.startTime, options.endTime, isLoaded, volume, duration]);

  const play = useCallback(() => {
    if (audioRef.current && isLoaded) {
      // Set start time if specified and audio is at the beginning
      if (options.startTime && options.startTime > 0 && audioRef.current.currentTime === 0) {
        audioRef.current.currentTime = options.startTime;
      }
      audioRef.current.play().catch(e => console.warn('Play prevented:', e));
    }
  }, [isLoaded, options.startTime]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
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