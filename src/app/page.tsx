import { games, getSinglePlayerGames, getMultiplayerGames } from "@/lib/games-data";
import GameCard from "@/components/GameCard";

export default function Home() {
  const singlePlayerGames = getSinglePlayerGames();
  const multiplayerGames = getMultiplayerGames();

  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="font-mono text-4xl font-bold text-emerald-400">
          DelightPlus MiniGames
        </h1>
        <p className="mt-2 text-zinc-400">
          A collection of fun browser-based mini-games built with Next.js
        </p>
      </header>

      <div className="space-y-12">
        {/* Multiplayer Games Section */}
        <section>
          <h2 className="mb-4 font-mono text-2xl font-bold text-emerald-400">
            Multiplayer Games
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {multiplayerGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* Single Player Games Section */}
        <section>
          <h2 className="mb-4 font-mono text-2xl font-bold text-emerald-400">
            Single Player Games
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {singlePlayerGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}