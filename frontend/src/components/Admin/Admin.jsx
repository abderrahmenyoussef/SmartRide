import { useState } from 'react';
import './Admin.css';

function Admin() {
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-header-content">
            <div className="admin-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="admin-header-text">
              <h1>Tableau de Bord Administrateur</h1>
              <p>Analyse et visualisation des données SmartRide en temps réel</p>
            </div>
          </div>
          <div className="admin-stats">
            <div className="stat-item">
              <i className="fas fa-users"></i>
              <span>Gestion des Utilisateurs</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-route"></i>
              <span>Analyse des Trajets</span>
            </div>
            <div className="stat-item">
              <i className="fas fa-chart-bar"></i>
              <span>Statistiques BI</span>
            </div>
          </div>
        </div>

        <div className="dashboard-container">
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p>Chargement du tableau de bord...</p>
            </div>
          )}
          <iframe
            title="SmartRide Analytics Dashboard"
            className="powerbi-iframe"
            src="https://app.powerbi.com/view?r=eyJrIjoiNzBhNWJjMjktZTg2OC00ZDkwLThkODEtODVhZjNhYTYyYzhhIiwidCI6ImI3YmQ0NzE1LTQyMTctNDhjNy05MTllLTJlYTk3ZjU5MmZhNyJ9"
            frameBorder="0"
            allowFullScreen={true}
            onLoad={handleIframeLoad}
          />
        </div>

        <div className="admin-footer">
          <div className="footer-info">
            <i className="fas fa-info-circle"></i>
            <span>Les données sont mises à jour en temps réel depuis notre Data Warehouse</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
