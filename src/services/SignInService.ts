import { apiFetch } from "./Api";
import type { User } from "../types/User";

export interface SignInRequest {
    email: string;
    password: string;
}

export class SignInService {
    /** Effectuer la connexion */
    static async login(data: SignInRequest): Promise<User> {
        const dataResponse = await apiFetch("/auth/signin", {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
        });
        return dataResponse.user;
    }

    /** Récupérer l'utilisateur connecté */
    static async getCurrentUser(): Promise<User> {
        const dataResponse = await apiFetch("/auth/me", {
            method: "GET",
            credentials: "include",
        });
        return dataResponse.user;
    }

    /** Déconnexion (suppression des tokens du localStorage) */
    static logout(): void {
        try {
            // Suppression des informations de l'utilisateur
            localStorage.removeItem("currentUser");
            // Redirection vers la page de connexion
            window.location.href = "/auth/signin";
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    }
}