import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Team } from "../types/Team";
import { TeamService } from "../services/TeamService";

const TeamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      TeamService.getTeam(Number(id))
        .then((data) => setTeam(data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!team) return <p>Team not found</p>;

  return (
    <div>
      <h1>{team.name}</h1>
      <img src={`/teams/${team.id}.webp`} alt={team.name} />
      
      <p><strong>Flag:</strong> {team.flag}</p>
      <p>
        <strong>Flag Image:</strong>{" "}
        <img src={team.flagImagePath} alt={`${team.name} flag`} width={50} />
      </p>
      <p><strong>Confederation:</strong> {team.confederation}</p>
      <p><strong>Continent:</strong> {team.continent}</p>
    </div>
  );
};

export default TeamDetails;