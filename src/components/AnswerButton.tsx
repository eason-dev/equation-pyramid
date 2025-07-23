"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { useButtonSound } from "@/hooks/useButtonSound";
import { cn } from "@/lib/utils";
import { Typography } from "./Typography";

interface AnswerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  playerName: string;
  score: number;
  onClick: () => void;
  isOver?: boolean;
  isSinglePlayer?: boolean;
}

export const AnswerButton = forwardRef<HTMLButtonElement, AnswerButtonProps>(
  (
    {
      playerName,
      score,
      onClick,
      isOver = false,
      isSinglePlayer = false,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const { playButtonSound } = useButtonSound();
    const isDisabled = disabled || isOver;

    const getStateStyles = () => {
      if (isDisabled) {
        return {
          background: "rgba(11, 11, 11, 0.8)",
          border: "1px solid rgba(104, 104, 104, 0.75)",
          color: "#FFFFFF",
        };
      }

      // Default enabled state
      return {
        background: "rgba(36, 36, 47, 0.8)",
        border: "1px solid rgba(169, 199, 255, 0.75)",
        color: "#FFFFFF",
      };
    };

    const getHoverStyles = () => {
      if (isDisabled) return {};

      return {
        background: "rgba(48, 48, 64, 0.8)",
        boxShadow: "8px 8px 30px 0px rgba(191, 191, 191, 0.25)",
      };
    };

    const getActiveStyles = () => {
      if (isDisabled) return {};

      return {
        background: "rgba(62, 62, 76, 0.8)",
        boxShadow: "4px 4px 20px 0px rgba(191, 191, 191, 0.25)",
      };
    };

    const styles = getStateStyles();

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        data-tutorial="answer-button"
        onClick={(_e) => {
          if (!isDisabled) {
            playButtonSound();
            onClick();
          }
        }}
        className={cn(
          // Base styles
          "flex flex-col items-center justify-center",
          "rounded-xl transition-all duration-200",
          "gap-3 p-4 md:gap-3.5 md:p-4.5 lg:gap-4 lg:p-5",
          // Responsive sizing
          "min-w-full md:min-w-[180px] lg:min-w-[200px]",
          "min-h-[140px] md:min-h-[170px] lg:min-h-[200px]",
          isDisabled ? "cursor-not-allowed" : "cursor-pointer",
          className,
        )}
        style={{
          background: styles.background,
          border: styles.border,
          color: styles.color,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            const hoverStyles = getHoverStyles();
            Object.assign(e.currentTarget.style, hoverStyles);
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) {
            Object.assign(e.currentTarget.style, {
              background: styles.background,
              boxShadow: "none",
            });
          }
        }}
        onMouseDown={(e) => {
          if (!isDisabled) {
            const activeStyles = getActiveStyles();
            Object.assign(e.currentTarget.style, activeStyles);
          }
        }}
        onMouseUp={(e) => {
          if (!isDisabled) {
            const hoverStyles = getHoverStyles();
            Object.assign(e.currentTarget.style, hoverStyles);
          }
        }}
        {...props}
      >
        {/* Player Name - hidden in single player mode */}
        {!isSinglePlayer && (
          <Typography variant="h2" className="text-lg md:text-xl lg:text-2xl">
            {playerName}
          </Typography>
        )}

        {/* Call to Action - only show when not in over state and in single player mode */}
        {!isOver && isSinglePlayer && (
          <Typography
            variant="h2"
            className="text-base md:text-lg lg:text-xl text-center"
          >
            Press Here to Answer!
          </Typography>
        )}

        {/* Score text - only show when round is over and in single player mode */}
        {isOver && isSinglePlayer && (
          <Typography variant="h2" className="text-lg md:text-xl lg:text-2xl">
            Score
          </Typography>
        )}

        {/* Score Badge */}
        <div
          className="flex items-center justify-center rounded-full w-[60px] h-[60px] md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px]"
          style={{
            background: "rgba(71, 71, 71, 0.15)",
            border: "1px solid rgba(169, 199, 255, 0.75)",
            boxShadow: "4px 4px 20px 0px rgba(99, 99, 99, 0.25)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <Typography variant="h2" className="text-xl md:text-2xl lg:text-3xl">
            {score}
          </Typography>
        </div>
      </button>
    );
  },
);

AnswerButton.displayName = "AnswerButton";
