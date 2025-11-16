import type { Ticket, PendingTicketsResponse, AllTicketsResponse } from "../types/Ticket";
import { apiFetch } from "./Api";
let onCartUpdate: (() => void) | null = null;

// Mise à jour du panier
export function setCartUpdateCallback(fn: () => void) {
  onCartUpdate = fn;
}

// Service de gestion des tickets : ajout, récupération, suppression, paiement et validation
export class TicketService {
  // Ajouter un ticket pour un match donné, une catégorie et une quantité et retourne la liste des tickets ajoutés
  static async addTicket(matchId: number, category: string, quantity: number): Promise<Ticket[]> {
    const response = await apiFetch<{ tickets: Ticket[] }>("/tickets", {
      method: "POST",
      body: JSON.stringify({ matchId, category, quantity }),
      credentials: "include",
    });
    if (onCartUpdate) onCartUpdate();

    // On ne retourne que les tickets, pas toute la réponse
    return response.tickets;
  }

  // Récupérer tous les tickets de l'utilisateur et les retourne
  static async getAllTickets(): Promise<AllTicketsResponse> {
    return apiFetch<AllTicketsResponse>("/tickets", {
      method: "GET",
      credentials: "include",
    });
  }


  // Récupère les tickets en attente de paiement et les retourne
  static async getPendingTickets(): Promise<PendingTicketsResponse> {
    return apiFetch<PendingTicketsResponse>("/tickets/pending", {
      method: "GET",
      credentials: "include",
    });
  }

  // Supprimer un ticket par son identifiant et mettre à jour le panier
  static async deleteTicket(ticketId: string): Promise<void> {
    await apiFetch<void>(`/tickets/${ticketId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (onCartUpdate) onCartUpdate();

  }

  // Payer tous les tickets en attente et les retourner
  static async payPendingTickets(): Promise<Ticket[]> {
    const response = await apiFetch<Ticket[]>("/tickets/pay-pending", {
      method: "POST",
      credentials: "include",
    });
    if (onCartUpdate) onCartUpdate();
    return response;
  }

  // Valider un ticket par son identifiant et le retourner
  static async validateTicket(ticketId: string): Promise<Ticket> {
    return apiFetch<Ticket>(`/tickets/validate/${ticketId}`, {
      method: "POST",
      credentials: "include",
    });
  }
}
