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
  // Helper function to check if an equation was found
  const isEquationFound = (equation: Equation): boolean => {
    return foundEquations.some(equationKey => {
      const [i, j, k] = equationKey.split(",").map(Number);
      return (
        equation.tiles[0].number === tiles[i].number &&
        equation.tiles[1].number === tiles[j].number &&
        equation.tiles[2].number === tiles[k].number
      );
    });
  };

  // Sort equations to show found ones first
  const sortedEquations = [...validEquations].sort((a, b) => {
    const aFound = isEquationFound(a);
    const bFound = isEquationFound(b);
    
    // Found equations (true) should come first
    if (aFound && !bFound) return -1;
    if (!aFound && bFound) return 1;
    return 0;
  });

  return (
    <Block className="text-center">
      <Typography variant="h2" className="mb-4">
        Answers
      </Typography>
      <div className="space-y-4">
        {sortedEquations.map((equation, index) => {
          const isFound = isEquationFound(equation);
          const equationText = equation.tiles.map((t) => t.label).join(" ");
          const uniqueKey = equation.tiles.map((t) => t.number).join("-");
          
          return (
            <Typography 
              key={uniqueKey} 
              variant="p1" 
              className={`text-center ${isFound ? 'font-bold' : 'font-normal'}`}
            >
              {equationText}
            </Typography>
          );
        })}
      </div>
    </Block>
  );
}
