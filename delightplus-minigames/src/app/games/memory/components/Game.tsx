"use client";

import { useState, useEffect } from "react";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const emojis = ["🎮", "🎲", "🎯", "🎪", "🎨", "🎭", "🎪", "🎯"];

  useEffect(() => {
    initializeGame();
  }, []);

  function initializeGame() {
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
  }

  function handleCardClick(cardId: number) {
    if (flippedCards.length === 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);
    
    setFlippedCards([...flippedCards, cardId]);

    if (flippedCards.length === 1) {
      setMoves(m => m + 1);
      const [firstCard] = flippedCards;
      
      if (cards[firstCard].emoji === cards[cardId].emoji) {
        newCards[firstCard].isMatched = true;
        newCards[cardId].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          newCards[firstCard].isFlipped = false;
          newCards[cardId].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`h-24 w-24 rounded-xl text-4xl transition-all ${
              card.isFlipped || card.isMatched
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-zinc-900 text-transparent"
            }`}
          >
            {card.isFlipped || card.isMatched ? card.emoji : "?"}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <p className="text-zinc-400">Moves: {moves}</p>
        <button
          onClick={initializeGame}
          className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
}