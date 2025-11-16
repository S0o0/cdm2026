import React, { useState, useEffect } from 'react';
import StadiumPreview from './StadiumPreview';
import type { Stadium } from '../../types/Stadium';
import { StadiumService } from "../../services/StadiumService";
import { Link } from 'react-router-dom';
import { translate } from "../../utils/translate"; // import de la fonction de traduction des pays et continents

const StadiumsMaster: React.FC = () => {
  // État pour stocker la liste des stades récupérés
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);
  // État pour stocker la liste filtrée des stades selon le pays sélectionné
  const [filteredStadiums, setFilteredStadiums] = useState<Stadium[]>([]);
  // État pour stocker le pays sélectionné dans le filtre (valeur par défaut "Tous")
  const [selectedCountry, setSelectedCountry] = useState<string>('Tous');

  // Chargement des informations des stades
  useEffect(() => {
    StadiumService.getStadiums()
      .then(setStadiums)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filtre des stades en fonction du pays sélectionné
  useEffect(() => {
    if (selectedCountry === 'Tous') {
      // Si "Tous" est sélectionné, on affiche tous les stades
      setFilteredStadiums(stadiums);
    } else {
      // Sinon, on filtre les stades dont le pays traduit correspond au pays sélectionné
      setFilteredStadiums(
        stadiums.filter(stadium => translate(stadium.country) === selectedCountry)
      );
    }
  }, [stadiums, selectedCountry]);

  // Affichage pendant le chargement des données
  if (loading) return <p>Chargement des stades...</p>;
  // Message affiché si aucune donnée n'est disponible
  if (stadiums.length === 0) return <p>Aucune équipe disponible</p>;

  // Traduction des pays
  const countrys = Array.from(new Set(stadiums.map(s => s.country)))
    .map(en => ({ en, fr: translate(en) }));

  return (
    <div className="container mt-5">
      {/* Section de filtrage par pays */}
      <div className="mb-4">
        <label className="me-2 fw-bold">Filtrer par pays :</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="Tous">Tous</option>
          {/* Options générées dynamiquement à partir des pays traduits */}
          {countrys.map(country => (
            <option key={country.en} value={country.fr}>
              {country.fr}
            </option>
          ))}
        </select>
      </div>
      {/* Affichage des stades filtrés sous forme de grille */}
      <div className="row">
        {filteredStadiums.map(stadium => (
          <div key={stadium.id} className="col-md-4 mb-3 d-flex justify-content-center">
            {/* Lien vers la page détaillée du stade */}
            <Link to={`/stadiums/${stadium.id}`}>
              <StadiumPreview stadium={stadium} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StadiumsMaster;