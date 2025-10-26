import { useState, useEffect } from 'react';
import MatchPreview from './MatchPreview';
import type { Match } from '../types/Match';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const MatchesCarousel: React.FC = () => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/matches`)
            .then(res => res.json())
            .then(data => {
                setMatches(data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const next = () => setCurrentIndex(prev => (prev + 4 >= matches.length ? 0 : prev + 4));
    const prev = () => setCurrentIndex(prev => (prev - 4 < 0 ? Math.max(matches.length - 4, 0) : prev - 4));

    if (loading) return <p>Chargement des matchs...</p>;
    if (matches.length === 0) return <p>Aucun match disponible</p>;

    const visibleMatches = matches.slice(currentIndex, currentIndex + 4);

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-dark" onClick={prev}>◀</button>
                <button className="btn btn-dark" onClick={next}>▶</button>
            </div>
            <div className='overflow-auto'>
                <ul className="list-group list-group-horizontal gap-2 flex-nowrap">
                    {visibleMatches.map(match => (
                        <Link to={`/matches/${match.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}>
                            <MatchPreview match={match} />
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MatchesCarousel;