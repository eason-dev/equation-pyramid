import { Tile } from "@/components/Tile";
import type { Tile as TileType } from "@/logic/game/types";

interface TutorialTileListProps {
  tiles: TileType[];
  onTileClick: (tile: TileType) => void;
  selectedTiles: TileType[];
  disabledTiles: TileType[];
  highlightedTiles: string[];
}

export default function TutorialTileList({
  tiles,
  onTileClick,
  selectedTiles,
  disabledTiles,
  highlightedTiles,
}: TutorialTileListProps) {
  // For tutorial, we show tiles in a simple layout based on number of tiles
  const getLayout = () => {
    if (tiles.length <= 3) {
      // Single row for guided scenarios
      return [tiles];
    } else if (tiles.length <= 6) {
      // Two rows for free exploration
      return [tiles.slice(0, 3), tiles.slice(3, 6)];
    } else {
      // Standard pyramid for practice mode
      return [
        tiles.slice(0, 1),
        tiles.slice(1, 3),
        tiles.slice(3, 6),
        tiles.slice(6, 10),
      ];
    }
  };

  const rows = getLayout();

  return (
    <div className="flex flex-col items-center gap-3 md:gap-4 lg:gap-5 py-4 md:py-6 lg:py-8">
      {rows.map((rowTiles, rowIndex) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: Row layout is static based on tile count
          key={`row-${rowIndex}`}
          className="flex items-center justify-center gap-6 md:gap-7 lg:gap-10"
        >
          {rowTiles.map((tile) => {
            const isSelected = selectedTiles.some(
              (t) => t.label === tile.label,
            );
            const isDisabled = disabledTiles.some(
              (t) => t.label === tile.label,
            );
            const isHighlighted = highlightedTiles.includes(tile.label);

            return (
              <Tile
                key={tile.label}
                tile={tile}
                isSelected={isSelected}
                onClick={() => !isDisabled && onTileClick(tile)}
                disabled={isDisabled || isSelected}
                isHint={isHighlighted}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
