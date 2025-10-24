import React from 'react';
import type { Match } from '../types/Match';

interface MatchPreviewProps {
    match: Match;
}

// Composant pour afficher un match
const MatchPreview: React.FC<MatchPreviewProps> = ({ match }) => {
    return (
        <li className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={`https://worldcup2026.shrp.dev${match.homeTeam.flagImagePath}`}
                        alt={match.homeTeam.name}
                        style={{ width: '10px', height: 'auto' }}
                    />
                    <span>{match.homeTeam.name}</span>
                    <span className="fw-bold mx-2">vs</span>
                    <img
                          src={`https://worldcup2026.shrp.dev${match.awayTeam.flagImagePath}`}
                        alt={match.awayTeam.name}
                        style={{ width: '30px', height: 'auto' }}
                    />
                    <span>{match.awayTeam.name}</span>
                </div>
                <div className="text-end">
                    <div>
                        {new Date(match.date).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </div>
                    <div className="text-muted">{match.stadium.name} - {match.stadium.city}</div>
                </div>
            </div>
        </li>
    );
};

export default MatchPreview;