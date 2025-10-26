import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Match, MatchAvailability } from '../types/Match';
import MatchService from '../services/MatchService';

const MatchDetails: React.FC = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

    // Gestion ticket availability
    const [availability, setAvailability] = useState<MatchAvailability | null>(null);

    useEffect(() => {
        if (!matchId) return;

        async function fetchData() {
            try {
                // Récupère les données du match et des catégories
                const [matchData, availabilityData] = await Promise.all([
                    MatchService.getMatch(Number(matchId)),
                    MatchService.getAvailability(Number(matchId)),
                ]);
                setMatch(matchData);
                setAvailability(availabilityData);
            } catch (err : any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
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
                    {/* --- CHANGEMENTS LIMITES AUX TICKETS --- */}
                    {availability && (
                        <div className="mt-4">
                        <h4>Catégories de places et tarifs</h4>
                        <ul>
                            {Object.entries(availability.categories).map(([catName, info]) => (
                            <li key={catName}>
                                <strong>{catName}</strong> — {info.price} € ({info.availableSeats} places restantes)
                            </li>
                            ))}
                        </ul>
                        </div>
                    )}
                    {/* --------------------------------------- */}
                    <Link to="/matches" className="btn btn-primary mt-3">Retour</Link>
                </div>
            </div>
        </div>
    );
};

export default MatchDetails;
