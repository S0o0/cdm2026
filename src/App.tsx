import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css';
import { useState, useEffect } from "react";



//import Stadiums from './components/Stadiums';
//import Teams from './components/Teams';

// Icons and Images
import logo from './assets/home/wc26logo.avif'; // World Cup 2026 Logo
import signin from './assets/home/usericon.png'; // Login Icon
import usericonlogged from './assets/home/usericonlogged.png'; // Logged-in User Icon
import cartIcon from './assets/home/carticon.png'; // Cart Icon (user to manage)
import { TicketService } from './services/TicketService';
// Components
import Groups from './components/GroupsMaster';
import GroupDetails from "./components/GroupDetails";
import Matches from './components/MatchesMaster';
import MatchesCarousel from './components/MatchesCarousel';
import MatchDetails from './components/MatchDetails';
import Stades from './components/StadiumsMaster';
import Teams from './components/TeamsMaster';
import TeamDetails from './components/TeamDetails';
import Home from './components/Home';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import { SignInService } from "./services/SignInService";
import type { User } from "./types/User";
import Cart from "./components/Cart";
import StadiumDetails from "./components/StadiumDetails";
import OrdersHistory from "./components/OrdersHistory";


function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (!stored || stored === "undefined" || stored === "null") {
        localStorage.removeItem("currentUser");
        return null;
      }
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem("currentUser");
      return null;
    }
  });


  useEffect(() => {
    // Fermer le menu si clic en dehors du cadre
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.querySelector(".dropdown-menu.show");
      const icon = document.querySelector("img[alt='User menu']");
      if (menu && !menu.contains(event.target as Node) && !icon?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    // Fermer le menu si l'utilisateur appuie sur echap
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (

    <BrowserRouter>
      <header className="navbar navba r-expand-lg navbar-dark bg-dark shadow-sm fixed-top mb-5">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold d-flex align-items-center me-3 ps-3" to="/">
            <img src={logo} alt="CDM 2026 Logo" style={{ height: '80px' }} />
          </Link>
          <div className="d-flex align-items-center">
            <Link to="/" className="nav-link px-2 text-white">Accueil</Link>
            <Link to="/matches" className="nav-link px-2 text-white">Matches</Link>
            <Link to="/groups" className="nav-link px-2 text-white">Groupes</Link>
            <Link to="/stadiums" className="nav-link px-2 text-white">Stades</Link>
            <Link to="/teams" className="nav-link px-2 text-white">Équipes</Link>
            <Link to="/tickets/history" className="nav-link px-2 text-white">Commandes</Link>
          </div>
          <div className="ms-auto position-relative d-flex align-items-center">
            <Link to="/tickets/pending" style={{ position: 'relative', marginRight: '15px', cursor: 'pointer' }}>
              <img
                src={cartIcon}
                alt="Cart"
                style={{ height: "25px" }}
              />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-10px',
                  background: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>{cartCount}</span>
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
                    {/* 🔹 Petite croix simple en haut à droite */}
    <button
      type="button"
      onClick={closeMenu}
      className="btn btn-sm btn-light"
      style={{ position: "absolute", top: "5px", right: "5px", border: "none", background: "transparent", fontSize: "1rem", cursor: "pointer",}}>×</button>
                {currentUser ? (
                  <>
                    <li className="dropdown-item-text">Connecté en tant que {currentUser.email}</li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          SignInService.logout();
                          setCurrentUser(null);
                          closeMenu();
                        }}
                      >
                        Déconnexion
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/auth/signin" onClick={closeMenu}>
                        Se connecter
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/auth/signup" onClick={closeMenu}>
                        S'inscrire
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>
      </header>


      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <MatchesCarousel />
              </>
            }
          />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:matchId" element={<MatchDetails />} />
          <Route path="/stadiums" element={<Stades />} />
          <Route path="/stadiums/:stadiumId" element={<StadiumDetails />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetails />} />
          <Route path="/auth/signin" element={<SignInForm onSignIn={setCurrentUser} />} />
          <Route path="/auth/signup" element={<SignUpForm onSignUp={setCurrentUser} />} />
          <Route path="/tickets/pending" element={currentUser ? (<Cart />) : (<SignInForm onSignIn={setCurrentUser} />)}/>
          <Route path="/tickets/history" element={currentUser ? (<OrdersHistory />) : (<SignInForm onSignIn={setCurrentUser} />)} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App