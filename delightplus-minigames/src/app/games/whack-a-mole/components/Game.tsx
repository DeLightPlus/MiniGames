"use client";

import { useState, useEffect, useRef } from "react";

export default function WhackAMoleGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimerRef = useRef<NodeJS.Timeout | null>(null);

  function startGame() {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    spawnMole();
  }

  function spawnMole() {
    const nextMole = Math.floor(Math.random() * 9);
    setActiveMole(nextMole);
    
    moleTimerRef.current = setTimeout(() => {
      setActiveMole(null);
      if (isPlaying) spawnMole();
    }, Math.random() * 1000 + 1000); // Random time between 0.5 and 1.5 seconds
  }

  function whackMole(index: number) {
    if (index === activeMole) {
      setScore(s => s + 1);
      setActiveMole(null);
      spawnMole();
    }
  }

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (moleTimerRef.current) clearTimeout(moleTimerRef.current);
    };
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-8 text-xl">
        <div className="text-center">
          <p className="text-emerald-400">Score</p>
          <p className="text-zinc-400">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-red-400">Time</p>
          <p className="text-zinc-400">{timeLeft}s</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Array(9).fill(null).map((_, i) => (
          <button
            key={i}
            onClick={() => whackMole(i)}
            disabled={!isPlaying}
            className={`h-24 w-24 rounded-full transition-all ${
              activeMole === i
                ? "bg-emerald-500 scale-100"
                : "bg-zinc-800 scale-75"
            }`}
          >
            {activeMole === i && "🦔"}
          </button>
        ))}
      </div>

      {!isPlaying && (
        <button
          onClick={startGame}
          className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
        >
          {timeLeft === 30 ? "Start Game" : "Play Again"}
        </button>
      )}
    </div>
  );
}