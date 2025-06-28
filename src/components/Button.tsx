"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useButtonSound } from "@/hooks/useButtonSound";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "default";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      // size = "default",
      className,
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { playButtonSound } = useButtonSound();
    const getStateStyles = () => {
      if (variant === "secondary") {
        if (disabled) {
          return {
            background: "transparent",
            border: "none",
            color: "rgba(255, 255, 255, 0.5)",
          };
        }
        // Secondary default state - no background or border
        return {
          background: "transparent",
          border: "none",
          color: "#FFFFFF",
        };
      }

      // Primary variant
      if (disabled) {
        return {
          background: "rgba(11, 11, 11, 0.8)",
          border: "1px solid rgba(104, 104, 104, 0.75)",
          color: "#FFFFFF",
        };
      }

      // Primary default enabled state
      return {
        background: "rgba(36, 36, 47, 0.8)",
        border: "1px solid rgba(169, 199, 255, 0.75)",
        color: "#FFFFFF",
      };
    };

    const getHoverStyles = () => {
      if (disabled) return {};

      if (variant === "secondary") {
        // Secondary hover - subtle background
        return {
          background: "rgba(255, 255, 255, 0.1)",
        };
      }

      // Primary hover
      return {
        background: "rgba(48, 48, 64, 0.8)",
        boxShadow: "4px 4px 20px 0px rgba(191, 191, 191, 0.25)",
      };
    };

    const getActiveStyles = () => {
      if (disabled) return {};

      if (variant === "secondary") {
        // Secondary active - slightly more visible background
        return {
          background: "rgba(255, 255, 255, 0.2)",
        };
      }

      // Primary active
      return {
        background: "rgba(62, 62, 76, 0.8)",
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
          "rounded-lg transition-all duration-200",
          "w-[160px] h-[64px]",
          "px-6 py-3",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          className,
        )}
        style={{
          background: styles.background,
          border: styles.border,
          color: styles.color,
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
              boxShadow: variant === "primary" ? "none" : undefined,
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

Button.displayName = "Button";
