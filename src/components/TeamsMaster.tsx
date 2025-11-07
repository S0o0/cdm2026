import React, { useState, useEffect } from 'react';
import TeamPreview from './TeamPreview';
import type { Team } from '../types/Team';
import { TeamService } from '../services/TeamService';
import { Link } from 'react-router-dom';

const TeamsMaster: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
    const [selectedContinent, setSelectedContinent] = useState<string>('All');

    useEffect(() => {
        TeamService.getTeams()
            .then(setTeams)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (selectedContinent === 'All') {
            setFilteredTeams(teams);
        } else {
            setFilteredTeams(teams.filter(team => team.continent === selectedContinent));
        }
    }, [teams, selectedContinent]);

    const continents = Array.from(new Set(teams.map(team => team.continent)));

    if (loading) return <p>Chargement des équipes...</p>;
    if (teams.length === 0) return <p>Aucune équipe disponible</p>;

    return (
        <div className="container py-5">
            <div className="mb-4 d-flex align-items-center">
                <label htmlFor="continentFilter" className="me-2 fw-bold">Filtrer par continent :</label>
                <select
                    id="continentFilter"
                    value={selectedContinent}
                    onChange={e => setSelectedContinent(e.target.value)}
                    className="form-select w-auto"
                >
                    <option value="All">Tous</option>
                    {continents.map(continent => (
                        <option key={continent} value={continent}>
                            {continent}
                        </option>
                    ))}
                </select>
            </div>
            <div className="row justify-content-center">
                {filteredTeams.map(team => (
                    <div key={team.id} className="col-md-4 mb-3 d-flex justify-content-center">
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