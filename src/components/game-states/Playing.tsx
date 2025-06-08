"use client";

import { Tile } from "@/components/Tile";
import { PlayerList } from "@/components/PlayerList";
import { Timer } from "@/components/Timer";
import type { Player, Tile as TileType } from "@/logic/game/types";

interface PlayingProps {
  tiles: TileType[];
  players: Player[];
  selectedTileIndex: number | null;
  selectedPlayerId: string | null;
  timeRemaining: number;
  onTileClick: (index: number) => void;
  onPlayerSelect: (playerId: string) => void;
}

export function Playing({
  tiles,
  players,
  selectedTileIndex,
  selectedPlayerId,
  timeRemaining,
  onTileClick,
  onPlayerSelect,
}: PlayingProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <PlayerList
          players={players}
          onSelectPlayer={onPlayerSelect}
          selectedPlayerId={selectedPlayerId}
        />
        <Timer seconds={timeRemaining} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {tiles.map((tile, index) => (
          <Tile
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            tile={tile}
            isSelected={index === selectedTileIndex}
            onClick={() => onTileClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
