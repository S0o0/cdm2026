import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Team } from "../../types/Team";
import { TeamService } from "../../services/TeamService";
import { teamImages } from "./TeamImages";
import type { Match } from "../../types/Match";
import { MatchService } from "../../services/MatchService";

const API_URL = import.meta.env.VITE_API_URL;

const TeamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (id) {
      TeamService.getTeam(Number(id))
        .then((data) => setTeam(data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    MatchService.getMatches()
      .then((data) => setMatches(data))
      .catch(console.error);
  }, []);

  if (loading) return <p className="text-center mt-5">Chargement...</p>;
  if (!team) return <p className="text-center mt-5">Team introuvable</p>;

  const opponents = matches
    .filter(m => m.homeTeam.name === team.name || m.awayTeam.name === team.name)
    .map(m => m.homeTeam.name === team.name ? m.awayTeam : m.homeTeam);

  const uniqueOpponents = opponents.filter(
    (opp, index, self) => index === self.findIndex(o => o.id === opp.id)
  );


  return (
    <div>
      <div className="text-center mb-4">
        <h1 className="fw-bold mt-5">{team.name}</h1>
        <img
          src={`${API_URL}${team.flagImagePath}`}
          alt={`${team.name} flag`}
          className="img-fluid mb-3"
          style={{ maxHeight: "150px" }}
        />
        <p className="mb-1"><strong>Confédération :</strong> {team.confederation}</p>
        <p className="mb-0"><strong>Continent :</strong> {team.continent}</p>
      </div>

      <div className="row justify-content-center align-items-center w-100 gap-4">
        <div className="col-auto">
          <img
            src={teamImages[team.name]}
            alt={team.name}
            className="img-fluid"
            style={{ maxHeight: "250px" }}
          />
        </div>
        <div className="text-center mt-4">
          <h4>Prochains adversaires :</h4>
          <div className="d-flex align-items-center flex-wrap justify-content-center gap-2">
            {uniqueOpponents.map((opponent) => (
              <Link
                key={opponent.id}
                to={`/teams/${opponent.id}`}
              >
                <img
                  key={opponent.id}
                  src={`${API_URL}${opponent.flagImagePath}`}
                  alt={opponent.name}
                  style={{ maxHeight: "60px", borderRadius: "5px" }}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center mt-5">
        <Link to="/teams" className="btn btn-dark px-4 py-2 rounded-0 shadow-sm border-0">
          Retour aux équipes
        </Link>
      </div>
    </div>
  );
};

export default TeamDetails;