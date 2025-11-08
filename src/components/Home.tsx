import React, { useState, useEffect, useRef } from 'react';
import home from '../assets/home/home.webp';
import video from '../assets/home/video.mp4';

const Home: React.FC = () => {
    const [showImage, setShowImage] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;

        if (showImage) {
        timer = setTimeout(() => {
            setShowImage(false);
        }, 30000);
        } else {
        videoRef.current?.play();
        }

        return () => {
        if (timer) {
            clearTimeout(timer);
        }
        };
    }, [showImage]);

    const handleVideoEnded = () => { setShowImage(true); };

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
        {!showImage && (
          <button
            onClick={toggleSound}
            className="btn btn-light"
          >
            {soundEnabled ? '🔇' : '🔊'}
          </button>
        )}
      </div>

      <div className="hero-image pe-5">
        {showImage ? (
          <img
            src={home}
            alt="CDM 2026"
            className="img-fluid shadow-lg"
            style={{ width: '100%', maxWidth: '1200px', height: 'auto', borderRadius: '10px' }}
          />
        ) : (
          <video
            ref={videoRef}
            src={video}
            className="shadow-lg"
            style={{ width: '100%', maxWidth: '1200px', height: 'auto', borderRadius: '10px' }}
            onEnded={handleVideoEnded}
            muted={!soundEnabled}
          />
        )}
      </div>
    </div>
  );
};

export default Home;