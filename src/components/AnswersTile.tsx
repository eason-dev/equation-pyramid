"use client";

import type { Equation, Tile } from "@/logic/game/types";

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
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-center">Answers</h3>
      <div className="space-y-2">
        {foundEquations.length > 0 ? (
          foundEquations.map((equationKey) => {
            const [i, j, k] = equationKey.split(",").map(Number);
            const equation = validEquations.find(
              (eq) =>
                eq.tiles[0].number === tiles[i].number &&
                eq.tiles[1].number === tiles[j].number &&
                eq.tiles[2].number === tiles[k].number,
            );
            return (
              <div key={equationKey} className="text-center">
                {equation?.tiles.map((t) => t.label).join(" ")}
              </div>
            );
          })
        ) : (
          <div className="text-gray-400 text-center text-sm">
            No answers found yet
          </div>
        )}
      </div>
    </div>
  );
}
