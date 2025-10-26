import type { Ticket } from "../types/Ticket";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default class TicketService {
    // Ajouter un ticket au panier
    static async addTicket(matchId: number, category: string, quantity: number): Promise<Ticket[]> {
        const res = await fetch(`${API_BASE_URL}/tickets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ matchId, category, quantity }),
        });
        if (!res.ok) throw new Error("Erreur lors de l'ajout au panier");
            const json = await res.json();
            return json.data.tickets;
    }

    // Voir le contenu du panier (les tickets en attente de paiement)
    static async getPendingTickets(): Promise<Ticket[]> {
        const res = await fetch(`${API_BASE_URL}/tickets/pending`);
        if (!res.ok) throw new Error("Erreur lors de la récupération du panier");
        const json = await res.json();
        return json.data.tickets;
    }

    // Supprimer un ticket du panier
    static async deleteTicket(ticketId: string): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Erreur lors de la suppression du ticket");
    }

    // Payer tous les tickets du panier
    static async payPendingTickets(paymentMethodId: string): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/tickets/pay-pending`, {
            method: "POST"});
        if (!res.ok) throw new Error("Erreur lors du paiement des tickets");
        const json = await res.json();
        return json.data.tickets;
    }
}