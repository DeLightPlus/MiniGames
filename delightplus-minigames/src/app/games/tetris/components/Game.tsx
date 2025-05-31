"use client";

import { useEffect, useRef, useState } from "react";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;

const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: "#06b6d4" },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: "#3b82f6" },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: "#f97316" },
  O: { shape: [[1, 1], [1, 1]], color: "#eab308" },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: "#22c55e" },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: "#a855f7" },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: "#ef4444" },
};

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gameState = useRef({
    board: Array(BOARD_HEIGHT).fill(null).map(() => 
      Array(BOARD_WIDTH).fill(null)
    ),
    currentPiece: null as any,
    currentPosition: { x: 0, y: 0 },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = BOARD_WIDTH * CELL_SIZE;
    canvas.height = BOARD_HEIGHT * CELL_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function spawnPiece() {
      const pieces = Object.keys(TETROMINOES);
      const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
      gameState.current.currentPiece = TETROMINOES[randomPiece as keyof typeof TETROMINOES];
      gameState.current.currentPosition = {
        x: Math.floor(BOARD_WIDTH / 2) - 1,
        y: 0
      };
    }

    function draw() {
      if (!ctx) return;
      // Clear canvas
      ctx.fillStyle = "#18181b";
      ctx.fillRect(0, 0, canvas?.width ?? 0, canvas?.height ?? 0);

      // Draw board
      gameState.current.board.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            ctx.fillStyle = cell;
            ctx.fillRect(
              x * CELL_SIZE,
              y * CELL_SIZE,
              CELL_SIZE - 1,
              CELL_SIZE - 1
            );
          }
        });
      });

      // Draw current piece
      if (gameState.current.currentPiece) {
        const { shape, color } = gameState.current.currentPiece;
        const { x: pieceX, y: pieceY } = gameState.current.currentPosition;

        shape.forEach((row: number[], y: number) => {
          row.forEach((cell: number, x: number) => {
            if (cell) {
              ctx.fillStyle = color;
              ctx.fillRect(
                (pieceX + x) * CELL_SIZE,
                (pieceY + y) * CELL_SIZE,
                CELL_SIZE - 1,
                CELL_SIZE - 1
              );
            }
          });
        });
      }
    }

    // Game loop
    let lastTime = 0;
    let dropCounter = 0;
    const dropInterval = 1000;

    function update(time = 0) {
      const deltaTime = time - lastTime;
      lastTime = time;
      dropCounter += deltaTime;

      if (dropCounter > dropInterval) {
        dropPiece();
        dropCounter = 0;
      }

      draw();
      if (!gameOver) {
        requestAnimationFrame(update);
      }
    }

    function dropPiece() {
      gameState.current.currentPosition.y++;
      if (checkCollision()) {
        gameState.current.currentPosition.y--;
        mergePiece();
        clearLines();
        spawnPiece();
        if (checkCollision()) {
          setGameOver(true);
        }
      }
    }

    // Start game
    spawnPiece();
    update();

    function handleKeydown(event: KeyboardEvent) {
      if (gameOver) return;

      switch (event.key) {
        case 'ArrowLeft':
          gameState.current.currentPosition.x--;
          if (checkCollision()) {
            gameState.current.currentPosition.x++;
          }
          break;
        case 'ArrowRight':
          gameState.current.currentPosition.x++;
          if (checkCollision()) {
            gameState.current.currentPosition.x--;
          }
          break;
        case 'ArrowDown':
          gameState.current.currentPosition.y++;
          if (checkCollision()) {
            gameState.current.currentPosition.y--;
            mergePiece();
            clearLines();
            spawnPiece();
            if (checkCollision()) {
              setGameOver(true);
            }
          }
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
      }
    }

    // Add rotation function
    function rotatePiece() {
      const { currentPiece } = gameState.current;
      const rotated = currentPiece.shape[0].map((_: any, i: number) =>
        currentPiece.shape.map((row: any[]) => row[row.length - 1 - i])
      );
      const previousShape = currentPiece.shape;
      currentPiece.shape = rotated;
      
      if (checkCollision()) {
        currentPiece.shape = previousShape;
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeydown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [gameOver]);

  function checkCollision() {
    const { currentPiece, currentPosition, board } = gameState.current;
    return currentPiece.shape.some((row: number[], y: number) =>
      row.some((cell: number, x: number) => {
        if (cell === 0) return false;
        const boardX = currentPosition.x + x;
        const boardY = currentPosition.y + y;
        return (
          boardX < 0 ||
          boardX >= BOARD_WIDTH ||
          boardY >= BOARD_HEIGHT ||
          (boardY >= 0 && board[boardY][boardX])
        );
      })
    );
  }

  function mergePiece() {
    const { currentPiece, currentPosition, board } = gameState.current;
    currentPiece.shape.forEach((row: number[], y: number) => {
      row.forEach((cell: number, x: number) => {
        if (cell) {
          const boardY = currentPosition.y + y;
          if (boardY >= 0) {
            board[boardY][currentPosition.x + x] = currentPiece.color;
          }
        }
      });
    });
  }

  function clearLines() {
    const { board } = gameState.current;
    let linesCleared = 0;

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (board[y].every(cell => cell !== null)) {
        board.splice(y, 1);
        board.unshift(Array(BOARD_WIDTH).fill(null));
        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      setScore(score => score + (linesCleared * 100));
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative rounded-xl bg-zinc-900 p-4">
        <canvas ref={canvasRef} className="rounded-lg" />
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/75">
            <div className="text-center">
              <p className="text-xl font-bold text-red-400">Game Over!</p>
              <p className="mt-2 text-zinc-400">Score: {score}</p>
              <button
                onClick={() => window.location.reload()}
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