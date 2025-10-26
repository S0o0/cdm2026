import React, { useState, useEffect } from 'react';
import MatchPreview from './MatchPreview';
import type { Match } from '../types/Match';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const MatchesMaster: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/matches`)
      .then(res => res.json())
      .then(data => {
        setMatches(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des matchs...</p>;
  if (matches.length === 0) return <p>Aucun match disponible</p>;

  // Group matches by date
  const groupedMatches = matches.reduce((groups: Record<string, Match[]>, match) => {
    const date = new Date(match.date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(match);
    return groups;
  }, {});

  return (
    <div className="container py-5">
      {Object.entries(groupedMatches).map(([date, dayMatches]) => (
        <div key={date} className="mb-5">
          <h4 className="fw-bold text-capitalize mb-4 border-bottom pb-2">
            {date}
          </h4>
          <div className="row g-4">
            {dayMatches.map(match => (
              <div key={match.id} className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100 hover-shadow transition-all">
                  <div className="card-body text-center p-4">
                    <Link to={`/matches/${match.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}>
                      <MatchPreview match={match} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchesMaster;