import type { Stadium } from '../types/Stadium';

interface StadiumPreviewProps {
    stadium: Stadium; // on reçoit directement l’objet
}

const StadiumPreview: React.FC<StadiumPreviewProps> = ({ stadium }) => {
    return (
        <div className="col-12 col-md-4 mb-4 pt-4 justify-content-center d-flex">
            <div className="card text-white border-0 rounded">
                <div className="position-relative">
                    <img
                        src={`./stadiums/${stadium.id}.webp`}
                        alt={stadium.name}
                        className="card-img rounded"
                        style={{
                            width: '300px',
                            height: '200px',
                            objectFit: 'cover',
                            filter: 'brightness(50%)',
                        }}
                    />
                    <div className="card-img-overlay d-flex justify-content-start align-items-end p-2">
                        <h5 className="card-title rounded px-3 fw-bold">{stadium.name}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StadiumPreview;