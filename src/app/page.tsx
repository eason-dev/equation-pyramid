"use client";

import { HomeView } from "@/views/HomeView";
import { GameSettingsView } from "@/views/GameSettingsView";
import { GamePlayingView } from "@/views/GamePlayingView";
import { GameRoundOverView } from "@/views/GameRoundOverView";
import { GameOverView } from "@/views/GameOverView";
import { useGameStore } from "@/logic/state/gameStore";
import { DEBUG } from "@/constants";

export default function AppPage() {
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
    <main className="min-h-screen bg-[#0a0c11] text-white">
      {currentState === "menu" && (
        <HomeView onStart={start} onTutorialClick={() => {}} />
      )}

      {currentState === "config" && (
        <GameSettingsView
          numPlayers={config.numPlayers}
          numRounds={config.numRounds}
          onConfigUpdate={handleConfigUpdate}
          onStartGame={startGame}
        />
      )}

      {(currentState === "game" || currentState === "guessing") && (
        <GamePlayingView
          tiles={tiles}
          players={players}
          selectedPlayerId={selectedPlayerId}
          timeRemaining={timeRemaining}
          onTileClick={selectTile}
          DEBUG={DEBUG}
        />
      )}

      {currentState === "roundOver" && (
        <GameRoundOverView
          players={players}
          currentRound={config.currentRound}
          onNextRound={nextRound}
        />
      )}

      {currentState === "gameOver" && (
        <GameOverView players={players} onNewGame={continueGame} />
      )}
    </main>
  );
}
