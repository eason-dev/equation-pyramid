"use client";

import type { Equation, Tile } from "@/logic/game/types";
import { Block } from "./Block";
import { Typography } from "./Typography";

interface AnswersTileProps {
  foundEquations: string[];
  validEquations: Equation[];
  tiles: Tile[];
}

export function AnswersTile({
  foundEquations,
  validEquations,
  tiles,
}: AnswersTileProps) {
  return (
    <Block className="text-center">
      <Typography variant="h2" className="mb-4">
        Answers
      </Typography>
      <div className="space-y-4">
        {foundEquations.map((equationKey) => {
          const [i, j, k] = equationKey.split(",").map(Number);
          const equation = validEquations.find(
            (eq) =>
              eq.tiles[0].number === tiles[i].number &&
              eq.tiles[1].number === tiles[j].number &&
              eq.tiles[2].number === tiles[k].number,
          );
          return (
            <Typography key={equationKey} variant="p1" className="text-center">
              {equation?.tiles.map((t) => t.label).join(" ")}
            </Typography>
          );
        })}
      </div>
    </Block>
  );
}
