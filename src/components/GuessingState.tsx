"use client";

import { GuessingTimer } from "./GuessingTimer";
import { Tile } from "./Tile";
import { Block } from "./Block";
import { Typography } from "./Typography";
import type { Tile as TileType } from "@/logic/game/types";
import { cn } from "@/lib/utils";

interface GuessingStateProps {
  playerName: string;
  tiles: TileType[];
  selectedTiles: number[];
  targetNumber: number;
  countdownSeconds: number;
  countdownTotalSeconds: number;
  state: "guessing" | "correct" | "wrong";
}

export function GuessingState({
  playerName,
  tiles,
  selectedTiles,
  targetNumber,
  countdownSeconds,
  countdownTotalSeconds,
  state,
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
          <div className="bg-gray-200 text-black px-6 py-4 rounded-lg">
            <GuessingTimer
              seconds={countdownSeconds}
              totalSeconds={countdownTotalSeconds}
              isVisible={true}
            />
          </div>
        </div>

        {/* Selected Tiles Display - center when tiles are selected */}
        {hasSelectedTiles && (
          <div className="order-2 flex items-center gap-3">
            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              {selectedTiles.map((tileIndex, index) => {
                const tile = tiles[tileIndex];
                return (
                  <div key={tileIndex} className="flex items-center gap-3">
                    <Tile
                      tile={tile}
                      isSelected={false}
                      onClick={() => {}}
                      disabled
                    />
                    {index < selectedTiles.length - 1 && (
                      <Typography variant="h2" className="text-white/60">
                        →
                      </Typography>
                    )}
                  </div>
                );
              })}
              {hasThreeTiles && (
                <Typography variant="h2" className="mx-4 text-white">
                  =
                </Typography>
              )}
            </div>
          </div>
        )}

        {/* Result Block - shows after 3 tiles selected */}
        {hasThreeTiles && (
          <div className="order-3">
            <Block
              className={cn(
                "min-w-[120px] min-h-[120px] flex flex-col items-center justify-center gap-2.5 border-2 transition-colors",
                getResultBorderStyle(),
              )}
            >
              <Typography variant="h2">Result</Typography>
              <Typography variant="p1">={targetNumber}</Typography>
            </Block>
          </div>
        )}
      </div>

      {/* Player Name - always at bottom */}
      <Typography variant="h2" className="text-white">
        {playerName}
      </Typography>
    </div>
  );
}
