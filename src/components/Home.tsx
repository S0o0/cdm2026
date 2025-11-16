import React, { useState, useRef } from 'react';
import video from '../assets/img/home/video.mp4';
import soundDisabledIcon from '../assets/img/home/soundDisabled.png';
import soundEnabledIcon from '../assets/img/home/soundEnabled.png';

// Composant du haut de la page d'accueil (vidéo sur fond noir)
const Home: React.FC = () => {
    // État pour savoir si le son est activé ou non
    const [soundEnabled, setSoundEnabled] = useState(false);
    // Référence vers l'élément vidéo pour pouvoir le contrôler
    const videoRef = useRef<HTMLVideoElement>(null);

    // Fonction pour activer ou désactiver le son de la vidéo
    const toggleSound = () => {
        if (videoRef.current) {
            videoRef.current.muted = !soundEnabled;
            setSoundEnabled(!soundEnabled);
        }
    };

    return (
        // Section principale de la page d'accueil avec texte et vidéo
        <div
            className="hero-section d-flex align-items-center justify-content-between pt-5 pb-5 bg-black"
            style={{ color: 'white' }}
        >
            {/* Partie texte avec titre et description */}
            <div className="hero-text text-white ps-5 pe-3">
                <h1 className="fw-bold display-4 mb-3">Coupe du Monde 2026</h1>
                <p className="lead mb-4">
                    La Coupe du Monde de la FIFA 2026 se tiendra au Canada, au Mexique et aux États-Unis.
                    Découvrez les stades, les matches et les équipes de cet événement exceptionnel.
                </p>
            </div>

            {/* Partie image/vidéo avec contrôle du son */}
            <div className="hero-image pe-5">
                <video
                    ref={videoRef} // Référence pour contrôler la vidéo
                    src={video}
                    className="shadow-lg"
                    style={{ width: '100%', maxWidth: '1200px', height: 'auto' }}
                    muted={!soundEnabled} // Muet si le son n'est pas activé
                    autoPlay
                    loop
                />
                {/* Bouton pour activer/désactiver le son */}
                <button
                    onClick={toggleSound}
                    className="btn btn-light mb-3"
                >
                    <img
                        src={soundEnabled ? soundEnabledIcon : soundDisabledIcon} // Icône selon l'état du son
                        alt={soundEnabled ? 'Sound On' : 'Sound Off'}
                        style={{ width: 20, height: 20 }}
                    />
                </button>
            </div>
        </div>
    );
};

export default Home;