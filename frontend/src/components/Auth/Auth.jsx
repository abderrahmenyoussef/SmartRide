import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Modal } from '../shared';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

function Auth() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isAuthLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'warning',
    title: '',
    message: ''
  });

  // Modal states for terms and privacy
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'passager',
    termsAccepted: false
  });

  // Admin form state
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: ''
  });

  // Form touched state for validation
  const [loginTouched, setLoginTouched] = useState({
    email: false,
    password: false
  });

  const [registerTouched, setRegisterTouched] = useState({
    username: false,
    email: false,
    password: false
  });

  const [adminTouched, setAdminTouched] = useState({
    username: false,
    password: false
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginBlur = (field) => {
    setLoginTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleRegisterBlur = (field) => {
    setRegisterTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleAdminBlur = (field) => {
    setAdminTouched(prev => ({ ...prev, [field]: true }));
  };

  const switchTab = (tab) => {
    setErrorMessage('');
    setSuccessMessage('');
    if (tab === 'login') {
      setIsLoginMode(true);
      setIsAdminMode(false);
    } else if (tab === 'register') {
      setIsLoginMode(false);
      setIsAdminMode(false);
    } else {
      setIsLoginMode(true);
      setIsAdminMode(true);
    }
  };

  // Validation helpers
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const getLoginErrors = () => {
    const errors = {};
    if (!loginForm.email) errors.email = 'Identifiant requis';
    if (!loginForm.password) errors.password = 'Mot de passe est obligatoire';
    return errors;
  };

  const getRegisterErrors = () => {
    const errors = {};
    if (!registerForm.username) errors.username = 'Nom d\'utilisateur est obligatoire';
    else if (registerForm.username.length < 3) errors.username = 'Nom d\'utilisateur doit avoir au moins 3 caractères';
    if (!registerForm.email) errors.email = 'Email est obligatoire';
    else if (!isEmailValid(registerForm.email)) errors.email = 'Format d\'email invalide';
    if (!registerForm.password) errors.password = 'Mot de passe est obligatoire';
    else if (registerForm.password.length < 8) errors.password = 'Mot de passe doit avoir au moins 8 caractères';
    return errors;
  };

  const getAdminErrors = () => {
    const errors = {};
    if (!adminForm.username) errors.username = 'Identifiant admin requis';
    if (!adminForm.password) errors.password = 'Mot de passe admin requis';
    return errors;
  };

  const loginErrors = getLoginErrors();
  const registerErrors = getRegisterErrors();
  const adminErrors = getAdminErrors();

  const isLoginValid = Object.keys(loginErrors).length === 0;
  const isRegisterValid = Object.keys(registerErrors).length === 0 && registerForm.termsAccepted;
  const isAdminValid = Object.keys(adminErrors).length === 0;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isLoginValid) {
      setLoginTouched({ email: true, password: true });
      return;
    }

    try {
      await login({ identifier: loginForm.email, password: loginForm.password });
      setSuccessMessage('Connexion réussie ! Redirection...');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!registerForm.termsAccepted) {
      setAlertConfig({
        type: 'warning',
        title: 'Conditions requises',
        message: 'Vous devez accepter les conditions générales et la politique de confidentialité pour créer un compte.'
      });
      setShowAlert(true);
      return;
    }

    if (!isRegisterValid) {
      setRegisterTouched({ username: true, email: true, password: true });
      return;
    }

    try {
      await register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role
      });
      setSuccessMessage('Compte créé ! Redirection vers votre tableau de bord...');
      setIsLoginMode(true);
      setRegisterForm({
        username: '',
        email: '',
        password: '',
        role: 'passager',
        termsAccepted: false
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isAdminValid) {
      setAdminTouched({ username: true, password: true });
      return;
    }

    if (adminForm.username === 'admin' && adminForm.password === 'admin') {
      localStorage.setItem('smartride:admin', 'true');
      navigate('/admin');
      return;
    }

    setErrorMessage('Identifiants admin invalides');
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const openTermsModal = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const openPrivacyModal = (e) => {
    e.preventDefault();
    setShowPrivacyModal(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand">
            <i className="fas fa-car-side"></i>
            <h1>SmartRide</h1>
          </div>
          <h2>
            {isAdminMode ? 'Espace admin' : isLoginMode ? 'Connexion' : 'Créer un compte'}
          </h2>
          <p className="auth-subtitle">
            {isAdminMode
              ? 'Accès réservé à l’administration'
              : isLoginMode
                ? 'Accédez à votre compte'
                : 'Rejoignez notre communauté de covoiturage'}
          </p>
        </div>

        {errorMessage && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            {successMessage}
          </div>
        )}

        <div className="auth-tabs">
          <button 
            className={isLoginMode && !isAdminMode ? 'active' : ''} 
            onClick={() => switchTab('login')}
          >
            Connexion
          </button>
          <button 
            className={!isLoginMode && !isAdminMode ? 'active' : ''} 
            onClick={() => switchTab('register')}
          >
            Inscription
          </button>
          <button
            className={isAdminMode ? 'active' : ''}
            onClick={() => switchTab('admin')}
          >
            Espace admin
          </button>
        </div>

        {/* Login Form */}
        {isLoginMode && !isAdminMode && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">
                <i className="fas fa-envelope"></i>
                Email ou nom d'utilisateur
              </label>
              <input
                type="text"
                id="login-email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                onBlur={() => handleLoginBlur('email')}
                placeholder="Email ou nom d'utilisateur"
              />
              {loginTouched.email && loginErrors.email && (
                <div className="validation-error">
                  <i className="fas fa-info-circle"></i> {loginErrors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="login-password">
                <i className="fas fa-lock"></i>
                Mot de passe
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  onBlur={() => handleLoginBlur('password')}
                  placeholder="Votre mot de passe"
                />
                <button 
                  type="button" 
                  className="toggle-password" 
                  onClick={togglePasswordVisibility}
                >
                  <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </button>
              </div>
              {loginTouched.password && loginErrors.password && (
                <div className="validation-error">
                  <i className="fas fa-info-circle"></i> {loginErrors.password}
                </div>
              )}
            </div>

            <div className="remember-forgot">
              <label className="remember-me">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={loginForm.rememberMe}
                  onChange={handleLoginChange}
                /> Se souvenir de moi
              </label>
              <span className="forgot-password">Mot de passe oublié?</span>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="auth-button"
            >
              {isAuthLoading ? (
                <span>
                  <i className="fas fa-spinner fa-spin"></i> Connexion en cours...
                </span>
              ) : (
                <span>
                  <i className="fas fa-sign-in-alt"></i> Se connecter
                </span>
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {!isLoginMode && !isAdminMode && (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label htmlFor="register-username">
                <i className="fas fa-user"></i>
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="register-username"
                name="username"
                value={registerForm.username}
                onChange={handleRegisterChange}
                onBlur={() => handleRegisterBlur('username')}
                placeholder="Choisir un nom d'utilisateur"
              />
              {registerTouched.username && registerErrors.username && (
                <div className="validation-error">
                  <i className="fas fa-info-circle"></i> {registerErrors.username}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="register-email">
                <i className="fas fa-envelope"></i>
                Email
              </label>
              <input
                type="email"
                id="register-email"
                name="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                onBlur={() => handleRegisterBlur('email')}
                placeholder="Votre adresse email"
              />
              {registerTouched.email && registerErrors.email && (
                <div className="validation-error">
                  <i className="fas fa-info-circle"></i> {registerErrors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="register-password">
                <i className="fas fa-lock"></i>
                Mot de passe
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="register-password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  onBlur={() => handleRegisterBlur('password')}
                  placeholder="Choisir un mot de passe"
                />
                <button 
                  type="button" 
                  className="toggle-password" 
                  onClick={togglePasswordVisibility}
                >
                  <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </button>
              </div>
              {registerTouched.password && registerErrors.password && (
                <div className="validation-error">
                  <i className="fas fa-info-circle"></i> {registerErrors.password}
                </div>
              )}
            </div>

            <div className="form-group role-selection">
              <label>
                <i className="fas fa-user-tag"></i>
                Je m'inscris en tant que
              </label>
              <div className="role-options">
                <label className={`role-option ${registerForm.role === 'passager' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="passager"
                    checked={registerForm.role === 'passager'}
                    onChange={handleRegisterChange}
                  />
                  <i className="fas fa-user"></i>
                  <span>Passager</span>
                </label>
                <label className={`role-option ${registerForm.role === 'conducteur' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="conducteur"
                    checked={registerForm.role === 'conducteur'}
                    onChange={handleRegisterChange}
                  />
                  <i className="fas fa-car"></i>
                  <span>Conducteur</span>
                </label>
              </div>
            </div>

            <div className="terms-checkbox">
              <label>
                <input 
                  type="checkbox" 
                  name="termsAccepted"
                  checked={registerForm.termsAccepted}
                  onChange={handleRegisterChange}
                />
                <span className="terms-text">
                  J'accepte les{' '}
                  <a href="#" onClick={openTermsModal}>conditions générales</a>
                  {' '}et la{' '}
                  <a href="#" onClick={openPrivacyModal}>politique de confidentialité</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="auth-button"
            >
              {isAuthLoading ? (
                <span>
                  <i className="fas fa-spinner fa-spin"></i> Inscription en cours...
                </span>
              ) : (
                <span>
                  <i className="fas fa-user-plus"></i> Créer un compte
                </span>
              )}
            </button>
          </form>
        )}

        {isAdminMode && (
          <form onSubmit={handleAdminLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="admin-username">
                <i className="fas fa-user-shield"></i>
                Identifiant admin
              </label>
              <input
                type="text"
                id="admin-username"
                name="username"
                value={adminForm.username}
                onChange={handleAdminChange}
                onBlur={() => handleAdminBlur('username')}
                placeholder="Votre identifiant"
              />
              {adminTouched.username && adminErrors.username && (
                <div className="validation-error">
                  <i className="fas fa-info-circle"></i> {adminErrors.username}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">
                <i className="fas fa-lock"></i>
                Mot de passe admin
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="admin-password"
                  name="password"
                  value={adminForm.password}
                  onChange={handleAdminChange}
                  onBlur={() => handleAdminBlur('password')}
                  placeholder="Votre mot de passe"
                />
                <button 
                  type="button" 
                  className="toggle-password" 
                  onClick={togglePasswordVisibility}
                >
                  <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </button>
              </div>
              {adminTouched.password && adminErrors.password && (
                <div className="validation-error">
                  <i className="fas fa-info-circle"></i> {adminErrors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="auth-button"
            >
              {isAuthLoading ? (
                <span>
                  <i className="fas fa-spinner fa-spin"></i> Connexion en cours...
                </span>
              ) : (
                <span>
                  <i className="fas fa-shield-alt"></i> Accéder à l’espace admin
                </span>
              )}
            </button>
          </form>
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

      {/* Terms Modal */}
      <Modal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} maxWidth="700px">
        <div className="legal-modal-content">
          <h2><i className="fas fa-file-contract"></i> Conditions Générales d'Utilisation</h2>
          
          <div className="legal-section">
            <h3>1. Objet</h3>
            <p>Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation de la plateforme SmartRide, service de mise en relation entre conducteurs et passagers pour le covoiturage.</p>
          </div>

          <div className="legal-section">
            <h3>2. Inscription</h3>
            <p>Pour utiliser nos services, vous devez créer un compte en fournissant des informations exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion.</p>
          </div>

          <div className="legal-section">
            <h3>3. Utilisation du service</h3>
            <p>SmartRide permet aux conducteurs de proposer des trajets et aux passagers de réserver des places. Les utilisateurs s'engagent à :</p>
            <ul>
              <li>Fournir des informations exactes sur les trajets</li>
              <li>Respecter les horaires convenus</li>
              <li>Adopter un comportement respectueux</li>
              <li>Ne pas utiliser le service à des fins commerciales</li>
            </ul>
          </div>

          <div className="legal-section">
            <h3>4. Responsabilité</h3>
            <p>SmartRide agit uniquement comme intermédiaire et ne peut être tenu responsable des incidents survenant pendant les trajets. Chaque utilisateur est responsable de son propre comportement.</p>
          </div>

          <div className="legal-section">
            <h3>5. Modification des CGU</h3>
            <p>SmartRide se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification significative.</p>
          </div>

          <div className="legal-footer">
            <p>Dernière mise à jour : Novembre 2025</p>
            <button className="btn-close-modal" onClick={() => setShowTermsModal(false)}>
              J'ai compris
            </button>
          </div>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} maxWidth="700px">
        <div className="legal-modal-content">
          <h2><i className="fas fa-shield-alt"></i> Politique de Confidentialité</h2>
          
          <div className="legal-section">
            <h3>1. Collecte des données</h3>
            <p>Nous collectons les données suivantes lors de votre inscription et utilisation :</p>
            <ul>
              <li>Nom d'utilisateur et adresse email</li>
              <li>Informations de profil (rôle, préférences)</li>
              <li>Données de trajets (départ, destination, horaires)</li>
              <li>Historique des réservations</li>
            </ul>
          </div>

          <div className="legal-section">
            <h3>2. Utilisation des données</h3>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Permettre le fonctionnement du service de covoiturage</li>
              <li>Faciliter la mise en relation entre conducteurs et passagers</li>
              <li>Améliorer nos services</li>
              <li>Vous contacter concernant votre compte</li>
            </ul>
          </div>

          <div className="legal-section">
            <h3>3. Protection des données</h3>
            <p>Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.</p>
          </div>

          <div className="legal-section">
            <h3>4. Vos droits</h3>
            <p>Conformément à la réglementation, vous disposez des droits suivants :</p>
            <ul>
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
          </div>

          <div className="legal-section">
            <h3>5. Contact</h3>
            <p>Pour toute question concernant vos données personnelles, vous pouvez nous contacter à : contact@smartride.com</p>
          </div>

          <div className="legal-footer">
            <p>Dernière mise à jour : Novembre 2025</p>
            <button className="btn-close-modal" onClick={() => setShowPrivacyModal(false)}>
              J'ai compris
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Auth;
