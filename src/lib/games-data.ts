export type GameMode = 'single' | 'multiplayer';

export interface Game {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  path: string;
  available: boolean;
  mode: GameMode;
}

export const games: Game[] = [
  {
    id: "pong",
    name: "Ping Pong",
    description: "Classic two-player paddle game. First to 11 points wins!",
    thumbnail: "/games/pong/thumbnail.jpg",
    path: "/games/pong",
    available: true,
    mode: "multiplayer"
  },
  {
    id: "toe",
    name: "Tic Tac Toe",
    description: "Play the classic game of Tic Tac Toe against a friend or AI.",
    thumbnail: "/games/tic-tac-toe/thumbnail.jpg",
    path: "/games/toe",
    available: true,
    mode: "multiplayer" // Can be both single and multiplayer, but categorized as multiplayer
  },
   {
    id: "rps",
    name: "Rock Paper Scissors",
    description: "Classic hand game against the computer!",
    thumbnail: "/games/rps/thumbnail.jpg",
    path: "/games/rps",
    available: true,
    mode: "single"
  },
  {
    id: "memory",
    name: "Memory Game",
    description: "Test your memory with this classic card-matching game.",
    thumbnail: "/games/memory/thumbnail.jpg",
    path: "/games/memory",
    available: true,
    mode: "single"
  },
  {
    id: "tetris",
    name: "Terminal Tower",
    description: "Stack blocks and reach new heights in this Tetris-inspired game.",
    thumbnail: "/games/tetris/thumbnail.jpg",
    path: "/games/tetris",
    available: true,
    mode: "single"
  },
  {
    id: "snake",
    name: "Snake",
    description: "Classic Snake game. Eat, grow, and avoid your own tail!",
    thumbnail: "/games/snake/thumbnail.jpg",
    path: "/games/snake",
    available: true,
    mode: "single"
  },
  {
    id: "dino",
    name: "Chrome Dino",
    description: "Jump over cacti and dodge birds in this endless runner game.",
    thumbnail: "/games/dino/thumbnail.jpg",
    path: "/games/dino",
    available: false,
    mode: "single"
  },
  {
    id: "flappy",
    name: "Flappy Bird",
    description: "Guide the bird through pipes and beat your high score.",
    thumbnail: "/games/flappy/thumbnail.jpg",
    path: "/games/flappy",
    available: false,
    mode: "single"
  },
  {
    id: "2048",
    name: "2048",
    description: "Slide numbered tiles and combine them to reach 2048!",
    thumbnail: "/games/2048/thumbnail.jpg",
    path: "/games/2048",
    available: false,
    mode: "single"
  },
  {
    id: "minesweeper",
    name: "Minesweeper",
    description: "Clear the minefield without hitting any bombs.",
    thumbnail: "/games/minesweeper/thumbnail.jpg",
    path: "/games/minesweeper",
    available: false,
    mode: "single"
  },
  {
    id: "space-invaders",
    name: "Space Invaders",
    description: "Defend Earth from waves of alien invaders!",
    thumbnail: "/games/space-invaders/thumbnail.jpg",
    path: "/games/space-invaders",
    available: false,
    mode: "single"
  },
  {
    id: "whack-a-mole",
    name: "Whack-a-Mole",
    description: "Test your reflexes by whacking moles as they pop up!",
    thumbnail: "/games/whack-a-mole/thumbnail.jpg",
    path: "/games/whack-a-mole",
    available: false,
    mode: "single"
  },
];

// Helper functions to filter games by mode
export const getSinglePlayerGames = () => games.filter(game => game.mode === 'single');
export const getMultiplayerGames = () => games.filter(game => game.mode === 'multiplayer');