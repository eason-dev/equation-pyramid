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
      className={`
        w-20 h-20 
        rotate-45 
        border-2 transition-colors 
        flex items-center justify-center
        relative
        ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-800 hover:border-gray-400"
        }
      `}
    >
      <div className="-rotate-45 flex flex-col items-center justify-center gap-0.5">
        <div className="text-xs font-medium text-gray-400">{tile.label}</div>
        <div className="flex items-center gap-0.5">
          <div className="text-sm text-white">
            {operatorMap[tile.operator as Operator]}
          </div>
          <div className="text-lg font-bold text-white">{tile.number}</div>
        </div>
      </div>
    </button>
  );
}
