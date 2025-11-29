import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mockUser } from '../../data/mockData';
import './Navigation.css';

function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Static: always logged in for demo
  const [currentUser] = useState(mockUser);
  const location = useLocation();

  const handleLogout = () => {
    setIsAuthenticated(false);
    // In static version, just toggle the state
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <div className="logo-container">
              <i className="fas fa-car-side"></i>
              <span>SmartRide</span>
            </div>
          </Link>
        </div>

        <div className="navbar-menu">
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Accueil
          </Link>
          <Link 
            to="/trajets" 
            className={`nav-link ${location.pathname.startsWith('/trajets') ? 'active' : ''}`}
          >
            Trajets
          </Link>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-menu-btn">
                <i className="fas fa-user-circle"></i>
                <span>{currentUser?.username}</span>
                <i className="fas fa-chevron-down"></i>
              </button>
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <i className="fas fa-user"></i> Mon profil
                </Link>
                <Link to="/mes-trajets" className="dropdown-item">
                  <i className="fas fa-route"></i> Mes trajets
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <i className="fas fa-sign-out-alt"></i> Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="nav-link auth-link" onClick={handleLogin}>
              <i className="fas fa-sign-in-alt"></i> Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
