import React, { useState, useEffect } from 'react';
import StadiumPreview from './StadiumPreview';
import type { Stadium } from '../types/Stadium';
import { StadiumService } from "../services/StadiumService";
import { Link } from 'react-router-dom';

const StadiumsMaster: React.FC = () => {
    const [stadiums, setStadiums] = useState<Stadium[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredStadiums, setFilteredStadiums] = useState<Stadium[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('Tous');

    useEffect(() => {
        StadiumService.getStadiums()
            .then(setStadiums)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (selectedCountry === 'Tous') {
            setFilteredStadiums(stadiums);
        } else {
            setFilteredStadiums(stadiums.filter(stadium => stadium.country === selectedCountry));
        }
    }, [stadiums, selectedCountry]);

    if (loading) return <p>Chargement des stades...</p>;
    if (stadiums.length === 0) return <p>Aucune équipe disponible</p>;

    const countrys = Array.from(new Set(stadiums.map(t => t.country)));
    return (
        <div className="container py-5 mt-5">
            <div className="mb-4">
                <label className="me-2 fw-bold">Filtrer par continent :</label>
                <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                >
                    <option value="Tous">Tous</option>
                    {countrys.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>
            <div className="row">
                {filteredStadiums.map(stadium => (
                    <div key={stadium.id} className="col-md-4 mb-3 d-flex justify-content-center">
                        <Link
                            to={`/stadiums/${stadium.id}`}
                        >
                            <StadiumPreview stadium={stadium} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StadiumsMaster;