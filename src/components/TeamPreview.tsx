import type { Team } from '../types/Team';
import { teamImages } from "../components/TeamImages";
import { translate } from '../utils/translate';


interface TeamPreviewProps {
    team: Team;
}

const TeamPreview: React.FC<TeamPreviewProps> = ({ team }) => {
    return (
        <div className="col-12 col-md-4 mb-4 pt-4 justify-content-center d-flex">
            <div className="card text-white border-0">
                <div className="position-relative">
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
                    <div className="card-img-overlay d-flex justify-content-start align-items-end p-2">
                        <h5 className="card-title rounded px-3 fw-bold">{translate(team.name)}</h5>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamPreview;