export default function Step({ number, children }) {
  return (
    <div className="step">
      <div className="num">{number}</div>
      <div className="step-content">{children}</div>
      <style jsx>{`
        .step { display: flex; gap: 15px; align-items: flex-start; margin-bottom: 1.5rem; }
        .num { 
          background: #0070f3; 
          width: 24px; 
          height: 24px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 0.75rem; 
          font-weight: bold; 
          color: #fff;
          flex-shrink: 0; 
        }
        .step-content { color: #888; font-size: 0.85rem; line-height: 1.4; }
      `}</style>
    </div>
  );
}
