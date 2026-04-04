import Head from 'next/head';
import AdminLayout from '../../src/components/AdminLayout';
import Card from '../../src/components/Card';

export default function AdminDashboard() {
  const stats = [
    { label: 'Espectadores Totales', value: '12.4k', change: '+12%', color: '#0070f3' },
    { label: 'Suscripciones Activas', value: '450', change: '+5%', color: '#ffd700' },
    { label: 'Streamers Online', value: '24', change: 'Estable', color: '#ff4d4d' },
    { label: 'Ingresos Mensuales', value: '$8,240', change: '+18%', color: '#00dfd8' },
  ];

  return (
    <AdminLayout>
      <Head><title>Admin Dashboard | ChillStream</title></Head>

      <div className="dashboard-header">
        <h1>Vista General</h1>
        <p>Bienvenido al centro de control de ChillStream.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="stat-card">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <span className="stat-change">{stat.change} desde el mes pasado</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="recent-activity">
        <Card title="Alertas del Sistema">
          <div className="alert-item">
            <span className="dot yellow"></span>
            <p><strong>Elite_Gamer</strong> ha superado las 1,000 visualizaciones concurrentes.</p>
          </div>
          <div className="alert-item">
            <span className="dot red"></span>
            <p>Se detectó un intento de acceso no autorizado en el stream de <strong>Cristian</strong>.</p>
          </div>
          <div className="alert-item">
            <span className="dot green"></span>
            <p>Nuevas 15 suscripciones procesadas a través de Stripe.</p>
          </div>
        </Card>
      </div>

      <style jsx>{`
        .dashboard-header { margin-bottom: 2rem; }
        .dashboard-header h1 { font-size: 2rem; margin: 0; }
        .dashboard-header p { color: #555; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { text-align: left; }
        .stat-label { font-size: 0.75rem; font-weight: 900; color: #444; letter-spacing: 1px; text-transform: uppercase; }
        .stat-value { font-size: 2.5rem; font-weight: 900; margin: 10px 0; }
        .stat-change { font-size: 0.75rem; color: #555; }
        
        .recent-activity { margin-top: 2rem; }
        .alert-item { display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
        .alert-item:last-child { border-bottom: none; }
        .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .yellow { background: #ffd700; box-shadow: 0 0 10px #ffd700; }
        .red { background: #ff4d4d; box-shadow: 0 0 10px #ff4d4d; }
        .green { background: #00dfd8; box-shadow: 0 0 10px #00dfd8; }
        .alert-item p { margin: 0; font-size: 0.9rem; color: #888; }
        .alert-item strong { color: #fff; }
      `}</style>
    </AdminLayout>
  );
}
