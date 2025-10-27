import React, { useState, useEffect } from 'react';
import StadiumPreview from './StadiumPreview';
import type { Stadium } from '../types/Stadium';
import { StadiumService } from "../services/StadiumService";
import { Link } from 'react-router-dom';

const StadiumsMaster: React.FC = () => {
    const [stadiums, setStadiums] = useState<Stadium[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        StadiumService.getStadiums()
            .then(setStadiums)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Chargement des stades...</p>;
    if (stadiums.length === 0) return <p>Aucun stade disponible</p>;

    return (

        <div className="row">
            <h1 className="text-center fw-bold pt-3">Stades</h1>
            {stadiums.map(stadium => (
                <div key={stadium.id} className="col-md-4 mb-3 justify-content-center d-flex">
                    <Link
                        to={`/stadiums/${stadium.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <StadiumPreview stadium={stadium} />
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default StadiumsMaster;