import { Tile } from "@/components/Tile";
import type { Tile as TileType } from "@/logic/game/types";

interface TileListProps {
  tiles: TileType[];
  selectedTiles: number[];
  onTileClick: (index: number) => void;
  isGuessing: boolean;
}

export function TileList({
  tiles,
  selectedTiles,
  onTileClick,
  isGuessing,
}: TileListProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {tiles.map((tile, index) => (
        <Tile
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          tile={tile}
          isSelected={selectedTiles.includes(index)}
          onClick={() => onTileClick(index)}
          disabled={!isGuessing}
        />
      ))}
    </div>
  );
}
