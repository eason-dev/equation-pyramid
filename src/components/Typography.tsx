"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type TypographyVariant = "h1" | "h2" | "label" | "p1" | "p2" | "p3" | "curved";
type TypographyTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "label";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant: TypographyVariant;
  children?: React.ReactNode;
  className?: string;
  tag?: TypographyTag;
  // Curved text specific props
  curved?: {
    radius?: number;
    animate?: boolean;
    duration?: number;
    repeat?: number | "auto";
    fontSize?: number;
  };
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: "font-inter font-bold text-2xl md:text-3xl lg:text-[32px]",
  h2: "font-inter font-bold text-lg md:text-xl lg:text-[24px]",
  label: "font-inter font-bold text-sm md:text-base lg:text-[16px]",
  p1: "font-inter font-normal text-lg md:text-xl lg:text-[24px]",
  p2: "font-inter font-normal text-base md:text-lg lg:text-[20px]",
  p3: "font-inter font-normal text-sm md:text-base lg:text-[16px]",
  curved:
    "font-inter font-semibold text-sm md:text-base lg:text-[16px] uppercase tracking-[3px]",
};

const defaultTags: Record<TypographyVariant, TypographyTag> = {
  h1: "h1",
  h2: "h2",
  label: "label",
  p1: "p",
  p2: "p",
  p3: "p",
  curved: "div",
};

export const Typography = forwardRef<
  React.ElementRef<TypographyTag>,
  TypographyProps
>(({ variant, children, className, tag, curved, ...props }, ref) => {
  const Component = tag || defaultTags[variant];

  // Handle curved text variant
  if (variant === "curved" && curved) {
    const {
      radius = 120,
      animate = true,
      duration = 20,
      repeat = "auto",
      fontSize = 16,
    } = curved;

    // Calculate SVG dimensions based on radius
    const svgSize = (radius + 30) * 2;
    const center = svgSize / 2;

    // Calculate optimal spacing for full circle coverage
    const textContent = String(children);
    const separator = "   •   "; // Add more spacing
    const fullText = textContent + separator;

    // Use specified repeat count or auto-calculate based on text length
    let actualRepeats: number;
    if (repeat === "auto") {
      // Different repeats for different text lengths to avoid cuts
      if (textContent.length <= 10) {
        actualRepeats = 5; // "Time's Up!" fits well with 5
      } else if (textContent.length <= 20) {
        actualRepeats = 4; // Medium length text
      } else {
        actualRepeats = 3; // "All Answers Completed" fits well with 3
      }
    } else {
      actualRepeats = repeat;
    }

    // Create repeated text
    const repeatedText = Array(actualRepeats).fill(fullText).join("");

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn("relative", className)}
        {...props}
      >
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          style={{
            filter: "drop-shadow(0 0 10px rgba(169, 199, 255, 0.8))",
          }}
          aria-label={`Curved text: ${textContent}`}
        >
          <title>Curved text display</title>
          <defs>
            <path
              id="curved-text-path"
              d={`M ${center},${center} m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
            />
          </defs>

          <g
            className={animate ? "origin-center animate-spin" : ""}
            style={animate ? { animationDuration: `${duration}s` } : {}}
          >
            <text
              fill="currentColor"
              fontSize={fontSize}
              className={variantStyles[variant]}
              style={{
                letterSpacing:
                  textContent === "Time's Up!"
                    ? "0.55em"
                    : textContent === "Answers Completed"
                      ? "0.60em"
                      : "0.45em",
              }}
            >
              <textPath href="#curved-text-path" startOffset="0%">
                {repeatedText}
              </textPath>
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // Default non-curved rendering
  return (
    <Component
      ref={ref as any}
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
});

Typography.displayName = "Typography";
