import cards from "@/data/cards.json";
import type { SportsCard } from "@/types/card";
export function getCardById(id: string): SportsCard | undefined {
  return (cards as SportsCard[]).find((card) => card.id === id);
}
