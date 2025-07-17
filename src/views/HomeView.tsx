"use client";

import { Button } from "@/components/Button";
import { TileList } from "@/components/TileList";
import { Typography } from "@/components/Typography";
import type { Tile } from "@/logic/game/types";

interface HomeViewProps {
  onStart: () => void;
  onTutorialClick: () => void;
}

const mockTiles: Tile[] = [
  { number: 1, operator: "+", label: "A" },
  { number: 1, operator: "+", label: "A" },
  { number: 1, operator: "+", label: "A" },
  { number: 1, operator: "+", label: "A" },
  { number: 1, operator: "+", label: "A" },
  { number: 1, operator: "+", label: "A" },
  { number: 1, operator: "+", label: "A" },
  { number: 1, operator: "+", label: "A" },
  { number: 1, operator: "+", label: "A" },
  { number: 1, operator: "+", label: "A" },
];

export function HomeView({ onStart, onTutorialClick }: HomeViewProps) {
  return (
    <div className="h-full flex flex-col items-center justify-start pt-20 gap-16">
      {/* Title Section */}
      <div className="flex flex-col items-center gap-6">
        <Typography variant="h1" className="text-center text-white">
          Equation Pyramid
        </Typography>
        <Typography variant="p1" className="text-center text-white">
          Using 3 tiles to reach the target number!
        </Typography>
      </div>

      {/* Center Section - Pyramid Tiles */}
      <TileList
        tiles={mockTiles}
        selectedTiles={[]}
        onTileClick={() => {}}
        isGuessing={false}
      />

      {/* Buttons Section */}
      <div className="flex flex-col items-center gap-8">
        <Button variant="primary" onClick={onStart}>
          Start Game
        </Button>
        <Button variant="secondary" onClick={onTutorialClick}>
          Tutorial
        </Button>
      </div>
    </div>
  );
}
