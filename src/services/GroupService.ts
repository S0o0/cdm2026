import type { Group } from "../types/Group";
import { apiFetch } from "./Api";

// Service pour gérer les opérations liées aux groupes
export class GroupService {

    // Récupère la liste de tous les groupes et retourne un tableau de groupes
    static async getGroups(): Promise<Group[]> {
        return apiFetch("/groups");
    }

    // Récupère un groupe spécifique par son id et retourne le groupe associé à l'id
    static async getGroup(id: number): Promise<Group> {
        return apiFetch(`/groups/${id}`);
    }
}