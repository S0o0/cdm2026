import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StadiumService } from "../services/StadiumService";
import { MatchService } from "../services/MatchService";
import type { Stadium } from "../types/Stadium";
import type { Match } from "../types/Match";

const API_URL = import.meta.env.VITE_API_URL;

export default function StadiumDetails() {
    const { stadiumId } = useParams<{ stadiumId: string }>();
    const [stadium, setStadium] = useState<Stadium | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        if (!stadiumId) return;

        async function fetchStadium() {
            try {
                const data = await StadiumService.getStadium(Number(stadiumId));
                setStadium(data);
                const allMatches = await MatchService.getMatches();
                setMatches(allMatches);
                const stadiumMatches = allMatches.filter(
                    (m) => m.stadium.id === Number(stadiumId)
                );
                setMatches(stadiumMatches);
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
      <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 mt-5 py-5">
        <div className="text-center mb-4">
          <h1 className="fw-bold">{stadium.name}</h1>
          <p className="mb-1">Ville : <strong>{stadium.city}</strong></p>
          <p className="mb-1">Pays : <strong>{stadium.country}</strong> ({stadium.countryCode})</p>
          <p className="mb-1">Capacité : <strong>{stadium.capacity.toLocaleString()}</strong> spectateurs</p>
          <p className="mb-0">Fuseau horaire : <strong>{stadium.timezone}</strong></p>
        </div>

        <div className="row justify-content-center align-items-center w-100 gap-4">
          <div className="col-auto">
            <img
              src={`/stadiums/${stadium.id}.webp`}
              alt={stadium.name}
              className="img-fluid shadow-lg"
              style={{ maxHeight: "300px" }}
            />
          </div>
          <div className="text-center mt-4">
            <h4>Caractéristiques :</h4>
            <div className="d-flex align-items-center flex-wrap justify-content-center gap-2">
              {stadium.features.map((feature, index) => (
                <span
                  key={index}
                  className="badge bg-secondary p-2"
                  style={{ fontSize: "0.9rem" }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
              <div className="mt-5 text-center">
        <h4>Matchs joués dans ce stade :</h4>
        {matches.length === 0 ? (
          <p className="text-muted mt-3">Aucun match prévu dans ce stade.</p>
        ) : (
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
            {matches.map((match) => (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                className="btn btn-outline-light border rounded p-3 text-dark"
                style={{ minWidth: "220px", textDecoration: "none" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <img
                    src={`${API_URL}${match.homeTeam.flagImagePath}`}
                    alt={match.homeTeam.name}
                    style={{ width: "40px", borderRadius: "4px" }}
                  />
                  <span className="mx-2 fw-bold">vs</span>
                  <img
                    src={`${API_URL}${match.awayTeam.flagImagePath}`}
                    alt={match.awayTeam.name}
                    style={{ width: "40px", borderRadius: "4px" }}
                  />
                </div>
                <p className="mt-2 mb-0 small text-dark">
                  {new Date(match.date).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>
    );
}
