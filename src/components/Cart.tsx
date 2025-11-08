import React, { useEffect, useState } from "react";
import type { Ticket } from "../types/Ticket";
import { TicketService } from "../services/TicketService";

const Cart: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [userTotalTickets, setUserTotalTickets] = useState<number>(0);
    const [loadingTickets, setLoadingTickets] = useState<boolean>(true);
    const MAX_TICKETS = 6;

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoadingTickets(true);
                // On récupère tous les tickets puis on compte ceux payés ou utilisés
                const allTicketsResp: any = await TicketService.getAllTickets();
                const confirmedCount = allTicketsResp?.counts?.confirmed || 0;
                const usedCount = allTicketsResp?.counts?.used || 0;
                const effectiveCount = confirmedCount + usedCount;
                setUserTotalTickets(effectiveCount);

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

                // Les tickets expirés sont supprimés du panier
                for (const ticket of expiredTickets) {
                    try {
                        await TicketService.deleteTicket(ticket.id);
                        console.info('Ticket expiré supprimé du panier :', ticket.id);
                    } catch (error) {
                        console.warn('Erreur lors de la suppression du ticket expiré :', ticket.id, error);
                    }
                }

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
    
    // Tous les tickets qui ont pour match et catégorie ceux passés en paramètre sont supprimés
    const handleRemove = async (matchId: number, category: string) => {
        try {
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

    const handleCheckout = async () => {
        try {
            await TicketService.payPendingTickets();
            setTickets([]);
            alert("Paiement effectué avec succès !");
        } catch (error) {
            console.error("Erreur lors du paiement :", error);
            alert("Le paiement a échoué. Veuillez réessayer.");
        }
    };

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

    // Calcule le nombre maximum restant à acheter
    const remainingTickets = Math.max(0, MAX_TICKETS - (userTotalTickets || 0));

    const calculateTotal = () =>
        groupedTickets.reduce((total, t) => total + t.totalPrice, 0);

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

    try {
        if (diff > 0) {
            // ➕ AJOUT : on ajoute diff tickets à l’utilisateur
            const added = await TicketService.addTicket(matchId, category, diff);

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
        } else {
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


    return (
        <div>
            <h2>Votre Panier</h2>
                <p style={{ color: "#555", fontStyle: "italic" }}>
                Les tickets ajoutés à votre panier expirent <strong>15 minutes</strong> après leur ajout.
                Passé ce délai, ils seront automatiquement supprimés.
            </p>
            {loadingTickets ? (
                <p>Chargement du panier...</p>
            ) : (
                <>
                    {/* Si l'utilisateur a atteint la limite de tickets par utilisateur on le lui indique */}
                    {userTotalTickets >= MAX_TICKETS ? (
                        <p style={{ color: "red", fontWeight: "bold" }}>
                            Vous avez atteint la limite de 6 tickets par utilisateur, vous ne pouvez plus en acheter.
                        </p>
                    ) : (
                        <p style={{ fontStyle: "italic", color: "#444" }}>
                            Vous pouvez acheter jusqu’à <strong>{MAX_TICKETS}</strong> tickets au total.<br />
                            Vous avez déjà <strong>{userTotalTickets}</strong> ticket(s) confirmés ou utilisés,<br />
                            il vous reste donc <strong>{remainingTickets}</strong> ticket(s) possible(s).
                        </p>
                    )}
                </>
            )}

            {tickets.length === 0 ? (
                <p>Le panier est vide.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Match</th>
                            <th>Catégorie</th>
                            <th>Quantité</th>
                            <th>Prix unitaire</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
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
                                            ? `${ticket.match.homeTeam} vs ${ticket.match.awayTeam} - ${ticket.match.stadium}`
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
                                            style={{ width: "60px", textAlign: "center" }}
                                        />
                                    </td>

                                    <td>{ticket.price.toFixed(2)} €</td>
                                    <td>{(ticket.price * ticket.quantity).toFixed(2)} €</td>
                                    <td >
                                        <button onClick={() => handleRemove(ticket.matchId, ticket.category)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        <tr>
                            <td colSpan={4} style={{ textAlign: "right", fontWeight: "bold" }}>
                                Total
                            </td>
                            <td colSpan={2} style={{ fontWeight: "bold" }}>
                                {calculateTotal().toFixed(2)} €
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
            {tickets.length > 0 && (
                <button onClick={handleCheckout}>Payer</button>
            )}
        </div>
    );
};

export default Cart;
