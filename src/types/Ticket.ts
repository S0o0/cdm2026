// Catégories possibles pour un billet
export type TicketCategoryName = "VIP" | "CATEGORY_1" | "CATEGORY_2" | "CATEGORY_3";

// Représentation d'un billet individuel
export type Ticket = {
    id: string;
    userId: string;
    matchId: number;
    category: TicketCategoryName;
    price: number;
    status: "pending_payment" | "confirmed" | "used";
    seatNumber?: string | null;
    qrCode?: string | null;
    expiresAt: string | null;
    paymentDate: string | null;
    validatedAt: string | null;
    match?: {
        id: number;
        homeTeam: string;
        awayTeam: string;
        stadium: string;
        matchDate: string;
    };
};

// Comptage des billets selon leur statut
export type TicketCounts = {
    total: number;
    pending: number;
    confirmed: number;
    used: number;
};

// Regroupement des billets par statut
export type GroupedTickets = {
    pending: Ticket[];
    confirmed: Ticket[];
    used: Ticket[];
};

// Réponse contenant tous les billets, leur regroupement et les comptes
export type AllTicketsResponse = {
    tickets: Ticket[];
    grouped: GroupedTickets;
    counts: TicketCounts;
};

// Réponse du endpoint GET /tickets/pending
export type PendingTicketsResponse = {
    tickets: Ticket[];
    count: number;
    totalPrice: number;
    expiresAt: string | null;
};