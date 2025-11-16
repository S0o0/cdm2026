import React, { useState, useEffect } from 'react';
import MatchPreview from './MatchPreview';
import type { Match } from '../../types/Match';
import { MatchService } from "../../services/MatchService";
import { Link } from 'react-router-dom';
import { GroupService } from "../../services/GroupService";
import type { Group } from "../../types/Group";
import { translate } from "../../utils/translate"; // import de la fonction de traduction des pays et continents

// Options de tri
type SortOption = 'date' | 'team' | 'group';
type SortOptionGroupe = string;
type SortOptionEquipe = string;

// Composant affichant les matches
const MatchesMaster: React.FC = () => {
  // États locaux pour gérer les données des matchs, le chargement et les options de tri
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [groupedMatches, setGroupedMatches] = useState<Record<string, Match[]>>({});
  const [groupNames, setGroupNames] = useState<Record<number, string>>({});
  const [selectedGroup, setSelectedGroup] = useState<SortOptionGroupe | ''>('');
  const [selectedTeam, setSelectedTeam] = useState<SortOptionEquipe | ''>('');

  // Récupération des groupes pour associer les noms aux IDs des groupes
  useEffect(() => {
    GroupService.getGroups()
      .then((groups: Group[]) => {
        const mapping: Record<number, string> = {};
        groups.forEach(g => (mapping[g.id] = g.name));
        setGroupNames(mapping);
      })
      .catch(err => console.error("Erreur chargement groupes :", err));
  }, []);

  // Chargement des matchs depuis le service
  useEffect(() => {
    MatchService.getMatches()
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Tri et regroupement des matchs par date si l'option 'date' est sélectionnée
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

  // Filtrage et regroupement des matchs par équipe si l'option 'team' est sélectionnée
  useEffect(() => {
    if (!matches.length || sortBy !== 'team') return;

    if (selectedTeam) {
      // Filtrer les matchs pour l'équipe sélectionnée
      const filtered = matches.filter(
        m =>
          translate(m.homeTeam.name) === selectedTeam || translate(m.awayTeam.name) === selectedTeam
      );
      const grouped: Record<string, Match[]> = {
        [selectedTeam]: filtered
      };
      setGroupedMatches(grouped);
    } else {
      // Regrouper les matchs par équipes (domicile et extérieur)
      const sorted = [...matches].sort((a, b) =>
        a.homeTeam.name.localeCompare(b.homeTeam.name)
      );

      const grouped: Record<string, Match[]> = {};
      sorted.forEach(match => {
        const home = translate(match.homeTeam.name);
        const away = translate(match.awayTeam.name);

        if (!grouped[home]) grouped[home] = [];
        grouped[home].push(match);

        if (!grouped[away]) grouped[away] = [];
        grouped[away].push(match);
      });

      setGroupedMatches(grouped);
    }
  }, [matches, sortBy, selectedTeam]);

  // Filtrage et regroupement des matchs par groupe si l'option 'group' est sélectionnée
  useEffect(() => {
    if (!matches.length || sortBy !== 'group') return;

    const filtered = selectedGroup
      ? matches.filter(m => groupNames[m.homeTeam.groupId] === selectedGroup)
      : matches;

    const sorted = [...filtered].sort((a, b) => a.homeTeam.groupId - b.homeTeam.groupId);

    const grouped: Record<string, Match[]> = {};
    sorted.forEach(match => {
      const key = groupNames[match.homeTeam.groupId] || `Groupe ${match.homeTeam.groupId}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(match);
    });

    setGroupedMatches(grouped);
  }, [matches, sortBy, groupNames, selectedGroup]);

  // Construction de la liste unique des équipes traduites pour le filtre par équipe
  const allTeams = Array.from(new Set(matches.flatMap(m => [m.homeTeam.name, m.awayTeam.name]))).map
    (en => ({
      en,
      fr: translate(en)
    }))
    .sort((a, b) => a.fr.localeCompare(b.fr));

  // Affichage conditionnel lors du chargement ou si aucun match n'est disponible
  if (loading) return <p>Chargement des matchs...</p>;
  if (matches.length === 0) return <p>Aucun match disponible</p>;

  return (
    <div className="container mt-5">
      {/* Section de sélection du tri et filtres associés */}
      <div className="mb-4">
        <label className="me-2 fw-bold">Trier par :</label>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value as SortOption); setSelectedGroup(''); setSelectedTeam(''); }}>
          <option value="date">Date</option>
          <option value="team">Équipe</option>
          <option value="group">Groupe</option>
        </select>
        {/* Sélecteur de groupe affiché uniquement si tri par groupe */}
        {sortBy === 'group' && (
          <select
            className="ms-3"
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value as SortOptionGroupe)}
          >
            <option value="">Tous les groupes</option>
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].map(g => (
              <option key={g} value={g}>Groupe {g}</option>
            ))}
          </select>
        )}
        {/* Sélecteur d'équipe affiché uniquement si tri par équipe */}
        {sortBy === 'team' && (
          <select
            className="ms-3"
            value={selectedTeam}
            onChange={e => setSelectedTeam(e.target.value as SortOptionEquipe)}
          >
            <option value="">Toutes les équipes</option>
            {allTeams.map(team => (
              <option key={team.en} value={team.fr}>{team.fr}</option>
            ))}
          </select>
        )}
      </div>

      {/* Affichage des groupes de matchs selon le tri sélectionné */}
      {Object.entries(groupedMatches).map(([groupLabel, dayMatches]) => (
        <div key={groupLabel} className="mb-5">
          <h4 className="fw-bold text-capitalize mb-4 border-bottom pb-2">
            {sortBy === 'date'
              ? groupLabel
              : sortBy === 'team'
                ? `${groupLabel}`
                : `Groupe ${groupLabel}`}
          </h4>

          {/* Liste des cartes de matchs pour le groupe ou la date */}
          <div className="row g-4">
            {dayMatches.map(match => (
              <div key={match.id} className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 h-100 hover-shadow transition-all rounded-0">
                  <div className="card-body text-center p-4">
                    <Link to={`/matches/${match.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <MatchPreview
                        match={match}
                        showDate={true}
                        groupNames={sortBy === 'group' ? undefined : groupNames}
                      />
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