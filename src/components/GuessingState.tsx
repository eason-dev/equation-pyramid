"use client";

import { cn } from "@/lib/utils";
import type { Tile as TileType } from "@/logic/game/types";
import { Block } from "./Block";
import { GuessingTimer } from "./GuessingTimer";
import { Tile } from "./Tile";
import { Typography } from "./Typography";

interface GuessingStateProps {
  playerName?: string;
  tiles: TileType[];
  selectedTiles: number[];
  countdownSeconds?: number;
  countdownTotalSeconds?: number;
  state: "guessing" | "correct" | "wrong";
  calculatedResult?: number | null;
  hideTimer?: boolean;
}

export function GuessingState({
  playerName,
  tiles,
  selectedTiles,
  countdownSeconds = 0,
  countdownTotalSeconds = 1,
  state,
  calculatedResult,
  hideTimer = false,
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
    <div 
      className="flex flex-col items-center gap-3 md:gap-4 lg:gap-5"
      data-tutorial="guessing-state"
    >
      {/* Main horizontal layout */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 lg:gap-10 min-h-[80px] md:min-h-[100px] lg:min-h-[120px]">
        {/* Timer - centered when no tiles selected, left when tiles selected */}
        {!hideTimer && (
          <div
            className={cn(
              "flex items-center justify-center transition-all duration-300",
              hasSelectedTiles ? "md:order-1" : "md:order-2 mx-auto",
            )}
          >
            <GuessingTimer
              seconds={countdownSeconds}
              totalSeconds={countdownTotalSeconds}
              isVisible={true}
            />
          </div>
        )}

        {/* Selected Tiles Display - center when tiles are selected */}
        {hasSelectedTiles && (
          <div className="order-2">
            {/* Responsive container for tiles */}
            <div className="flex items-center gap-2 md:gap-2.5 w-full md:w-[280px] lg:w-[326px] h-[80px] md:h-[90px] lg:h-[102px] justify-center">
              {/* Render selected tiles, left-aligned */}
              {selectedTiles.map((tileIndex, arrayIndex) => {
                const tile = tiles[tileIndex];
                const isFirstSelected = arrayIndex === 0; // First tile in the selected array
                return (
                  <div
                    key={tileIndex}
                    className="w-[70px] md:w-[85px] lg:w-[102px]"
                  >
                    <Tile
                      tile={tile}
                      isSelected={false}
                      disabled
                      isFirstSelected={isFirstSelected}
                      onClick={() => {}}
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
                  "w-[90px] h-[90px] md:w-[110px] md:h-[110px] lg:w-[120px] lg:h-[120px] flex flex-col items-center justify-center gap-1.5 md:gap-2 lg:gap-2.5 border-2",
                  getResultBorderStyle(),
                )}
              >
                <Typography
                  variant="h2"
                  className="text-base md:text-lg lg:text-xl"
                >
                  Result
                </Typography>
                <div className="relative w-full text-center min-h-[1.2rem] md:min-h-[1.4rem] lg:min-h-[1.5rem] flex items-center justify-center">
                  <Typography
                    variant="p1"
                    className="text-lg md:text-xl lg:text-2xl"
                  >
                    ={" "}
                    {calculatedResult !== null && calculatedResult !== undefined
                      ? calculatedResult
                      : "?"}
                  </Typography>
                </div>
              </Block>
            ) : (
              /* Empty placeholder to maintain layout spacing */
              <div className="min-w-[90px] min-h-[90px] md:min-w-[110px] md:min-h-[110px] lg:min-w-[120px] lg:min-h-[120px]" />
            )}
          </div>
        )}
      </div>

      {/* Player Name - only show if provided */}
      {playerName && (
        <Typography
          variant="h2"
          className="text-white text-lg md:text-xl lg:text-2xl"
        >
          {playerName}
        </Typography>
      )}
    </div>
  );
}
