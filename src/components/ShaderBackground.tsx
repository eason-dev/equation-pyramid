"use client";

import * as THREE from 'three'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import { useRef } from 'react'

// 🔮 Shader Material 定義
const TrippyMaterial = shaderMaterial(
  {
    u_time: 0,
    u_resolution: new THREE.Vector2(),
    u_scale: 1.0,
    u_strength: 0.6,
    u_color: new THREE.Color('#242b3e'),
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

function FullscreenShader({ externalColor }: { externalColor?: string }) {
  const ref = useRef<any>(null)
  const targetColorRef = useRef(new THREE.Color('#242b3e'))
  const currentColorRef = useRef(new THREE.Color('#242b3e'))

  const { strength, color } = useControls({
    strength: { value: 0.6, min: 0.1, max: 2.0, step: 0.1 },
    color: '#242b3e',
  })

  useFrame(({ clock, size }) => {
    if (ref.current) {
      ref.current.u_time = clock.getElapsedTime() * 0.1
      ref.current.u_resolution = new THREE.Vector2(size.width, size.height)
      ref.current.u_strength = strength
      
      // Use external color if provided, otherwise use Leva controls
      const targetColor = externalColor || color
      targetColorRef.current.set(targetColor)
      
      // Smoothly interpolate to target color
      currentColorRef.current.lerp(targetColorRef.current, 0.05)
      ref.current.u_color = currentColorRef.current.clone()
    }
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <trippyMaterial ref={ref} />
    </mesh>
  )
}

interface ShaderBackgroundProps {
  showControls?: boolean
  className?: string
  color?: string
}

export function ShaderBackground({ showControls = false, className = "fixed top-0 left-0 w-screen h-screen overflow-hidden -z-10", color }: ShaderBackgroundProps) {
  return (
    <>
      {showControls && <Leva collapsed={true} />}
      <div className={className}>
        <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 1] }}>
          <FullscreenShader externalColor={color} />
        </Canvas>
      </div>
    </>
  )
} 