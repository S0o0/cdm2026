import type { Group } from '../../types/Group';
import { Link } from 'react-router-dom';
import { translate } from '../../utils/translate'; // import de la fonction de traduction des pays et continents

const API_URL = import.meta.env.VITE_API_URL;

// Propriétés reçues par le composant, contenant les informations d’un groupe
interface GroupPreviewProps {
    group: Group;
}

// Composant affichant un aperçu du groupe avec ses équipes
const GroupPreview: React.FC<GroupPreviewProps> = ({ group }) => {
    // Élément de liste représentant un groupe dans l’aperçu
    return (
        <li className="list-group-item">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0 fw-bold">{group.name}</h5>
            </div>

            {/* Liste des équipes appartenant à ce groupe */}
            <ul className="list-unstyled mb-0">
                {group.teams.map((team) => (
                    <li key={team.id} className="d-flex align-items-center gap-2 mb-1">
                        {/* Affichage du drapeau de l’équipe */}
                        <img
                            src={`${API_URL}${team.flagImagePath}`}
                            alt={team.name}
                            style={{ width: '30px', height: 'auto' }}
                        />
                        {/* Nom traduit de l’équipe */}
                        <span>{translate(team.name)}</span>
                    </li>
                ))}
            </ul>

            {/* Bouton permettant d’accéder à la page détaillée du groupe */}
            <div className="text-end mt-2">
                <Link
                    to={`/groups/${group.id}`}
                    className="btn btn-sm btn-dark text-white rounded-0 px-3 py-1 shadow-sm border-0"
                >
                    Voir le groupe
                </Link>
            </div>
        </li>
    );
};

export default GroupPreview;