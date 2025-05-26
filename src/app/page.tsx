import Image from "next/image";
import { useMachine } from "@xstate/react";
import { appMachine } from "./state/machine";
import type { Tile } from "./game/types";

function TileComponent({
  tile,
  index,
  isSelected,
  onClick,
}: {
  tile: Tile;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-lg border-2 ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
      }`}
    >
      <div className="text-xl font-bold">{tile.number}</div>
      <div className="text-lg">{tile.operator}</div>
    </button>
  );
}

export default function Home() {
  const [state, send] = useMachine(appMachine);
  const { gameState, selectedTiles } = state.context;

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Equation Pyramid</h1>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => send({ type: "START" })}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              New Game
            </button>
            <button
              type="button"
              onClick={() => send({ type: "STOP" })}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Stop
            </button>
          </div>
        </div>

        {gameState && (
          <div className="space-y-8">
            <div className="text-2xl font-bold">
              Target Number: {gameState.targetNumber}
            </div>

            <div className="grid grid-cols-5 gap-4">
              {gameState.tiles.map((tile, index) => (
                <TileComponent
                  key={`tile-${index}-${tile.number}-${tile.operator}`}
                  tile={tile}
                  index={index}
                  isSelected={selectedTiles.includes(index)}
                  onClick={() => {
                    send({ type: "SELECT_TILE", tileIndex: index });
                    if (selectedTiles.length === 2) {
                      send({ type: "CHECK_EQUATION" });
                    }
                  }}
                />
              ))}
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Found Equations:</h2>
              <div className="space-y-2">
                {state.context.foundEquations.map((key) => {
                  const [i, j, k] = key.split(",").map(Number);
                  const tiles = [
                    gameState.tiles[i],
                    gameState.tiles[j],
                    gameState.tiles[k],
                  ];
                  return (
                    <div key={key} className="p-2 bg-gray-100 rounded">
                      {tiles[1].number} {tiles[1].operator} {tiles[2].number} ={" "}
                      {gameState.targetNumber}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
