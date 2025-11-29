import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const handleLoginBlur = (field) => {
    setLoginTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleRegisterBlur = (field) => {
    setRegisterTouched(prev => ({ ...prev, [field]: true }));
  };

  // Validation helpers
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const getLoginErrors = () => {
    const errors = {};
    if (!loginForm.email) errors.email = 'Email est obligatoire';
    else if (!isEmailValid(loginForm.email)) errors.email = 'Format d\'email invalide';
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
    else if (registerForm.password.length < 6) errors.password = 'Mot de passe doit avoir au moins 6 caractères';
    return errors;
  };

  const loginErrors = getLoginErrors();
  const registerErrors = getRegisterErrors();

  const isLoginValid = Object.keys(loginErrors).length === 0;
  const isRegisterValid = Object.keys(registerErrors).length === 0 && registerForm.termsAccepted;

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isLoginValid) {
      setLoginTouched({ email: true, password: true });
      return;
    }

    // Static demo: simulate login
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Connexion réussie ! Redirection...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    }, 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isRegisterValid) {
      setRegisterTouched({ username: true, email: true, password: true });
      return;
    }

    // Static demo: simulate registration
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      setIsLoginMode(true);
      setRegisterForm({
        username: '',
        email: '',
        password: '',
        role: 'passager',
        termsAccepted: false
      });
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand">
            <i className="fas fa-car-side"></i>
            <h1>SmartRide</h1>
          </div>
          <h2>{isLoginMode ? 'Connexion' : 'Créer un compte'}</h2>
          <p className="auth-subtitle">
            {isLoginMode ? 'Accédez à votre compte' : 'Rejoignez notre communauté de covoiturage'}
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
            className={isLoginMode ? 'active' : ''} 
            onClick={() => setIsLoginMode(true)}
          >
            Connexion
          </button>
          <button 
            className={!isLoginMode ? 'active' : ''} 
            onClick={() => setIsLoginMode(false)}
          >
            Inscription
          </button>
        </div>

        {/* Login Form */}
        {isLoginMode && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">
                <i className="fas fa-envelope"></i>
                Email
              </label>
              <input
                type="email"
                id="login-email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                onBlur={() => handleLoginBlur('email')}
                placeholder="Votre adresse email"
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
              <a href="#" className="forgot-password">Mot de passe oublié?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-button"
            >
              {isLoading ? (
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
        {!isLoginMode && (
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

            <div className="terms">
              <label>
                <input 
                  type="checkbox" 
                  name="termsAccepted"
                  checked={registerForm.termsAccepted}
                  onChange={handleRegisterChange}
                />
                J'accepte les <a href="#">conditions générales</a> et la <a href="#">politique de confidentialité</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-button"
            >
              {isLoading ? (
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

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-btn google">
            <i className="fab fa-google"></i>
            Continuer avec Google
          </button>
          <button type="button" className="social-btn facebook">
            <i className="fab fa-facebook-f"></i>
            Continuer avec Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
