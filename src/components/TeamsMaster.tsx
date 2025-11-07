import React, { useState, useEffect } from 'react';
import TeamPreview from './TeamPreview';
import type { Team } from '../types/Team';
import { TeamService } from '../services/TeamService';
import { Link } from 'react-router-dom';

type SortOption = 'continent';

const TeamsMaster: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
    const [selectedContinent, setSelectedContinent] = useState<string>('Tous');

    useEffect(() => {
        TeamService.getTeams()
            .then(setTeams)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (selectedContinent === 'Tous') {
            setFilteredTeams(teams);
        } else {
            setFilteredTeams(teams.filter(team => team.continent === selectedContinent));
        }
    }, [teams, selectedContinent]);

    if (loading) return <p>Chargement des équipes...</p>;
    if (teams.length === 0) return <p>Aucune équipe disponible</p>;

    const continents = Array.from(new Set(teams.map(t => t.continent)));

    return (
        <div className="container py-5">
            <div className="mb-4">
                <label className="me-2 fw-bold">Filtrer par continent :</label>
                <select value={selectedContinent} onChange={e => setSelectedContinent(e.target.value)}>
                    <option value="Tous">Tous</option>
                    {continents.map(continent => (
                        <option key={continent} value={continent}>{continent}</option>
                    ))}
                </select>
            </div>

            <div className="row">
                {filteredTeams.map(team => (
                    <div key={team.id} className="col-md-4 mb-3 d-flex justify-content-center">
                        <Link to={`/teams/${team.id}`} style={{ textDecoration: 'none', color: 'inherit'}}>
                            <TeamPreview team={team} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamsMaster;