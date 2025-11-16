import { useState, useEffect } from 'react';
import MatchPreview from './MatchPreview';
import type { Match } from '../../types/Match';
import { MatchService } from "../../services/MatchService";
import { Link } from 'react-router-dom';
import { GroupService } from '../../services/GroupService';
import type { Group } from '../../types/Group';

// Propriétés du composant : liste de matchs initiale et optionnellement un nom d’équipe pour filtrer
interface MatchesCarouselProps {
    matches?: Match[];
    teamName?: string;
}

// Composant affichant un carousel de matchs avec navigation et filtrage par équipe
const MatchesCarousel: React.FC<MatchesCarouselProps> = ({ matches: initialMatches, teamName }) => {
    // Liste des matchs affichés dans le carrousel
    const [matches, setMatches] = useState<Match[]>(initialMatches || []);
    // Index du premier match actuellement visible dans le carrousel
    const [currentIndex, setCurrentIndex] = useState(0);
    // Indique si les données des matchs sont en cours de chargement
    const [loading, setLoading] = useState(!initialMatches);
    // Dictionnaire associant l’ID d’un groupe à son nom pour l’affichage
    const [groupNames, setGroupNames] = useState<Record<number, string>>({});

    // Chargement des groupes pour récupérer leurs noms et pouvoir les afficher
    useEffect(() => {
        GroupService.getGroups()
            .then((groups: Group[]) => {
                const mapping: Record<number, string> = {};
                groups.forEach(g => (mapping[g.id] = g.name));
                setGroupNames(mapping);
            })
            .catch(err => console.error("❌ Erreur chargement groupes :", err));
    }, []);

    // Chargement des matchs depuis l’API si aucun match initial n’est fourni
    useEffect(() => {
        if (!initialMatches) {
            MatchService.getMatches()
                .then(data => setMatches(data))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [initialMatches]);


    // Filtrage des matchs selon le nom de l’équipe si un filtre est fourni
    const filteredMatches = teamName
        ? matches.filter(match =>
            match.homeTeam && match.awayTeam &&
            match.homeTeam.name.toLowerCase().includes(teamName.toLowerCase()) ||
            match.awayTeam.name.toLowerCase().includes(teamName.toLowerCase())
        )
        : matches;

    // Fonctions pour naviguer dans le carrousel (suivant/précédent)
    const next = () => setCurrentIndex(prev => (prev + 4 >= filteredMatches.length ? 0 : prev + 4));
    const prev = () => setCurrentIndex(prev => (prev - 4 < 0 ? Math.max(filteredMatches.length - 4, 0) : prev - 4));

    // Affichage d’un message pendant le chargement des matchs
    if (loading) return <p>Chargement des matchs...</p>;
    // Message affiché si aucun match ne correspond au filtre
    if (filteredMatches.length === 0) return <p>Aucun match disponible</p>;

    // Sélection des matchs visibles dans le carrousel
    const visibleMatches = filteredMatches.slice(currentIndex, currentIndex + 4);

    return (
        <>  {/*Animation de fondu*/}
            {/* Styles et animation de fondu pour le carrousel */}
            <style>
                {`
                .fade-carousel {
                    animation: fadeIn 0.4s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}
            </style>
            {/* Structure principale du carrousel avec boutons de navigation et affichage des matchs */}
            <div className="position-relative">
                <button
                    className="btn btn-dark position-absolute top-50 start-0 translate-middle-y rounded-0 shadow-sm border-0"
                    onClick={prev}
                    style={{ zIndex: 1 }}
                >
                    ◀
                </button>

                <div className='overflow-auto ps-5 pe-5'>
                    <ul
                        key={currentIndex}
                        className="list-group list-group-horizontal gap-2 flex-nowrap fade-carousel"
                    >
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
                    style={{ zIndex: 1 }}
                >
                    ▶
                </button>
            </div>
        </>
    );
};

export default MatchesCarousel;