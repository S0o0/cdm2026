import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { StadiumService } from "../../services/StadiumService";
import { MatchService } from "../../services/MatchService";
import type { Stadium } from "../../types/Stadium";
import type { Match } from "../../types/Match";
import MatchPreview from "../Match/MatchPreview";
import { GroupService } from "../../services/GroupService";
import type { Group } from "../../types/Group";

// Composant affichant les détails d'un stade
const StadiumDetails: React.FC = () => {
  // Récupération de l'ID du stade depuis les paramètres de l'URL
  const { stadiumId } = useParams<{ stadiumId: string }>();

  // États locaux pour stocker les données du stade, le chargement, les erreurs, les matchs et les noms des groupes
  const [stadium, setStadium] = useState<Stadium | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [groupNames, setGroupNames] = useState<Record<number, string>>({});

  // useEffect pour récupérer les groupes et construire un mapping id -> nom du groupe
  useEffect(() => {
    GroupService.getGroups()
      .then((groups: Group[]) => {
        const mapping: Record<number, string> = {};
        groups.forEach(g => (mapping[g.id] = g.name));
        setGroupNames(mapping);
      })
      .catch(err => console.error("❌ Erreur chargement groupes :", err));
  }, []);

  // useEffect pour récupérer les détails du stade et les matchs associés au chargement ou au changement de stadiumId
  useEffect(() => {
    if (!stadiumId) return;

    const fetchStadium = async () => {
      try {
        // Récupération des données du stade via le service
        const data = await StadiumService.getStadium(Number(stadiumId));
        setStadium(data);

        // Récupération de tous les matchs
        const allMatches = await MatchService.getMatches();

        // Filtrage des matchs joués dans ce stade
        const stadiumMatches = allMatches.filter(
          (m) => m.stadium.id === Number(stadiumId)
        );
        setMatches(stadiumMatches);
      } catch (err: any) {
        // Gestion des erreurs lors du chargement
        setError(err.message || "Erreur lors du chargement du stade.");
      } finally {
        // Fin du chargement
        setLoading(false);
      }
    };

    fetchStadium();
  }, [stadiumId]);

  // Affichage conditionnel selon l'état de chargement, d'erreur ou de données
  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!stadium) return <p>Aucun stade trouvé.</p>;

  return (
    // Conteneur principal centré verticalement et horizontalement avec marges
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 mt-5 py-5">
      {/* Section d'informations principales sur le stade */}
      <div className="text-center mb-4">
        <h1 className="fw-bold">{stadium.name}</h1>
        <p className="mb-1">Ville : <strong>{stadium.city}</strong></p>
        <p className="mb-1">Pays : <strong>{stadium.country}</strong> ({stadium.countryCode})</p>
        <p className="mb-1">Capacité : <strong>{stadium.capacity.toLocaleString()}</strong> spectateurs</p>
        <p className="mb-0">Fuseau horaire : <strong>{stadium.timezone}</strong></p>
      </div>

      {/* Section image et caractéristiques du stade */}
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
          {/* Affichage des caractéristiques sous forme de badges */}
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

      {/* Section listant les matchs joués dans ce stade */}
      <div className="mt-5 text-center">
        <h4>Matchs joués dans ce stade :</h4>
        {matches.length > 0 && (
          <>
            <h3 className="text-white mt-5 mb-3">Matchs du groupe</h3>
            <div
              className="d-grid"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "15px",
                maxWidth: "700px",
                width: "100%",
              }}
            >
              {/* Pour chaque match, affichage d'un lien vers la page du match avec un aperçu */}
              {matches.map((match) => (
                <Link
                  key={match.id}
                  to={`/matches/${match.id}`}
                  className="btn btn-light rounded-0 shadow-sm d-flex flex-column align-items-center p-3"
                >
                  <MatchPreview match={match} showDate groupNames={groupNames} />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bouton de retour à la liste des stades */}
      <div className="text-center mt-5">
        <Link to="/stadiums" className="btn btn-dark px-4 py-2 rounded-0 shadow-sm border-0">
          Retour aux stades
        </Link>
      </div>
    </div>
  );
};

export default StadiumDetails;