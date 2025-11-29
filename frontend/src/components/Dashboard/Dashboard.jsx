import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  mockUser,
  mockStats,
  mockRides,
  mockDriverRides,
  mockReservations,
  mockTestimonials,
  formatDate
} from '../../data/mockData';
import { Modal, Alert } from '../shared';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [currentUser] = useState(mockUser);
  const [availableRides] = useState(mockRides);
  const [driverRides, setDriverRides] = useState(mockDriverRides);
  const [userReservations, setUserReservations] = useState(mockReservations);
  
  // Search state
  const [searchDeparture, setSearchDeparture] = useState('');
  const [searchArrival, setSearchArrival] = useState('');
  const [searchDate, setSearchDate] = useState('');
  
  // Modal states
  const [showRideDetails, setShowRideDetails] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [placesToReserve, setPlacesToReserve] = useState(1);

  // Alert/Confirmation modal states
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'success', // 'success', 'error', 'warning', 'confirm'
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });

  // Custom alert function
  const showCustomAlert = (config) => {
    setAlertConfig(config);
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
    if (alertConfig.onCancel) {
      alertConfig.onCancel();
    }
  };

  const confirmAlert = () => {
    setShowAlert(false);
    if (alertConfig.onConfirm) {
      alertConfig.onConfirm();
    }
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  // Date helpers
  const getDay = (date) => new Date(date).getDate();
  const getMonthName = (date) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months[new Date(date).getMonth()];
  };

  const formatReservationDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  // Actions
  const searchRides = () => {
    alert(`Recherche: ${searchDeparture} → ${searchArrival} le ${searchDate || 'toute date'}`);
  };

  const proposeRide = () => {
    navigate('/trajets/nouveau');
  };

  const editRide = (ride) => {
    navigate(`/trajets/modifier/${ride.id}`);
  };

  const deleteRide = (ride) => {
    showCustomAlert({
      type: 'confirm',
      title: 'Supprimer le trajet',
      message: 'Êtes-vous sûr de vouloir supprimer ce trajet ?',
      onConfirm: () => {
        setDriverRides(prev => prev.filter(r => r.id !== ride.id));
        showCustomAlert({
          type: 'success',
          title: 'Trajet supprimé',
          message: 'Le trajet a été supprimé avec succès.',
          onConfirm: null
        });
      }
    });
  };

  const showRideDetail = (ride) => {
    setSelectedRide(ride);
    setShowRideDetails(true);
  };

  const closeRideDetail = () => {
    setShowRideDetails(false);
    setSelectedRide(null);
  };

  const reserveRide = (ride) => {
    setSelectedRide(ride);
    setPlacesToReserve(1);
    setShowRideDetails(false);
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setSelectedRide(null);
    setPlacesToReserve(1);
  };

  const confirmReservation = () => {
    if (selectedRide) {
      const newReservation = {
        ...selectedRide,
        reservationId: `r${Date.now()}`,
        places: placesToReserve,
        reservationDate: new Date()
      };
      setUserReservations(prev => [...prev, newReservation]);
      closeConfirmation();
      showCustomAlert({
        type: 'success',
        title: 'Réservation confirmée',
        message: 'Votre réservation a été confirmée avec succès !',
        onConfirm: null
      });
    }
  };

  const cancelReservation = (reservation) => {
    showCustomAlert({
      type: 'confirm',
      title: 'Annuler la réservation',
      message: 'Êtes-vous sûr de vouloir annuler cette réservation ?',
      onConfirm: () => {
        setUserReservations(prev => prev.filter(r => r.reservationId !== reservation.reservationId));
        showCustomAlert({
          type: 'success',
          title: 'Réservation annulée',
          message: 'Votre réservation a été annulée avec succès.',
          onConfirm: null
        });
      }
    });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Bienvenue sur <span className="brand-name">SmartRide</span></h1>
            {currentUser ? (
              <p>{getGreeting()} <strong>{currentUser.username}</strong></p>
            ) : (
              <p>Votre plateforme de covoiturage écologique et économique</p>
            )}
          </div>
          <div className="header-illustration">
            <i className="fas fa-car-side"></i>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon eco">
            <i className="fas fa-leaf"></i>
          </div>
          <div className="stat-info">
            <h3>Écologie</h3>
            <p className="stat-value">{mockStats.co2Saved} kg</p>
            <p className="stat-label">CO₂ économisé</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon users">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>Communauté</h3>
            <p className="stat-value">{mockStats.activeUsers}+</p>
            <p className="stat-label">Utilisateurs actifs</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon routes">
            <i className="fas fa-route"></i>
          </div>
          <div className="stat-info">
            <h3>Trajets</h3>
            <p className="stat-value">{mockStats.sharedRides}+</p>
            <p className="stat-label">Trajets partagés</p>
          </div>
        </div>
      </div>

      {/* User Dashboard */}
      {currentUser && (
        <div className="user-dashboard">
          {/* Profile Section */}
          <div className="dashboard-section user-info">
            <div className="section-header">
              <h2><i className="fas fa-user-circle"></i> Profil</h2>
              <button className="btn-edit"><i className="fas fa-pen"></i> Modifier</button>
            </div>
            <div className="section-content">
              <div className="profile-card">
                <div className="profile-avatar">
                  <i className="fas fa-user"></i>
                  <span className={`status-badge ${currentUser.role === 'conducteur' ? 'driver' : ''}`}>
                    {currentUser.role === 'conducteur' ? 'Conducteur' : 'Passager'}
                  </span>
                </div>
                <div className="profile-info">
                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-id-card"></i> Nom d'utilisateur</span>
                    <span className="info-value">{currentUser.username}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-envelope"></i> Email</span>
                    <span className="info-value">{currentUser.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-star"></i> Note</span>
                    <span className="info-value">
                      <i className="fas fa-star star-filled"></i>
                      <i className="fas fa-star star-filled"></i>
                      <i className="fas fa-star star-filled"></i>
                      <i className="fas fa-star star-filled"></i>
                      <i className="fas fa-star-half-alt star-filled"></i>
                      <span className="rating-text">4.5/5</span>
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label"><i className="fas fa-check-circle"></i> Compte vérifié</span>
                    <span className="info-value verification-badge">
                      <i className="fas fa-check-circle verified-icon"></i> Vérifié
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="search-box">
            <div className="search-form">
              <div className="form-group">
                <label><i className="fas fa-map-marker-alt departure-icon"></i> Départ</label>
                <input 
                  type="text" 
                  value={searchDeparture}
                  onChange={(e) => setSearchDeparture(e.target.value)}
                  placeholder="Ville de départ" 
                  className="search-input"
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-map-marker-alt arrival-icon"></i> Arrivée</label>
                <input 
                  type="text" 
                  value={searchArrival}
                  onChange={(e) => setSearchArrival(e.target.value)}
                  placeholder="Ville d'arrivée" 
                  className="search-input"
                />
              </div>
              <div className="form-group">
                <label><i className="fas fa-calendar-alt"></i> Date</label>
                <input 
                  type="date" 
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="search-input"
                />
              </div>
              <button className="search-button" onClick={searchRides}>
                <i className="fas fa-search"></i> Rechercher
              </button>
            </div>
          </div>

          {/* Conducteur View */}
          {currentUser.role === 'conducteur' ? (
            <div className="dashboard-section">
              <div className="section-header">
                <h2><i className="fas fa-car"></i> Vos trajets proposés</h2>
                <button className="btn-primary" onClick={proposeRide}>
                  <i className="fas fa-plus"></i> Proposer un trajet
                </button>
              </div>
              <div className="section-content">
                <div className="rides-grid">
                  {driverRides.map(ride => (
                    <div key={ride.id} className="ride-card">
                      <div className="ride-date">
                        <span className="day">{getDay(ride.date)}</span>
                        <span className="month">{getMonthName(ride.date)}</span>
                      </div>
                      <div className="ride-details">
                        <div className="ride-route">
                          <span className="departure">{ride.departure}</span>
                          <i className="fas fa-long-arrow-alt-right"></i>
                          <span className="arrival">{ride.arrival}</span>
                        </div>
                        <div className="ride-time">
                          <i className="far fa-clock"></i> Départ à {ride.time}
                        </div>
                        <div className="ride-price">
                          <i className="fas fa-tag"></i> {ride.price}DT par personne
                        </div>
                        <div className="ride-seats">
                          <i className="fas fa-users"></i> {ride.availableSeats} place{ride.availableSeats > 1 ? 's' : ''} disponible{ride.availableSeats > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="ride-actions">
                        <button className="btn-edit-small" onClick={() => editRide(ride)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-delete-small" onClick={() => deleteRide(ride)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="add-ride-card" onClick={proposeRide}>
                    <div className="add-ride-content">
                      <i className="fas fa-plus-circle"></i>
                      <span>Proposer un nouveau trajet</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Passager View - Available Rides */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h2><i className="fas fa-search"></i> Trajets disponibles</h2>
                </div>
                <div className="section-content">
                  <div className="rides-grid">
                    {availableRides.length === 0 ? (
                      <div className="no-rides-message">
                        <i className="fas fa-info-circle"></i>
                        <p>Aucun trajet disponible pour vos critères de recherche.</p>
                      </div>
                    ) : (
                      availableRides.map(ride => (
                        <div key={ride.id} className="ride-card clickable" onClick={() => showRideDetail(ride)}>
                          <div className="ride-date">
                            <span className="day">{getDay(ride.date)}</span>
                            <span className="month">{getMonthName(ride.date)}</span>
                          </div>
                          <div className="ride-details">
                            <div className="ride-route">
                              <span className="departure">{ride.departure}</span>
                              <i className="fas fa-long-arrow-alt-right"></i>
                              <span className="arrival">{ride.arrival}</span>
                            </div>
                            <div className="ride-time">
                              <i className="far fa-clock"></i> Départ à {ride.time}
                            </div>
                            <div className="driver-info">
                              <span><i className="fas fa-user-circle"></i> {ride.driverName}</span>
                              <div className="driver-rating">
                                <i className="fas fa-star"></i> {ride.driverRating}
                              </div>
                            </div>
                            <div className="ride-price">
                              <i className="fas fa-tag"></i> {ride.price}DT par personne
                            </div>
                          </div>
                          <div className="ride-actions" onClick={(e) => e.stopPropagation()}>
                            <button className="btn-reserve" onClick={() => reserveRide(ride)}>
                              Réserver
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Passager View - Reservations */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h2><i className="fas fa-ticket-alt"></i> Mes réservations</h2>
                </div>
                <div className="section-content">
                  <div className="rides-grid">
                    {userReservations.length === 0 ? (
                      <div className="no-reservations-message">
                        <i className="fas fa-info-circle"></i>
                        <p>Vous n'avez pas encore de réservations. Recherchez un trajet et réservez votre place !</p>
                      </div>
                    ) : (
                      userReservations.map(reservation => (
                        <div key={reservation.reservationId} className="ride-card">
                          <div className="ride-date">
                            <span className="day">{getDay(reservation.date)}</span>
                            <span className="month">{getMonthName(reservation.date)}</span>
                          </div>
                          <div className="ride-details">
                            <div className="ride-route">
                              <span className="departure">{reservation.departure}</span>
                              <i className="fas fa-long-arrow-alt-right"></i>
                              <span className="arrival">{reservation.arrival}</span>
                            </div>
                            <div className="ride-time">
                              <i className="far fa-clock"></i> Départ à {reservation.time}
                            </div>
                            <div className="driver-info">
                              <i className="fas fa-user-circle"></i> {reservation.driverName}
                            </div>
                            <div className="reservation-info">
                              <i className="fas fa-users"></i> {reservation.places} place(s) réservée(s)
                              <span className="reservation-date">le {formatReservationDate(reservation.reservationDate)}</span>
                            </div>
                          </div>
                          <div className="ride-actions">
                            <button className="btn-cancel-reservation" onClick={() => cancelReservation(reservation)}>
                              <i className="fas fa-times"></i> Annuler
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Features Section */}
      <div className="dashboard-features">
        <h2 className="features-title">Pourquoi choisir SmartRide ?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-hand-holding-usd"></i>
            </div>
            <h3>Économique</h3>
            <p>Partagez les frais de transport et économisez sur vos déplacements quotidiens.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-leaf"></i>
            </div>
            <h3>Écologique</h3>
            <p>Réduisez votre empreinte carbone en partageant votre trajet avec d'autres voyageurs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Sécurisé</h3>
            <p>Profitez d'un système de vérification des profils et d'évaluations entre utilisateurs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Convivial</h3>
            <p>Rencontrez de nouvelles personnes et rendez vos trajets plus agréables.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <h2 className="testimonials-title">Ce que disent nos utilisateurs</h2>
        <div className="testimonials-grid">
          {mockTestimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <i className="fas fa-quote-left"></i>
                <p>{testimonial.comment}</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <div className="author-rating">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fas ${i < testimonial.rating ? 'fa-star' : 'fa-star-half-alt'}`}
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ride Detail Modal */}
      {showRideDetails && selectedRide && (
        <div className="ride-detail-modal">
          <div className="modal-overlay" onClick={closeRideDetail}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Détails du trajet</h2>
              <button className="modal-close-btn" onClick={closeRideDetail}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="ride-detail-route">
                <div className="route-point departure">
                  <div className="point-icon">
                    <i className="fas fa-map-marker-alt departure-icon"></i>
                  </div>
                  <div className="point-info">
                    <h3>Départ</h3>
                    <p>{selectedRide.departure}</p>
                  </div>
                </div>
                <div className="route-line">
                  <i className="fas fa-long-arrow-alt-down"></i>
                </div>
                <div className="route-point arrival">
                  <div className="point-icon">
                    <i className="fas fa-map-marker-alt arrival-icon"></i>
                  </div>
                  <div className="point-info">
                    <h3>Arrivée</h3>
                    <p>{selectedRide.arrival}</p>
                  </div>
                </div>
              </div>

              <div className="ride-detail-info">
                <div className="info-item">
                  <div className="info-icon">
                    <i className="far fa-calendar-alt"></i>
                  </div>
                  <div className="info-text">
                    <h4>Date</h4>
                    <p>{formatDate(selectedRide.date)}</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">
                    <i className="far fa-clock"></i>
                  </div>
                  <div className="info-text">
                    <h4>Heure</h4>
                    <p>{selectedRide.time}</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="info-text">
                    <h4>Conducteur</h4>
                    <p>
                      {selectedRide.driverName}
                      <span className="driver-rating">
                        <i className="fas fa-star"></i> {selectedRide.driverRating}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="info-text">
                    <h4>Places disponibles</h4>
                    <p>{selectedRide.availableSeats} place(s)</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">
                    <i className="fas fa-tag"></i>
                  </div>
                  <div className="info-text">
                    <h4>Prix</h4>
                    <p>{selectedRide.price}DT par personne</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeRideDetail}>Annuler</button>
              <button className="btn-reserve-large" onClick={() => reserveRide(selectedRide)}>
                Réserver ce trajet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && selectedRide && (
        <div className="confirmation-modal">
          <div className="modal-overlay" onClick={closeConfirmation}></div>
          <div className="modal-content confirmation-content">
            <div className="modal-header">
              <h2>Confirmer votre réservation</h2>
              <button className="modal-close-btn" onClick={closeConfirmation}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="confirmation-info">
                <p>Vous êtes sur le point de réserver un trajet :</p>
                <div className="confirmation-route">
                  <i className="fas fa-map-marker-alt departure-icon"></i> {selectedRide.departure}
                  <i className="fas fa-long-arrow-alt-right"></i>
                  <i className="fas fa-map-marker-alt arrival-icon"></i> {selectedRide.arrival}
                </div>
                <div className="confirmation-date">
                  <i className="far fa-calendar-alt"></i> {formatDate(selectedRide.date)} à {selectedRide.time}
                </div>
                <div className="confirmation-price">
                  <i className="fas fa-tag"></i> {selectedRide.price}DT par personne
                </div>
              </div>

              <div className="places-selection">
                <label htmlFor="places-input">Nombre de places à réserver :</label>
                <div className="places-control">
                  <button
                    disabled={placesToReserve <= 1}
                    onClick={() => setPlacesToReserve(prev => prev - 1)}
                    className="btn-places"
                  >-</button>
                  <input
                    type="number"
                    value={placesToReserve}
                    onChange={(e) => setPlacesToReserve(Math.min(selectedRide.availableSeats, Math.max(1, parseInt(e.target.value) || 1)))}
                    id="places-input"
                    max={selectedRide.availableSeats}
                    min="1"
                    className="places-input"
                  />
                  <button
                    disabled={placesToReserve >= selectedRide.availableSeats}
                    onClick={() => setPlacesToReserve(prev => prev + 1)}
                    className="btn-places"
                  >+</button>
                </div>
                {placesToReserve > 1 && (
                  <p className="places-info">
                    Total : {placesToReserve * selectedRide.price}DT
                  </p>
                )}
                <p className="places-availability">
                  {selectedRide.availableSeats} place(s) disponible(s)
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeConfirmation}>Annuler</button>
              <button
                className="btn-confirm"
                onClick={confirmReservation}
                disabled={placesToReserve < 1 || placesToReserve > selectedRide.availableSeats}
              >
                Confirmer la réservation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <Alert
        isOpen={showAlert}
        onClose={closeAlert}
        onConfirm={confirmAlert}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
      />
    </div>
  );
}

export default Dashboard;
