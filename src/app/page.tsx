"use client";

import { Menu } from "@/components/game-states/Menu";
import { Config } from "@/components/game-states/Config";
import { Playing } from "@/components/game-states/Playing";
import { RoundOver } from "@/components/game-states/RoundOver";
import { GameOver } from "@/components/game-states/GameOver";
import { useGameStore } from "@/logic/state/gameStore";

export default function Home() {
  const {
    currentState,
    config,
    players,
    gameState,
    guessingPlayerId,
    mainTimer,
    start,
    updateConfig,
    startGame,
    selectTile,
    selectPlayer,
    nextRound,
    continueGame,
  } = useGameStore();

  const tiles = gameState?.tiles ?? [];
  const selectedPlayerId = guessingPlayerId;
  const timeRemaining = mainTimer;

  const handleConfigUpdate = (newConfig: {
    numPlayers?: number;
    numRounds?: number;
  }) => {
    updateConfig(newConfig);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Equation Pyramid
        </h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {currentState === "menu" && <Menu onStart={start} />}

          {currentState === "config" && (
            <Config
              numPlayers={config.numPlayers}
              numRounds={config.numRounds}
              onConfigUpdate={handleConfigUpdate}
              onStartGame={startGame}
            />
          )}

          {(currentState === "game" || currentState === "guessing") && (
            <Playing
              tiles={tiles}
              players={players}
              selectedPlayerId={selectedPlayerId}
              timeRemaining={timeRemaining}
              onTileClick={selectTile}
              onPlayerSelect={selectPlayer}
            />
          )}

          {currentState === "roundOver" && (
            <RoundOver
              players={players}
              currentRound={config.currentRound}
              onNextRound={nextRound}
            />
          )}

          {currentState === "gameOver" && (
            <GameOver players={players} onNewGame={continueGame} />
          )}
        </div>
      </div>
    </main>
  );
}
