import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Group } from "../types/Group";
import { countryImages } from "./CountryImages";

function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://worldcup2026.shrp.dev/groups")
      .then((res) => res.json())
      .then((data) => {
        setGroups(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement :", err);
        setLoading(false);
      });
  }, []);

  function nextGroup() {
    setCurrentIndex((prev) => (prev + 1) % groups.length);
  }

  function prevGroup() {
    setCurrentIndex((prev) => (prev - 1 + groups.length) % groups.length);
  }

  if (loading) return <p>Chargement des groupes...</p>;

  const currentGroup = groups[currentIndex];

  return (
    <div className="container-fluid vh-100 vw-100 p-0 position-relative overflow-hidden">
      <h1
        className="position-absolute text-white"
        style={{
          top: "20px",
          left: "20px",
          fontSize: "2rem",
          textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
          zIndex: 10,
        }}
      >
        Groupe {currentGroup.name}
      </h1>

      <div className="row g-0 h-100 w-100">
        {currentGroup.teams.slice(0, 4).map((team) => (
          <div
            key={team.id}
            className="col-6 position-relative p-0"
            style={{ height: "50vh", cursor: "pointer" }}
            onClick={() => navigate(`/teams/${team.id}`)}
          >
            <img
            src={countryImages[team.name] || team.flag} 
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
            />
            <div
              className="position-absolute top-50 start-50 translate-middle text-white fw-bold text-center"
              style={{
                fontSize: "2rem",
                textShadow: "0 0 10px rgba(0,0,0,0.8)",
                backgroundColor: "rgba(0,0,0,0.3)",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              {team.name}
            </div>
          </div>
        ))}
      </div>

      <div
        className="position-absolute d-flex gap-3"
        style={{ bottom: "30px", right: "30px", zIndex: 10 }}
      >
        <button
          onClick={prevGroup}
          className="btn btn-light rounded-circle shadow"
          style={{
            width: "50px",
            height: "50px",
            opacity: 0.8,
            fontSize: "1.5rem",
          }}
        >
          ←
        </button>
        <button
          onClick={nextGroup}
          className="btn btn-light rounded-circle shadow"
          style={{
            width: "50px",
            height: "50px",
            opacity: 0.8,
            fontSize: "1.5rem",
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}

export default Groups;
