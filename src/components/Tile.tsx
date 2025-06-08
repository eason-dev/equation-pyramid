"use client";

import type { Operator, Tile as TileType } from "@/logic/game/types";

interface TileProps {
  tile: TileType;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

const operatorMap: Record<Operator, string> = {
  "+": "+",
  "-": "-",
  "*": "×",
  "/": "÷",
};

export function Tile({ tile, isSelected, onClick, disabled }: TileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-4 rounded-lg border-2 transition-colors flex items-center justify-center gap-1 ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="text-lg">{operatorMap[tile.operator as Operator]}</div>
      <div className="text-xl font-bold">{tile.number}</div>
    </button>
  );
}
