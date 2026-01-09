import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'
import { useAdmin } from '../../hooks/useAdmin';
import './Navigation.css';

function Navigation() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdminAuthenticated, logoutAdmin } = useAdmin();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const openChatWidget = () => {
    window.dispatchEvent(new CustomEvent('smartride-open-chat'));
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    navigate('/auth');
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
            Dashboard
          </Link>
          {isAuthenticated && user?.role === 'conducteur' && (
            <Link
              to="/trajets/nouveau"
              className={`nav-link ${location.pathname.startsWith('/trajets') ? 'active' : ''}`}
            >
              Proposer un trajet
            </Link>
          )}
          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-menu-btn">
                <i className="fas fa-user-circle"></i>
                <span>{user?.username}</span>
                {user?.role && <span className="role-chip">{user.role}</span>}
                <i className="fas fa-chevron-down"></i>
              </button>
              <div className="dropdown-menu">
                <Link to="/dashboard" className="dropdown-item">
                  <i className="fas fa-home"></i> Tableau de bord
                </Link>
                <button type="button" className="dropdown-item" onClick={openChatWidget}>
                  <i className="fas fa-comments"></i> Assistance IA
                </button>
                {user?.role === 'conducteur' && (
                  <Link to="/trajets/nouveau" className="dropdown-item">
                    <i className="fas fa-plus-circle"></i> Nouveau trajet
                  </Link>
                )}
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <i className="fas fa-sign-out-alt"></i> Déconnexion
                </button>
              </div>
            </div>
          ) : isAdminAuthenticated ? (
            <div className="user-menu">
              <button className="user-menu-btn admin-menu-btn" type="button">
                <i className="fas fa-user-shield"></i>
                <span>Admin</span>
                <i className="fas fa-chevron-down"></i>
              </button>
              <div className="dropdown-menu">
                <button onClick={handleAdminLogout} className="dropdown-item logout-item" type="button">
                  <i className="fas fa-sign-out-alt"></i> Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="nav-link auth-link">
              <i className="fas fa-sign-in-alt"></i> Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
