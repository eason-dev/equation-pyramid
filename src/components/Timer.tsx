"use client";

import { Block } from "./Block";
import { Typography } from "./Typography";

interface TimerProps {
  seconds: number;
}

export function Timer({ seconds }: TimerProps) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return (
    <Block className="py-1.5 px-3 md:py-2 md:px-4">
      <Typography variant="h2" className="text-lg md:text-xl lg:text-2xl">
        {minutes}:{remainingSeconds.toString().padStart(2, "0")}
      </Typography>
    </Block>
  );
}
