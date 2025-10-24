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

  return (
    <ul className="list-group">
      {matches.map(match => (
        <MatchPreview key={match.id} match={match} />
      ))}
    </ul>
  );
};

export default MatchesMaster;