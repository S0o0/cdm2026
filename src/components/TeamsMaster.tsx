import React, { useState, useEffect } from 'react';
import TeamPreview from './TeamPreview';
import type { Team } from '../types/Team';
import { TeamService } from '../services/TeamService';
import { Link } from 'react-router-dom';

const TeamsMaster: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        TeamService.getTeams()
            .then(setTeams)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Chargement des équipes...</p>;
    if (teams.length === 0) return <p>Aucune équipe disponible</p>;

    return (
        <div className="row">
            <h1 className="text-center fw-bold pt-3">Équipes</h1>
            {teams.map(team => (
                <div key={team.id} className="col-md-4 mb-3 justify-content-center d-flex">
                    <Link
                        to={`/teams/${team.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <TeamPreview team={team} />
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default TeamsMaster;