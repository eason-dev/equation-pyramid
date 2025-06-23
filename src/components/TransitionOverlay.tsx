import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Lottie from "lottie-react";
import logoAnimation from "./logoAnimation.json";

interface TransitionOverlayProps {
  onComplete: () => void;
  onCenterReached?: () => void;
}

export default function TransitionOverlay({ onComplete, onCenterReached }: TransitionOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    // Set initial position
    gsap.set(overlayRef.current, { y: "100%" });

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
      }
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
  }, [onComplete, onCenterReached]);

  return (
    <div className="transition-overlay" ref={overlayRef}>
      <div className="logo-container">
        <Lottie animationData={logoAnimation} loop={false} />
      </div>
    </div>
  );
} 