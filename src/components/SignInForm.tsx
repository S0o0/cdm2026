import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInService } from "../services/SignInService";
import type { User } from "../types/User";

interface SignInFormProps {
    onSignIn?: (user: User) => void; // Callback après connexion réussie
}

const SignInForm: React.FC<SignInFormProps> = ({ onSignIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await SignInService.login({ email, password });
            // Stocker l'utilisateur pour affichage dans la navbar
            localStorage.setItem("currentUser", JSON.stringify(data))
            if (onSignIn) {
                onSignIn(data);
            }

            // Redirection après connexion (vers l'accueil par exemple)
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Erreur lors de la connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form-container" style={{ maxWidth: "400px", margin: "2rem auto" }}>
            <h2>Se connecter</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email :</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
            </form>
        </div>
    );
};

export default SignInForm;