"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type TypographyVariant = "h1" | "h2" | "label" | "p1" | "p2" | "p3";
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
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: "font-inter font-bold text-[32px]",
  h2: "font-inter font-bold text-[24px]",
  label: "font-inter font-bold text-[16px]",
  p1: "font-inter font-normal text-[24px]",
  p2: "font-inter font-normal text-[20px]",
  p3: "font-inter font-normal text-[16px]",
};

const defaultTags: Record<TypographyVariant, TypographyTag> = {
  h1: "h1",
  h2: "h2",
  label: "label",
  p1: "p",
  p2: "p",
  p3: "p",
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ variant, children, className, tag, ...props }, ref) => {
    const Component = tag || defaultTags[variant];

    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Typography.displayName = "Typography";
