import type { Match } from '../types/Match';

const API_URL = import.meta.env.VITE_API_URL;

interface MatchPreviewProps {
    match: Match;
    showDate?: boolean;
}

const MatchPreview: React.FC<MatchPreviewProps> = ({ match, showDate }) => {
    const matchDate = new Date(match.date);
    // Format date as DD/MM
    const formattedDate = `${String(matchDate.getDate()).padStart(2, '0')}/${String(matchDate.getMonth() + 1).padStart(2, '0')}`;

    // Format time as HH:MM
    const formattedTime = matchDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <li className="list-group-item rounded-0">
            {/* Stadium - Date */}
            <div className="d-flex justify-content-between mb-2 gap-2">
                <span>{match.stadium.name} - {match.stadium.city}</span> 
                {showDate && <span>{formattedDate}</span>}
            </div>

            {/* Home Team + Code*/}
            <div className="mb-1 d-flex align-items-center justify-content-start gap-2">
                <img
                    src={`${API_URL}${match.homeTeam.flagImagePath}`}
                    alt={match.homeTeam.name}
                    style={{ width: '40px', height: 'auto' }}
                />
                <span>{match.homeTeam.code}</span>
            </div>

            {/* Away Team + Code */}
            <div className="mb-1 d-flex align-items-center justify-content-start gap-2">
                <img
                    src={`${API_URL}${match.awayTeam.flagImagePath}`}
                    alt={match.awayTeam.name}
                    style={{ width: '40px', height: 'auto' }}
                />
                <span>{match.awayTeam.code}</span>
            </div>

            {/* Hour */}
            <div className="text-end">
                {formattedTime}
            </div>
        </li>
    );
};

export default MatchPreview;