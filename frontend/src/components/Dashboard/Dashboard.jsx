import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../shared';
import './Dashboard.css';

const getDay = (date) => new Date(date).getDate();
const getMonthName = (date) => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  return months[new Date(date).getMonth()];
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

const formatTime = (date) => {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const formatReservationDate = (date) => new Date(date).toLocaleDateString('fr-FR');

function Dashboard() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [availableRides, setAvailableRides] = useState([]);
  const [driverRides, setDriverRides] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [statsTrajets, setStatsTrajets] = useState([]);

  const [searchDeparture, setSearchDeparture] = useState('');
  const [searchArrival, setSearchArrival] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const [showRideDetails, setShowRideDetails] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [placesToReserve, setPlacesToReserve] = useState(1);

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'success',
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });

  const [loading, setLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

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

  const handleAuthError = (err) => {
    setError(err.message);
    if (err.status === 401) {
      logout();
    }
  };

  const normalizeRide = (trajet) => {
    const availableSeats = Math.max(
      0,
      (trajet.placesDisponibles || 0) - (trajet.placesReservees || 0)
    );
    return {
      id: trajet._id,
      departure: trajet.depart,
      arrival: trajet.destination,
      date: trajet.dateDepart,
      time: formatTime(trajet.dateDepart),
      price: trajet.prix,
      availableSeats,
      driverName: trajet.conducteurNom,
      driverId: trajet.conducteurId,
      reservations: trajet.reservations || [],
      description: trajet.description
    };
  };

  const loadAvailableRides = async (filters = {}, updateStats = false) => {
    const res = await apiRequest('/trajets', { token, params: filters });
    const normalized = res.trajets.map(normalizeRide);
    setAvailableRides(normalized);
    if (updateStats) {
      setStatsTrajets(res.trajets);
    }
  };

  const loadDriverRides = async () => {
    const res = await apiRequest('/trajets/mes-trajets', { token });
    setDriverRides(res.trajets.map(normalizeRide));
  };

  const loadReservations = async () => {
    const res = await apiRequest('/trajets/mes-reservations', { token });
    const reservations = res.trajets.flatMap((trajet) => {
      const targeted = (trajet.reservations || []).filter(
        (r) => String(r.passagerId) === String(user?._id)
      );
      return targeted.map((reservation) => ({
        reservationId: reservation._id,
        trajetId: trajet._id,
        departure: trajet.depart,
        arrival: trajet.destination,
        date: trajet.dateDepart,
        time: formatTime(trajet.dateDepart),
        price: trajet.prix,
        driverName: trajet.conducteurNom,
        places: reservation.places,
        reservationDate: reservation.dateReservation,
        availableSeats: Math.max(
          0,
          (trajet.placesDisponibles || 0) - (trajet.placesReservees || 0)
        )
      }));
    });
    setUserReservations(reservations);
  };

  const loadDashboard = async () => {
    if (!token || !user) return;
    setLoading(true);
    setError('');
    try {
      await loadAvailableRides({}, true);
      if (user.role === 'conducteur') {
        await loadDriverRides();
      } else {
        await loadReservations();
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.role]);

  const searchRides = async () => {
    setIsBusy(true);
    try {
      const filters = {
        depart: searchDeparture.trim(),
        destination: searchArrival.trim(),
        dateDepart: searchDate
      };
      await loadAvailableRides(filters, false);
    } catch (err) {
      handleAuthError(err);
    } finally {
      setIsBusy(false);
    }
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
      onConfirm: async () => {
        try {
          await apiRequest(`/trajets/${ride.id}`, { method: 'DELETE', token });
          setDriverRides((prev) => prev.filter((r) => r.id !== ride.id));
          showCustomAlert({
            type: 'success',
            title: 'Trajet supprimé',
            message: 'Le trajet a été supprimé avec succès.'
          });
        } catch (err) {
          handleAuthError(err);
          showCustomAlert({
            type: 'error',
            title: 'Suppression impossible',
            message: err.message
          });
        }
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

  const confirmReservation = async () => {
    if (!selectedRide) return;
    setIsBusy(true);
    try {
      await apiRequest(`/trajets/${selectedRide.id}/reservations`, {
        method: 'POST',
        data: { places: placesToReserve },
        token
      });
      await Promise.all([loadAvailableRides({}, true), loadReservations()]);
      closeConfirmation();
      showCustomAlert({
        type: 'success',
        title: 'Réservation confirmée',
        message: 'Votre réservation a été confirmée avec succès.'
      });
    } catch (err) {
      handleAuthError(err);
      showCustomAlert({
        type: 'error',
        title: 'Réservation impossible',
        message: err.message
      });
    } finally {
      setIsBusy(false);
    }
  };

  const cancelReservation = (reservation) => {
    showCustomAlert({
      type: 'confirm',
      title: 'Annuler la réservation',
      message: 'Êtes-vous sûr de vouloir annuler cette réservation ?',
      onConfirm: async () => {
        try {
          await apiRequest(
            `/trajets/${reservation.trajetId}/reservations/${reservation.reservationId}`,
            { method: 'DELETE', token }
          );
          await loadReservations();
          showCustomAlert({
            type: 'success',
            title: 'Réservation annulée',
            message: 'Votre réservation a été annulée avec succès.'
          });
        } catch (err) {
          handleAuthError(err);
          showCustomAlert({
            type: 'error',
            title: 'Annulation impossible',
            message: err.message
          });
        }
      }
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const stats = useMemo(() => {
    const source = statsTrajets.length ? statsTrajets : availableRides;
    const uniqueUsers = new Set();
    let totalReservations = 0;
    source.forEach((trajet) => {
      const conductorId = trajet.conducteurId || trajet.driverId;
      if (conductorId) {
        uniqueUsers.add(String(conductorId));
      }
      (trajet.reservations || []).forEach((reservation) => {
        totalReservations += 1;
        uniqueUsers.add(String(reservation.passagerId));
      });
    });
    return {
      sharedRides: source.length,
      activeUsers: uniqueUsers.size,
      co2Saved: totalReservations * 8
    };
  }, [statsTrajets, availableRides]);

  const highlightRides = useMemo(() => {
    const source = availableRides.length ? availableRides : driverRides;
    return source.slice(0, 3);
  }, [availableRides, driverRides]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <div className="welcome-text">
              <h1>
                Bienvenue sur <span className="brand-name">SmartRide</span>
              </h1>
              {user ? (
                <p>
                  {getGreeting()} <strong>{user.username}</strong>
                </p>
              ) : (
                <p>Votre plateforme de covoiturage écologique et économique</p>
              )}
            </div>
            <div className="header-illustration">
              <i className="fas fa-car-side"></i>
            </div>
          </div>
          {error && (
            <div className="error-banner">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-overlay page">
            <div className="spinner"></div>
            <p>Chargement des données depuis l&apos;API...</p>
          </div>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-icon eco">
                  <i className="fas fa-leaf"></i>
                </div>
                <div className="stat-info">
                  <h3>Écologie</h3>
                  <p className="stat-value">{stats.co2Saved} kg</p>
                  <p className="stat-label">CO₂ économisé (estimé)</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon users">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-info">
                  <h3>Communauté</h3>
                  <p className="stat-value">{stats.activeUsers}</p>
                  <p className="stat-label">Profils actifs (API)</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon routes">
                  <i className="fas fa-route"></i>
                </div>
                <div className="stat-info">
                  <h3>Trajets</h3>
                  <p className="stat-value">{stats.sharedRides}</p>
                  <p className="stat-label">Trajets publiés</p>
                </div>
              </div>
            </div>

            {user && (
              <div className="user-dashboard">
                <div className="dashboard-section user-info">
                  <div className="section-header">
                    <h2>
                      <i className="fas fa-user-circle"></i> Profil
                    </h2>
                    <span className="status-badge filled">
                      {user.role === 'conducteur' ? 'Conducteur' : 'Passager'}
                    </span>
                  </div>
                  <div className="section-content">
                    <div className="profile-card">
                      <div className="profile-avatar">
                        <i className="fas fa-user"></i>
                        <span className={`status-badge ${user.role === 'conducteur' ? 'driver' : ''}`}>
                          {user.role === 'conducteur' ? 'Conducteur' : 'Passager'}
                        </span>
                      </div>
                      <div className="profile-info">
                        <div className="info-row">
                          <span className="info-label">
                            <i className="fas fa-id-card"></i> Nom d'utilisateur
                          </span>
                          <span className="info-value">{user.username}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">
                            <i className="fas fa-envelope"></i> Email
                          </span>
                          <span className="info-value">{user.email}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">
                            <i className="fas fa-check-circle"></i> Compte vérifié
                          </span>
                          <span className="info-value verification-badge">
                            <i className="fas fa-check-circle verified-icon"></i> Actif
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="search-box">
                  <div className="search-form">
                    <div className="form-group">
                      <label>
                        <i className="fas fa-map-marker-alt departure-icon"></i> Départ
                      </label>
                      <input
                        type="text"
                        value={searchDeparture}
                        onChange={(e) => setSearchDeparture(e.target.value)}
                        placeholder="Ville de départ"
                        className="search-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <i className="fas fa-map-marker-alt arrival-icon"></i> Arrivée
                      </label>
                      <input
                        type="text"
                        value={searchArrival}
                        onChange={(e) => setSearchArrival(e.target.value)}
                        placeholder="Ville d'arrivée"
                        className="search-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <i className="fas fa-calendar-alt"></i> Date
                      </label>
                      <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    <button className="search-button" onClick={searchRides} disabled={isBusy}>
                      {isBusy ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Recherche...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-search"></i> Rechercher
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {user.role === 'conducteur' ? (
                  <div className="dashboard-section">
                    <div className="section-header">
                      <h2>
                        <i className="fas fa-car"></i> Vos trajets proposés
                      </h2>
                      <button className="btn-primary" onClick={proposeRide}>
                        <i className="fas fa-plus"></i> Proposer un trajet
                      </button>
                    </div>
                    <div className="section-content">
                      <div className="rides-grid">
                        {driverRides.length === 0 ? (
                          <div className="no-rides-message">
                            <i className="fas fa-info-circle"></i>
                            <p>Vous n&apos;avez pas encore publié de trajet.</p>
                          </div>
                        ) : (
                          driverRides.map((ride) => (
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
                                  <i className="fas fa-users"></i> {ride.availableSeats} place
                                  {ride.availableSeats > 1 ? 's' : ''} disponible
                                  {ride.availableSeats > 1 ? 's' : ''}
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
                          ))
                        )}
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
                    <div className="dashboard-section">
                      <div className="section-header">
                        <h2>
                          <i className="fas fa-search"></i> Trajets disponibles
                        </h2>
                      </div>
                      <div className="section-content">
                        <div className="rides-grid">
                          {availableRides.length === 0 ? (
                            <div className="no-rides-message">
                              <i className="fas fa-info-circle"></i>
                              <p>Aucun trajet disponible pour vos critères de recherche.</p>
                            </div>
                          ) : (
                            availableRides.map((ride) => (
                              <div
                                key={ride.id}
                                className="ride-card clickable"
                                onClick={() => showRideDetail(ride)}
                              >
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
                                    <span>
                                      <i className="fas fa-user-circle"></i> {ride.driverName}
                                    </span>
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

                    <div className="dashboard-section">
                      <div className="section-header">
                        <h2>
                          <i className="fas fa-ticket-alt"></i> Mes réservations
                        </h2>
                      </div>
                      <div className="section-content">
                        <div className="rides-grid">
                          {userReservations.length === 0 ? (
                            <div className="no-reservations-message">
                              <i className="fas fa-info-circle"></i>
                              <p>
                                Vous n&apos;avez pas encore de réservations. Recherchez un trajet et
                                réservez votre place !
                              </p>
                            </div>
                          ) : (
                            userReservations.map((reservation) => (
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
                                    <i className="fas fa-users"></i> {reservation.places} place(s)
                                    <span className="reservation-date">
                                      le {formatReservationDate(reservation.reservationDate)}
                                    </span>
                                  </div>
                                </div>
                                <div className="ride-actions">
                                  <button
                                    className="btn-cancel-reservation"
                                    onClick={() => cancelReservation(reservation)}
                                  >
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

            <div className="dashboard-features">
              <h2 className="features-title">Activité récente</h2>
              <div className="features-grid">
                {highlightRides.length === 0 ? (
                  <div className="no-rides-message">
                    <i className="fas fa-info-circle"></i>
                    <p>Publiez ou recherchez un trajet pour voir les dernières activités.</p>
                  </div>
                ) : (
                  highlightRides.map((ride) => (
                    <div key={ride.id} className="feature-card ride-highlight">
                      <div className="feature-icon">
                        <i className="fas fa-route"></i>
                      </div>
                      <h3>
                        {ride.departure} → {ride.arrival}
                      </h3>
                      <p>
                        {formatDate(ride.date)} à {ride.time} · {ride.price} DT · {ride.availableSeats}{' '}
                        place(s)
                      </p>
                      <span className="author-rating">
                        <i className="fas fa-user-circle"></i> {ride.driverName}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

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
                          <p>{selectedRide.driverName}</p>
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
                    <button className="btn-cancel" onClick={closeRideDetail}>
                      Annuler
                    </button>
                    <button className="btn-reserve-large" onClick={() => reserveRide(selectedRide)}>
                      Réserver ce trajet
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                        <i className="far fa-calendar-alt"></i> {formatDate(selectedRide.date)} à{' '}
                        {selectedRide.time}
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
                          onClick={() => setPlacesToReserve((prev) => prev - 1)}
                          className="btn-places"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={placesToReserve}
                          onChange={(e) =>
                            setPlacesToReserve(
                              Math.min(
                                selectedRide.availableSeats,
                                Math.max(1, parseInt(e.target.value, 10) || 1)
                              )
                            )
                          }
                          id="places-input"
                          max={selectedRide.availableSeats}
                          min="1"
                          className="places-input"
                        />
                        <button
                          disabled={placesToReserve >= selectedRide.availableSeats}
                          onClick={() => setPlacesToReserve((prev) => prev + 1)}
                          className="btn-places"
                        >
                          +
                        </button>
                      </div>
                      {placesToReserve > 1 && (
                        <p className="places-info">Total : {placesToReserve * selectedRide.price}DT</p>
                      )}
                      <p className="places-availability">
                        {selectedRide.availableSeats} place(s) disponible(s)
                      </p>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn-cancel" onClick={closeConfirmation}>
                      Annuler
                    </button>
                    <button
                      className="btn-confirm"
                      onClick={confirmReservation}
                      disabled={
                        placesToReserve < 1 || placesToReserve > selectedRide.availableSeats || isBusy
                      }
                    >
                      {isBusy ? 'Réservation...' : 'Confirmer la réservation'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <Alert
              isOpen={showAlert}
              onClose={closeAlert}
              onConfirm={confirmAlert}
              type={alertConfig.type}
              title={alertConfig.title}
              message={alertConfig.message}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
