import type { Ticket } from "../types/Ticket";
import { apiFetch } from "./Api";

export class TicketService {
  // Ajouter un ticket au panier
  static async addTicket(matchId: number, category: string, quantity: number): Promise<Ticket[]> {
    return apiFetch<Ticket[]>("/tickets", {
      method: "POST",
      body: JSON.stringify({ matchId, category, quantity }),
    });
  }

  // Récupérer les tickets du panier (non payés)
  static async getPendingTickets(): Promise<Ticket[]> {
    return apiFetch<Ticket[]>("/tickets/pending");
  }

  // Supprimer un ticket du panier
  static async deleteTicket(ticketId: string): Promise<void> {
    await apiFetch<void>(`/tickets/${ticketId}`, { method: "DELETE" });
  }

  // Payer tous les tickets du panier
  static async payPendingTickets(): Promise<Ticket[]> {
    return apiFetch<Ticket[]>("/tickets/pay-pending", { method: "POST" });
  }
}
