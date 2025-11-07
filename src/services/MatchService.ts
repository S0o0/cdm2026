import type { Match, MatchAvailability } from "../types/Match";
import { apiFetch } from "./Api";

export class MatchService {

  // Récupère la liste de tous les matchs
  static async getMatches(): Promise<Match[]> {
    return apiFetch<Match[]>("/matches");
  }


  // Récupère les informations détaillées d’un match
  static async getMatch(id: number): Promise<Match> {
    return apiFetch<Match>(`/matches/${id}`);
  }

  // Récupère la disponibilité des places et les prix pour un match
  static async getAvailability(id: number): Promise<MatchAvailability> {
    return apiFetch<MatchAvailability>(`/matches/${id}/availability`);
  }
  // Récupère les matchs d’une date précise
  static async getMatchesByDate(date: string): Promise<Match[]> {
    return apiFetch<Match[]>(`/matches?date=${encodeURIComponent(date)}`);
  }
}
