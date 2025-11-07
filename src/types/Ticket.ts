// Toutes les catégories de billets disponibles
export type TicketCategoryName = "VIP" | "CATEGORY_1" | "CATEGORY_2" | "CATEGORY_3";

// Structure d'un ticket individuel
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
    match?:{
        id: number;
        homeTeam: string;
        awayTeam: string;
        stadium: string;
        matchDate: string;
    };
};

// Réponse du endpoint GET /tickets/pending
export type PendingTicketsResponse = {
    tickets: Ticket[];
    count: number;
    totalPrice: number;
    expiresAt: string | null;
};