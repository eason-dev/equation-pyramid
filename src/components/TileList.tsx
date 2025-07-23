import { Tile } from "@/components/Tile";
import type { Tile as TileType } from "@/logic/game/types";

interface TileListProps {
  tiles: TileType[];
  selectedTiles: number[];
  onTileClick: (index: number) => void;
  isGuessing: boolean;
  hintTileIndices?: number[];
}

export function TileList({
  tiles,
  selectedTiles,
  onTileClick,
  isGuessing,
  hintTileIndices = [],
}: TileListProps) {
  // Arrange tiles in pyramid: 1, 2, 3, 4 tiles per row
  const pyramidRows = [
    tiles.slice(0, 1), // Row 1: 1 tile
    tiles.slice(1, 3), // Row 2: 2 tiles
    tiles.slice(3, 6), // Row 3: 3 tiles
    tiles.slice(6, 10), // Row 4: 4 tiles
  ];

  return (
    <div 
      className="flex flex-col items-center gap-3 md:gap-4 lg:gap-5 py-4 md:py-6 lg:py-8"
      data-tutorial="tiles-area"
    >
      {pyramidRows.map((rowTiles, rowIndex) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: pyramid structure is static
          key={`row-${rowIndex}`}
          className="flex justify-center items-center gap-6 md:gap-7 lg:gap-10"
        >
          {rowTiles.map((tile, tileIndex) => {
            // Calculate the original index in the tiles array
            const originalIndex =
              rowIndex === 0
                ? tileIndex
                : rowIndex === 1
                  ? 1 + tileIndex
                  : rowIndex === 2
                    ? 3 + tileIndex
                    : 6 + tileIndex;

            return (
              <div
                key={originalIndex}
                data-tutorial={`tile-${originalIndex}`}
              >
                <Tile
                  tile={tile}
                  isSelected={selectedTiles.includes(originalIndex)}
                  onClick={() => onTileClick(originalIndex)}
                  disabled={!isGuessing || selectedTiles.includes(originalIndex)}
                  isHint={hintTileIndices.includes(originalIndex)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
