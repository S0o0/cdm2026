import React, { useState, useEffect } from 'react';
import MatchPreview from './MatchPreview';
import type { Match } from '../types/Match';
import { MatchService } from "../services/MatchService";
import { Link } from 'react-router-dom';
import { GroupService } from "../services/GroupService";
import type { Group } from "../types/Group";

type SortOption = 'date' | 'team' | 'group';

const MatchesMaster: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [groupedMatches, setGroupedMatches] = useState<Record<string, Match[]>>({});
  const [groupNames, setGroupNames] = useState<Record<number, string>>({});

  // Récupération des groupes pour les noms
  useEffect(() => {
    GroupService.getGroups()
      .then((groups: Group[]) => {
        const mapping: Record<number, string> = {};
        groups.forEach(g => (mapping[g.id] = g.name));
        setGroupNames(mapping);
      })
      .catch(err => console.error("❌ Erreur chargement groupes :", err));
  }, []);

  // Récupération des matchs
  useEffect(() => {
    MatchService.getMatches()
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filtre des matchs par date
  useEffect(() => {
    if (!matches.length || sortBy !== 'date') return;

    const sorted = [...matches].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const grouped: Record<string, Match[]> = {};
    sorted.forEach(match => {
      const key = new Date(match.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(match);
    });

    setGroupedMatches(grouped);
  }, [matches, sortBy]);

  // Filtre des matchs par équipe
  useEffect(() => {
    if (!matches.length || sortBy !== 'team') return;

    const sorted = [...matches].sort((a, b) =>
      a.homeTeam.name.localeCompare(b.homeTeam.name)
    );

    const grouped: Record<string, Match[]> = {};
    sorted.forEach(match => {
      if (!grouped[match.homeTeam.name]) grouped[match.homeTeam.name] = [];
      grouped[match.homeTeam.name].push(match);

      if (!grouped[match.awayTeam.name]) grouped[match.awayTeam.name] = [];
      grouped[match.awayTeam.name].push(match);
    });

    setGroupedMatches(grouped);
  }, [matches, sortBy]);

  // Filtre des matchs par groupe
  useEffect(() => {
    if (!matches.length || sortBy !== 'group') return;

    const sorted = [...matches].sort((a, b) => a.homeTeam.groupId - b.homeTeam.groupId);

    const grouped: Record<string, Match[]> = {};
    sorted.forEach(match => {
      const key = groupNames[match.homeTeam.groupId] || `Groupe ${match.homeTeam.groupId}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(match);
    });

    setGroupedMatches(grouped);
  }, [matches, sortBy, groupNames]);

  if (loading) return <p>Chargement des matchs...</p>;
  if (matches.length === 0) return <p>Aucun match disponible</p>;

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

      {Object.entries(groupedMatches).map(([groupLabel, dayMatches]) => (
        <div key={groupLabel} className="mb-5">
          <h4 className="fw-bold text-capitalize mb-4 border-bottom pb-2">
            {sortBy === 'date'
              ? groupLabel
              : sortBy === 'team'
                ? `${groupLabel}`
                : `Groupe ${groupLabel}`/* ?????????????????????????????????????????????????????? */} 
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