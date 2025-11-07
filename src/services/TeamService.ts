import type { Team } from "../types/Team";
import { apiFetch } from "./Api";


export class TeamService {
    static async getTeams(): Promise<Team[]> {
        return apiFetch(`/teams`);
    };

    static async getTeam(id: number): Promise<Team>  {
        return apiFetch(`/teams/${id}`);
    };

}