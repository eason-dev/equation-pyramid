"use client";

import { Block } from "./Block";
import { Typography } from "./Typography";

interface TargetTileProps {
  targetNumber: number;
}

export function TargetTile({ targetNumber }: TargetTileProps) {
  return (
    <Block className="text-center min-w-[128px] min-h-[128px]">
      <Typography variant="h2">Target</Typography>
      <Typography variant="p1" className="mt-2.5">
        {targetNumber}
      </Typography>
    </Block>
  );
}
