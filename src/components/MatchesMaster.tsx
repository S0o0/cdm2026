import React, { useState, useEffect } from 'react';
import MatchPreview from './MatchPreview';
import type { Match } from '../types/Match';
import { MatchService } from "../services/MatchService";
import { Link } from 'react-router-dom';

type SortOption = 'date' | 'team' | 'group';

const MatchesMaster: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date');

  useEffect(() => {
    MatchService.getMatches()
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des matchs...</p>;
  if (matches.length === 0) return <p>Aucun match disponible</p>;

  // Fonction de tri
  const sortMatches = (matches: Match[], sortBy: SortOption): Match[] => {
    switch (sortBy) {
      case 'date':
        return [...matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'team':
        return [...matches].sort((a, b) => a.homeTeam.name.localeCompare(b.homeTeam.name));
      case 'group':
        return [...matches].sort((a, b) => a.homeTeam.groupId - b.homeTeam.groupId);
      default:
        return matches;
    }
  };

  const sortedMatches = sortMatches(matches, sortBy);

  // Groupement des matchs selon le tri
  const groupedMatches: Record<string, Match[]> = {};

  if (sortBy === 'date') {
    sortedMatches.forEach(match => {
      const key = new Date(match.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      if (!groupedMatches[key]) groupedMatches[key] = [];
      groupedMatches[key].push(match);
    });
  } else if (sortBy === 'team') {
    sortedMatches.forEach(match => {
      // ajoute pour homeTeam
      if (!groupedMatches[match.homeTeam.name]) groupedMatches[match.homeTeam.name] = [];
      groupedMatches[match.homeTeam.name].push(match);

      // ajoute pour awayTeam
      if (!groupedMatches[match.awayTeam.name]) groupedMatches[match.awayTeam.name] = [];
      groupedMatches[match.awayTeam.name].push(match);
    });
  } else if (sortBy === 'group') {
    sortedMatches.forEach(match => {
      // utilise groupId comme clé, ou converti en lettre si tu veux
      const key = String(match.homeTeam.groupId);
      if (!groupedMatches[key]) groupedMatches[key] = [];
      groupedMatches[key].push(match);
    });
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <label className="me-2 fw-bold">Trier par :</label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}>
          <option value="date">Date</option>
          <option value="team">Équipe</option>
          <option value="group">Groupe</option>
        </select>
      </div>

      {Object.entries(groupedMatches)
        .sort(([a], [b]) => {
          if (sortBy === 'group') {
            return parseInt(a) - parseInt(b); // tri numérique pour les groupes
          } else if (sortBy === 'date') {
            const dateA = new Date(a.split(' ')[2] + ' ' + a.split(' ')[3] + ' ' + a.split(' ')[4]);
            const dateB = new Date(b.split(' ')[2] + ' ' + b.split(' ')[3] + ' ' + b.split(' ')[4]);
            return dateA.getTime() - dateB.getTime();
          } else {
            return a.localeCompare(b); // tri alphabétique pour les équipes
          }
        })
        .map(([groupLabel, dayMatches]) => (
          <div key={groupLabel} className="mb-5">
            {/* Affiche le titre selon le type de tri */}
            <h4 className="fw-bold text-capitalize mb-4 border-bottom pb-2">
              {sortBy === 'date'
                ? groupLabel
                : sortBy === 'team'
                  ? `${groupLabel}`
                  : `Groupe ${groupLabel}`}
            </h4>

            <div className="row g-4">
              {dayMatches.map(match => (
                <div key={match.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0 h-100 hover-shadow transition-all rounded-0">
                    <div className="card-body text-center p-4">
                      <Link to={`/matches/${match.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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