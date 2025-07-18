import Link from "next/link";
import MemoryGame from "./components/Game";

export default function MemoryGamePage() {
  return (
    <>
      <header className="flex items-center gap-4">
        <Link 
          href="/"
          className="rounded-lg bg-zinc-900 p-2 text-zinc-400 transition-colors hover:text-emerald-400"
        >
          ←
        </Link>
        <div>
          <h1 className="font-mono text-2xl font-bold text-emerald-400">Memory Game</h1>
          <p className="text-sm text-zinc-400">Match the cards to win!</p>
        </div>
      </header>

      <div className="mt-8 flex flex-1 items-center justify-center">
        <MemoryGame />
      </div>
    </>
  );
}