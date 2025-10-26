import React, { useState, useEffect } from 'react';
import StadiumPreview from './StadiumPreview';
import type { Stadium } from '../types/Stadium';
import { getStadiums } from "../services/StadiumsService";

const StadiumsMaster: React.FC = () => {
    const [stadiums, setStadiums] = useState<Stadium[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStadiums()
            .then(setStadiums)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Chargement des stades...</p>;
    if (stadiums.length === 0) return <p>Aucun stade disponible</p>;

    return (

        <div className="row">
            <h1 className="text-center fw-bold pt-3">
                Stades
            </h1>
            {stadiums.map(stadium => (
                <StadiumPreview key={stadium.id} stadium={stadium} />
            ))}
        </div>
    );
};

export default StadiumsMaster;