import React, { useState, useEffect } from 'react';
import TeamPreview from './TeamPreview';
import type { Team } from '../../types/Team';
import { TeamService } from '../../services/TeamService';
import { Link } from 'react-router-dom';
import { translate } from "../../utils/translate"; // import de la fonction de traduction des pays et continents

// Composant affichant les équipes
const TeamsMaster: React.FC = () => {
    // États locaux pour gérer les données des équipes, le chargement et les options de tri
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
    const [selectedContinent, setSelectedContinent] = useState<string>('Tous'); // par défaut tous les continents

    // Récupération des équipes
    useEffect(() => {
        TeamService.getTeams()
            .then(setTeams)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Tri et filtre par continent
    useEffect(() => {
        if (selectedContinent === 'Tous') {
            setFilteredTeams(teams);
        } else {
            setFilteredTeams(teams.filter(team => translate(team.continent) === selectedContinent));
        }
    }, [teams, selectedContinent]);

    // Affichage d'un message pendant le chargement des équipes
    if (loading) return <p>Chargement des équipes...</p>;
    // Affichage d'un message si aucune équipe n'est disponible
    if (teams.length === 0) return <p>Aucune équipe disponible</p>;

    // Liste des continents traduits pour le filtre, sans doublons
    const continents = Array.from(new Set(teams.map(t => t.continent)))
        .map(en => ({
            en,
            fr: translate(en)
        }));
        
    return (
        <div className="container py-5 mt-5">
            {/* Section de filtrage par continent */}
            <div className="mb-4">
                <label className="me-2 fw-bold">Filtrer par continent :</label>
                <select value={selectedContinent} onChange={e => setSelectedContinent(e.target.value)}>
                    <option value="Tous">Tous</option>
                    {continents.map(cont => (
                        <option key={cont.en} value={cont.fr}>{cont.fr}
                        </option>
                    ))}
                </select>
            </div>

            {/* Liste des équipes filtrées affichées sous forme de carte */}
            <div className="row">
                {filteredTeams.map(team => (
                    <div key={team.id} className="col-md-4 mb-3 d-flex justify-content-center">
                        {/* Lien vers la page détaillée de chaque équipe */}
                        <Link to={`/teams/${team.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <TeamPreview team={team} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamsMaster;