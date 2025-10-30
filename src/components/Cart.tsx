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

    const calculateTotal = () =>
        tickets.reduce((total, ticket) => total + ticket.price, 0);

    return (
        <div>
            <h2>Votre Panier</h2>
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
                        {tickets.map((ticket) => (
                            <tr key={ticket.id}>
                                <td>
                                    {ticket.match
                                        ? `${ticket.match.homeTeam} vs ${ticket.match.awayTeam} - ${ticket.match.stadium}`
                                        : "Match non disponible"}
                                </td>
                                <td>{ticket.category}</td>
                                <td>1</td>
                                <td>{ticket.price.toFixed(2)} €</td>
                                <td>{ticket.price.toFixed(2)} €</td>
                                <td>
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