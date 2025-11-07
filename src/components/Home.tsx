import React from 'react';
import home from '../assets/home/home.webp';

const Home: React.FC = () => {
    return (
        <div className="hero-section d-flex align-items-center justify-content-between pt-5 pb-5 bg-dark" style={{ color: 'white' }}>
            <div className="hero-text text-white ps-5 pe-3">
                <h1 className="fw-bold display-4 mb-3">Coupe du Monde 2026</h1>
                <p className="lead mb-4">
                    La Coupe du Monde de la FIFA 2026 se tiendra au Canada, au Mexique et aux États-Unis.
                    Découvrez les stades, les matches et les équipes de cet événement exceptionnel.
                </p>
            </div>

            <div className="hero-image pe-5">
                <img
                    src={home}
                    alt="CDM 2026"
                    className="img-fluid shadow-lg"
                    style={{ width: '1200px', height: 'auto' }}
                />
            </div>
        </div>
    );
};

export default Home;