"use client";

import { Menu } from "@/components/game-states/Menu";
import { Config } from "@/components/game-states/Config";
import { Playing } from "@/components/game-states/Playing";
import { RoundOver } from "@/components/game-states/RoundOver";
import { GameOver } from "@/components/game-states/GameOver";
import { useGameState } from "@/logic/state/useGameState";

export default function Home() {
  const {
    state,
    send,
    context: {
      players,
      tiles,
      selectedTileIndex,
      selectedPlayerId,
      timeRemaining,
    },
  } = useGameState();

  const handleConfigUpdate = (config: {
    numPlayers?: number;
    numRounds?: number;
  }) => {
    if (config.numPlayers !== undefined) {
      send({ type: "UPDATE_PLAYERS", numPlayers: config.numPlayers });
    }
    if (config.numRounds !== undefined) {
      send({ type: "UPDATE_ROUNDS", numRounds: config.numRounds });
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Equation Pyramid
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {state.matches("menu") && (
            <Menu onStart={() => send({ type: "START_CONFIG" })} />
          )}

          {state.matches("config") && (
            <Config
              numPlayers={players.length}
              numRounds={state.context.numRounds}
              onConfigUpdate={handleConfigUpdate}
              onStartGame={() => send({ type: "START_GAME" })}
            />
          )}

          {state.matches("playing") && (
            <Playing
              tiles={tiles}
              players={players}
              selectedTileIndex={selectedTileIndex}
              selectedPlayerId={selectedPlayerId}
              timeRemaining={timeRemaining}
              onTileClick={(index) => send({ type: "SELECT_TILE", index })}
              onPlayerSelect={(playerId) =>
                send({ type: "SELECT_PLAYER", playerId })
              }
            />
          )}

          {state.matches("roundOver") && (
            <RoundOver
              players={players}
              currentRound={state.context.currentRound}
              onNextRound={() => send({ type: "NEXT_ROUND" })}
            />
          )}

          {state.matches("gameOver") && (
            <GameOver
              players={players}
              onNewGame={() => send({ type: "NEW_GAME" })}
            />
          )}
        </div>
      </div>
    </main>
  );
}
