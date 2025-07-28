"use client";

import { useEffect, useRef, useState } from "react";
import { RoundButton } from "./RoundButton";
import { Typography } from "./Typography";
import { Button } from "@/components/Button";

interface FloatingButtonWithProgressProps {
  onClick: () => void;
  children: React.ReactNode;
  progress?: number; // 0-1
  showCompletionText?: boolean;
  completionText?: string;
  disabled?: boolean;
}

export function FloatingButtonWithProgress({
  onClick,
  children,
  progress = 0,
  showCompletionText = false,
  completionText = "All Answers Completed",
  disabled = false,
}: FloatingButtonWithProgressProps) {
  // Mouse tracking for floating button with ref-based approach
  const floatingButtonRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const buttonPos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  // Detect if device has touch capabilities
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports touch
    const checkTouchDevice = () => {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    };

    setIsTouchDevice(checkTouchDevice());

    // Also check on resize
    const handleResize = () => {
      setIsTouchDevice(checkTouchDevice());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Only enable mouse tracking on non-touch devices
    if (isTouchDevice) return;

    // Initialize button position to center of screen on first render
    if (!isInitialized) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      mousePos.current = { x: centerX, y: centerY };
      buttonPos.current = { x: centerX, y: centerY };
      setIsInitialized(true);
    }

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
        floatingButtonRef.current.style.left = `${buttonPos.current.x - 150}px`;
        floatingButtonRef.current.style.top = `${buttonPos.current.y - 150}px`;
      }

      animationRef.current = requestAnimationFrame(animateButton);
    };

    // Hide cursor globally when FloatingButton is mounted
    document.documentElement.classList.add("hide-cursor");

    window.addEventListener("mousemove", handleMouseMove);
    animateButton();

    return () => {
      // Restore cursor when FloatingButton is unmounted
      document.documentElement.classList.remove("hide-cursor");
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTouchDevice, isInitialized]);

  // Calculate the SVG path for the progress arc
  const radius = 90;
  const strokeWidth = 4;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  // Mobile/Touch device layout
  if (isTouchDevice) {
    return (
      <div className="flex flex-col items-center gap-8 mt-12">
        {/* Completion Text - Static for mobile */}
        {showCompletionText && (
          <Typography variant="h1">{completionText}</Typography>
        )}

        {/* Button Container */}
        <Button onClick={onClick} disabled={disabled}>
          {children}
        </Button>
      </div>
    );
  }

  // Desktop floating button layout
  return (
    <div
      ref={floatingButtonRef}
      className="fixed pointer-events-none z-50"
      style={{
        left: isInitialized
          ? `${buttonPos.current.x - 150}px`
          : "calc(50vw - 150px)",
        top: isInitialized
          ? `${buttonPos.current.y - 150}px`
          : "calc(50vh - 150px)",
        transform: "translate3d(0, 0, 0)", // Enable hardware acceleration
      }}
    >
      <div className="relative">
        {/* Progress Ring - Only show when not showing completion text */}
        {!showCompletionText && (
          <svg
            className="absolute inset-0 -rotate-90"
            width={200}
            height={200}
            style={{
              filter: "drop-shadow(0 0 10px rgba(169, 199, 255, 0.5))",
            }}
            aria-label="Progress indicator"
          >
            <title>Progress indicator</title>
            {/* Background circle */}
            <circle
              stroke="rgba(169, 199, 255, 0.2)"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={100}
              cy={100}
            />
            {/* Progress circle */}
            <circle
              stroke="rgba(169, 199, 255, 0.8)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{
                strokeDashoffset,
                transition: "stroke-dashoffset 0.5s ease-in-out",
              }}
              r={normalizedRadius}
              cx={100}
              cy={100}
            />
          </svg>
        )}

        {/* Completion Text - Using Typography curved variant */}
        {showCompletionText && (
          <div className="absolute" style={{ left: "-50px", top: "-65px" }}>
            <Typography
              variant="curved"
              curved={{
                radius: 120,
                animate: true,
                duration: 20,
                repeat: "auto",
                fontSize: 14,
              }}
              className="text-[#A9C7FF]"
            >
              {completionText}
            </Typography>
          </div>
        )}

        {/* Button Container */}
        <div
          className="pointer-events-auto relative"
          style={{ margin: "20px" }}
        >
          <RoundButton onClick={onClick} disabled={disabled}>
            {children}
          </RoundButton>
        </div>
      </div>
    </div>
  );
}
