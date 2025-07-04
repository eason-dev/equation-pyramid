"use client";

import type { Equation, Tile } from "@/logic/game/types";
import { Block } from "./Block";
import { Typography } from "./Typography";

interface AnswersTileProps {
  foundEquations: string[];
  validEquations: Equation[];
  tiles: Tile[];
  showAllAnswers?: boolean;
}

export function AnswersTile({
  foundEquations,
  validEquations,
  tiles,
  showAllAnswers = false,
}: AnswersTileProps) {
  if (showAllAnswers) {
    // For GameOverView: Show all valid equations with unfound ones having strikethrough
    // Create a set of found equation keys for fast lookup
    const foundEquationSet = new Set(foundEquations);
    
    // Helper function to create equation key from equation tiles
    const createEquationKey = (equation: Equation): string => {
      // Find the indices of these tiles in the tiles array
      const indices = equation.tiles.map(eqTile => 
        tiles.findIndex(tile => 
          tile.number === eqTile.number && 
          tile.label === eqTile.label
        )
      );
      return indices.join(",");
    };

    // Sort valid equations to show found ones first
    const sortedEquations = [...validEquations].sort((a, b) => {
      const aKey = createEquationKey(a);
      const bKey = createEquationKey(b);
      const aFound = foundEquationSet.has(aKey);
      const bFound = foundEquationSet.has(bKey);
      
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
          {sortedEquations.map((equation) => {
            const equationKey = createEquationKey(equation);
            const isFound = foundEquationSet.has(equationKey);
            const equationText = equation.tiles.map((t) => t.label).join(" ");
            
            return (
              <Typography 
                key={equationKey}
                variant="p1" 
                className={`text-center ${!isFound ? 'line-through' : ''}`}
              >
                {equationText}
              </Typography>
            );
          })}
        </div>
      </Block>
    );
  } else {
    // For GamePlayingView: Show only found equations
    const foundEquationData = foundEquations.map(equationKey => {
      const [i, j, k] = equationKey.split(",").map(Number);
      return {
        key: equationKey,
        tiles: [tiles[i], tiles[j], tiles[k]] as [Tile, Tile, Tile]
      };
    });

    return (
      <Block className="text-center">
        <Typography variant="h2" className="mb-4">
          Answers
        </Typography>
        <div className="space-y-4">
          {foundEquationData.map(({ key, tiles: equationTiles }) => {
            const equationText = equationTiles.map((t) => t.label).join(" ");
            
            return (
              <Typography 
                key={key}
                variant="p1" 
                className="text-center"
              >
                {equationText}
              </Typography>
            );
          })}
        </div>
      </Block>
    );
  }
}
