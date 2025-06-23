"use client";

import { useState, useEffect, useCallback } from "react";
import { HomeView } from "@/views/HomeView";
import { GameSettingsView } from "@/views/GameSettingsView";
import { GamePlayingView } from "@/views/GamePlayingView";
import { GameOverView } from "@/views/GameOverView";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShaderBackground } from "@/components/ShaderBackground";
import TransitionOverlay from "@/components/TransitionOverlay";
import { useGameStore, type GameAppState } from "@/logic/state/gameStore";
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
    continueGame,
  } = useGameStore();

  const [showTransition, setShowTransition] = useState(false);
  const [displayState, setDisplayState] = useState<GameAppState>(currentState);
  const [transitionKey, setTransitionKey] = useState(0);

  // Handle state transitions with overlay
  useEffect(() => {
    if (currentState !== displayState) {
      // Only show transition for specific state changes
      const shouldShowTransition = 
        (displayState === "config" && currentState === "game") ||
        (displayState === "roundOver" && currentState === "game") ||
        (displayState === "roundOver" && currentState === "gameOver");
      
      if (shouldShowTransition) {
        setShowTransition(true);
        // Increment key to ensure fresh component
        setTransitionKey(prev => prev + 1);
      } else {
        // For other state changes, update display state immediately without transition
        setDisplayState(currentState);
      }
    }
  }, [currentState, displayState]);

  const handleCenterReached = useCallback(() => {
    // Update display state when overlay reaches center
    setDisplayState(currentState);
  }, [currentState]);

  const handleTransitionComplete = useCallback(() => {
    // Animation completed, just hide overlay
    setShowTransition(false);
  }, []);

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
    <>
      {/* Transition Overlay */}
      {showTransition && (
        <TransitionOverlay 
          key={transitionKey} 
          onComplete={handleTransitionComplete}
          onCenterReached={handleCenterReached}
        />
      )}

      {/* Background Shader */}
      <ShaderBackground showControls={true} />
      
      {/* Main Content */}
      <div className="min-h-screen text-white flex flex-col relative z-10">
        <Header />

        <main className="flex-1">
          {displayState === "menu" && (
            <HomeView onStart={start} onTutorialClick={() => {}} />
          )}

          {displayState === "config" && (
            <GameSettingsView
              numPlayers={config.numPlayers}
              numRounds={config.numRounds}
              onConfigUpdate={handleConfigUpdate}
              onStartGame={startGame}
            />
          )}

          {(displayState === "game" || displayState === "guessing") && (
            <GamePlayingView
              tiles={tiles}
              players={players}
              selectedPlayerId={selectedPlayerId}
              timeRemaining={timeRemaining}
              onTileClick={selectTile}
              DEBUG={DEBUG}
            />
          )}

          {displayState === "roundOver" && (
            <GamePlayingView
              tiles={tiles}
              players={players}
              selectedPlayerId={selectedPlayerId}
              timeRemaining={timeRemaining}
              onTileClick={selectTile}
              isOver={true}
              DEBUG={DEBUG}
            />
          )}

          {displayState === "gameOver" && (
            <GameOverView players={players} onNewGame={continueGame} />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
