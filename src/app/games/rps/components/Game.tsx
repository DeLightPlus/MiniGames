"use client";

import { useState } from "react";

type Move = "rock" | "paper" | "scissors";
type Result = "win" | "lose" | "draw" | null;

const moves: Move[] = ["rock", "paper", "scissors"];

const emojis: Record<Move, string> = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

export default function RPSGame() {
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [computerMove, setComputerMove] = useState<Move | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });

  function determineWinner(player: Move, computer: Move): Result {
    if (player === computer) return "draw";
    
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "win";
    }
    
    return "lose";
  }

  function handleMove(move: Move) {
    const computerChoice = moves[Math.floor(Math.random() * moves.length)];
    setPlayerMove(move);
    setComputerMove(computerChoice);
    
    const gameResult = determineWinner(move, computerChoice);
    setResult(gameResult);

    if (gameResult === "win") {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else if (gameResult === "lose") {
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
    }
  }

  function resetGame() {
    setPlayerMove(null);
    setComputerMove(null);
    setResult(null);
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Score */}
      <div className="flex gap-8 text-xl">
        <div className="text-center">
          <p className="text-emerald-400">You</p>
          <p className="text-zinc-400">{score.player}</p>
        </div>
        <div className="text-center">
          <p className="text-red-400">Computer</p>
          <p className="text-zinc-400">{score.computer}</p>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex flex-col items-center gap-8">
        {/* Result Display */}
        {result && (
          <div className="flex gap-8 items-center">
            <div className="text-center">
              <div className="text-6xl mb-2">{emojis[playerMove!]}</div>
              <p className="text-emerald-400">You</p>
            </div>
            <div className="text-2xl font-bold">
              <span className={
                result === "win" ? "text-emerald-400" :
                result === "lose" ? "text-red-400" :
                "text-zinc-400"
              }>
                {result === "win" ? "WIN!" : result === "lose" ? "LOSE!" : "DRAW!"}
              </span>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-2">{emojis[computerMove!]}</div>
              <p className="text-red-400">Computer</p>
            </div>
          </div>
        )}

        {/* Move Buttons */}
        <div className="flex gap-4">
          {moves.map((move) => (
            <button
              key={move}
              onClick={() => handleMove(move)}
              className="h-24 w-24 rounded-xl bg-zinc-900 text-4xl transition-colors hover:bg-zinc-800"
            >
              {emojis[move]}
            </button>
          ))}
        </div>

        {/* Play Again Button */}
        {result && (
          <button
            onClick={resetGame}
            className="mt-4 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}