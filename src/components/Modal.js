export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        {title && <h2>{title}</h2>}
        {children}
      </div>

      <style jsx>{`
        .modal-overlay { 
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100%; 
          height: 100%; 
          background: rgba(0,0,0,0.9); 
          z-index: 2000; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          backdrop-filter: blur(10px); 
        }
        .auth-modal { 
          background: #111; 
          padding: 3rem; 
          border-radius: 32px; 
          border: 1px solid rgba(255,255,255,0.08); 
          width: 100%; 
          max-width: 450px; 
          text-align: center; 
          position: relative; 
          color: #fff;
        }
        .close-btn { position: absolute; top: 20px; right: 20px; background: none; border: none; color: #fff; font-size: 2rem; cursor: pointer; }
        
        @media (max-width: 480px) {
          .auth-modal { padding: 2rem; margin: 15px; }
        }
      `}</style>
    </div>
  );
}
