"use client";

import { useEffect, useRef, useState } from "react";
import { RoundButton } from "./RoundButton";
import { Typography } from "./Typography";

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
  }, [isTouchDevice]);

  // Calculate the SVG path for the progress arc
  const radius = 90;
  const strokeWidth = 4;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  // Mobile/Touch device layout
  if (isTouchDevice) {
    return (
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
        <div className="relative">
          {/* Progress Ring - Smaller for mobile */}
          {!showCompletionText && (
            <svg
              className="absolute inset-0 -rotate-90"
              width={160}
              height={160}
              style={{
                left: "-30px",
                top: "-30px",
                filter: "drop-shadow(0 0 10px rgba(169, 199, 255, 0.5))",
              }}
              aria-label="Progress indicator"
            >
              <title>Progress indicator</title>
              {/* Background circle */}
              <circle
                stroke="rgba(169, 199, 255, 0.2)"
                fill="transparent"
                strokeWidth={3}
                r={70}
                cx={80}
                cy={80}
              />
              {/* Progress circle */}
              <circle
                stroke="rgba(169, 199, 255, 0.8)"
                fill="transparent"
                strokeWidth={3}
                strokeDasharray={`${440} ${440}`}
                style={{
                  strokeDashoffset: 440 - progress * 440,
                  transition: "stroke-dashoffset 0.5s ease-in-out",
                }}
                r={70}
                cx={80}
                cy={80}
              />
            </svg>
          )}

          {/* Completion Text - Static for mobile */}
          {showCompletionText && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <Typography variant="p2" className="text-[#A9C7FF] text-sm">
                {completionText}
              </Typography>
            </div>
          )}

          {/* Button Container */}
          <div className="pointer-events-auto">
            <RoundButton onClick={onClick} disabled={disabled}>
              {children}
            </RoundButton>
          </div>
        </div>
      </div>
    );
  }

  // Desktop floating button layout
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
