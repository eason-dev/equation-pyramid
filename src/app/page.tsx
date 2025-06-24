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
import Confetti from "@/components/Confetti";
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
    currentEquationResult,
    isCurrentEquationCorrect,
  } = useGameStore();

  const [showTransition, setShowTransition] = useState(false);
  const [displayState, setDisplayState] = useState<GameAppState>(currentState);
  const [transitionKey, setTransitionKey] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shouldShowConfettiAfterTransition, setShouldShowConfettiAfterTransition] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Handle shake effect for wrong answers
  useEffect(() => {
    if (displayState === "showingResult" && isCurrentEquationCorrect === false) {
      setIsShaking(true);
      
      // Stop shaking after 600ms
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 600);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsShaking(false);
    }
  }, [displayState, isCurrentEquationCorrect]);

  // Handle confetti logic when entering gameOver state
  useEffect(() => {
    console.log("Confetti useEffect triggered:", { 
      currentState, 
      displayState, 
      playersCount: players.length, 
      players: players.map(p => ({ name: p.name, score: p.score })),
      numPlayers: config.numPlayers
    });

    if (currentState === "gameOver") {
      // Check if confetti should be shown based on score conditions
      const shouldShowConfetti = () => {
        const numPlayers = config.numPlayers;
        
        if (numPlayers === 1) {
          // Single player mode: show confetti if player has 3+ points
          const result = players.length > 0 && players[0].score >= 1;
          console.log("Single player check:", { playerScore: players[0]?.score, result });
          return result;
        } else {
          // Multi-player mode: show confetti if any player has 3+ points
          const result = players.some(player => player.score >= 1);
          console.log("Multi-player check:", { 
            playersWithHighScores: players.filter(p => p.score >= 1),
            result 
          });
          return result;
        }
      };

      const shouldShow = shouldShowConfetti();
      console.log("Should show confetti:", shouldShow);

      if (shouldShow) {
        // Check if there's a transition happening
        const isTransitioning = showTransition || 
          (displayState === "roundOver" && currentState === "gameOver");
        
        if (isTransitioning) {
          console.log("Setting flag to show confetti after transition");
          setShouldShowConfettiAfterTransition(true);
        } else {
          console.log("Setting showConfetti to true immediately (no transition)");
          setShowConfetti(true);
          // Hide confetti after animation completes (about 6 seconds)
          setTimeout(() => {
            console.log("Hiding confetti after timeout");
            setShowConfetti(false);
          }, 6000);
        }
      }
    }
  }, [currentState, displayState, players, config.numPlayers, showTransition]);

  // Separate effect to handle display state updates
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
    
    // Check if we should show confetti after transition
    if (shouldShowConfettiAfterTransition) {
      console.log("Transition complete - showing confetti now!");
      setShowConfetti(true);
      setShouldShowConfettiAfterTransition(false);
      
      // Hide confetti after animation completes (about 6 seconds)
      setTimeout(() => {
        console.log("Hiding confetti after timeout");
        setShowConfetti(false);
      }, 6000);
    }
  }, [shouldShowConfettiAfterTransition]);

  const tiles = gameState?.tiles ?? [];
  const selectedPlayerId = guessingPlayerId;
  const timeRemaining = mainTimer;

  const handleConfigUpdate = (newConfig: {
    numPlayers?: number;
    numRounds?: number;
  }) => {
    updateConfig(newConfig);
  };

  // Determine background color based on game state and answer correctness
  const getBackgroundColor = () => {
    if (displayState === "showingResult" && isCurrentEquationCorrect !== null) {
      return isCurrentEquationCorrect ? "#233d29" : "#3d2323"; // Green for correct, red for wrong
    }
    return "#242b3e"; // Default blue-gray color
  };

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && <Confetti />}

      {/* Transition Overlay */}
      {showTransition && (
        <TransitionOverlay 
          key={transitionKey} 
          onComplete={handleTransitionComplete}
          onCenterReached={handleCenterReached}
        />
      )}

      {/* Background Shader */}
      <ShaderBackground showControls={true} color={getBackgroundColor()} />
      
      {/* Main Content */}
      <div 
        className={`min-h-screen text-white flex flex-col relative z-10 transition-transform duration-75 ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
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

          {(displayState === "game" || displayState === "guessing" || displayState === "showingResult") && (
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

      <style jsx global>{`
        /* Hide scroll bars globally across all browsers while maintaining scroll functionality */
        html, body {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        
        /* Hide scroll bars for webkit browsers (Chrome, Safari, Edge) */
        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        *::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        
        /* Hide scroll bars for all elements while maintaining scroll functionality */
        * {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        
        /* Webkit browsers */
        *::-webkit-scrollbar {
          display: none;
        }

        @keyframes shake {
          0%, 100% { 
            transform: translateX(0); 
          }
          10% { 
            transform: translateX(-8px) translateY(-2px) rotate(-1deg); 
          }
          20% { 
            transform: translateX(8px) translateY(2px) rotate(1deg); 
          }
          30% { 
            transform: translateX(-6px) translateY(-1px) rotate(-0.5deg); 
          }
          40% { 
            transform: translateX(6px) translateY(1px) rotate(0.5deg); 
          }
          50% { 
            transform: translateX(-4px) translateY(-0.5px) rotate(-0.25deg); 
          }
          60% { 
            transform: translateX(4px) translateY(0.5px) rotate(0.25deg); 
          }
          70% { 
            transform: translateX(-2px) translateY(-0.25px); 
          }
          80% { 
            transform: translateX(2px) translateY(0.25px); 
          }
          90% { 
            transform: translateX(-1px); 
          }
        }
        
        .animate-shake {
          animation: shake 0.6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
