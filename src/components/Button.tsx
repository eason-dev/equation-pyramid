"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary";
  size?: "default";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      // variant = "primary",
      // size = "default",
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const getStateStyles = () => {
      if (disabled) {
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
      if (disabled) return {};

      return {
        background: "rgba(48, 48, 64, 0.8)",
        boxShadow: "4px 4px 20px 0px rgba(191, 191, 191, 0.25)",
      };
    };

    const getActiveStyles = () => {
      if (disabled) return {};

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
              boxShadow: "none",
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
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
