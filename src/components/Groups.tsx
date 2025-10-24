import { useEffect, useState } from "react";

interface Team {
  id: number;
  name: string;
  code: string;
  flag: string;
  confederation: string;
  continent: string;
}

interface Group {
  id: number;
  name: string;
  teams: Team[];
}

function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Chargement des groupes...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Groupes de la Coupe du Monde 2026</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {groups.map((group) => (
          <div
            key={group.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px 15px",
              backgroundColor: "#fafafa",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ textAlign: "center" }}>Groupe {group.name}</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {group.teams.map((team) => (
                <li
                  key={team.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "5px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <span>
                    {team.flag} {team.name}
                  </span>
                  <small style={{ color: "#666" }}>{team.code}</small>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;
