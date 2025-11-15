import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { useState } from "react";

// Components
import Home from './components/Home';
import MatchesCarousel from './components/Match/MatchesCarousel';
import Groups from './components/Group/GroupsMaster';
import GroupDetails from "./components/Group/GroupDetails";
import Matches from './components/Match/MatchesMaster';
import MatchDetails from './components/Match/MatchDetails';
import Stades from './components/Stadium/StadiumsMaster';
import Teams from './components/Teams/TeamsMaster';
import TeamDetails from './components/Teams/TeamDetails';
import SignInForm from './components/Account/SignInForm';
import SignUpForm from './components/Account/SignUpForm';
import Cart from "./components/Cart/Cart";
import StadiumDetails from "./components/Stadium/StadiumDetails";
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