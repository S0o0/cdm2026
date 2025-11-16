import React, { useState, useEffect } from 'react';
import GroupPreview from './GroupPreview';
import type { Group } from '../../types/Group';
import { GroupService } from "../../services/GroupService";

// Composant affichant les groupes
const GroupsMaster: React.FC = () => {
    // Indique si la page est encore en train de charger les données
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    // Chargement des groupes au montage du composant
    useEffect(() => {
        // Appel au service pour récupérer tous les groupes
        GroupService.getGroups()
            .then(setGroups)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Affichage pendant le chargement
    if (loading) return <p>Chargement des groupes...</p>;
    // Message affiché si aucun groupe n’a été trouvé
    if (groups.length === 0) return <p>Aucun groupe disponible</p>;

    // Structure principale de la page listant tous les groupes
    return (
        <div className="container mt-5">
            <h2 className="fw-bold mb-4 border-bottom pb-2">Groupes</h2>
            <div className="row g-4">
                {/* Création d’une carte pour chaque groupe */}
                {groups.map((group) => (
                    <div key={group.id} className="col-12 col-md-6 col-lg-4">
                        <div className="card shadow-sm border-0 h-100 hover-shadow transition-all rounded-0">
                            <div className="card-body p-4">
                                {/* Aperçu du groupe avec ses informations principales */}
                                <GroupPreview group={group} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupsMaster;