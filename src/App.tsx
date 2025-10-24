import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css';
//import Matches from './components/Matches';
import Groups from './components/Groups';
//import Stadiums from './components/Stadiums';
//import Teams from './components/Teams';
const API_URL: string = import.meta.env.VITE_API_URL;

// Icons and Images
import home from './assets/home/home.webp'; // Home Image
import logo from './assets/home/wc26logo.avif'; // World Cup 2026 Logo
import signin from './assets/home/usericon.png'; // Login Icon
// Components
import Matches from './components/MatchesMaster';
import MatchesCarousel from './components/MatchesCarousel';


function App() {
  const [count, setCount] = useState(0);

  return (

    <BrowserRouter>
      <header className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
        <div className="d-flex align-items-center">
          <Link className="navbar-brand fw-bold d-flex align-items-center me-3 ps-3" to="/">
            <img src={logo} alt="CDM 2026 Logo" style={{ height: '80px' }} />
          </Link>
          <Link to="/" className="nav-link px-2 text-white">Accueil</Link>
          <Link to="/matches" className="nav-link px-2 text-white">Matches</Link>
          <Link to="/groups" className="nav-link px-2 text-white">Groupes</Link>
          <Link to="/stadiums" className="nav-link px-2 text-white">Stades</Link>
          <Link to="/teams" className="nav-link px-2 text-white">Équipes</Link>
        </div>

        <div className="ms-auto">
          <Link to="/auth" className="nav-link p-0 pe-3">
            <img src={signin} alt="Sign in" style={{ height: '25px' }} />
          </Link>
        </div>
      </header>

      <div className="hero-image d-flex justify-content-center align-items-center mb-4">
        <img
          src={home}
          alt="CDM 2026"
          className="img-fluid"
        />
      </div>

      <main className="container mt-5 pt-5">
        <Routes>
          <Route
            path="/"
            element={<MatchesCarousel />}
          />
          <Route path="/groups" element={<Groups />} />
          <Route path="/matches" element={<Matches />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App
