import { apiFetch } from "./Api";
import type { Stadium } from "../types/Stadium";

// Service pour gérer les opérations liées aux stades
export class StadiumService {

  // Récupère la liste de tous les stades
  static async getStadiums(): Promise<Stadium[]> {
    return apiFetch<Stadium[]>("/stadiums");
  }

  // Récupère les informations détaillées d’un stade selon son identifiant
  static async getStadium(id: number): Promise<Stadium> {
    return apiFetch<Stadium>(`/stadiums/${id}`);
  }
}