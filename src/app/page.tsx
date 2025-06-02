"use client";

import { Menu } from "@/components/game-states/Menu";
import { Config } from "@/components/game-states/Config";
import { Playing } from "@/components/game-states/Playing";
import { RoundOver } from "@/components/game-states/RoundOver";
import { GameOver } from "@/components/game-states/GameOver";
import { useGameState } from "@/logic/state/useGameState";

export default function Home() {
  const { state, send, context } = useGameState();

  // Extract from context
  const players = context.config.players;
  const numRounds = context.config.numRounds;
  const currentRound = context.config.currentRound;
  const tiles = context.gameState?.tiles ?? [];
  const selectedTiles = context.selectedTiles;
  const selectedTileIndex =
    selectedTiles.length > 0 ? selectedTiles[selectedTiles.length - 1] : null;
  const selectedPlayerId = context.guessingPlayerId;
  const timeRemaining = context.mainTimer;

  const handleConfigUpdate = (config: {
    numPlayers?: number;
    numRounds?: number;
  }) => {
    send({ type: "CONFIG_UPDATE", config });
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Equation Pyramid
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {state.matches("menu") && (
            <Menu onStart={() => send({ type: "START" })} />
          )}

          {state.matches("config") && (
            <Config
              numPlayers={players.length}
              numRounds={numRounds}
              onConfigUpdate={handleConfigUpdate}
              onStartGame={() => send({ type: "START_GAME" })}
            />
          )}

          {state.matches("game") && (
            <Playing
              tiles={tiles}
              players={players}
              selectedTileIndex={selectedTileIndex}
              selectedPlayerId={selectedPlayerId}
              timeRemaining={timeRemaining}
              onTileClick={(tileIndex) =>
                send({ type: "SELECT_TILE", tileIndex })
              }
              onPlayerSelect={(playerId) =>
                send({ type: "SELECT_PLAYER", playerId })
              }
            />
          )}

          {state.matches("roundOver") && (
            <RoundOver
              players={players}
              currentRound={currentRound}
              onNextRound={() => send({ type: "NEXT_ROUND" })}
            />
          )}

          {state.matches("gameOver") && (
            <GameOver
              players={players}
              onNewGame={() => send({ type: "CONTINUE" })}
            />
          )}
        </div>
      </div>
    </main>
  );
}
