"use client";

import { useMachine } from "@xstate/react";
import { useEffect } from "react";

import type { Tile as TileType } from "@/logic/game/types";
import { appMachine } from "@/logic/state/machine";
import { PlayerList } from "@/components/PlayerList";
import { Tile } from "@/components/Tile";
import { Timer } from "@/components/Timer";

export default function Home() {
  const [state, send] = useMachine(appMachine);
  const {
    gameState,
    selectedTiles,
    config,
    mainTimer,
    guessTimer,
    guessingPlayerId,
  } = state.context;

  // Update timers
  useEffect(() => {
    if (state.value === "game" && mainTimer > 0) {
      const timer = setInterval(() => {
        send({ type: "UPDATE_TIMER" });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.value, mainTimer, send]);

  useEffect(() => {
    if (state.value === "guessing" && guessTimer > 0) {
      const timer = setInterval(() => {
        send({ type: "UPDATE_GUESS_TIMER" });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.value, guessTimer, send]);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Equation Pyramid
          </h1>

          {/* Menu State */}
          {state.value === "menu" && (
            <button
              type="button"
              onClick={() => send({ type: "START" })}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Start New Game
            </button>
          )}

          {/* Config State */}
          {state.value === "config" && (
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <label
                  htmlFor="numPlayers"
                  className="font-medium text-gray-900"
                >
                  Number of Players:
                </label>
                <select
                  id="numPlayers"
                  value={config.numPlayers}
                  onChange={(e) =>
                    send({
                      type: "CONFIG_UPDATE",
                      config: { numPlayers: Number.parseInt(e.target.value) },
                    })
                  }
                  className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 items-center">
                <label
                  htmlFor="numRounds"
                  className="font-medium text-gray-900"
                >
                  Number of Rounds:
                </label>
                <select
                  id="numRounds"
                  value={config.numRounds}
                  onChange={(e) =>
                    send({
                      type: "CONFIG_UPDATE",
                      config: { numRounds: Number.parseInt(e.target.value) },
                    })
                  }
                  className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => send({ type: "START_GAME" })}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Start Game
              </button>
            </div>
          )}

          {/* Game State */}
          {state.value === "game" && gameState && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-900">
                  Round {config.currentRound} of {config.numRounds}
                </div>
                <Timer seconds={mainTimer} />
              </div>

              <div className="text-2xl font-bold text-gray-900">
                Target Number: {gameState.targetNumber}
              </div>

              <div className="grid grid-cols-5 gap-4">
                {gameState.tiles.map((tile, index) => (
                  <Tile
                    key={`tile-${index}-${tile.number}-${tile.operator}`}
                    tile={tile}
                    index={index}
                    isSelected={selectedTiles.includes(index)}
                    onClick={() =>
                      send({ type: "SELECT_TILE", tileIndex: index })
                    }
                  />
                ))}
              </div>

              <div className="flex justify-between items-center">
                <PlayerList
                  players={config.players}
                  onSelectPlayer={(id) =>
                    send({ type: "SELECT_PLAYER", playerId: id })
                  }
                  selectedPlayerId={guessingPlayerId}
                />
                <button
                  type="button"
                  onClick={() => send({ type: "GUESS" })}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Make a Guess
                </button>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-2 text-gray-900">
                  Found Equations:
                </h2>
                <div className="space-y-2">
                  {state.context.foundEquations.map((key) => {
                    const [i, j, k] = key.split(",").map(Number);
                    const tiles = [
                      gameState.tiles[i],
                      gameState.tiles[j],
                      gameState.tiles[k],
                    ];
                    return (
                      <div
                        key={key}
                        className="p-2 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        {tiles[0].number} {tiles[1].operator} {tiles[2].number}{" "}
                        = {gameState.targetNumber}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Guessing State */}
          {state.value === "guessing" && gameState && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-900">
                  Guessing Time!
                </div>
                <Timer seconds={guessTimer} />
              </div>

              <div className="text-2xl font-bold text-gray-900">
                Target Number: {gameState.targetNumber}
              </div>

              <div className="grid grid-cols-5 gap-4">
                {gameState.tiles.map((tile, index) => (
                  <Tile
                    key={`tile-${index}-${tile.number}-${tile.operator}`}
                    tile={tile}
                    index={index}
                    isSelected={selectedTiles.includes(index)}
                    onClick={() =>
                      send({ type: "SELECT_TILE", tileIndex: index })
                    }
                  />
                ))}
              </div>

              <div className="flex justify-between items-center">
                <PlayerList
                  players={config.players}
                  onSelectPlayer={(id) =>
                    send({ type: "SELECT_PLAYER", playerId: id })
                  }
                  selectedPlayerId={guessingPlayerId}
                />
                <button
                  type="button"
                  onClick={() => send({ type: "CHECK_EQUATION" })}
                  disabled={selectedTiles.length !== 3 || !guessingPlayerId}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    selectedTiles.length === 3 && guessingPlayerId
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Check Equation
                </button>
              </div>
            </div>
          )}

          {/* Round Result State */}
          {state.value === "roundResult" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Round {config.currentRound} Complete!
              </h2>
              <div className="space-y-4">
                {config.players.map((player) => (
                  <div
                    key={player.id}
                    className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        {player.name}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        Score: {player.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => send({ type: "NEXT_ROUND" })}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {config.currentRound >= config.numRounds
                  ? "View Final Results"
                  : "Next Round"}
              </button>
            </div>
          )}

          {/* Final Result State */}
          {state.value === "finalResult" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Game Complete!
              </h2>
              <div className="space-y-4">
                {config.players
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div
                      key={player.id}
                      className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900">
                            #{index + 1}
                          </span>
                          <span className="font-medium text-gray-900">
                            {player.name}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          Score: {player.score}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => send({ type: "CONTINUE" })}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={() => send({ type: "EXIT" })}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Exit to Menu
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
