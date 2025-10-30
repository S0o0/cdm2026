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
        });
        return dataResponse.user;
    }

    /** Récupérer l'utilisateur connecté */
    static async getCurrentUser(): Promise<User> {
        const dataResponse = await apiFetch("/auth/me", {
            method: "GET",
        });
        return dataResponse.user;
    }

    /** Déconnexion (suppression des tokens du localStorage) */
    static logout(): void {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }
}