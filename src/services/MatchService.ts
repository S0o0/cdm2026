import type { Match, MatchAvailability } from "../types/Match";

const API_URL = import.meta.env.VITE_API_URL;

export default class MatchService {
    // Récupérer les informations d’un match
    static async getMatch(id: number): Promise<Match> {
        const res = await fetch(`${API_URL}matches/${id}`);
        if (!res.ok) throw new Error("Erreur lors du chargement du match");
        const json = await res.json();
        return json.data;
    }

    // Récupérer la disponibilité et les prix des tickets d’un match
    static async getAvailability(id: number): Promise<MatchAvailability> {
        const res = await fetch(`${API_URL}matches/${id}/availability`);
        if (!res.ok) throw new Error("Erreur lors du chargement de la disponibilité (qui devait renvoyer les prix de chacune des catégories)");
        const json = await res.json();
        return json.data;
    }
    }