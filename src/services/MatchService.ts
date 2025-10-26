import type { Match, MatchAvailability } from "../types/Match";
import { apiFetch } from "./Api";

/**
 * Service pour interagir avec les endpoints liés aux matchs.
 * Gère la récupération des matchs, des détails et des disponibilités.
 */
export class MatchService {
  /**
   * Récupère la liste de tous les matchs
   * Endpoint : GET /matches
   */
  static async getMatches(): Promise<Match[]> {
    return apiFetch<Match[]>("/matches");
  }

  /**
   * Récupère les informations détaillées d’un match
   * Endpoint : GET /matches/{id}
   */
  static async getMatch(id: number): Promise<Match> {
    return apiFetch<Match>(`/matches/${id}`);
  }

  /**
   * Récupère la disponibilité des places et les prix pour un match
   * Endpoint : GET /matches/{id}/availability
   */
  static async getAvailability(id: number): Promise<MatchAvailability> {
    return apiFetch<MatchAvailability>(`/matches/${id}/availability`);
  }
}
