"use client";

import { useEffect, useRef, useState } from "react";

// Update these constants at the top
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 90;
const BALL_SIZE = 12;
const PADDLE_SPEED = 8;
const BALL_SPEED = 5; // Reduced speed for better control

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<1 | 2 | null>(null);

  const gameState = useRef({
    paddles: {
      p1: { x: 50, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
      p2: { x: CANVAS_WIDTH - 50 - PADDLE_WIDTH, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
    },
    ball: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: BALL_SPEED,
      dy: 0,
    },
    keys: new Set<string>(),
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
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw center line
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.strokeStyle = "#27272a";
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw paddles
      ctx.fillStyle = "#10b981";
      const { p1, p2 } = gameState.current.paddles;
      ctx.fillRect(p1.x, p1.y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(p2.x, p2.y, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Draw ball
      const { ball } = gameState.current;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();

      // Draw score
      if (!gameOver) {
        ctx.font = "bold 48px var(--font-geist-sans)";
        ctx.textAlign = "center";
        ctx.fillStyle = "#a1a1aa";
        ctx.fillText("VS", CANVAS_WIDTH * 0.5, 60);
      }
    }

    function update() {
      if (gameOver) return;

      const { paddles, ball, keys } = gameState.current;

      // Update paddle positions
      if (keys.has("w")) paddles.p1.y = Math.max(0, paddles.p1.y - PADDLE_SPEED);
      if (keys.has("s")) paddles.p1.y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, paddles.p1.y + PADDLE_SPEED);
      if (keys.has("ArrowUp")) paddles.p2.y = Math.max(0, paddles.p2.y - PADDLE_SPEED);
      if (keys.has("ArrowDown")) paddles.p2.y = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, paddles.p2.y + PADDLE_SPEED);

      // Update ball position
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collisions with top and bottom
      if (ball.y <= BALL_SIZE / 2 || ball.y >= CANVAS_HEIGHT - BALL_SIZE / 2) {
        ball.dy *= -1;
      }

      // Ball collisions with paddles
      const hitP1 = ball.x - BALL_SIZE / 2 <= paddles.p1.x + PADDLE_WIDTH &&
                    ball.y >= paddles.p1.y &&
                    ball.y <= paddles.p1.y + PADDLE_HEIGHT;

      const hitP2 = ball.x + BALL_SIZE / 2 >= paddles.p2.x &&
                    ball.y >= paddles.p2.y &&
                    ball.y <= paddles.p2.y + PADDLE_HEIGHT;

      if (hitP1 || hitP2) {
        // Simply reverse direction and add a small fixed vertical velocity
        ball.dx = -ball.dx;
        
        // Add a small vertical velocity based on where the ball hits the paddle
        const paddle = hitP1 ? paddles.p1 : paddles.p2;
        const hitPosition = (ball.y - paddle.y) / PADDLE_HEIGHT; // 0 to 1
        ball.dy = (hitPosition - 0.5) * BALL_SPEED; // -2.5 to 2.5
      }

      // Score points
      if (ball.x <= 0) {
        setGameOver(true);
        setWinner(2);  // Player 2 wins if ball hits left wall
      } else if (ball.x >= CANVAS_WIDTH) {
        setGameOver(true);
        setWinner(1);  // Player 1 wins if ball hits right wall
      }
    }

    // Simplify the resetBall function
    function resetBall() {
      const direction = Math.random() > 0.5 ? 1 : -1;
      gameState.current.ball = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        dx: direction * BALL_SPEED,
        dy: 0,
      };
    }

    function handleKeyDown(e: KeyboardEvent) {
      gameState.current.keys.add(e.key);
    }

    function handleKeyUp(e: KeyboardEvent) {
      gameState.current.keys.delete(e.key);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const gameLoop = () => {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameOver, score]);

  function resetGame() {
    gameState.current = {
      paddles: {
        p1: { x: 50, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
        p2: { x: CANVAS_WIDTH - 50 - PADDLE_WIDTH, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 },
      },
      ball: {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1), // Random initial direction
        dy: 0,
      },
      keys: new Set<string>(),
    };
    setScore({ p1: 0, p2: 0 });  // Keep this for state consistency
    setGameOver(false);
    setWinner(null);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-[800px] rounded-xl bg-zinc-900 p-4">
        <canvas
          ref={canvasRef}
          className="rounded-lg w-full h-auto"
          style={{ 
            aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`,
          }}
        />
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/75">
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-400">
                Player {winner} Won!
              </p>
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