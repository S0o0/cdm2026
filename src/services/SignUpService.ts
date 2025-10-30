import { apiFetch } from "./Api";

export interface SignUpRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    birthDate: string;
}

export class SignUpService {
    /** Effectuer l'inscription */
    static async signup(data: SignUpRequest): Promise<void> {
        return apiFetch<void>("/auth/signup", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
}