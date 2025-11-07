import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Team } from "../types/Team";
import { TeamService } from "../services/TeamService";
import { teamImages } from "./TeamImages";
import type { Match } from "../types/Match";
import { MatchService } from "../services/MatchService";
import MatchesCarousel from './MatchesCarousel';
import './TeamDetails.css';

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

  if (loading) return <p className="loading">Loading...</p>;
  if (!team) return <p className="not-found">Team not found</p>;

  return (
    <div className="team-details-container">
      <div className="team-info">
        <h1 className="team-name">{team.name}</h1>
        <img
          src={`${API_URL}${team.flagImagePath}`}
          alt={`${team.name} flag`}
          className="team-flag"
        />
        <p className="team-confederation">
          Confédération : <strong>{team.confederation}</strong>
        </p>
        <p className="team-continent">
          Continent : <strong>{team.continent}</strong>
        </p>
      </div>

      <div className="team-image-section">
        <img
          src={teamImages[team.name]}
          alt={team.name}
          className="team-image"
        />
        <MatchesCarousel matches={matches} teamName={team.name} />
      </div>
    </div>
  );
};

export default TeamDetails;