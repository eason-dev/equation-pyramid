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
  const getStateStyles = () => {
    if (disabled) {
      return {
        background: "rgba(11, 11, 11, 0.8)",
        border: "1px solid rgba(104, 104, 104, 0.75)",
        shadow: "4px 4px 20px 0px rgba(191, 191, 191, 0.1)",
      };
    }

    if (isSelected) {
      return {
        background: "rgba(62, 62, 76, 0.8)",
        border: "1px solid rgba(169, 199, 255, 0.75)",
        shadow: "4px 4px 20px 0px rgba(99, 99, 99, 0.25)",
      };
    }

    return {
      background: "rgba(36, 36, 47, 0.8)",
      border: "1px solid rgba(169, 199, 255, 0.75)",
      shadow: "4px 4px 20px 0px rgba(99, 99, 99, 0.25)",
    };
  };

  const getHoverStyles = () => {
    if (disabled) return {};

    return {
      background: "rgba(48, 48, 64, 0.8)",
      boxShadow: "4px 4px 20px 0px rgba(191, 191, 191, 0.6)",
    };
  };

  const styles = getStateStyles();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-[72px] h-[72px]
        rotate-45
        rounded-lg
        transition-all duration-200
        flex flex-col items-center justify-center
        gap-2.5
        px-[15px] py-[7px]
        font-inter
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
      `}
      style={{
        background: styles.background,
        border: styles.border,
        boxShadow: styles.shadow,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const hoverStyles = getHoverStyles();
          Object.assign(e.currentTarget.style, hoverStyles);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, {
            background: styles.background,
            boxShadow: styles.shadow,
          });
        }
      }}
    >
      <div className="-rotate-45 flex flex-col items-center justify-center gap-2.5">
        <div
          className="text-[20px] font-normal leading-[1.21] text-center"
          style={{ color: "rgba(198, 197, 215, 0.8)" }}
        >
          {tile.label}
        </div>
        <div className="text-[24px] font-bold leading-[1.21] text-center text-white">
          {operatorMap[tile.operator as Operator]}
          {tile.number}
        </div>
      </div>
    </button>
  );
}
