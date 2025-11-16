import type { Match } from '../../types/Match';
import { translate } from "../../utils/translate"; // import de la fonction de traduction des pays et continents

const API_URL = import.meta.env.VITE_API_URL;

interface MatchPreviewProps {
    match: Match;
    groupNames?: Record<number, string>;
    showDate?: boolean; // réintégration de la prop showDate
}

// Composant affichant un aperçu d'un match avec les drapeaux, l'heure, le groupe et le stade
const MatchPreview: React.FC<MatchPreviewProps> = ({ match, groupNames, showDate }) => {
    // Conversion de la date du match en objet Date pour formatage
    const matchDate = new Date(match.date);
    // Formatage de l'heure en HH:MM selon la locale française
    const formattedTime = matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    // Formatage de la date en JJ/MM
    const formattedDate = `${String(matchDate.getDate()).padStart(2, '0')}/${String(matchDate.getMonth() + 1).padStart(2, '0')}`;

    // Récupération de l'ID du groupe à partir de l'équipe à domicile ou à l'extérieur
    const groupId = match.homeTeam.groupId || match.awayTeam.groupId;
    // Récupération du nom du groupe via la prop groupNames si disponible
    const groupName = groupId ? groupNames?.[groupId] : null;

    return (
        <li className="list-group-item rounded-0 d-flex flex-column align-items-center text-center">
            {/* Affichage conditionnel de la date du match */}
            {showDate && <div className="mb-2 fw-bold">{formattedDate}</div>}

            {/* Section affichant les drapeaux des équipes avec l'heure au centre */}
            <div className="d-flex align-items-center justify-content-center gap-4 mb-3">
                {/* Drapeau et code équipe à domicile */}
                <div className="d-flex flex-column align-items-center">
                    <img
                        src={`${API_URL}${match.homeTeam.flagImagePath}`}
                        alt={translate(match.homeTeam.name)}
                        style={{ width: '60px', height: 'auto' }}
                    />
                    <span className="mt-1">{translate(match.homeTeam.code, "code")}</span>
                </div>

                {/* Heure du match */}
                <div className="fw-bold fs-5">{formattedTime}</div>

                {/* Drapeau et code équipe à l'extérieur */}
                <div className="d-flex flex-column align-items-center">
                    <img
                        src={`${API_URL}${match.awayTeam.flagImagePath}`}
                        alt={translate(match.awayTeam.name)}
                        style={{ width: '60px', height: 'auto' }}
                    />
                    <span className="mt-1">{translate(match.awayTeam.code, "code")}</span>
                </div>
            </div>

            {/* Informations sur le groupe (si disponible) et le stade */}
            <div className="text-muted">
                {groupName ? `Groupe ${groupName} · ` : ''}
                {match.stadium.name} - {match.stadium.city}
            </div>
        </li>
    );
};

export default MatchPreview;