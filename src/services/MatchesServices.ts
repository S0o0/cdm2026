import { apiFetch } from "./Api";
import type { Match } from "../types/Match";

export async function getMatches(): Promise<Match[]> {
  return apiFetch("/matches");
}

export async function getMatch(id: number): Promise<Match> {
  return apiFetch(`/matches/${id}`);
}