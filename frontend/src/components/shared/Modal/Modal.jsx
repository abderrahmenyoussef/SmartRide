import './Modal.css';

function Modal({ isOpen, onClose, children, maxWidth = '650px' }) {
  if (!isOpen) return null;

  const handleOverlayClick = () => {
    onClose();
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-wrapper">
      <div className="modal-backdrop" onClick={handleOverlayClick}></div>
      <div 
        className="modal-box" 
        onClick={stopPropagation}
        style={{ maxWidth }}
      >
        <button className="modal-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
