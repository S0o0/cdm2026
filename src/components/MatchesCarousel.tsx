import { useState, useEffect } from 'react';
import MatchPreview from './MatchPreview';
import type { Match } from '../types/Match';
import { getMatches } from "../services/MatchesServices";
import { Link } from 'react-router-dom';

const MatchesCarousel: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMatches()
            .then(data => {
                setMatches(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const next = () => setCurrentIndex(prev => (prev + 4 >= matches.length ? 0 : prev + 4));
    const prev = () => setCurrentIndex(prev => (prev - 4 < 0 ? Math.max(matches.length - 4, 0) : prev - 4));

    if (loading) return <p>Chargement des matchs...</p>;
    if (matches.length === 0) return <p>Aucun match disponible</p>;

    const visibleMatches = matches.slice(currentIndex, currentIndex + 4);

    return (
        <div className="position-relative">
            <button
                className="btn btn-dark position-absolute top-50 start-0 translate-middle-y"
                onClick={prev}
                style={{ zIndex: 1 }}
            >
                ◀
            </button>

            <div className='overflow-auto ps-5'>
                <ul className="list-group list-group-horizontal gap-2 flex-nowrap">
                    {visibleMatches.map(match => (
                        <Link
                            key={match.id}
                            to={`/matches/${match.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <MatchPreview match={match} />
                        </Link>
                    ))}
                </ul>
            </div>

            <button
                className="btn btn-dark position-absolute top-50 end-0 translate-middle-y"
                onClick={next}
                style={{ zIndex: 1 }}
            >
                ▶
            </button>
        </div>
    );
};

export default MatchesCarousel;