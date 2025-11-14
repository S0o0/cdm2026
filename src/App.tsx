import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { useState } from "react";

// Components
import Home from './components/Home';
import MatchesCarousel from './components/MatchesCarousel';
import Groups from './components/GroupsMaster';
import GroupDetails from "./components/GroupDetails";
import Matches from './components/MatchesMaster';
import MatchDetails from './components/MatchDetails';
import Stades from './components/StadiumsMaster';
import Teams from './components/TeamsMaster';
import TeamDetails from './components/TeamDetails';
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';
import Cart from "./components/Cart";
import StadiumDetails from "./components/StadiumDetails";
import OrdersHistory from "./components/OrdersHistory";
import Navbar from './components/Navbar';

import type { User } from "./types/User";

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
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
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
          <Route path="/tickets/pending" element={currentUser ? (<Cart />) : (<SignInForm onSignIn={setCurrentUser} />)} />
          <Route path="/tickets/history" element={currentUser ? (<OrdersHistory />) : (<SignInForm onSignIn={setCurrentUser} />)} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;