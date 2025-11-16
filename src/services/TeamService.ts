import type { Team } from "../types/Team";
import { apiFetch } from "./Api";

// Service pour gérer les opérations liées aux équipes
export class TeamService {

    // Récupère la liste de toutes les équipes
    static async getTeams(): Promise<Team[]> {
        return apiFetch(`/teams`);
    };

    // Récupère une équipe spécifique par son id et retourne l'équpes associée à l'id
    static async getTeam(id: number): Promise<Team> {
        return apiFetch(`/teams/${id}`);
    };

}