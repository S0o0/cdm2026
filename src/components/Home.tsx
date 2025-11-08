import React, { useState, useRef } from 'react';
import home from '../assets/home/home.webp';
import video from '../assets/home/video.mp4';
import soundDisabledIcon from '../assets/home/soundDisabled.png';
import soundEnabledIcon from '../assets/home/soundEnabled.png';

const Home: React.FC = () => {
    const [soundEnabled, setSoundEnabled] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleSound = () => {
        if (videoRef.current) {
            videoRef.current.muted = !soundEnabled;
            setSoundEnabled(!soundEnabled);
        }
    };

    return (
        <div
            className="hero-section d-flex align-items-center justify-content-between pt-5 pb-5 bg-dark"
            style={{ color: 'white' }}
        >
            <div className="hero-text text-white ps-5 pe-3">
                <h1 className="fw-bold display-4 mb-3">Coupe du Monde 2026</h1>
                <p className="lead mb-4">
                    La Coupe du Monde de la FIFA 2026 se tiendra au Canada, au Mexique et aux États-Unis.
                    Découvrez les stades, les matches et les équipes de cet événement exceptionnel.
                </p>
            </div>

            <div className="hero-image pe-5">
                <button
                    onClick={toggleSound}
                    className="btn btn-light mb-3"
                >
                    <img
                        src={soundEnabled ? soundEnabledIcon : soundDisabledIcon}
                        alt={soundEnabled ? 'Sound On' : 'Sound Off'}
                        style={{ width: 30, height: 30 }}
                    />
                </button>
                <video
                    ref={videoRef}
                    src={video}
                    className="shadow-lg"
                    style={{ width: '100%', maxWidth: '1200px', height: 'auto' }}
                    muted={!soundEnabled}
                    autoPlay
                    loop
                />
            </div>
        </div>
    );
};

export default Home;