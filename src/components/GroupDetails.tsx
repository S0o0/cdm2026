import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Group } from "../types/Group";
import type { Match } from "../types/Match";
import { GroupService } from "../services/GroupService";
import { MatchService } from "../services/MatchService";
import MatchPreview from "./MatchPreview";
import logo from '../assets/home/wc26logo-black.webp';

const API_URL = import.meta.env.VITE_API_URL;

const GroupDetails: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!groupId) return;

        async function fetchData() {
            try {
                const groupData = await GroupService.getGroup(Number(groupId));
                setGroup(groupData);
                const allMatches = await MatchService.getMatches();
                // Filter matches belonging to this group
                const groupMatches = allMatches.filter(
                    (match) =>
                        match.homeTeam.groupId === Number(groupId)
                );
                setMatches(groupMatches);
            } catch (err: any) {
                setError(err.message || "Erreur lors du chargement des données.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [groupId]);

    if (loading) return <p>Chargement du groupe...</p>;
    if (error) return <p>Erreur : {error}</p>;
    if (!group) return <p>Groupe introuvable</p>;

    return (
        <div className="vw-100 p-4 d-flex flex-column align-items-center mt-5">
            <img
                src={logo}
                alt="FIFA Trophy"
                style={{ width: "100px", marginTop: "10px" }}
            />
            <div
                className="text-white fw-bold text-center rounded-0 px-4 py-2 mb-4"
                style={{
                    backgroundColor: "#D32F2F",
                    fontSize: "1.5rem",
                    letterSpacing: "1px",
                }}
            >
                GROUP {group.name.toUpperCase()}
            </div>

            <div
                className="d-grid"
                style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "20px",
                    maxWidth: "500px",
                    width: "100%",
                }}
            >
                {group.teams.map((team) => (
                    <Link 
                        key={team.id} 
                        to={`/teams/${team.id}`} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <div
                            className="bg-white shadow rounded-0 d-flex flex-column align-items-center justify-content-center p-4"
                        >
                            <img
                                src={`${API_URL}${team.flagImagePath}`}
                                alt={team.name}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "contain",
                                    marginBottom: "10px",
                                }}
                            />
                            <h6 className="fw-bold text-uppercase">{team.name}</h6>
                        </div>
                    </Link>
                ))}
            </div>

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
                        {matches.map((match) => (
                            <Link
                                key={match.id}
                                to={`/matches/${match.id}`}
                                className="btn btn-light rounded-0 shadow-sm d-flex flex-column align-items-center p-3"
                            >
                                <MatchPreview match={match} showDate />
                            </Link>
                        ))}
                    </div>
                </>
            )}

            <div className="text-center mt-5">
                <Link to="/groups" className="btn btn-dark px-4 py-2 rounded-0 shadow-sm border-0">
                    Retour aux groupes
                </Link>
            </div>
        </div>
    );
};

export default GroupDetails;