"use client";

import { useEffect, useRef, useState } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [touchStart, setTouchStart] = useState<Position | null>(null);

  const gameState = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: "RIGHT" as Direction,
    speed: INITIAL_SPEED,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GRID_SIZE * CELL_SIZE;
    canvas.height = GRID_SIZE * CELL_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    function update() {
      const { snake, food, direction } = gameState.current;
      const head = { ...snake[0] };

      // Update head position
      switch (direction) {
        case "UP": head.y--; break;
        case "DOWN": head.y++; break;
        case "LEFT": head.x--; break;
        case "RIGHT": head.x++; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 1);
        gameState.current.food = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };
      } else {
        snake.pop();
      }

      snake.unshift(head);
    }

    function draw() {
      const { snake, food } = gameState.current;
      if (!ctx || !canvas) return;
      
      // Clear canvas
      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw snake
      ctx.fillStyle = "#10b981";
      snake.forEach(({ x, y }) => {
        ctx.fillRect(
          x * CELL_SIZE,
          y * CELL_SIZE,
          CELL_SIZE - 1,
          CELL_SIZE - 1
        );
      });

      // Draw food
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(
        food.x * CELL_SIZE,
        food.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    }

    function gameLoop() {
      if (!gameOver) {
        update();
        draw();
      }
    }

    const interval = setInterval(gameLoop, gameState.current.speed);
    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const { direction } = gameState.current;
      
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") gameState.current.direction = "UP";
          break;
        case "ArrowDown":
          if (direction !== "UP") gameState.current.direction = "DOWN";
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") gameState.current.direction = "LEFT";
          break;
        case "ArrowRight":
          if (direction !== "LEFT") gameState.current.direction = "RIGHT";
          break;
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  // Touch controls
  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && gameState.current.direction !== "LEFT") {
        gameState.current.direction = "RIGHT";
      } else if (dx < 0 && gameState.current.direction !== "RIGHT") {
        gameState.current.direction = "LEFT";
      }
    } else {
      if (dy > 0 && gameState.current.direction !== "UP") {
        gameState.current.direction = "DOWN";
      } else if (dy < 0 && gameState.current.direction !== "DOWN") {
        gameState.current.direction = "UP";
      }
    }

    setTouchStart(null);
  }

  function resetGame() {
    gameState.current = {
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: "RIGHT",
      speed: INITIAL_SPEED,
    };
    setScore(0);
    setGameOver(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative rounded-xl bg-zinc-900 p-4">
        <canvas
          ref={canvasRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="touch-none rounded-lg"
        />
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