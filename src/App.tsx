import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { useState } from "react";
import type { User } from "./types/User";

// Composants
//Accueil
import Home from './components/Home';
import Navbar from './components/Navbar';
// Matches
import MatchesCarousel from './components/Match/MatchesCarousel';
import Matches from './components/Match/MatchesMaster';
import MatchDetails from './components/Match/MatchDetails';
// Groupes
import Groups from './components/Group/GroupsMaster';
import GroupDetails from "./components/Group/GroupDetails";
// Stades
import Stades from './components/Stadium/StadiumsMaster';
import StadiumDetails from "./components/Stadium/StadiumDetails";
// Équipes
import Teams from './components/Teams/TeamsMaster';
import TeamDetails from './components/Teams/TeamDetails';
// Compte
import SignInForm from './components/Account/SignInForm';
import SignUpForm from './components/Account/SignUpForm';
// Panier
import Cart from "./components/Cart/Cart";
// Commandes
import OrdersHistory from "./components/OrdersHistory";

// État pour stocker l'utilisateur actuellement connecté (null si aucun utilisateur n'est authentifié)
function App() {
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

  return (
    <BrowserRouter>
      {/* Barre de navigation */}
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Vidéo sur fond noir */}
                <Home />
                {/* Carousel des matches */}
                <MatchesCarousel />
              </>
            }
          />
          {/* Matches*/}
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:matchId" element={<MatchDetails />} />
          {/* Groupes */}
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:groupId" element={<GroupDetails />} />
          {/* Stades */}
          <Route path="/stadiums" element={<Stades />} />
          <Route path="/stadiums/:stadiumId" element={<StadiumDetails />} />
          {/* Équipes*/}
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamDetails />} />
          {/* Compte */}
          <Route path="/auth/signin" element={<SignInForm onSignIn={setCurrentUser} />} />
          <Route path="/auth/signup" element={<SignUpForm onSignUp={setCurrentUser} />} />
          {/* Panier */}
          <Route path="/tickets/pending" element={currentUser ? (<Cart />) : (<SignInForm onSignIn={setCurrentUser} />)} />
          {/* Commandes */}
          <Route path="/tickets/history" element={currentUser ? (<OrdersHistory />) : (<SignInForm onSignIn={setCurrentUser} />)} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;