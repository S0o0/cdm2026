import React, { useEffect, useState } from "react";
import type { Ticket } from "../../types/Ticket";
import { TicketService } from "../../services/TicketService";
import "../../assets/style/Cart.css";
import { translate } from "../../utils/translate"; // import de la fonction de traduction des pays et continents

// Composant du panier affichant les tickets ajoutés par l’utilisateur
const Cart: React.FC = () => {
    // Liste des tickets actuellement présents dans le panier
    const [tickets, setTickets] = useState<Ticket[]>([]);
    // Nombre total de tickets déjà confirmés ou utilisés par l’utilisateur
    const [userTotalTickets, setUserTotalTickets] = useState<number>(0);
    // Indique si les données du panier sont en cours de chargement
    const [loadingTickets, setLoadingTickets] = useState<boolean>(true);

    // Limite maximale de tickets autorisés par utilisateur
    const MAX_TICKETS = 6;

    // Chargement initial des tickets au montage du composant
    useEffect(() => {
        // Fonction interne qui récupère les tickets et met à jour le panier
        const fetchTickets = async () => {
            try {
                setLoadingTickets(true);
                // Récupération du nombre total de tickets confirmés ou utilisés
                // On récupère tous les tickets puis on compte ceux payés ou utilisés
                const allTickets = await TicketService.getAllTickets();

                const confirmedCount = allTickets.counts.confirmed;
                const usedCount = allTickets.counts.used;

                const effectiveCount = confirmedCount + usedCount;
                setUserTotalTickets(effectiveCount);

                // Séparation des tickets valides et expirés
                // On récupère les tickets en attente
                const fetched = await TicketService.getPendingTickets();
                const now = new Date();
                const validTickets: Ticket[] = [];
                const expiredTickets: Ticket[] = [];


                // On ne garde que les tickets qui n'ont pas expirés
                for (const ticket of fetched.tickets) {
                    if (!ticket.expiresAt || new Date(ticket.expiresAt) > now) {
                        validTickets.push(ticket);
                    } else {
                        expiredTickets.push(ticket);
                    }
                }
                // Suppression automatique des tickets expirés côté API
                for (const ticket of expiredTickets) {
                    try {
                        await TicketService.deleteTicket(ticket.id);
                        console.info('Ticket expiré supprimé du panier :', ticket.id);
                    } catch (error) {
                        console.warn('Erreur lors de la suppression du ticket expiré :', ticket.id, error);
                    }
                }

                // Mise à jour du panier avec uniquement les tickets valides
                // Le panier ne contient que les tickets valides
                setTickets(fetched.tickets);

            } catch (error) {
                console.error("Erreur lors du chargement des tickets :", error);
                setTickets([]);
                setUserTotalTickets(0);
            }
            finally {
                setLoadingTickets(false);
            }
        };
        fetchTickets();
    }, []);

    // Suppression de tous les tickets correspondant à un match et une catégorie
    const handleRemove = async (matchId: number, category: string) => {
        try {
            // Sélection des tickets ciblés pour la suppression
            // Trouver tous les tickets concernés
            const toDelete = tickets.filter(
                (t) => t.matchId === matchId && t.category === category
            );

            // Les supprimer un par un via l’API
            for (const ticket of toDelete) {
                try {
                    await TicketService.deleteTicket(ticket.id);
                } catch (error) {
                    console.warn(`Erreur lors de la suppression du ticket ${ticket.id}`, error);
                }
            }

            // Mise à jour locale du panier après suppression
            // Mettre à jour le state local
            setTickets((prev) =>
                prev.filter(
                    (t) => !(t.matchId === matchId && t.category === category)
                )
            );

            console.info(
                `${toDelete.length} ticket(s) supprimé(s) pour le match ${matchId} (${category})`
            );
        } catch (error) {
            console.error("Erreur lors de la suppression des tickets :", error);
        }
    };

    // Fonction de paiement des tickets en attente
    const handleCheckout = async () => {
        try {
            // Envoi du paiement des tickets au serveur
            await TicketService.payPendingTickets();
            setTickets([]);
            // Mise à jour du nombre total de tickets confirmés après paiement
            // Après paiement, on met à jour le nombre total de tickets confirmés
            try {
                const allTickets = await TicketService.getAllTickets();
                const confirmedCount = allTickets.counts.confirmed;
                const usedCount = allTickets.counts.used;
                const effectiveCount = confirmedCount + usedCount;
                setUserTotalTickets(effectiveCount);
            } catch (error) {
                // En cas d'erreur, on ne fait rien mais on peut afficher un message si besoin
                console.warn("Erreur lors de la mise à jour du nombre total de tickets :", error);
            }
            alert("Paiement effectué avec succès !");
        } catch (error) {
            console.error("Erreur lors du paiement :", error);
            alert("Le paiement a échoué. Veuillez réessayer.");
        }
    };

    // Regroupement des tickets par match et catégorie pour un affichage simplifié
    // Regrouper les tickets ayant même match.id + catégorie
    const groupedTickets = Object.values(
        tickets.reduce((acc, ticket) => {
            const key = `${ticket.match?.id || "unknown"}-${ticket.category}`;
            if (!acc[key]) {
                acc[key] = {
                    ...ticket,
                    quantity: 1,
                    totalPrice: ticket.price,
                };
            } else {
                acc[key].quantity += 1;
                acc[key].totalPrice += ticket.price;
            }
            return acc;
        }, {} as Record<string, Ticket & { quantity: number; totalPrice: number }>)
    );

    // Calcul du nombre de tickets restants que l’utilisateur peut encore acheter
    // Calcule le nombre maximum restant à acheter
    const remainingTickets = Math.max(
        0,
        MAX_TICKETS - userTotalTickets - tickets.length
    );

    // Calcule le prix total du panier
    const calculateTotal = () =>
        groupedTickets.reduce((total, t) => total + t.totalPrice, 0);

    // Gestion du changement de quantité pour un groupe de tickets donné
    const handleQuantityChange = async (matchId: number, category: string, newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > 6) {
            alert("La quantité doit être comprise entre 1 et 6 par match.");
            return;
        }

        const group = groupedTickets.find(
            (g) => g.match?.id === matchId && g.category === category
        );
        if (!group) return;

        const currentQuantity = group.quantity;
        const diff = newQuantity - currentQuantity;

        if (diff === 0) return; // rien à faire

        // Vérification que la limite globale de 6 tickets n’est pas dépassée
        // Vérification limite globale (confirmés + panier + ajout)
        if (userTotalTickets + tickets.length + diff > MAX_TICKETS) {
            alert("Vous ne pouvez pas dépasser la limite totale de 6 tickets.");
            return;
        }

        try {
            // Cas où l’utilisateur augmente la quantité de tickets
            if (diff > 0) {
                // ➕ AJOUT : on ajoute diff tickets à l’utilisateur
                const added = await TicketService.addTicket(matchId, category, diff);

                // Réinjection d’un ticket de référence pour conserver les informations du match
                // NEW : on récupère un ticket de référence pour réinjecter le champ `match`
                const refTicket = tickets.find(
                    (t) => t.matchId === matchId && t.category === category && t.match
                );

                const completedAdded = added.map((t) => ({
                    ...t,
                    match: refTicket?.match || t.match || undefined,
                }));

                setTickets((prev) => [...prev, ...completedAdded]);

                console.info(`+${diff} ticket(s) ajouté(s) pour match ${matchId} (${category})`);
            }
            // Cas où l’utilisateur réduit la quantité de tickets
            else {
                // ➖ SUPPRESSION : on retire |diff| tickets existants du panier
                const toRemove = tickets.filter(
                    (t) => t.matchId === matchId && t.category === category
                ).slice(0, Math.abs(diff));

                for (const ticket of toRemove) {
                    try {
                        await TicketService.deleteTicket(ticket.id);
                    } catch (err) {
                        console.warn("Erreur suppression ticket :", ticket.id, err);
                    }
                }

                setTickets((prev) =>
                    prev.filter(
                        (t) =>
                            !(t.matchId === matchId && t.category === category && toRemove.some((r) => r.id === t.id))
                    )
                );
                console.info(`${Math.abs(diff)} ticket(s) supprimé(s) pour match ${matchId} (${category})`);
            }
        } catch (error: any) {
            // Je sais pas encore si on garde le message d'erreur dans la console
            console.error("Erreur lors de la mise à jour de la quantité :", error);

            // On affiche le message de l'API
            const apiMessage =
                (error instanceof Error && error.message) ||
                error?.message ||
                "Une erreur est survenue lors de la mise à jour de la quantité.";

            alert(apiMessage);
        }
    };


    // Affichage de l’interface du panier avec statistiques, tableau et actions
    return (
        <div className="cart-container">
            <h2 className="cart-title">Votre Panier</h2>
            <p className="cart-info">
                Les tickets ajoutés à votre panier expirent <strong>15 minutes</strong> après leur ajout.
                Passé ce délai, ils seront automatiquement supprimés.
            </p>
            {/* Affichage du message de chargement ou des statistiques utilisateur */}
            {loadingTickets ? (
                <p>Chargement du panier...</p>
            ) : (
                <>
                    {/* Si l'utilisateur a atteint la limite de tickets par utilisateur on le lui indique */}
                    {userTotalTickets >= MAX_TICKETS ? (
                        <p className="cart-limit-warning">
                            Vous avez atteint la limite de 6 tickets par utilisateur, vous ne pouvez plus en acheter.
                        </p>
                    ) : (
                        <div className="ticket-stats-container">
                            <div className="ticket-stat-box">
                                <div className="ticket-stat-number">{remainingTickets}</div>
                                <div className="ticket-stat-label">Tickets restants</div>
                            </div>

                            <div className="ticket-stat-box">
                                <div className="ticket-stat-number">{userTotalTickets}</div>
                                <div className="ticket-stat-label">Tickets confirmés</div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Affichage spécifique lorsque le panier est vide */}
            {tickets.length === 0 ? (
                <>
                    <p className="text-center mt-3">Le panier est vide.</p>

                    <div className="cart-bottom">
                        <div className="fw-bold fs-5">
                            Total : 0 €
                        </div>
                        <button className="btn btn-success" onClick={handleCheckout} disabled>
                            Payer
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <table className="table table-striped table-bordered cart-table">
                        <thead>
                            <tr>
                                <th>Match</th>
                                <th>Catégorie</th>
                                <th>Quantité</th>
                                <th>Prix</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Génération des lignes du tableau pour chaque groupe de tickets */}
                            {groupedTickets
                                .sort((a, b) => {
                                    const matchDiff = (a.match?.id || 0) - (b.match?.id || 0);
                                    if (matchDiff !== 0) return matchDiff;
                                    return a.category.localeCompare(b.category);
                                })
                                .map((ticket) => (
                                    <tr key={`${ticket.match?.id}-${ticket.category}`}>
                                        <td>
                                            {ticket.match
                                                ? `${translate(ticket.match.homeTeam)} vs ${translate(ticket.match.awayTeam)} - ${ticket.match.stadium}`
                                                : "Match non disponible"}
                                        </td>
                                        {/* affichage centré de la catégorie */}
                                        <td style={{ width: "60px", textAlign: "center" }}>{ticket.category}</td>

                                        <td>
                                            <input
                                                type="number"
                                                min={1}
                                                max={6}
                                                value={ticket.quantity}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const parsed = parseInt(value);

                                                    // On ne met à jour que si c’est un nombre valide
                                                    if (!isNaN(parsed)) {
                                                        handleQuantityChange(
                                                            ticket.match?.id!,
                                                            ticket.category,
                                                            parsed
                                                        );
                                                    }
                                                }}
                                            />
                                        </td>


                                        <td>{(ticket.price * ticket.quantity).toFixed(2)} €</td>
                                        <td >
                                            <button onClick={() => handleRemove(ticket.matchId, ticket.category)}>Retirer</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    <div className="cart-bottom">
                        <div className="fw-bold fs-5">
                            Total : {calculateTotal().toFixed(2)} €
                        </div>
                        <button className="btn btn-success" onClick={handleCheckout}>
                            Payer
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;