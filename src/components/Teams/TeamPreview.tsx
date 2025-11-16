import type { Team } from '../../types/Team';
import { teamImages } from "./TeamImages"; // import des images des équipes
import { translate } from '../../utils/translate'; // import de la fonction de traduction des pays et continents


interface TeamPreviewProps {
    // Propriétés du composant : une équipe de type Team
    team: Team;
}

// Composant affichant un aperçu d'une équipe
const TeamPreview: React.FC<TeamPreviewProps> = ({ team }) => {
    return (
        // Conteneur principal du composant avec mise en page responsive et centrage
        <div className="col-12 col-md-4 mb-4 pt-4 justify-content-center d-flex">
            <div className="card text-white border-0">
                <div className="position-relative">
                    {/* Image de l'équipe avec styles pour taille, ajustement et filtre */}
                    <img
                        src={teamImages[team.name]}
                        alt={team.name}
                        className="card-img rounded-0 shadow"
                        style={{
                            width: '300px',
                            height: '200px',
                            objectFit: 'cover',
                            filter: 'brightness(75%)',
                            borderRadius: '8px'
                        }}
                    />
                    {/* Texte en overlay sur l'image, aligné en bas à gauche */}
                    <div className="card-img-overlay d-flex justify-content-start align-items-end p-2">
                        <h5 className="card-title rounded px-3 fw-bold">{translate(team.name)}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamPreview;