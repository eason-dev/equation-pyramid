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
  compact?: boolean;
}

export function AnswersTile({
  foundEquations,
  validEquations,
  tiles,
  players,
  showAllAnswers = false,
  compact = false,
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

  // Compact mode for mobile/tablet
  if (compact) {
    if (showAllAnswers) {
      // Show all equations in compact format
      const foundEquationMap = new Map<string, FoundEquation>();
      foundEquations.forEach((eq) => {
        foundEquationMap.set(eq.key, eq);
      });

      return (
        <div className="flex flex-wrap items-center gap-2 max-w-full px-4 justify-center">
          {validEquations.map((equation) => {
            const equationKey = createEquationKey(equation);
            const foundEquation = foundEquationMap.get(equationKey);
            const equationText = equation.tiles.map((t) => t.label).join(" ");
            const isFound = !!foundEquation;

            return (
              <div
                key={equationKey}
                className="flex items-center justify-center min-w-[60px] h-8 sm:min-w-[98px] sm:h-10 border border-white/20 rounded-lg px-1 sm:px-3"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(11, 11, 11, 0.6)",
                }}
              >
                <span className="text-xs sm:text-sm font-semibold text-white/90 whitespace-nowrap">
                  {isFound ? "✓" : "✗"} {equationText}
                </span>
              </div>
            );
          })}
        </div>
      );
    } else {
      // Show only found equations in compact format
      return (
        <div className="flex flex-wrap items-center gap-2 max-w-full px-4 justify-center">
          {foundEquations.map((foundEq) => {
            const tileIndices = foundEq.key.split(",").map(Number);
            const equationText = tileIndices
              .map((i) => tiles[i]?.label || "")
              .join(" ");

            return (
              <div
                key={foundEq.key}
                className="flex items-center justify-center min-w-[60px] h-8 sm:min-w-[98px] sm:h-10 border border-white/20 rounded-lg px-1 sm:px-3"
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(11, 11, 11, 0.6)",
                }}
              >
                <span className="text-xs sm:text-sm font-semibold text-white/90 whitespace-nowrap">
                  ✓ {equationText}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
  }

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
      <div className="p-4" data-tutorial="answers-area">
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
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(11, 11, 11, 0.6)",
                }}
              >
                <div className="flex items-center justify-center w-8">
                  {foundEquation ? (
                    isSinglePlayer ? (
                      <span className="font-bold text-lg">✓</span>
                    ) : (
                      <span className="font-bold text-lg">P{playerIndex}</span>
                    )
                  ) : (
                    <span className="font-bold text-lg">✗</span>
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
                style={{
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  background: "rgba(11, 11, 11, 0.6)",
                }}
              >
                <div className="flex items-center justify-center w-8 sm:w-6 md:w-8">
                  {isSinglePlayer ? (
                    <span className="font-bold text-lg sm:text-sm md:text-lg">
                      ✓
                    </span>
                  ) : (
                    <span className="font-bold text-lg sm:text-sm md:text-lg">
                      P{playerIndex}
                    </span>
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
