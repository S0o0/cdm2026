import { apiFetch } from "./Api";
import type { User } from "../types/User";

// Interface représentant la requête de connexion avec email et mot de passe
export interface SignInRequest {
    email: string;
    password: string;
}

// Service pour gérer les opréations d'authentification (cookies http-only avec credentials : "include")
export class SignInService {
    // Connecte l'utilisateur avec l'email et le mot de passe fournis et retourne l'utilisateur connecté
    static async login(data: SignInRequest): Promise<User> {
        // Envoie une requête POST pour authentifier l'utilisateur
        const dataResponse = await apiFetch("/auth/signin", {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
        });
        // Retourne l'utilisateur connecté reçu de l'API
        return dataResponse.user;
    }

    // Récupère l'utilisateur actuellement connecté
    static async getCurrentUser(): Promise<User> {
        // Envoie une requête GET pour obtenir les informations de l'utilisateur courant
        const dataResponse = await apiFetch("/auth/me", {
            method: "GET",
            credentials: "include",
        });
        // Retourne l'utilisateur courant
        return dataResponse.user;
    }

    // Déconnecte l'utilisateur et redirige vers la page de connexion
    static logout(): void {
        try {
            // Supprime les informations de l'utilisateur du stockage local
            localStorage.removeItem("currentUser");
            // Redirige vers la page de connexion
            window.location.href = "/auth/signin";
        } catch (error) {
            // Affiche une erreur en cas d'échec de la déconnexion
            console.error("Erreur lors de la déconnexion :", error);
        }
    }
}