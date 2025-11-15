import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from '../assets/home/wc26logo.avif';
import signin from '../assets/home/usericon.png';
import usericonlogged from '../assets/home/usericonlogged.png';
import cartIcon from '../assets/home/carticon.png';
import { TicketService, setCartUpdateCallback } from "../services/TicketService";
import { SignInService } from "../services/SignInService";
import type { User } from "../types/User";

interface NavbarProps {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, setCurrentUser }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);

    // Compteur du panier
    useEffect(() => {
        if (!currentUser) {
            setCartCount(0);
            return;
        }
        TicketService.getPendingTickets()
            .then(data => setCartCount(data.count))
            .catch(() => setCartCount(0));
    }, [currentUser]);

    useEffect(() => {
        setCartUpdateCallback(() => {
            TicketService.getPendingTickets()
                .then(data => setCartCount(data.count))
                .catch(() => setCartCount(0));
        });
    }, []);

    // Fermer menu si clic en dehors ou escape
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

    // Mettre à jour le compteur à chaque changement de route
    const location = useLocation();
    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + "/");
    };
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
        <header className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top mb-5">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold d-flex align-items-center me-3 ps-3" to="/">
                    <img src={logo} alt="CDM 2026 Logo" style={{ height: '80px' }} />
                </Link>
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
                    {currentUser && (
                        <Link
                            to="/tickets/history"
                            className={`nav-link px-2 ${isActive("/tickets/history") ? "bg-white text-dark fw-bold rounded px-2" : "text-white"}`}
                        >
                            Commandes
                        </Link>
                    )}
                </div>
                <div className="ms-auto position-relative d-flex align-items-center">
                    <Link to="/tickets/pending" style={{ display: 'flex', alignItems: 'center', marginRight: '15px', cursor: 'pointer', gap: '5px' }}>
                        <img src={cartIcon} alt="Cart" style={{ height: "25px" }} />
                        {cartCount > 0 && (
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
                    <img
                        src={currentUser ? usericonlogged : signin}
                        alt="User menu"
                        style={{ height: "25px", cursor: "pointer" }}
                        onClick={toggleMenu}
                        className="rounded-circle"
                    />
                    {menuOpen && (
                        <ul className="dropdown-menu dropdown-menu-end show" style={{ display: "block", position: "absolute", right: 0, marginTop: "0.5rem" }}>
                            <button type="button" onClick={closeMenu} className="btn btn-sm btn-light"
                                style={{ position: "absolute", top: "5px", right: "5px", border: "none", background: "transparent", fontSize: "1rem", cursor: "pointer" }}>×</button>
                            {currentUser ? (
                                <>
                                    <li className="dropdown-item-text">Connecté en tant que {currentUser.email}</li>
                                    <li>
                                        <button className="dropdown-item" onClick={() => { SignInService.logout(); setCurrentUser(null); closeMenu(); }}>Déconnexion</button>
                                    </li>
                                </>
                            ) : (
                                <>
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