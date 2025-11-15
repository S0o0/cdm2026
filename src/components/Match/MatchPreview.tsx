import type { Match } from '../../types/Match';
import { translate } from "../../utils/translate";

const API_URL = import.meta.env.VITE_API_URL;

interface MatchPreviewProps {
    match: Match;
    groupNames?: Record<number, string>;
    showDate?: boolean; // réintégration de la prop showDate
}

const MatchPreview: React.FC<MatchPreviewProps> = ({ match, groupNames, showDate }) => {
    const matchDate = new Date(match.date);
    const formattedTime = matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = `${String(matchDate.getDate()).padStart(2, '0')}/${String(matchDate.getMonth() + 1).padStart(2, '0')}`;

    const groupId = match.homeTeam.groupId || match.awayTeam.groupId;
    const groupName = groupId ? groupNames?.[groupId] : null;

    return (
        <li className="list-group-item rounded-0 d-flex flex-column align-items-center text-center">
            {/* Date */}
            {showDate && <div className="mb-2 fw-bold">{formattedDate}</div>}

            {/* Flags with time in between */}
            <div className="d-flex align-items-center justify-content-center gap-4 mb-3">
                <div className="d-flex flex-column align-items-center">
                    <img
                        src={`${API_URL}${match.homeTeam.flagImagePath}`}
                        alt={translate(match.homeTeam.name)}
                        style={{ width: '60px', height: 'auto' }}
                    />
                    <span className="mt-1">{translate(match.homeTeam.code, "code")}</span>
                </div>

                {/* Time */}
                <div className="fw-bold fs-5">{formattedTime}</div>

                <div className="d-flex flex-column align-items-center">
                    <img
                        src={`${API_URL}${match.awayTeam.flagImagePath}`}
                        alt={translate(match.awayTeam.name)}
                        style={{ width: '60px', height: 'auto' }}
                    />
                    <span className="mt-1">{translate(match.awayTeam.code, "code")}</span>
                </div>
            </div>

            {/* Group & Stadium */}
            <div className="text-muted">
                {groupName ? `Groupe ${groupName} · ` : ''}
                {match.stadium.name} - {match.stadium.city}
            </div>
        </li>
    );
};

export default MatchPreview;