import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockDriverRides } from '../../data/mockData';
import { Alert } from '../shared';
import './TrajetForm.css';

// Helper function to get initial trajet data
const getInitialTrajet = (id) => {
  if (id) {
    const existingTrajet = mockDriverRides.find(r => r.id === parseInt(id));
    if (existingTrajet) {
      return {
        depart: existingTrajet.departure,
        destination: existingTrajet.arrival,
        dateDepart: existingTrajet.date,
        heure: existingTrajet.time,
        placesDisponibles: existingTrajet.seats,
        prix: existingTrajet.price,
        description: existingTrajet.description || ''
      };
    }
  }
  return {
    depart: '',
    destination: '',
    dateDepart: '',
    heure: '',
    placesDisponibles: 1,
    prix: '',
    description: ''
  };
};

function TrajetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [trajet, setTrajet] = useState(() => getInitialTrajet(id));
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'success',
    title: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrajet(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = [];

    if (!trajet.depart.trim()) {
      newErrors.push('Le lieu de départ est obligatoire');
    }
    if (!trajet.destination.trim()) {
      newErrors.push('La destination est obligatoire');
    }
    if (!trajet.dateDepart) {
      newErrors.push('La date de départ est obligatoire');
    }
    if (!trajet.heure) {
      newErrors.push("L'heure de départ est obligatoire");
    }
    if (!trajet.placesDisponibles || trajet.placesDisponibles < 1 || trajet.placesDisponibles > 6) {
      newErrors.push('Le nombre de places doit être entre 1 et 6');
    }
    if (!trajet.prix || trajet.prix <= 0) {
      newErrors.push('Le prix doit être supérieur à 0');
    }

    // Check if date is not in the past
    const selectedDate = new Date(trajet.dateDepart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.push('La date de départ ne peut pas être dans le passé');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const showCustomAlert = (type, title, message) => {
    setAlertConfig({ type, title, message });
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
    if (alertConfig.type === 'success') {
      navigate('/dashboard');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      if (isEditMode) {
        showCustomAlert(
          'success',
          'Trajet modifié !',
          'Votre trajet a été mis à jour avec succès.'
        );
      } else {
        showCustomAlert(
          'success',
          'Trajet créé !',
          'Votre trajet a été publié avec succès. Les passagers peuvent maintenant le réserver.'
        );
      }
    }, 1500);
  };

  const cancel = () => {
    navigate('/dashboard');
  };

  // Get today's date for min attribute
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="trajet-form-page">
      <div className="trajet-form-container">
        <h2>{isEditMode ? 'Modifier un trajet' : 'Proposer un nouveau trajet'}</h2>

        {errors.length > 0 && (
          <div className="errors-container">
            {errors.map((error, index) => (
              <div key={index} className="error-message">
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="depart">
              <i className="fas fa-map-marker-alt departure-icon"></i> Lieu de départ
            </label>
            <input
              type="text"
              id="depart"
              name="depart"
              value={trajet.depart}
              onChange={handleChange}
              placeholder="Ex: Tunis, Gare de Tunis"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="destination">
              <i className="fas fa-map-marker-alt arrival-icon"></i> Destination
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={trajet.destination}
              onChange={handleChange}
              placeholder="Ex: Sousse, Centre-ville"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateDepart">
                <i className="fas fa-calendar-alt"></i> Date de départ
              </label>
              <input
                type="date"
                id="dateDepart"
                name="dateDepart"
                value={trajet.dateDepart}
                onChange={handleChange}
                min={getTodayDate()}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="heure">
                <i className="fas fa-clock"></i> Heure
              </label>
              <input
                type="time"
                id="heure"
                name="heure"
                value={trajet.heure}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="placesDisponibles">
                <i className="fas fa-users"></i> Nombre de places
              </label>
              <input
                type="number"
                id="placesDisponibles"
                name="placesDisponibles"
                value={trajet.placesDisponibles}
                onChange={handleChange}
                min="1"
                max="6"
                required
              />
              <small className="helper-text">Entre 1 et 6 places disponibles</small>
            </div>

            <div className="form-group">
              <label htmlFor="prix">
                <i className="fas fa-tag"></i> Prix par personne (DT)
              </label>
              <input
                type="number"
                id="prix"
                name="prix"
                value={trajet.prix}
                onChange={handleChange}
                min="1"
                step="0.5"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              <i className="fas fa-info-circle"></i> Description (optionnelle)
            </label>
            <textarea
              id="description"
              name="description"
              value={trajet.description}
              onChange={handleChange}
              placeholder="Informations supplémentaires, conditions particulières..."
              rows="3"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={cancel}>
              <i className="fas fa-times"></i> Annuler
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              <i className={isLoading ? "fas fa-spinner fa-spin" : "fas fa-save"}></i>
              {isLoading ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Créer le trajet')}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner">
              <i className="fas fa-spinner fa-spin"></i>
            </div>
          </div>
        )}
      </div>

      {/* Alert Modal */}
      <Alert
        isOpen={showAlert}
        onClose={closeAlert}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
      />
    </div>
  );
}

export default TrajetForm;
