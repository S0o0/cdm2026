import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from '../assets/img/home/wc26logo.avif';
import signin from '../assets/img/home/usericon.png';
import usericonlogged from '../assets/img/home/usericonlogged.png';
import cartIcon from '../assets/img/home/carticon.png';
import { TicketService, setCartUpdateCallback } from "../services/TicketService";
import { SignInService } from "../services/SignInService";
import type { User } from "../types/User";

interface NavbarProps {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, setCurrentUser }) => {
    // État pour gérer l'ouverture/fermeture du menu utilisateur
    const [menuOpen, setMenuOpen] = useState(false);
    // État pour stocker le nombre d'articles dans le panier
    const [cartCount, setCartCount] = useState(0);

    // Fonction pour basculer l'état du menu utilisateur
    const toggleMenu = () => setMenuOpen(!menuOpen);
    // Fonction pour fermer le menu utilisateur
    const closeMenu = () => setMenuOpen(false);

    // Récupération du nombre d'articles en attente dans le panier lors du changement d'utilisateur
    useEffect(() => {
        if (!currentUser) {
            setCartCount(0);
            return;
        }
        TicketService.getPendingTickets()
            .then(data => setCartCount(data.count))
            .catch(() => setCartCount(0));
    }, [currentUser]);

    // Mise à jour du compteur du panier via un callback global
    useEffect(() => {
        setCartUpdateCallback(() => {
            TicketService.getPendingTickets()
                .then(data => setCartCount(data.count))
                .catch(() => setCartCount(0));
        });
    }, []);

    // Fermeture du menu si clic en dehors ou touche Echap pressée
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const menu = document.querySelector(".dropdown-menu.show");
            const icon = document.querySelector("img[alt='User menu']");
            if (menu && !menu.contains(event.target as Node) && !icon?.contains(event.target as Node)) {
                closeMenu();
            }
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") closeMenu();
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    // Récupération de la location pour mettre à jour le style des liens actifs
    const location = useLocation();
    // Fonction pour vérifier si un chemin est actif (exact ou sous-chemin)
    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };
    // Mise à jour du compteur du panier à chaque changement de route ou utilisateur
    useEffect(() => {
        if (!currentUser) {
            setCartCount(0);
            return;
        }
        TicketService.getPendingTickets()
            .then(data => setCartCount(data.count))
            .catch(() => setCartCount(0));
    }, [location, currentUser]);

    return (
        // En-tête de la navbar fixe en haut avec styles Bootstrap
        <header className="navbar navbar-expand-lg navbar-dark bg-black shadow-sm fixed-top mb-5">
            <div className="container-fluid">
                {/* Logo cliquable menant à la page d'accueil */}
                <Link className="navbar-brand fw-bold d-flex align-items-center me-3 ps-3" to="/">
                    <img src={logo} alt="CDM 2026 Logo" style={{ height: '80px' }} />
                </Link>
                {/* Liens de navigation principaux */}
                <div className="d-flex align-items-center">
                    <Link
                        to="/"
                        className={`nav-link px-2 ${isActive("/") ? "bg-white text-dark fw-bold rounded px-2" : "text-white"}`}
                    >
                        Accueil
                    </Link>
                    <Link
                        to="/matches"
                        className={`nav-link px-2 ${isActive("/matches") ? "bg-white text-dark fw-bold rounded px-2" : "text-white"}`}
                    >
                        Matches
                    </Link>
                    <Link
                        to="/groups"
                        className={`nav-link px-2 ${isActive("/groups") ? "bg-white text-dark fw-bold rounded px-2" : "text-white"}`}
                    >
                        Groupes
                    </Link>
                    <Link
                        to="/stadiums"
                        className={`nav-link px-2 ${isActive("/stadiums") ? "bg-white text-dark fw-bold rounded px-2" : "text-white"}`}
                    >
                        Stades
                    </Link>
                    <Link
                        to="/teams"
                        className={`nav-link px-2 ${isActive("/teams") ? "bg-white text-dark fw-bold rounded px-2" : "text-white"}`}
                    >
                        Équipes
                    </Link>
                    {/* Lien vers l'historique des commandes visible uniquement si utilisateur connecté */}
                    {currentUser && (
                        <Link
                            to="/tickets/history"
                            className={`nav-link px-2 ${isActive("/tickets/history") ? "bg-white text-dark fw-bold rounded px-2" : "text-white"}`}
                        >
                            Commandes
                        </Link>
                    )}
                </div>
                {/* Section droite : icône panier et menu utilisateur */}
                <div className="ms-auto position-relative d-flex align-items-center">
                    {/* Lien vers le panier avec compteur */}
                    <Link to="/tickets/pending" style={{ display: 'flex', alignItems: 'center', marginRight: '15px', cursor: 'pointer', gap: '5px' }}>
                        <img src={cartIcon} alt="Cart" style={{ height: "25px" }} />
                        {cartCount > 0 && (
                            // Badge rouge affichant le nombre d'articles dans le panier
                            <span style={{
                                position: "absolute",
                                bottom: "-5px",
                                left: "-5px",
                                background: "red",
                                color: "white",
                                borderRadius: "50%",
                                padding: "2px 6px",
                                fontSize: "10px",
                                fontWeight: "bold",
                                border: "1px solid white"
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    {/* Icône utilisateur qui ouvre/ferme le menu */}
                    <img
                        src={currentUser ? usericonlogged : signin}
                        alt="User menu"
                        style={{ height: "25px", cursor: "pointer" }}
                        onClick={toggleMenu}
                        className="rounded-circle"
                    />
                    {/* Menu déroulant utilisateur */}
                    {menuOpen && (
                        <ul className="dropdown-menu dropdown-menu-end show" style={{ display: "block", position: "absolute", right: 0, marginTop: "0.5rem" }}>
                            {/* Bouton pour fermer le menu */}
                            <button type="button" onClick={closeMenu} className="btn btn-sm btn-light"
                                style={{ position: "absolute", top: "5px", right: "5px", border: "none", background: "transparent", fontSize: "1rem", cursor: "pointer" }}>×</button>
                            {/* Contenu du menu selon si utilisateur connecté ou non */}
                            {currentUser ? (
                                <>
                                    {/* Affichage email de l'utilisateur connecté */}
                                    <li className="dropdown-item-text">Connecté en tant que {currentUser.email}</li>
                                    {/* Bouton de déconnexion */}
                                    <li>
                                        <button className="dropdown-item" onClick={() => { SignInService.logout(); setCurrentUser(null); closeMenu(); }}>Déconnexion</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    {/* Liens vers pages de connexion et inscription */}
                                    <li><Link className="dropdown-item" to="/auth/signin" onClick={closeMenu}>Se connecter</Link></li>
                                    <li><Link className="dropdown-item" to="/auth/signup" onClick={closeMenu}>S'inscrire</Link></li>
                                </>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;