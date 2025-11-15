import React, { useState, useEffect } from 'react';
import GroupPreview from './GroupPreview';
import type { Group } from '../../types/Group';
import { GroupService } from "../../services/GroupService";

const GroupsMaster: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GroupService.getGroups()
            .then(setGroups)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Chargement des groupes...</p>;
    if (groups.length === 0) return <p>Aucun groupe disponible</p>;

    return (
        <div className="container mt-5">
            <h2 className="fw-bold mb-4 border-bottom pb-2">Groupes</h2>
            <div className="row g-4">
                {groups.map((group) => (
                    <div key={group.id} className="col-12 col-md-6 col-lg-4">
                        <div className="card shadow-sm border-0 h-100 hover-shadow transition-all rounded-0">
                            <div className="card-body p-4">
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