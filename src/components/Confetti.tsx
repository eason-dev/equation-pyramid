import { useEffect, useRef } from "react";
import { useAudio } from "../hooks/useAudio";

export default function Confetti() {
  const animationRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const audioPlayedRef = useRef(false);

  const winAudioControls = useAudio("/audio/win.mp3", {
    volume: 0.8,
    loop: false,
    autoPlay: false,
  });

  // Play win sound when audio is loaded - global audio state is handled by useAudio hook
  useEffect(() => {
    if (winAudioControls.isLoaded && !audioPlayedRef.current) {
      winAudioControls.play();
      audioPlayedRef.current = true;
    }
  }, [winAudioControls.isLoaded, winAudioControls.play]);

  // Cleanup: Stop win audio when component unmounts (leaving page)
  useEffect(() => {
    return () => {
      if (winAudioControls.isPlaying) {
        winAudioControls.pause();
      }
    };
  }, [winAudioControls.isPlaying, winAudioControls.pause]);

  useEffect(() => {
    // Prevent multiple animations from starting
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const canvas = document.getElementById(
      "confetti-canvas",
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
      "#0300ff",
      "#ffffff",
      "#0d0041",
      "#252386",
      "#aa94ff",
      "#d6ccff",
      "#a3c4ff",
      "#94ebff",
      "#ebccff",
      "#5c7db7",
    ];

    const gravity = 0.3;
    const friction = 0.99;
    const confettiCount = 150;
    const confetti: Confetto[] = [];

    class Confetto {
      x: number;
      y: number;
      size: number;
      color: string;
      velocity: { x: number; y: number };
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      lifetime: number;

      constructor(x: number, side: "left" | "right") {
        this.x = x;
        this.y = canvas.height;
        this.size = Math.random() * 8 + 4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.velocity = {
          x:
            (((Math.random() - 0.5) * canvas.width) / 25) *
            (side === "left" ? -1 : 1),
          y: Math.random() * -20 - 5,
        };
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.opacity = 1;
        this.lifetime = 200;
      }

      update() {
        this.velocity.y += gravity;
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.rotation += this.rotationSpeed;
        this.lifetime--;
        this.opacity = Math.max(0, this.lifetime / 200);
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(
          -this.size / 2,
          -this.size / 2,
          this.size,
          this.size * 0.5,
        );
        ctx.restore();
      }
    }

    function spawnConfetti() {
      for (let i = 0; i < confettiCount; i++) {
        const fromLeft = i % 2 === 0;
        const x = fromLeft ? 0 : canvas.width;
        const side = fromLeft ? "left" : "right";
        confetti.push(new Confetto(x, side));
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.update();
        c.draw();
        if (c.opacity <= 0) {
          confetti.splice(i, 1);
        }
      }
      if (confetti.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    }

    spawnConfetti();
    animate();

    return () => {
      // Cleanup function to stop animation if component unmounts
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      confetti.length = 0;
      hasStartedRef.current = false;
    };
  }, []); // Empty dependency array ensures this only runs once per mount

  return (
    <canvas
      id="confetti-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 10000,
      }}
    />
  );
}
