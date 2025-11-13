import type { Ticket, PendingTicketsResponse } from "../types/Ticket";
import { apiFetch } from "./Api";

export class TicketService {
  // Ajouter un ticket
  static async addTicket(matchId: number, category: string, quantity: number): Promise<Ticket[]> {
    const response = await apiFetch<{ tickets: Ticket[] }>("/tickets", {
      method: "POST",
      body: JSON.stringify({ matchId, category, quantity }),
      credentials: "include",
    });

    // On ne retourne que les tickets, pas toute la réponse
    return response.tickets;
  }

  // Récupère tous les tickets
static async getAllTickets(): Promise<Ticket[]> {
    const result = await apiFetch<{ tickets: Ticket[] }>("/tickets", {
      method: "GET",
      credentials: "include",
    });

    return result.tickets;
}


  // Récupère les tickets en attente
  static async getPendingTickets(): Promise<PendingTicketsResponse> {
    return apiFetch<PendingTicketsResponse>("/tickets/pending", {
      method: "GET",
      credentials: "include",
    });
  }

  // Supprimer un ticket
  static async deleteTicket(ticketId: string): Promise<void> {
    await apiFetch<void>(`/tickets/${ticketId}`, { 
      method: "DELETE",
      credentials: "include",
    });
  }

  // Payer les tickets en attente
  static async payPendingTickets(): Promise<Ticket[]> {
    return apiFetch<Ticket[]>("/tickets/pay-pending", { 
      method: "POST",
      credentials: "include",
    });
  }

  // Valider un ticket
  static async validateTicket(ticketId: string): Promise<Ticket> {
    return apiFetch<Ticket>(`/tickets/validate/${ticketId}`, {
      method: "POST",
      credentials: "include",
    });
  }
}
