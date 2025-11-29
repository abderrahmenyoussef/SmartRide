import './Modal.css';

function Modal({ isOpen, onClose, children, maxWidth = '650px' }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay active" onClick={handleOverlayClick}>
      <div 
        className="modal-content" 
        onClick={stopPropagation}
        style={{ maxWidth }}
      >
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
