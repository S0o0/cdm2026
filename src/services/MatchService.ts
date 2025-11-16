import type { Match, MatchAvailability } from "../types/Match";
import { apiFetch } from "./Api";

// Service pour gérer les opréations liées aux matches
export class MatchService {

  // Récupère la liste de tous les matches et retourne un tableau de matches
  static async getMatches(): Promise<Match[]> {
    return apiFetch<Match[]>("/matches");
  }

  // Récupère un match spécifique par son id et retourne le match associé à l'id
  static async getMatch(id: number): Promise<Match> {
    return apiFetch<Match>(`/matches/${id}`);
  }

  // Récupère la disponibilité des places et les prix pour un match donné et retourne la disponibilité et les tarifs
  static async getAvailability(id: number): Promise<MatchAvailability> {
    return apiFetch<MatchAvailability>(`/matches/${id}/availability`);
  }

  // Récupère les matches programmés pour une date précise et retourne un tableau de matches pour la date donnée
  static async getMatchesByDate(date: string): Promise<Match[]> {
    return apiFetch<Match[]>(`/matches?date=${encodeURIComponent(date)}`);
  }
}
