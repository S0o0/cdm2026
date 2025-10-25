import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Match } from '../types/Match';

const MatchDetails: React.FC = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!matchId) return;

        fetch(`https://worldcup2026.shrp.dev/matches/${matchId}`)
            .then(res => res.json())
            .then(json => setMatch(json.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [matchId]);

    if (loading) return <p>Chargement...</p>;
    if (!match) return <p>Match introuvable</p>;

    const matchDate = new Date(match.date);
    // Format date as DD/MM
    const formattedDate = `${String(matchDate.getDate()).padStart(2, '0')}/${String(matchDate.getMonth() + 1).padStart(2, '0')}`;

    // Format time as HH:MM
    const formattedTime = matchDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="container py-5">
            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <h3 className="mb-3">
                        {match.homeTeam.name} ({match.homeTeam.code}) vs {match.awayTeam.name} ({match.awayTeam.code})
                    </h3>
                    <p><strong>Stade:</strong> {match.stadium.name}</p>
                    <p><strong>Ville:</strong> {match.stadium.city}</p>
                    <p><strong>Heure:</strong> {formattedTime}</p>
                    <p><strong>Date:</strong> {formattedDate}</p>
                    <p><strong>Phase:</strong> {match.stage}</p>
                    <p><strong>Statut:</strong> {match.status}</p>
                    <p><strong>Places disponibles:</strong> {match.availableSeats}</p>
                    <p><strong>Multiplicateur de prix:</strong> {match.priceMultiplier}</p>
                    <Link to="/matches" className="btn btn-primary mt-3">Retour</Link>
                </div>
            </div>
        </div>
    );
};

export default MatchDetails;
