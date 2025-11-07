import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Team } from "../types/Team";
import { TeamService } from "../services/TeamService";
import { teamImages } from "./TeamImages";

const API_URL = import.meta.env.VITE_API_URL;

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
    <div style={{ display: 'flex', gap: '10px', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1 1 20%', minWidth: '20%', boxSizing: 'border-box', flexDirection: 'column' }}>
        <h1>{team.name}</h1>
        <p>
          <img
            src={`${API_URL}${team.flagImagePath}`}
            alt={team.name}
            style={{ width: '120px', height: '80px', objectFit: 'cover' }}
          />
        </p>
        <p>Confédération : <strong>{team.confederation}</strong></p>
        <p>Continent : <strong>{team.continent}</strong></p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '4 1 80%', minWidth: '80%', boxSizing: 'border-box' }}>
        <img
          src={teamImages[team.name]}
          alt={team.name}
          style={{
            width: '66%',
            height: 'auto',
          }}
        />
      </div>
      <style>
        {`
          @media (max-width: 768px) {
            div[style*="display: flex"] {
              flex-direction: column !important;
            }
            div[style*="flex: 1 1 20%"] {
              flex: 1 1 100% !important;
              min-width: 100% !important;
            }
            div[style*="flex: 4 1 80%"] {
              flex: 1 1 100% !important;
              min-width: 100% !important;
            }
            div[style*="flex: 1 1 20%"] img {
              width: 120px !important;
              height: 80px !important;
            }
            div[style*="flex: 4 1 80%"] img {
              width: 100% !important;
              height: auto !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default TeamDetails;