import React, { useEffect, useState } from "react";
import { TicketService } from "../services/TicketService";
import type { Ticket } from "../types/Ticket";
import { QRCodeCanvas } from "qrcode.react";
import { translate } from "../utils/translate";

const OrdersHistory: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const result = await TicketService.getAllTickets();

                const filtered = result.filter(
                    (t) => t.status === "confirmed" || t.status === "used"
                );

                setTickets(filtered);
            } catch (err: any) {
                setError("Erreur lors du chargement des tickets.");
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const formatDate = (date: string | null) => {
        if (!date) return "-";
        return new Date(date).toLocaleString();
    };

    if (loading) {
        return <p className="mt-5 ms-5">Chargement...</p>;
    }

    if (error) {
        return <p className="mt-5 ms-5" style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div className="container mt-5 pt-5">
            <h2 className="mb-4">Historique des commandes</h2>

            {tickets.length === 0 && (
                <p>Aucune commande trouvee.</p>
            )}

            <div className="list-group">
                {tickets.map((t) => (
                    <div key={t.id} className="list-group-item mb-3 shadow-sm">

                        <h5 className="mb-3">
                            Match: {translate(t.match?.homeTeam || "")} vs {translate(t.match?.awayTeam || "")}
                        </h5>

                        <div className="d-flex flex-wrap align-items-center">
                            
                            {/* Bloc QR Code */}
                            <div className="me-4 mb-3">
                                {t.qrCode ? (
                                    <QRCodeCanvas
                                        value={t.qrCode}
                                        size={128}
                                        includeMargin={true}
                                    />
                                ) : (
                                    <p>QR Code indisponible</p>
                                )}
                            </div>

                            {/* Bloc Infos */}
                            <div>
                                <p className="mb-1"><strong>Date du match:</strong> {formatDate(t.match?.matchDate || null)}</p>
                                <p className="mb-1"><strong>Stade:</strong> {t.match?.stadium}</p>
                                <p className="mb-1"><strong>Categorie:</strong> {t.category}</p>
                                <p className="mb-1"><strong>Prix:</strong> {t.price}$</p>
                                <p className="mb-1"><strong>Status:</strong> {t.status === "confirmed" ? "Confirme" : "Utilise"}</p>
                                <p className="mb-1"><strong>Place:</strong> {t.seatNumber ?? "-"}</p>
                                <p className="mb-1"><strong>Paye le:</strong> {formatDate(t.paymentDate)}</p>
                                <p className="mb-1"><strong>Valide le:</strong> {formatDate(t.validatedAt)}</p>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersHistory;
