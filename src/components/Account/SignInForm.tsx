import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignInService } from "../../services/SignInService";
import type { User } from "../../types/User";
import home from "../../assets/img/home/home.webp";

// Définition des propriétés possibles reçues par le composant
interface SignInFormProps {
  onSignIn?: (user: User) => void; // Callback après connexion réussie
}

// Composant du formulaire de connexion
const SignInForm: React.FC<SignInFormProps> = ({ onSignIn }) => {
  // États locaux pour gérer les champs du formulaire, les erreurs et le chargement
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Permet de rediriger l'utilisateur après connexion
  const navigate = useNavigate();

  // Fonction lancée lors de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // On active le mode chargement
    setLoading(true);
    setError(null);

    try {
      const data = await SignInService.login({ email, password });
      // Sauvegarde de l'utilisateur connecté dans le stockage local
      // Stocker l'utilisateur pour affichage dans la navbar
      localStorage.setItem("currentUser", JSON.stringify(data))
      if (onSignIn) {
        onSignIn(data);
      }

      // Redirection vers l'accueil après connexion réussie
      navigate("/");
    } catch (err: any) {
      // Gestion des erreurs selon le type de problème rencontré
      if (err.message?.includes("401")) {
        setError("Email ou mot de passe incorrect");
      } else {
        setError(err.message || "Erreur lors de la connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  // Structure de l'affichage du formulaire avec une image à gauche et le formulaire à droite
  return (
    <div className="container mt-5">
      <div className="row justify-content-center align-items-center">
        {/* Affichage de l'image illustrant la connexion */}
        <div className="col-md-6 d-flex justify-content-center mb-3 mb-md-0">
          <img src={home} alt="Login illustration" className="img-fluid shadow-lg"
            style={{ width: "800px", height: "500px", objectFit: "cover" }} />
        </div>

        {/* Carte contenant le formulaire de connexion */}
        <div className="col-md-6">
          <div className="card p-4" style={{ width: "400px", height: "auto" }}>
            <h2 className="mb-3">Se connecter</h2>
            {/* Affichage d'un message d'erreur si les informations sont incorrectes */}
            {error &&
              <p
                style={{ backgroundColor: "red", fontWeight: "bold", textAlign: "center", color: "white", padding: "10px" }}
              >{error}
              </p>}
            <form onSubmit={handleSubmit}>
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
              {/* Bouton de connexion, change de texte lorsqu'une connexion est en cours */}
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </button>
              {/* Bouton pour rediriger vers la page d'inscription */}
              <button
                type="button"
                className="btn btn-secondary w-100 mt-2"
                onClick={() => navigate("/auth/signup")}
              >
                Pas de compte ? Inscription
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;