"use client";

import type { Equation, Player, Tile } from "@/logic/game/types";
import type { FoundEquation } from "@/logic/state/gameStore";
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
      <div className="p-4">
        <div className="space-y-2">
          {sortedEquations.map((equation) => {
            const equationKey = createEquationKey(equation);
            const foundEquation = foundEquationMap.get(equationKey);
            const equationText = equation.tiles.map((t) => t.label).join(" ");
            const playerIndex = foundEquation
              ? getPlayerIndex(foundEquation.foundBy)
              : null;

            return (
              <div
                key={equationKey}
                className="flex items-center gap-3 border border-white/20 rounded-lg px-3 py-2"
              >
                <div className="flex items-center justify-center w-8">
                  {foundEquation ? (
                    isSinglePlayer ? (
                      <span className="font-bold text-lg">v</span>
                    ) : (
                      <span className="font-bold text-lg">P{playerIndex}</span>
                    )
                  ) : (
                    <span className="font-bold text-lg">x</span>
                  )}
                </div>
                <Typography variant="p1" className="flex-1 text-center">
                  {equationText}
                </Typography>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    // For GamePlayingView: Show only found equations
    return (
      <div className="p-4 sm:p-1 md:p-4">
        <div className="space-y-2 sm:space-y-1 md:space-y-2">
          {foundEquations.map((foundEquation) => {
            const [i, j, k] = foundEquation.key.split(",").map(Number);
            const equationTiles = [tiles[i], tiles[j], tiles[k]];
            const equationText = equationTiles.map((t) => t.label).join(" ");
            const playerIndex = getPlayerIndex(foundEquation.foundBy);

            return (
              <div
                key={foundEquation.key}
                className="flex items-center gap-3 sm:gap-1 md:gap-3 border border-white/20 rounded-lg px-3 sm:px-1 md:px-3 py-2 sm:py-0.5 sm:h-8 md:py-2 md:h-auto"
              >
                <div className="flex items-center justify-center w-8 sm:w-6 md:w-8">
                  {isSinglePlayer ? (
                    <span className="font-bold text-lg sm:text-sm md:text-lg">v</span>
                  ) : (
                    <span className="font-bold text-lg sm:text-sm md:text-lg">P{playerIndex}</span>
                  )}
                </div>
                <Typography variant="p1" className="flex-1 text-center">
                  {equationText}
                </Typography>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
