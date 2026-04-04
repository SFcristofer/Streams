export default function StreamCard({ stream, onClick }) {
  return (
    <div className="stream-card" onClick={() => onClick(stream.name)}>
      <div className="thumbnail-wrapper">
        <img src={stream.thumb} alt={stream.title} />
        <span className="viewers">👁️ {stream.viewers}</span>
      </div>
      <div className="stream-info">
        <div className="avatar">{stream.name.charAt(0)}</div>
        <div className="text">
          <h4>{stream.title}</h4>
          <p>{stream.name}</p>
        </div>
      </div>

      <style jsx>{`
        .stream-card { 
          background: #111; 
          border-radius: 16px; 
          overflow: hidden; 
          border: 1px solid rgba(255,255,255,0.08); 
          cursor: pointer; 
          transition: 0.3s; 
        }
        .stream-card:hover { transform: translateY(-10px); border-color: #0070f3; }
        
        .thumbnail-wrapper { position: relative; padding-top: 56.25%; }
        .thumbnail-wrapper img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .viewers { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; color: #fff; }
        
        .stream-info { padding: 1.2rem; display: flex; gap: 12px; }
        .avatar { width: 40px; height: 40px; background: #0070f3; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #fff; }
        .text h4 { margin: 0; font-size: 1rem; color: #fff; }
        .text p { margin: 5px 0 0 0; font-size: 0.8rem; color: #555; }
      `}</style>
    </div>
  );
}
