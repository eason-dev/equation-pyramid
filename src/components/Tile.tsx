"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useButtonSound } from "@/hooks/useButtonSound";
import type { Operator, Tile as TileType } from "@/logic/game/types";

// Add CSS keyframes for hint animation
if (typeof window !== "undefined" && !document.querySelector("#hint-pulse-keyframes")) {
  const style = document.createElement("style");
  style.id = "hint-pulse-keyframes";
  style.textContent = `
    @keyframes hint-glow {
      0%, 100% {
        box-shadow: 
          0 0 0 0 rgba(250, 204, 21, 0.7),
          0 0 20px rgba(250, 204, 21, 0.6),
          inset 0 0 20px rgba(250, 204, 21, 0.2);
      }
      50% {
        box-shadow: 
          0 0 0 12px rgba(250, 204, 21, 0),
          0 0 40px rgba(250, 204, 21, 0.8),
          inset 0 0 30px rgba(250, 204, 21, 0.3);
      }
    }
    
    .hint-tile {
      animation: hint-glow 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

interface TileProps {
  tile: TileType;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
  isFirstSelected?: boolean;
  isHint?: boolean;
}

const operatorMap: Record<Operator, string> = {
  "+": "+",
  "-": "-",
  "*": "×",
  "/": "÷",
};

export function Tile({
  tile,
  isSelected,
  onClick,
  disabled,
  isFirstSelected = false,
  isHint = false,
}: TileProps) {
  const { playButtonSound } = useButtonSound();
  const operatorRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const explosionContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      isFirstSelected &&
      operatorRef.current &&
      explosionContainerRef.current &&
      numberRef.current
    ) {
      const operatorElement = operatorRef.current;
      const numberElement = numberRef.current;

      // Calculate the operator width to determine proper centering offset
      const operatorWidth = operatorElement.getBoundingClientRect().width;
      const centeringOffset = -(operatorWidth / 2);

      // Create timeline for coordinated animations
      const tl = gsap.timeline();

      // First: Operator scale up and fade out (longer duration)
      tl.to(operatorElement, {
        opacity: 0,
        duration: 0.6,
        ease: "power1.out",
      });

      // Then: Number slides to center position with calculated offset
      tl.to(
        numberElement,
        {
          x: centeringOffset, // Use calculated offset based on operator width
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.3",
      ); // Start 0.3 seconds before the operator animation ends

      // Add a subtle scale animation to the number for emphasis
      tl.to(
        numberElement,
        {
          duration: 0.4,
        },
        "-=0.4",
      );
    }
  }, [isFirstSelected]);

  const getStateStyles = () => {
    if (disabled) {
      return {
        background: "rgba(11, 11, 11, 0.8)",
        border: "1px solid rgba(104, 104, 104, 0.75)",
        shadow: "4px 4px 20px 0px rgba(191, 191, 191, 0.1)",
      };
    }

    if (isSelected) {
      return {
        background: "rgba(62, 62, 76, 0.8)",
        border: "1px solid rgba(169, 199, 255, 0.75)",
        shadow: "4px 4px 20px 0px rgba(99, 99, 99, 0.25)",
      };
    }

    return {
      background: "rgba(36, 36, 47, 0.8)",
      border: "1px solid rgba(169, 199, 255, 0.75)",
      shadow: "4px 4px 20px 0px rgba(99, 99, 99, 0.25)",
    };
  };

  const getHoverStyles = () => {
    if (disabled) return {};

    return {
      background: "rgba(48, 48, 64, 0.8)",
      boxShadow: "4px 4px 20px 0px rgba(191, 191, 191, 0.6)",
    };
  };

  const styles = getStateStyles();

  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) {
          playButtonSound();
          onClick();
        }
      }}
      disabled={disabled}
      className={`
        w-[56px] h-[56px] md:w-[64px] md:h-[64px] lg:w-[72px] lg:h-[72px]
        rotate-45
        rounded-[8px] md:rounded-[10px] lg:rounded-[12px]
        transition-all duration-200
        flex flex-col items-center justify-center
        gap-1.5 md:gap-2 lg:gap-2.5
        px-[10px] py-[5px] md:px-[12px] md:py-[6px] lg:px-[15px] lg:py-[7px]
        font-inter
        relative
        overflow-hidden
        ${disabled ? "cursor-default" : "cursor-pointer"}
        ${isHint ? "hint-tile" : ""}
      `}
      style={{
        background: styles.background,
        border: styles.border,
        boxShadow: !isHint ? styles.shadow : undefined,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const hoverStyles = getHoverStyles();
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, {
            background: styles.background,
            boxShadow: styles.shadow,
          });
        }
      }}
    >
      {/* Explosion container for star animations */}
      <div
        ref={explosionContainerRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="-rotate-45 flex flex-col items-center justify-center gap-1 md:gap-1.5 w-full max-w-[35px] md:max-w-[40px] lg:max-w-[50px]">
        <div
          className="text-[12px] md:text-[14px] lg:text-[16px] font-normal leading-tight text-center w-full"
          style={{ color: "rgba(198, 197, 215, 0.8)" }}
        >
          {tile.label}
        </div>
        <div
          className="text-[16px] md:text-[18px] lg:text-[22px] font-bold leading-tight text-center text-white relative w-full overflow-hidden"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          <span ref={operatorRef} className="inline-block">
            {operatorMap[tile.operator as Operator]}
          </span>
          <span ref={numberRef} className="inline-block">
            {tile.number}
          </span>
        </div>
      </div>
    </button>
  );
}
