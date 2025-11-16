import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignUpService } from "../../services/SignUpService";
import type { User } from "../../types/User";
import { SignInService } from "../../services/SignInService";

// Définition des propriétés reçues par le formulaire d'inscription
type SignUpFormProps = {
    onSignUp?: (user: User) => void;
};

// Composant du formulaire d'inscription
const SignUpForm: React.FC<SignUpFormProps> = ({ onSignUp }) => {
    // États locaux pour stocker les informations saisies et l'état de chargement
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [loading, setLoading] = useState(false);

    // Permet de rediriger l'utilisateur après l'inscription
    const navigate = useNavigate();

    // Fonction exécutée lors de la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Activation du mode chargement
        setLoading(true);

        try {
            // Envoi des informations au service pour créer le compte
            const signupResponse = await SignUpService.signup({ firstname, lastname, email, password, birthDate });
            // Connexion automatique après inscription
            const loggedUser = await SignInService.login({ email, password });
            // Sauvegarde de l'utilisateur dans le stockage local
            localStorage.setItem("currentUser", JSON.stringify(loggedUser));
            if (onSignUp) {
                onSignUp(loggedUser);
            }
            // Redirection vers la page d'accueil après succès
            navigate("/");
        } catch (err: any) {
            // Gestion des erreurs selon le type de problème rencontré
            if (err.message?.includes("400")) {
                alert("Données invalides");
            } else if (err.message?.includes("409")) {
                alert("Email déjà utilisé");
            }
        } finally {
            setLoading(false);
        }
    };

    // Structure du formulaire d'inscription
    return (
        <div className="signup-form-container ms-5" style={{ maxWidth: "400px", margin: "2rem auto" }}>
            <h2>S'inscrire</h2>
            <form onSubmit={handleSubmit}>
                {/* Champ pour saisir le prénom */}
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
                {/* Champ pour saisir le nom */}
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
                {/* Champ pour saisir l'adresse email */}
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
                {/* Champ pour saisir le mot de passe */}
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
                {/* Champ pour sélectionner la date de naissance */}
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
                {/* Bouton pour valider l'inscription, change de texte pendant le chargement */}
                <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Inscription..." : "S'inscrire"}
                </button>
            </form>
        </div>
    );
};

export default SignUpForm;