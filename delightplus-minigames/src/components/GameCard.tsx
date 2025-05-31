import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/lib/games-data";

export default function GameCard({ game }: { game: Game }) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-zinc-900 transition-all hover:bg-zinc-800">
      <div className="flex items-center gap-4 p-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
          <Image
            src={game.thumbnail}
            alt={game.name}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
        </div>
        
        <div className="flex flex-col">
          <h2 className="font-medium text-emerald-400">{game.name}</h2>
          <p className="mt-1 text-sm text-zinc-400">{game.description}</p>
          
          {game.available ? (
            <Link
              href={game.path}
              className="mt-3 inline-flex w-fit items-center rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
            >
              Play Now
            </Link>
          ) : (
            <span className="mt-3 inline-flex w-fit items-center rounded-lg bg-zinc-800 px-3 py-1 text-sm text-zinc-500">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}