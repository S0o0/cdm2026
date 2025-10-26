import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TicketService } from "../services/TicketService";
import type { Match, MatchAvailability } from '../types/Match';
import { MatchService } from '../services/MatchService';

const API_URL = import.meta.env.VITE_API_URL;

const MatchDetails: React.FC = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Gestion ticket availability
    const [availability, setAvailability] = useState<MatchAvailability | null>(null);
    const [category, setCategory] = useState<string>("Catégorie 1"); // Catégorie sélectionnée
    const [quantity, setQuantity] = useState<number>(1); // Quantité sélectionnée
    const [message, setMessage] = useState<string>(""); // Message 
    const [adding, setAdding] = useState<boolean>(false); // Etat du bouton

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
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [matchId]);

    // fonction d'ajout au panier
    const handleAddToCart = async () => {
        if (!match) return;
        if (quantity < 1 || quantity > 6) {
            setMessage("La quantité doit être comprise entre 1 et 6.");
            return;
        }
        try {
            setAdding(true);
            await TicketService.addTicket(Number(match.id), category, quantity);
            setMessage("Tickets ajoutés au panier !");
        } catch (err: any) {
            setMessage(err.message || "Erreur lors de l'ajout au panier.");
        } finally {
            setAdding(false);
        }
    };
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
        <div className="d-flex justify-content-center py-5">
            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-center mb-3">
                        {/* Équipe à domicile */}
                        <div className="text-center mx-3">
                            <img
                                src={`${API_URL}${match.homeTeam.flagImagePath}`}
                                alt={match.homeTeam.name}
                                style={{ width: '40px', height: 'auto' }}
                            />
                            <div>{match.homeTeam.code}</div>
                        </div>

                        <div className="mx-2" style={{ fontSize: '1.5rem' }}>VS</div>

                        {/* Équipe visiteuse */}
                        <div className="text-center mx-3">
                            <img
                                src={`${API_URL}${match.awayTeam.flagImagePath}`}
                                alt={match.awayTeam.name}
                                style={{ width: '40px', height: 'auto' }}
                            />
                            <div>{match.awayTeam.code}</div>
                        </div>
                    </div>
                    <p><strong>Stade:</strong> {match.stadium.name}</p>
                    <p><strong>Ville:</strong> {match.stadium.city}</p>
                    <p><strong>Heure:</strong> {formattedTime}</p>
                    <p><strong>Date:</strong> {formattedDate}</p>
                    <p><strong>Phase:</strong> {match.stage}</p>
                    <p><strong>Statut:</strong> {match.status}</p>
                    <p><strong>Places disponibles:</strong> {match.availableSeats}</p>
                    <p><strong>Multiplicateur de prix:</strong> {match.priceMultiplier}</p>

                    {/* --- Sélection de catégorie et quantité --- */}
                    {availability && (
                        <div className="mt-4">
                            <h4>Catégories et tarifs</h4>
                            <ul>
                                {Object.entries(availability.categories).map(([catName, info]) => (
                                    <li key={catName}>
                                        <strong>{catName}</strong> — {info.price} € ({info.availableSeats} places restantes)
                                    </li>
                                ))}
                            </ul>

                            {/* sélecteurs et bouton */}
                            <div className="mt-3">
                                <label>Catégorie :</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)} // ligne ajoutée
                                    className="form-select w-auto d-inline ms-2"
                                >
                                    {Object.keys(availability.categories).map((catName) => (
                                        <option key={catName} value={catName}>{catName}</option>
                                    ))}
                                </select>

                                <label className="ms-3">Quantité :</label>
                                <select
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))} // ligne ajoutée
                                    className="form-select w-auto d-inline ms-2"
                                >
                                    {[1, 2, 3, 4, 5, 6].map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleAddToCart} // ligne ajoutée
                                    className="btn btn-success ms-3"
                                    disabled={adding}
                                >
                                    {adding ? "Ajout..." : "Ajouter au panier"}
                                </button>

                                {message && <p className="mt-3">{message}</p>} {/* ligne ajoutée */}
                            </div>
                        </div>
                    )}

                    <Link to="/matches" className="btn btn-primary mt-4">Retour</Link>
                </div>
            </div>
        </div>
    );
};


export default MatchDetails;
