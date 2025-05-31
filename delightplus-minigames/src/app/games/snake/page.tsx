import Link from "next/link";
import SnakeGame from "./components/Game";

export default function SnakeGamePage() {
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
          <h1 className="font-mono text-2xl font-bold text-emerald-400">Snake</h1>
          <p className="text-sm text-zinc-400">Use arrow keys or swipe to control the snake!</p>
        </div>
      </header>

      <div className="mt-8 flex flex-1 items-center justify-center">
        <SnakeGame />
      </div>
    </>
  );
}