"use client";

import { Tile } from "@/components/Tile";
import { cn } from "@/lib/utils";
import type { Tile as TileType } from "@/logic/game/types";

interface TutorialGuessingStateProps {
  selectedTiles: TileType[];
  onTileClick: (tile: TileType) => void;
  calculateEquation: (tiles: TileType[]) => number | null;
  targetNumber: number;
  showError?: boolean;
  showSuccess?: boolean;
}

export default function TutorialGuessingState({
  selectedTiles,
  onTileClick,
  calculateEquation,
  targetNumber,
  showError,
  showSuccess,
}: TutorialGuessingStateProps) {
  const hasThreeTiles = selectedTiles.length === 3;

  // Calculate result when we have 3 tiles
  const calculatedResult = hasThreeTiles
    ? calculateEquation(selectedTiles)
    : null;
  const isCorrect = calculatedResult === targetNumber;

  // Determine border style based on state
  const getBorderStyle = () => {
    if (showSuccess || (hasThreeTiles && isCorrect)) {
      return "border-green-500";
    }
    if (showError || (hasThreeTiles && !isCorrect)) {
      return "border-red-500";
    }
    return "border-white/30";
  };

  return (
    <div className="flex items-center gap-4">
      {/* Selected tiles or empty blocks */}
      <div className="flex gap-2">
        {[0, 1, 2].map((index) => {
          const tile = selectedTiles[index];
          if (tile) {
            return (
              <Tile
                key={`selected-${index}`}
                tile={tile}
                isSelected={false}
                onClick={() => onTileClick(tile)}
                disabled={false}
              />
            );
          }
          return (
            <div
              key={`empty-${index}`}
              className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-white/30"
            />
          );
        })}
      </div>

      {/* Equals sign */}
      <span className="text-2xl font-bold text-white">=</span>

      {/* Result */}
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-lg border-2 transition-colors",
          getBorderStyle(),
          hasThreeTiles ? "bg-white/10" : "bg-white/5",
        )}
      >
        {hasThreeTiles && calculatedResult !== null ? (
          <span className="text-2xl font-bold text-white">
            {calculatedResult}
          </span>
        ) : (
          <span className="text-2xl text-white/30">?</span>
        )}
      </div>
    </div>
  );
}
