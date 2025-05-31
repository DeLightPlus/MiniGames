"use client";

import { useState } from "react";

type Player = "X" | "O";
type Board = (Player | null)[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export default function TicTacToeGame() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);
  const [isAgainstAI, setIsAgainstAI] = useState(false);

  function checkWinner(squares: Board): Player | "Draw" | null {
    // Check for winner
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a] as Player;
      }
    }
    
    // Check for draw
    if (squares.every(square => square !== null)) {
      return "Draw";
    }
    
    return null;
  }

  function getAIMove(squares: Board): number {
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const testBoard = [...squares];
        testBoard[i] = "O";
        if (checkWinner(testBoard) === "O") return i;
      }
    }

    // Block player win
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const testBoard = [...squares];
        testBoard[i] = "X";
        if (checkWinner(testBoard) === "X") return i;
      }
    }

    // Take center
    if (!squares[4]) return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !squares[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    const availableSpaces = squares
      .map((square, i) => !square ? i : -1)
      .filter(i => i !== -1);
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  }

  function handleClick(index: number) {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    const nextPlayer = currentPlayer === "X" ? "O" : "X";
    setCurrentPlayer(nextPlayer);

    // AI turn
    if (isAgainstAI && nextPlayer === "O" && !gameWinner) {
      setTimeout(() => {
        const aiMove = getAIMove(newBoard);
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = "O";
        setBoard(aiBoard);
        setCurrentPlayer("X");
        const aiWinner = checkWinner(aiBoard);
        if (aiWinner) setWinner(aiWinner);
      }, 500);
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-4">
        <button
          onClick={() => {
            setIsAgainstAI(false);
            resetGame();
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            !isAgainstAI
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          2 Players
        </button>
        <button
          onClick={() => {
            setIsAgainstAI(true);
            resetGame();
          }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isAgainstAI
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          vs AI
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {board.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={!!square || (isAgainstAI && currentPlayer === "O")}
            className="h-24 w-24 rounded-xl bg-zinc-900 text-4xl font-bold transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed"
          >
            <span className={square === "X" ? "text-emerald-400" : "text-red-400"}>
              {square}
            </span>
          </button>
        ))}
      </div>

      {winner && (
        <div className="text-center">
          <p className="text-xl font-bold text-emerald-400">
            {winner === "Draw" ? "Draw!" : `${winner} Wins!`}
          </p>
          <button
            onClick={resetGame}
            className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
          >
            Play Again
          </button>
        </div>
      )}

      {!winner && (
        <p className="text-zinc-400">
          Current Player: <span className={currentPlayer === "X" ? "text-emerald-400" : "text-red-400"}>{currentPlayer}</span>
        </p>
      )}
    </div>
  );
}