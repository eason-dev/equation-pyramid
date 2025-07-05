"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useButtonSound } from "@/hooks/useButtonSound";

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
          "font-inter font-bold text-2xl leading-[1.21]",
          "transition-all duration-200",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className,
        )}
        style={{
          width: "160px",
          height: "160px",
          borderRadius: "80px",
          background: styles.background,
          border: styles.border,
          color: styles.color,
          boxShadow: styles.boxShadow,
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
