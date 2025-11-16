import React, { useEffect, useState, type JSX } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TicketService } from "../../services/TicketService";
import type { Match, MatchAvailability, MatchStage } from '../../types/Match';
import { MatchService } from '../../services/MatchService';
import { translate } from '../../utils/translate'; // import de la fonction de traduction des pays et continents

const API_URL = import.meta.env.VITE_API_URL;

// Traduction des phases de la compétition
const getStage = (stage: MatchStage): JSX.Element => {
    let label = "";
    switch (stage) {
        case "group":
            label = "Phase de groupe";
            break;
        case "round_of_16":
            label = "Huitièmes de finale";
            break;
        case "quarter_final":
            label = "Quarts de finale";
            break;
        case "semi_final":
            label = "Demi-finale";
            break;
        case "final":
            label = "Finale";
            break;
        default:
            label = "Match";
    }
    return <span className="opacity-50">{label}</span>;
};

// Composant affichant les détails d'un match
const MatchDetails: React.FC = () => {
    // Récupère l'identifiant du match depuis l'URL
    const { matchId } = useParams<{ matchId: string }>();

    // États locaux pour stocker les informations du match, l'état de chargement et les erreurs
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // États locaux pour gérer la réservation : disponibilité, catégorie, quantité, état d'ajout et utilisateur courant
    const [availability, setAvailability] = useState<MatchAvailability | null>(null);
    const [category, setCategory] = useState<string>(""); // Catégorie sélectionnée
    const [quantity, setQuantity] = useState<number>(1); // Quantité sélectionnée
    const [adding, setAdding] = useState<boolean>(false); // Etat du bouton
    const [currentUser, setCurrentUser] = useState(() => {
        const user = localStorage.getItem("currentUser");
        return user ? JSON.parse(user) : null;
    });

    // Récupère les données du match et les disponibilités
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
                const firstCategory = Object.keys(availabilityData.categories)[0];
                if (firstCategory) setCategory(firstCategory);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [matchId]);

    // Fonction pour ajouter des tickets au panier
    const handleAddToCart = async () => {
        if (!match) return;

        // Vérifie si l'utilisateur est connecté
        if (!currentUser) {
            alert("Vous devez être connecté pour ajouter des tickets au panier.");
            return;
        }
        // Cas où la commande n'est pas conforme aux quantités de l'API
        if (quantity < 1 || quantity > 6) {
            alert("La quantité doit être comprise entre 1 et 6.");
            return;
        }

        try {
            setAdding(true);
            await TicketService.addTicket(Number(match.id), category, quantity);
            alert("Tickets ajoutés au panier !");
        } catch (err: any) {
            if (err.message?.includes("400")) {
                alert("Quantité de tickets demandée non disponible.");
            }
        } finally {
            setAdding(false);
        }
    };
    // Affichage pendant le chargement des données du match
    if (loading) return <p>Chargement...</p>;
    // Message affiché si le match n'a pas été trouvé
    if (!match) return <p>Match introuvable</p>;

    const matchDate = new Date(match.date);
    // Date formatée ainsi : JJ/MM
    const formattedDate = `${String(matchDate.getDate()).padStart(2, '0')}/${String(matchDate.getMonth() + 1).padStart(2, '0')}`;

    // Heure formatée ainsi HH:MM
    const formattedTime = matchDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    // Structure principale de la page avec les informations du match et réservation
    return (
        <div className="vw-100 p-4">
            <div className="d-flex justify-content-center align-items-start flex-wrap gap-5">

                {/* Colonne gauche : informations sur le match et équipes */}
                <div className="flex-grow-1 p-4 bg-white shadow rounded-0" style={{ maxWidth: '380px' }}>
                    <h4 className="text-center mb-4">{getStage(match.stage)}</h4>

                    {/* Drapeaux */}
                    <div className="d-flex justify-content-center align-items-center mb-3">
                        {/* Équipe domicile */}
                        <div className="text-center mx-2">
                            <img
                                src={`${API_URL}${match.homeTeam.flagImagePath}`}
                                alt={translate(match.homeTeam.name)}
                                style={{ width: '120px', height: '80px', objectFit: 'cover' }}
                            />
                            <div className="mt-2 fw-semibold">{translate(match.homeTeam.code, "code")}</div>
                        </div>

                        <div className="mx-3 fw-bold fs-4">-</div>

                        {/* Équipe extérieure */}
                        <div className="text-center mx-2">
                            <img
                                src={`${API_URL}${match.awayTeam.flagImagePath}`}
                                alt={translate(match.awayTeam.name)}
                                style={{ width: '120px', height: '80px', objectFit: 'cover' }}
                            />
                            <div className="mt-2 fw-semibold">{translate(match.awayTeam.code, "code")}</div>
                        </div>
                    </div>

                    {/* Infos secondaires */}
                    <div className="mt-4">
                        <div><strong>Stade :</strong> {match.stadium.name}</div>
                        <div><strong>Ville :</strong> {match.stadium.city}</div>
                        <div><strong>Date :</strong> {formattedDate}</div>
                        <div><strong>Heure :</strong> {formattedTime}</div>
                        <div><strong>Statut :</strong> {match.status}</div>
                    </div>
                </div>

                {/* Colonne droite : sélection de catégorie, quantité et ajout au panier */}
                <div className="flex-grow-1 p-4 bg-white shadow rounded-0" style={{ maxWidth: '380px' }}>
                    <h4 className="text-center fw-bold mb-4">RÉSERVATION</h4>
                    {availability ? (
                        <>
                            <div className="mb-3">
                                <strong>Places disponibles :</strong> {match.availableSeats}
                            </div>
                            <div className="mb-3">
                                <strong>Multiplicateur :</strong> {match.priceMultiplier}
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Catégorie :</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="form-select rounded-0"
                                >
                                    {(Object.entries(availability.categories) as [string, any][]).map(([catName, info]) => (
                                        <option key={catName} value={catName}>
                                            {catName.replace("_", " ")} — {info.price} €
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Quantité :</label>
                                <select
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="form-select rounded-0"
                                >
                                    {[1, 2, 3, 4, 5, 6].map((n) => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={adding}
                                className="btn btn-success w-100 mt-2 rounded-0 shadow-sm border-0"
                            >
                                {adding ? "Ajout..." : "Ajouter au panier"}
                            </button>
                        </>
                    ) : (
                        <p>Aucune donnée sur les disponibilités.</p>
                    )}
                </div>
            </div>

            {/* Bouton pour retourner à la liste des matchs */}
            <div className="text-center mt-4">
                <Link to="/matches" className="btn btn-dark px-4 py-2 rounded-0 shadow-sm border-0">Retour</Link>
            </div>
        </div>
    );
};


export default MatchDetails;
