"use client";

import { useRef, useEffect } from "react";
import { RoundButton } from "./RoundButton";

interface FloatingButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export function FloatingButton({ onClick, children }: FloatingButtonProps) {
  // Mouse tracking for floating button with ref-based approach
  const floatingButtonRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const buttonPos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animateButton = () => {
      const dx = mousePos.current.x - buttonPos.current.x;
      const dy = mousePos.current.y - buttonPos.current.y;

      // Spring animation with damping
      const spring = 0.15;
      buttonPos.current.x += dx * spring;
      buttonPos.current.y += dy * spring;

      // Directly update DOM element style
      if (floatingButtonRef.current) {
        floatingButtonRef.current.style.left = `${buttonPos.current.x - 80}px`;
        floatingButtonRef.current.style.top = `${buttonPos.current.y - 80}px`;
      }

      animationRef.current = requestAnimationFrame(animateButton);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animateButton();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={floatingButtonRef}
      className="fixed pointer-events-none z-50"
      style={{
        left: "0px",
        top: "0px",
        transform: "translate3d(0, 0, 0)", // Enable hardware acceleration
      }}
    >
      <div className="pointer-events-auto">
        <RoundButton onClick={onClick}>{children}</RoundButton>
      </div>
    </div>
  );
}
