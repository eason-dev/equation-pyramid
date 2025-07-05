"use client";

import type { Equation, Tile, Player } from "@/logic/game/types";
import type { FoundEquation } from "@/logic/state/gameStore";
import { Block } from "./Block";
import { Typography } from "./Typography";

interface AnswersTileProps {
  foundEquations: FoundEquation[];
  validEquations: Equation[];
  tiles: Tile[];
  players?: Player[];
  showAllAnswers?: boolean;
}

export function AnswersTile({
  foundEquations,
  validEquations,
  tiles,
  players,
  showAllAnswers = false,
}: AnswersTileProps) {
  const isSinglePlayer = players ? players.length === 1 : true;

  // Helper function to create equation key from equation tiles
  const createEquationKey = (equation: Equation): string => {
    // Find the indices of these tiles in the tiles array
    const indices = equation.tiles.map((eqTile) =>
      tiles.findIndex(
        (tile) => tile.number === eqTile.number && tile.label === eqTile.label,
      ),
    );
    return indices.join(",");
  };

  // Helper function to get player index (1-based) from player ID
  const getPlayerIndex = (playerId: string): number => {
    if (!players) return 1;
    const index = players.findIndex((p) => p.id === playerId);
    return index >= 0 ? index + 1 : 1;
  };

  if (showAllAnswers) {
    // For GameOverView: Show all valid equations with indicators
    // Create a map of found equation keys for fast lookup
    const foundEquationMap = new Map<string, FoundEquation>();
    foundEquations.forEach((eq) => {
      foundEquationMap.set(eq.key, eq);
    });

    // Sort valid equations to show found ones first
    const sortedEquations = [...validEquations].sort((a, b) => {
      const aKey = createEquationKey(a);
      const bKey = createEquationKey(b);
      const aFound = foundEquationMap.has(aKey);
      const bFound = foundEquationMap.has(bKey);

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
            const foundEquation = foundEquationMap.get(equationKey);
            const equationText = equation.tiles.map((t) => t.label).join(" ");

            let prefix = "";
            if (foundEquation) {
              if (isSinglePlayer) {
                prefix = "✓ ";
              } else {
                prefix = `${getPlayerIndex(foundEquation.foundBy)} `;
              }
            }

            return (
              <Typography
                key={equationKey}
                variant="p1"
                className="text-center"
              >
                {prefix}
                {equationText}
              </Typography>
            );
          })}
        </div>
      </Block>
    );
  } else {
    // For GamePlayingView: Show only found equations
    return (
      <Block className="text-center">
        <Typography variant="h2" className="mb-4">
          Answers
        </Typography>
        <div className="space-y-4">
          {foundEquations.map((foundEquation) => {
            const [i, j, k] = foundEquation.key.split(",").map(Number);
            const equationTiles = [tiles[i], tiles[j], tiles[k]];
            const equationText = equationTiles.map((t) => t.label).join(" ");

            let prefix = "";
            if (isSinglePlayer) {
              prefix = "✓ ";
            } else {
              prefix = `${getPlayerIndex(foundEquation.foundBy)} `;
            }

            return (
              <Typography
                key={foundEquation.key}
                variant="p1"
                className="text-center"
              >
                {prefix}
                {equationText}
              </Typography>
            );
          })}
        </div>
      </Block>
    );
  }
}
