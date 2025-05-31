"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 300;
const GROUND_HEIGHT = 250;
const DINO_WIDTH = 60;
const DINO_HEIGHT = 80;
const CACTUS_WIDTH = 40;
const CACTUS_HEIGHT = 80;
const JUMP_FORCE = -15;  // Reduced from -20 for better control
const GRAVITY = 0.6;     // Reduced from 0.8 for smoother falling

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const gameState = useRef({
    dino: {
      x: 50,
      y: GROUND_HEIGHT - DINO_HEIGHT,
      velocity: 0,
      isJumping: false,
    },
    obstacles: [] as { x: number; width: number; height: number }[],
    speed: 5,
    spawnTimer: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      if (!ctx) return;
      // Clear canvas
      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);

      // Draw ground
      ctx.fillStyle = "#27272a";
      ctx.fillRect(0, GROUND_HEIGHT, canvas?.width ?? CANVAS_WIDTH, 2);

      // Draw dino
      ctx.fillStyle = "#10b981";
      ctx.fillRect(
        gameState.current.dino.x,
        gameState.current.dino.y,
        DINO_WIDTH,
        DINO_HEIGHT
      );

      // Draw obstacles
      ctx.fillStyle = "#ef4444";
      gameState.current.obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, GROUND_HEIGHT - obstacle.height, obstacle.width, obstacle.height);
      });

      // Draw score
      ctx.fillStyle = "white";
      ctx.font = "bold 24px var(--font-geist-sans)";
      ctx.textAlign = "right";
      ctx.fillText(score.toString().padStart(5, "0"), canvas!.width - 20, 40);
    }

    function update() {
      const { dino, obstacles } = gameState.current;

      // Update dino physics even if game hasn't started
      if (dino.isJumping) {
        dino.velocity += GRAVITY;
        dino.y += dino.velocity;

        if (dino.y > GROUND_HEIGHT - DINO_HEIGHT) {
          dino.y = GROUND_HEIGHT - DINO_HEIGHT;
          dino.isJumping = false;
          dino.velocity = 0;
        }
      }

      // Only update obstacles and score if game is started
      if (gameStarted && !gameOver) {
        // Update obstacles
        obstacles.forEach(obstacle => {
          obstacle.x -= gameState.current.speed;
        });

        // Remove off-screen obstacles
        gameState.current.obstacles = obstacles.filter(obstacle => obstacle.x > -obstacle.width);

        // Spawn new obstacles
        gameState.current.spawnTimer--;
        if (gameState.current.spawnTimer <= 0) {
          gameState.current.obstacles.push({
            x: CANVAS_WIDTH,
            width: CACTUS_WIDTH,
            height: CACTUS_HEIGHT,
          });
          gameState.current.spawnTimer = Math.random() * 60 + 60;
        }

        // Update score
        setScore(s => s + 1);
      }
    }

    let animationFrame: number;

    function gameLoop() {
      update();
      draw();
      animationFrame = requestAnimationFrame(gameLoop);
    }

    function jump() {
      const { dino } = gameState.current;
      
      if (gameOver) return;
      
      // Start game on first jump
      if (!gameStarted) {
        setGameStarted(true);
        gameLoop();
      }
      
      // Allow jumping if on ground or just started falling
      if (!dino.isJumping || dino.velocity < 5) {
        dino.isJumping = true;
        dino.velocity = JUMP_FORCE;
      }
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    canvas.addEventListener("click", jump);
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      jump();
    });

    // Initial draw
    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("keydown", handleKeydown);
      canvas.removeEventListener("click", jump);
      canvas.removeEventListener("touchstart", jump);
    };
  }, [gameStarted, gameOver, score]);

  function resetGame() {
    gameState.current = {
      dino: {
        x: 50,
        y: GROUND_HEIGHT - DINO_HEIGHT,
        velocity: 0,
        isJumping: false,
      },
      obstacles: [],
      speed: 5,
      spawnTimer: 0,
    };
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-[800px] rounded-xl bg-zinc-900 p-4">
        <canvas
          ref={canvasRef}
          className="touch-none rounded-lg w-full h-auto"
          style={{ 
            aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`,
            cursor: "pointer" 
          }}
        />
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/75">
            <p className="text-xl font-bold text-emerald-400">
              Press Space or tap to start!
            </p>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/75">
            <div className="text-center">
              <p className="text-xl font-bold text-red-400">Game Over!</p>
              <p className="mt-2 text-zinc-400">Score: {score}</p>
              <button
                onClick={resetGame}
                className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}