import React, { useState, useEffect } from 'react';
import MatchPreview from './MatchPreview';
import type { Match } from '../types/Match';

const MatchesMaster: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://worldcup2026.shrp.dev/matches')
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
    <div className="container pt-5">
      {Object.entries(groupedMatches).map(([date, dayMatches]) => (
        <div key={date} className="mb-4">
          <h5 className="text-start fw-bold text-capitalize mb-3">
            {date}
          </h5>

          <ul className="list-group gap-2">
            {dayMatches.map(match => (
              <MatchPreview key={match.id} match={match} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MatchesMaster;