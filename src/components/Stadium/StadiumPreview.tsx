import type { Stadium } from '../../types/Stadium';

// Propriétés du composant StadiumPreview
interface StadiumPreviewProps {
    stadium: Stadium;
}

// Composant affichant une carte avec l'image et le nom du stade
const StadiumPreview: React.FC<StadiumPreviewProps> = ({ stadium }) => {
    return (

        <div className="col-12 col-md-4 mb-4 pt-4 justify-content-center d-flex">
            {/* Carte Bootstrap */}
            <div className="card text-white border-0">
                {/* Conteneur pour superposer éléments */}
                <div className="position-relative">
                    {/* Image du stade */}
                    <img
                        src={`./stadiums/${stadium.id}.webp`}
                        alt={stadium.name}
                        className="card-img rounded-0 shadow"
                        style={{
                            width: '300px',
                            height: '200px',
                            objectFit: 'cover',
                            filter: 'brightness(50%)',
                        }}
                    />
                    {/* Overlay en bas à gauche avec nom du stade */}
                    <div className="card-img-overlay d-flex justify-content-start align-items-end p-2">
                        <h5 className="card-title rounded px-3 fw-bold">{stadium.name}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StadiumPreview;