import { apiFetch } from "./Api";

// Interface représentant les données nécessaires pour l'inscription d'un utilisateur
export interface SignUpRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    birthDate: string;
}

// Service pour géré les opérations liées à l'inscription des utilisateurs
export class SignUpService {
    // Inscription de l'utilisateur
    static async signup(data: SignUpRequest): Promise<void> {
        return apiFetch<void>("/auth/signup", {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include", // cookies http-only
        });
    }
}