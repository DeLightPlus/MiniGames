"use client";

import { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 480;  // Increased from 360
const CANVAS_HEIGHT = 720; // Increased from 640
const GRAVITY = 0.5;
const FLAP_STRENGTH = -8;
const PIPE_SPEED = 3;
const PIPE_SPAWN_INTERVAL = 1500;
const PIPE_GAP = 150;
const BIRD_SIZE = 48;      // Increased from 40
const PIPE_WIDTH = 80;     // New constant for pipe width

export default function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const gameState = useRef({
    bird: {
      x: CANVAS_WIDTH * 0.2,
      y: CANVAS_HEIGHT * 0.4,
      velocity: 0,
      width: BIRD_SIZE,
      height: BIRD_SIZE,
    },
    pipes: [] as { x: number; topHeight: number; scored: boolean }[],
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
      ctx.fillStyle = "#70c5ce";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw bird
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.ellipse(
        gameState.current.bird.x,
        gameState.current.bird.y,
        gameState.current.bird.width / 2,
        gameState.current.bird.height / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.strokeStyle = "#047857";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw pipes
      ctx.fillStyle = "#10b981";
      gameState.current.pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(
          pipe.x,
          pipe.topHeight + PIPE_GAP,
          PIPE_WIDTH,
          CANVAS_HEIGHT - (pipe.topHeight + PIPE_GAP)
        );
      });

      // Draw score
      ctx.fillStyle = "white";
      ctx.font = "bold 48px var(--font-geist-sans)";
      ctx.textAlign = "center";
      ctx.fillText(score.toString(), CANVAS_WIDTH / 2, 60);
    }

    function update() {
      if (!gameStarted || gameOver) return;

      const { bird, pipes } = gameState.current;

      // Update bird position
      bird.velocity += GRAVITY;
      bird.y += bird.velocity;

      // Update pipes
      pipes.forEach(pipe => {
        pipe.x -= PIPE_SPEED;
      });

      // Remove off-screen pipes
      gameState.current.pipes = pipes.filter(pipe => pipe.x > -PIPE_WIDTH);

      // Check collisions
      if (
        bird.y < 0 ||
        bird.y > CANVAS_HEIGHT ||
        pipes.some(
          pipe =>
            bird.x + bird.width / 2 > pipe.x &&
            bird.x - bird.width / 2 < pipe.x + PIPE_WIDTH &&
            (bird.y - bird.height / 2 < pipe.topHeight ||
              bird.y + bird.height / 2 > pipe.topHeight + PIPE_GAP)
        )
      ) {
        setGameOver(true);
        return;  // Stop updating when game is over
      }

      // Update score
      pipes.forEach(pipe => {
        if (!pipe.scored && pipe.x + PIPE_WIDTH < bird.x) {
          pipe.scored = true;
          setScore(s => s + 1);
        }
      });
    }

    let animationFrame: number;
    let pipeInterval: NodeJS.Timeout;

    function gameLoop() {
      update();
      draw();
      if (!gameOver) {
        animationFrame = requestAnimationFrame(gameLoop);
      }
    }

    function spawnPipe() {
      if (gameStarted && !gameOver) {
        const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
        gameState.current.pipes.push({
          x: CANVAS_WIDTH,
          topHeight,
          scored: false,
        });
      }
    }

    function startGame() {
      if (!gameStarted && !gameOver) {
        setGameStarted(true);
        gameLoop();
        pipeInterval = setInterval(spawnPipe, PIPE_SPAWN_INTERVAL);
      }
    }

    function flap() {
      if (gameOver) return;
      if (!gameStarted) {
        startGame();  // This will start the game loop
      }
      gameState.current.bird.velocity = FLAP_STRENGTH;
    }

    // Event listeners
    function handleKeydown(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        flap();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    canvas.addEventListener("click", flap);
    canvas.addEventListener("touchstart", e => {
      e.preventDefault();
      flap();
    });

    // Initial draw
    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      clearInterval(pipeInterval);
      window.removeEventListener("keydown", handleKeydown);
      canvas.removeEventListener("click", flap);
      canvas.removeEventListener("touchstart", flap);
    };
  }, [gameStarted, gameOver, score]);

  function resetGame() {
    gameState.current = {
      bird: {
        x: CANVAS_WIDTH * 0.2,
        y: CANVAS_HEIGHT * 0.4,
        velocity: 0,
        width: BIRD_SIZE,
        height: BIRD_SIZE,
      },
      pipes: [] as { x: number; topHeight: number; scored: boolean }[],
    };
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-[480px] rounded-xl bg-zinc-900 p-4">
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
              Tap or press Space to start!
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

      <p className="text-zinc-400">Score: {score}</p>
    </div>
  );
}
