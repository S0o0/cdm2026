import { useState, useEffect } from 'react';
import MatchPreview from './MatchPreview';
import type { Match } from '../types/Match';
import { MatchService } from "../services/MatchService";
import { Link } from 'react-router-dom';
import { GroupService } from '../services/GroupService';
import type { Group } from '../types/Group';

interface MatchesCarouselProps {
    matches?: Match[];
    teamName?: string;
}

const MatchesCarousel: React.FC<MatchesCarouselProps> = ({ matches: initialMatches, teamName }) => {
    const [matches, setMatches] = useState<Match[]>(initialMatches || []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(!initialMatches);
    const [groupNames, setGroupNames] = useState<Record<number, string>>({});

    // Récupération des groupes pour les noms
    useEffect(() => {
        GroupService.getGroups()
            .then((groups: Group[]) => {
                const mapping: Record<number, string> = {};
                groups.forEach(g => (mapping[g.id] = g.name));
                setGroupNames(mapping);
            })
            .catch(err => console.error("❌ Erreur chargement groupes :", err));
    }, []);

    useEffect(() => {
        if (!initialMatches) {
            MatchService.getMatches()
                .then(data => setMatches(data))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [initialMatches]);


    const filteredMatches = teamName
        ? matches.filter(match =>
            match.homeTeam && match.awayTeam &&
            match.homeTeam.name.toLowerCase().includes(teamName.toLowerCase()) ||
            match.awayTeam.name.toLowerCase().includes(teamName.toLowerCase())
        )
        : matches;

    const next = () => setCurrentIndex(prev => (prev + 4 >= filteredMatches.length ? 0 : prev + 4));
    const prev = () => setCurrentIndex(prev => (prev - 4 < 0 ? Math.max(filteredMatches.length - 4, 0) : prev - 4));

    if (loading) return <p>Chargement des matchs...</p>;
    if (filteredMatches.length === 0) return <p>Aucun match disponible</p>;

    const visibleMatches = filteredMatches.slice(currentIndex, currentIndex + 4);

    return (
        <div className="position-relative">
            <button
                className="btn btn-dark position-absolute top-50 start-0 translate-middle-y rounded-0 shadow-sm border-0"
                onClick={prev}
                style={{ zIndex: 1}}
            >
                ◀
            </button>

            <div className='overflow-auto ps-5 pe-5'>
                <ul className="list-group list-group-horizontal gap-2 flex-nowrap">
                    {visibleMatches.map(match => (
                        <Link
                            key={match.id}
                            to={`/matches/${match.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <MatchPreview match={match} groupNames={groupNames} showDate />
                        </Link>
                    ))}
                </ul>
            </div>

            <button
                className="btn btn-dark position-absolute top-50 end-0 translate-middle-y rounded-0 shadow-sm border-0"
                onClick={next}
                style={{ zIndex: 1}}
            >
                ▶
            </button>
        </div>
    );
};

export default MatchesCarousel;