"use client";

import * as THREE from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import { useRef } from 'react'
import { HomeView } from "@/views/HomeView";
import { GameSettingsView } from "@/views/GameSettingsView";
import { GamePlayingView } from "@/views/GamePlayingView";
import { GameOverView } from "@/views/GameOverView";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useGameStore } from "@/logic/state/gameStore";
import { DEBUG } from "@/constants";

// 🔮 Shader Material 定義
const TrippyMaterial = shaderMaterial(
  {
    u_time: 0,
    u_resolution: new THREE.Vector2(),
    u_scale: 1.0,
    u_strength: 0.6,
    u_color: new THREE.Color('#00bfff'),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_strength;
    uniform vec3 u_color;

    varying vec2 vUv;

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      uv = (2.0 * gl_FragCoord.xy - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
      
      for(float i = 1.0; i < 5.0; i++){
        uv.x += u_strength / i * cos(i * 2.5 * uv.y + u_time);
        uv.y += u_strength / i * cos(i * 1.5 * uv.x + u_time);
      }
    
      float brightness = (1.0 / abs(sin(u_time - uv.y - uv.x))) * 0.8;
      vec3 color = u_color * brightness;
    
      gl_FragColor = vec4(color, 1.0);
    }
  `
)

extend({ TrippyMaterial })

function FullscreenShader() {
  const ref = useRef<any>()

  const { strength, color } = useControls({
    strength: { value: 0.6, min: 0.1, max: 2.0, step: 0.1 },
    color: '#242b3e',
  })

  useFrame(({ clock, size }) => {
    if (ref.current) {
      ref.current.u_time = clock.getElapsedTime() * 0.1
      ref.current.u_resolution = new THREE.Vector2(size.width, size.height)
      ref.current.u_strength = strength
      ref.current.u_color = new THREE.Color(color)
    }
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <trippyMaterial ref={ref} />
    </mesh>
  )
}

function ShaderBackground() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10">
      <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 1] }}>
        <FullscreenShader />
      </Canvas>
    </div>
  )
}

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
      {/* Background Shader */}
      <ShaderBackground />
      
      {/* Leva Controls */}
      <Leva collapsed={true} />
      
      {/* Main Content */}
      <div className="min-h-screen text-white flex flex-col relative z-10">
        <Header />

        <main className="flex-1">
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

          {currentState === "gameOver" && (
            <GameOverView players={players} onNewGame={continueGame} />
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
