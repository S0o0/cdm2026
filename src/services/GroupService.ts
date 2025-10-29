import type { Group } from "../types/Group";
import { apiFetch } from "./Api";

export class GroupService {
    static async getGroups(): Promise<Group[]> {
        return apiFetch("/groups");
    }

    static async getGroup(id: number): Promise<Group> {
        return apiFetch(`/groups/${id}`);
    }
}