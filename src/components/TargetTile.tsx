"use client";

import { Block } from "./Block";
import { Typography } from "./Typography";

interface TargetTileProps {
  targetNumber: number;
}

export function TargetTile({ targetNumber }: TargetTileProps) {
  return (
    <Block className="text-center w-16 h-16 sm:min-w-[100px] sm:min-h-[100px] md:min-w-[120px] md:min-h-[120px] lg:min-w-[128px] lg:min-h-[128px] p-2 sm:p-4 md:p-5 lg:p-6">
      <Typography
        variant="h2"
        className="text-sm sm:text-lg md:text-xl lg:text-2xl"
      >
        Target
      </Typography>
      <Typography
        variant="p1"
        className="mt-0.5 sm:mt-1.5 md:mt-2 lg:mt-2.5 text-base sm:text-xl md:text-2xl lg:text-3xl"
      >
        {targetNumber}
      </Typography>
    </Block>
  );
}
