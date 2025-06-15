import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BlockProps {
  children: React.ReactNode;
  className?: string;
}

export const Block = forwardRef<HTMLDivElement, BlockProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl p-5 backdrop-blur-[24px] border border-white/20 bg-[#0B0B0B]/60",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Block.displayName = "Block";
