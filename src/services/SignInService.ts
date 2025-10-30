import { apiFetch } from "./Api";
import type { User } from "../types/User";

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export class SignInService {
    /** Effectuer la connexion */
    static async login(data: SignInRequest): Promise<SignInResponse> {
        return apiFetch<SignInResponse>("/auth/signin", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    /** Rafraîchir le token si l’API propose un endpoint /auth/refresh */
    static async refreshToken(refreshToken: string): Promise<SignInResponse> {
        return apiFetch<SignInResponse>("/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
        });
    }

    /** Déconnexion (suppression des tokens du localStorage) */
    static logout(): void {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }

    /** Sauvegarde des tokens */
    static saveTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    }

    /** Récupérer le token d’accès */
    static getAccessToken(): string | null {
        return localStorage.getItem("accessToken");
    }

    /** Récupérer le refresh token */
    static getRefreshToken(): string | null {
        return localStorage.getItem("refreshToken");
    }

    /** Vérifie si l’utilisateur est connecté */
    static isLoggedIn(): boolean {
        return !!this.getAccessToken();
    }
}