// src/components/SignUpForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignUpService } from "../services/SignUpService";
import type { User } from "../types/User";
import { SignInService } from "../services/SignInService";

type SignUpFormProps = {
  onSignUp?: (user: User) => void;
};

    const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUp }) => {
        const [firstname, setFirstname] = useState("");
        const [lastname, setLastname] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [birthDate, setBirthDate] = useState("");
        const [error, setError] = useState<string | null>(null);
        const [loading, setLoading] = useState(false);

        const navigate = useNavigate();

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setError(null);

            try {
                const signupResponse = await SignUpService.signup({ firstname, lastname, email, password, birthDate });
                const loggedUser = await SignInService.login({ email, password });
                localStorage.setItem("currentUser", JSON.stringify(loggedUser));

                if (onSignUp) {
                    onSignUp(loggedUser);
                }
                navigate("/"); // redirection vers la page d'accueil après inscription
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="signup-form-container ms-5" style={{ maxWidth: "400px", margin: "2rem auto" }}>
                <h2>S'inscrire</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Prénom :</label>
                        <input
                            type="text"
                            className="form-control"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>Nom :</label>
                        <input
                            type="text"
                            className="form-control"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                    </div>
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
                    <div className="mb-3">
                        <label>Date de naissance :</label>
                        <input
                            type="date"
                            className="form-control"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? "Inscription..." : "S'inscrire"}
                    </button>
                </form>
            </div>
        );
};

export default SignUpForm;