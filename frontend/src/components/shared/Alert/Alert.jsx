import './Alert.css';

function Alert({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type = 'success', 
  title, 
  message 
}) {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-times-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'confirm':
        return 'fa-question-circle';
      case 'info':
        return 'fa-info-circle';
      default:
        return 'fa-check-circle';
    }
  };

  return (
    <div className="alert-modal">
      <div className="alert-overlay" onClick={handleOverlayClick}></div>
      <div className={`alert-box alert-${type}`}>
        <div className="alert-icon">
          <i className={`fas ${getIcon()}`}></i>
        </div>
        <h3 className="alert-title">{title}</h3>
        <p className="alert-message">{message}</p>
        <div className="alert-actions">
          {type === 'confirm' ? (
            <>
              <button className="alert-btn alert-btn-cancel" onClick={onClose}>
                Annuler
              </button>
              <button className="alert-btn alert-btn-confirm" onClick={onConfirm}>
                Confirmer
              </button>
            </>
          ) : (
            <button className="alert-btn alert-btn-ok" onClick={onClose}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Alert;
