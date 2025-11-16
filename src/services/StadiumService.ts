import { apiFetch } from "./Api";
import type { Stadium } from "../types/Stadium";

// Service pour gérer les opérations liées aux stades
export class StadiumService {

  // Récupère la liste de tous les stades et retourne un tableau contenant les stades
  static async getStadiums(): Promise<Stadium[]> {
    return apiFetch<Stadium[]>("/stadiums");
  }

  // Récupère un stade spécifique par son id et retourne le stade associé à l'id
  static async getStadium(id: number): Promise<Stadium> {
    return apiFetch<Stadium>(`/stadiums/${id}`);
  }
}