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
    <Block className="py-2 px-4">
      <Typography variant="h2">
        {minutes}:{remainingSeconds.toString().padStart(2, "0")}
      </Typography>
    </Block>
  );
}
