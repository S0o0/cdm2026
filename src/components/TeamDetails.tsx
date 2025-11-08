import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Team } from "../types/Team";
import { TeamService } from "../services/TeamService";
import { teamImages } from "./TeamImages";
import type { Match } from "../types/Match";
import { MatchService } from "../services/MatchService";
import MatchesCarousel from './MatchesCarousel';

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

  return (
  <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 py-5">
    {/* Nom et drapeau */}
    <div className="text-center mb-4">
      <h1 className="fw-bold">{team.name}</h1>
      <img
        src={`${API_URL}${team.flagImagePath}`}
        alt={`${team.name} flag`}
        className="img-fluid mb-3"
        style={{ maxHeight: "150px" }}
      />
      <p className="mb-1"><strong>Confédération :</strong> {team.confederation}</p>
      <p className="mb-0"><strong>Continent :</strong> {team.continent}</p>
    </div>

    {/* Image et carousel */}
    <div className="row justify-content-center align-items-center w-100 gap-4">
      <div className="col-auto">
        <img
          src={teamImages[team.name]}
          alt={team.name}
          className="img-fluid"
          style={{ maxHeight: "250px" }}
        />
      </div>
      <div className="col-md-6">
        <MatchesCarousel matches={matches} teamName={team.name} />
      </div>
    </div>
  </div>
);
};

export default TeamDetails;