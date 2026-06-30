import type { Card } from "@/lib/game/types";

const DECK_API_BASE = "https://deckofcardsapi.com/api";

export interface DrawResponse {
  success: boolean;
  deck_id: string;
  cards: Card[];
  remaining: number;
}

export interface NewDeckResponse {
  success: boolean;
  deck_id: string;
  shuffled: boolean;
  remaining: number;
}

export interface ShuffleResponse {
  success: boolean;
  deck_id: string;
  shuffled: boolean;
  remaining: number;
}

async function fetchDeckApi<T>(path: string): Promise<T> {
  const response = await fetch(`/api/deck${path}`);

  if (!response.ok) {
    throw new Error(`Deck API error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function createShuffledDeck(
  deckCount = 1
): Promise<NewDeckResponse> {
  return fetchDeckApi<NewDeckResponse>(
    `/deck/new/shuffle/?deck_count=${deckCount}`
  );
}

export async function drawCards(
  deckId: string,
  count: number
): Promise<DrawResponse> {
  return fetchDeckApi<DrawResponse>(`/deck/${deckId}/draw/?count=${count}`);
}

export async function shuffleDeck(deckId: string): Promise<ShuffleResponse> {
  return fetchDeckApi<ShuffleResponse>(`/deck/${deckId}/shuffle/`);
}

export { DECK_API_BASE };
