import React from 'react';
import type { Stadium } from '../types/Stadium';

interface StadiumPreviewProps {
    stadium: Stadium;
}

const StadiumPreview: React.FC<StadiumPreviewProps> = ({ stadium }) => {

    return (
        <div className="col-12 col-md-4 mb-4">
            <div className="card text-white">
                <div className="position-relative">
                    <img 
                        src={`${stadium.id}.webp`} 
                        className="card-img" 
                        alt={stadium.name} 
                    />
                    <div className="card-img-overlay d-flex align-items-start p-2">
                        <h5 className="card-title bg-dark bg-opacity-50 rounded px-2">{stadium.name}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StadiumPreview;