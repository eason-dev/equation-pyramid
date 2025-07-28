"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { useButtonSound } from "@/hooks/useButtonSound";
import { cn } from "@/lib/utils";

interface RoundButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isActive?: boolean;
}

export const RoundButton = forwardRef<HTMLButtonElement, RoundButtonProps>(
  (
    { children, className, disabled, isActive = false, onClick, ...props },
    ref,
  ) => {
    const { playButtonSound } = useButtonSound();
    const getStateStyles = () => {
      if (disabled) {
        return {
          background: "rgba(11, 11, 11, 0.8)",
          border: "1px solid rgba(104, 104, 104, 0.75)",
          color: "#FFFFFF",
          boxShadow: "none",
        };
      }

      if (isActive) {
        return {
          background: "#3E3E4C",
          border: "1px solid rgba(169, 199, 255, 0.75)",
          color: "#FFFFFF",
          boxShadow: "4px 4px 20px 0px rgba(191, 191, 191, 0.25)",
        };
      }

      // Primary default enabled state
      return {
        background: "#0E0E12",
        border: "1px solid rgba(169, 199, 255, 0.75)",
        color: "#FFFFFF",
        boxShadow: "4px 4px 20px 0px rgba(191, 191, 191, 0.25)",
      };
    };

    const getHoverStyles = () => {
      if (disabled) return {};

      // Primary hover
      return {
        background: "#23232C",
        boxShadow: "6px 6px 20px 0px rgba(191, 191, 191, 0.25)",
      };
    };

    const getActiveStyles = () => {
      if (disabled || isActive) return {};

      // Primary active
      return {
        background: "#3E3E4C",
        boxShadow: "4px 4px 20px 0px rgba(191, 191, 191, 0.25)",
      };
    };

    const styles = getStateStyles();

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          // Base styles
          "relative inline-flex items-center justify-center",
          // Responsive font sizes
          "font-inter font-bold text-lg md:text-2xl leading-[1.21]",
          "transition-all duration-200",
          // Responsive dimensions
          "w-[80px] h-[80px] md:w-[120px] md:h-[120px] lg:w-[160px] lg:h-[160px]",
          "rounded-full",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className,
        )}
        style={{
          background: styles.background,
          border: styles.border,
          color: styles.color,
          boxShadow: styles.boxShadow,
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
              boxShadow: styles.boxShadow,
            });
          }
        }}
        onMouseDown={(e) => {
          if (!disabled) {
            const activeStyles = getActiveStyles();
            Object.assign(e.currentTarget.style, activeStyles);
          }
        }}
        onMouseUp={(e) => {
          if (!disabled) {
            const hoverStyles = getHoverStyles();
            Object.assign(e.currentTarget.style, hoverStyles);
          }
        }}
        onClick={(e) => {
          if (!disabled) {
            playButtonSound();
            onClick?.(e);
          }
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);

RoundButton.displayName = "RoundButton";
