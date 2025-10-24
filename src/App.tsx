import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css';
//import Matches from './components/Matches';
import Groups from './components/Groups';
//import Stadiums from './components/Stadiums';
//import Teams from './components/Teams';
const API_URL: string = import.meta.env.VITE_API_URL;

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '10px 20px',
          zIndex: 1000,
        }}
      >
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontWeight: 500,
          }}
        >
          <p style={{ margin: 0, fontWeight: 700 }}>Logo</p>
          <Link to="/matches" className="nav-link">Matches</Link>
          <Link to="/groups" className="nav-link">Groupes</Link>
          <Link to="/stadiums" className="nav-link">Stades</Link>
          <Link to="/teams" className="nav-link">Équipes</Link>
        </nav>
      </header>

      <main style={{ paddingTop: '70px' }}>
        <Routes>
          {//<Route path="/matches" element={<Matches />} />
}
          <Route path="/groups" element={<Groups />} />
          {//<Route path="/stadiums" element={<Stadiums />} />
          //<Route path="/teams" element={<Teams />} />
          //<Route path="/" element={<Matches />} />
}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App
