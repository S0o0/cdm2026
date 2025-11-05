import React, { useEffect, useState } from "react";
import type { Ticket } from "../types/Ticket";
import { TicketService } from "../services/TicketService";

const Cart: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                // On indique à TypeScript que fetchedTickets peut être un tableau de Ticket ou un objet avec tickets
                const fetchedTickets: Ticket[] | { tickets: Ticket[] } = await TicketService.getPendingTickets();

                // Vérifie si c'est un tableau, sinon essaye fetchedTickets.tickets, sinon tableau vide
                const ticketsArray = Array.isArray(fetchedTickets)
                    ? fetchedTickets
                    : Array.isArray((fetchedTickets as { tickets: Ticket[] }).tickets)
                        ? (fetchedTickets as { tickets: Ticket[] }).tickets
                        : [];

                setTickets(ticketsArray);
            } catch (error) {
                console.error("Erreur lors du chargement des tickets :", error);
                setTickets([]);
            }
        };
        fetchTickets();
    }, []);

    const handleRemove = async (ticketId: string) => {
        try {
            await TicketService.deleteTicket(ticketId);
            setTickets((prevTickets) => prevTickets.filter((t) => t.id !== ticketId));
        } catch (error) {
            console.error("Erreur lors de la suppression du ticket :", error);
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
                    quantity: 1, // AJOUT
                    totalPrice: ticket.price, // AJOUT
                };
            } else {
                acc[key].quantity += 1;
                acc[key].totalPrice += ticket.price;
            }
            return acc;
        }, {} as Record<string, Ticket & { quantity: number; totalPrice: number }>)
    );

    // Calcul du total à partir des groupes
    const calculateTotal = () =>
        groupedTickets.reduce((total, t) => total + t.totalPrice, 0);

    // Gestion de la modification de quantité
    const handleQuantityChange = (matchId: number, category: string, newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > 6) {
            alert("La quantité doit être comprise entre 1 et 6 par match.");
            return;
        }

        setTickets((prevTickets) => {
            const filtered = prevTickets.filter(
                (t) => !(t.match?.id === matchId && t.category === category)
            );

            const referenceTicket = prevTickets.find(
                (t) => t.match?.id === matchId && t.category === category
            );
            if (!referenceTicket) return prevTickets;

            const updatedGroup = Array(newQuantity).fill({ ...referenceTicket });

            return [...filtered, ...updatedGroup];
        });
    };

    return (
        <div>
            <h2>Votre Panier</h2>

            <p style={{ fontStyle: "italic", color: "#444"}}>
                Vous pouvez acheter jusqu’à <strong>6 tickets par match</strong>, toutes catégories confondues.
            </p>

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
                            .sort((a, b) => (a.match?.id || 0) - (b.match?.id || 0))
                            .map((ticket, index) => (
                                <tr key={`${ticket.match?.id}-${ticket.category}-${index}`}>
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
                                        <button onClick={() => handleRemove(ticket.id)}>Supprimer</button>
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
