"use client";

import type { Tile as TileType } from "@/logic/game/types";

interface TileProps {
  tile: TileType;
  isSelected: boolean;
  onClick: () => void;
}

export function Tile({ tile, isSelected, onClick }: TileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="text-xl font-bold">{tile.number}</div>
      <div className="text-lg">{tile.operator}</div>
    </button>
  );
}
