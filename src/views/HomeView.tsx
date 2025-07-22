"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { TileList } from "@/components/TileList";
import { Typography } from "@/components/Typography";
import { generateGameState } from "@/logic/game/logic";
import type { Tile } from "@/logic/game/types";

interface HomeViewProps {
  onStart: () => void;
  onTutorialClick: () => void;
}

// Create placeholder tiles to prevent layout shift
const createPlaceholderTiles = (): Tile[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    number: i + 1,
    operator: "+",
    label: String.fromCharCode(65 + i), // A, B, C, etc.
  })) as Tile[];
};

export function HomeView({ onStart, onTutorialClick }: HomeViewProps) {
  const [tiles, setTiles] = useState<Tile[]>(createPlaceholderTiles());

  useEffect(() => {
    // Generate random valid tiles on mount
    const gameState = generateGameState();
    setTiles(gameState.tiles);
  }, []);
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 md:px-6 lg:px-8 gap-6 md:gap-8 lg:gap-10">
      {/* Title Section */}
      <div className="flex flex-col items-center gap-4 md:gap-5 lg:gap-6">
        <Typography
          variant="h1"
          className="text-center text-white text-2xl md:text-3xl lg:text-4xl"
        >
          Equation Pyramid
        </Typography>
        <Typography
          variant="p1"
          className="text-center text-white text-sm md:text-base lg:text-lg"
        >
          Using 3 tiles to reach the target number!
        </Typography>
      </div>

      {/* Center Section - Pyramid Tiles */}
      <div className="flex-1 flex items-center justify-center w-full max-w-sm md:max-w-md lg:max-w-none">
        <div className="transform scale-75 md:scale-90 lg:scale-100">
          <TileList
            tiles={tiles}
            selectedTiles={[]}
            onTileClick={() => {}}
            isGuessing={false}
          />
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col items-center gap-4 md:gap-5 lg:gap-6 w-full max-w-xs md:max-w-sm pb-8 md:pb-12">
        <Button variant="primary" onClick={onStart}>
          Start Game
        </Button>
        <Button
          variant="secondary"
          onClick={onTutorialClick}
          className="w-auto"
        >
          Tutorial
        </Button>
      </div>
    </div>
  );
}
