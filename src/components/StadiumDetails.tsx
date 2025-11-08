import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StadiumService } from "../services/StadiumService";
import type { Stadium } from "../types/Stadium";

export default function StadiumDetails() {
    const { stadiumId } = useParams<{ stadiumId: string }>();
    const [stadium, setStadium] = useState<Stadium | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!stadiumId) return;

        async function fetchStadium() {
            try {
                const data = await StadiumService.getStadium(Number(stadiumId));
                setStadium(data);
            } catch (err: any) {
                setError(err.message || "Erreur lors du chargement du stade.");
            } finally {
                setLoading(false);
            }
        }

        fetchStadium();
    }, [stadiumId]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (!stadium) return <p>Aucun stade trouvé.</p>;

    return (
        <div className="container py-5 mt-5">
            <div className="position-relative mb-4">
                <img
                    src={`/stadiums/${stadium.id}.webp`}    
                    alt={stadium.name}
                    className="img-fluid shadow mb-4"
                    style={{
                        width: "100%",
                        maxHeight: "400px",
                    }}
                />
            </div>
            <h1 className="mb-4">{stadium.name}</h1>
            <p><strong>Ville :</strong> {stadium.city}</p>
            <p><strong>Pays :</strong> {stadium.country} ({stadium.countryCode})</p>
            <p><strong>Capacité :</strong> {stadium.capacity.toLocaleString()} spectateurs</p>
            <p><strong>Fuseau horaire :</strong> {stadium.timezone}</p>
            <p><strong>Caractéristiques :</strong> {stadium.features.join(", ")}</p>
        </div>
    );
}
