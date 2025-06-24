"use client";

import { GuessingTimer } from "./GuessingTimer";
import { Tile } from "./Tile";
import { Block } from "./Block";
import { Typography } from "./Typography";
import type { Tile as TileType } from "@/logic/game/types";
import { cn } from "@/lib/utils";

interface GuessingStateProps {
  playerName?: string;
  tiles: TileType[];
  selectedTiles: number[];
  targetNumber: number;
  countdownSeconds: number;
  countdownTotalSeconds: number;
  state: "guessing" | "correct" | "wrong";
  calculatedResult?: number | null;
}

export function GuessingState({
  playerName,
  tiles,
  selectedTiles,
  targetNumber,
  countdownSeconds,
  countdownTotalSeconds,
  state,
  calculatedResult,
}: GuessingStateProps) {
  const hasSelectedTiles = selectedTiles.length > 0;
  const hasThreeTiles = selectedTiles.length === 3;

  const getResultBorderStyle = () => {
    if (state === "correct") {
      return "border-green-500";
    }
    if (state === "wrong") {
      return "border-red-500";
    }
    return "border-white/30";
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Main horizontal layout */}
      <div className="flex items-center gap-10 min-h-[120px]">
        {/* Timer - centered when no tiles selected, left when tiles selected */}
        <div
          className={cn(
            "flex items-center justify-center transition-all duration-300",
            hasSelectedTiles ? "order-1" : "order-2 mx-auto",
          )}
        >
          <GuessingTimer
            seconds={countdownSeconds}
            totalSeconds={countdownTotalSeconds}
            isVisible={true}
          />
        </div>

        {/* Selected Tiles Display - center when tiles are selected */}
        {hasSelectedTiles && (
          <div className="order-2">
            {/* Fixed width container to allocate space for 3 tiles */}
            <div
              className="flex items-center gap-2.5"
              style={{ width: "326px", height: "102px" }}
            >
              {/* Render selected tiles, left-aligned */}
              {selectedTiles.map((tileIndex) => {
                const tile = tiles[tileIndex];
                return (
                  <div key={tileIndex} className="w-[102px]">
                    <Tile
                      tile={tile}
                      isSelected={false}
                      onClick={() => {}}
                      disabled
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Result Block - always allocate space, show content after 3 tiles selected */}
        {hasSelectedTiles && (
          <div className="order-3">
            {hasThreeTiles ? (
              <Block
                className={cn(
                  "min-w-[120px] min-h-[120px] flex flex-col items-center justify-center gap-2.5 border-2 transition-colors",
                  getResultBorderStyle(),
                )}
              >
                <Typography variant="h2">Result</Typography>
                <Typography variant="p1">
                  ={calculatedResult !== null && calculatedResult !== undefined ? calculatedResult : targetNumber}
                </Typography>
              </Block>
            ) : (
              /* Empty placeholder to maintain layout spacing */
              <div className="min-w-[120px] min-h-[120px]" />
            )}
          </div>
        )}
      </div>

      {/* Player Name - only show if provided */}
      {playerName && (
        <Typography variant="h2" className="text-white">
          {playerName}
        </Typography>
      )}
    </div>
  );
}
