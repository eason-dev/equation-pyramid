import { gsap } from "gsap";
import Lottie from "lottie-react";
import { useEffect, useRef } from "react";
import { useAudio } from "../hooks/useAudio";
import logoAnimation from "./logoAnimation.json";

interface TransitionOverlayProps {
  onComplete: () => void;
  onCenterReached?: () => void;
}

export default function TransitionOverlay({
  onComplete,
  onCenterReached,
}: TransitionOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { play } = useAudio("/audio/page-transition.mp3", {
    volume: 0.7,
    loop: true,
    autoPlay: true,
    startTime: 0.05,
    endTime: 0.05,
  });

  useEffect(() => {
    if (!overlayRef.current) return;

    // Set initial position
    gsap.set(overlayRef.current, { y: "100%" });

    // Play transition audio when animation starts
    play();

    const tl = gsap.timeline({
      onComplete: onComplete,
    });

    // Slide up from bottom to center
    tl.to(overlayRef.current, {
      y: "0%",
      duration: 0.6,
      ease: "power3.out",
      onComplete: () => {
        // Call onCenterReached when overlay reaches center
        if (onCenterReached) {
          onCenterReached();
        }
      },
    })
      .to({}, { duration: 2 }) // 停留時間
      // Slide up to top
      .to(overlayRef.current, {
        y: "-100%",
        duration: 0.6,
        ease: "power3.in",
      });

    return () => {
      tl.kill();
    };
  }, [onComplete, onCenterReached, play]);

  return (
    <div className="transition-overlay" ref={overlayRef}>
      <div className="logo-container">
        <Lottie animationData={logoAnimation} loop={false} />
      </div>
    </div>
  );
}
