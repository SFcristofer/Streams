export default async function handler(req, res) {
  const { all } = req.query;
  const fullPath = all.join('/');
  const rawUrl = req.url;

  // Cabeceras para imitar a un navegador real y evitar bloqueos de la red de anuncios
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'es-ES,es;q=0.9',
    'Referer': 'https://chillstream.app/', // O tu dominio real
  };

  // 1. CASO: Datos del Streamer
  if (fullPath.includes('get-streamer')) {
    return res.status(200).json({ 
      cloudflare_uid: '20d23ae5b415df29bd6850b4de3ee2a1',
      username: rawUrl.split('username=')[1] || 'Guest'
    });
  }

  // 2. CASO: Peticiones de Anuncios
  if (fullPath.includes('users') || fullPath.includes('sys-module') || fullPath.includes('provider')) {
    
    // Si es el token dinámico
    if (rawUrl.includes('token=')) {
      const token = rawUrl.split('token=')[1];
      const target = `https://www.profitablecpmratenetwork.com/dnhcmvse?token=${token}`;
      try {
        const response = await fetch(target, { headers });
        const data = await response.text();
        res.setHeader('Content-Type', 'text/html');
        return res.send(data);
      } catch (e) { return res.status(500).send(''); }
    }

    // Si es la carga del script principal (banner superior)
    if (!rawUrl.includes('key=')) {
      try {
        const target = 'https://pl29013553.profitablecpmratenetwork.com/d9776db8a2d68a75a0f93175459f95a7/invoke.js';
        const response = await fetch(target, { headers });
        let data = await response.text();
        
        // Ofuscamos el rastro de la red de anuncios en el script
        data = data.split('https://www.profitablecpmratenetwork.com').join('/api/users');
        
        res.setHeader('Content-Type', 'application/javascript');
        return res.send(data);
      } catch (e) { return res.status(500).send(''); }
    }

    // Si es el Direct Link (banner inferior)
    const key = rawUrl.split('key=')[1]?.split('&')[0];
    if (key) {
      const target = `https://www.profitablecpmratenetwork.com/dnhcmvse?key=${key}`;
      try {
        const response = await fetch(target, { headers });
        const data = await response.text();
        res.setHeader('Content-Type', 'text/html');
        // Aseguramos que los enlaces internos también pasen por nuestro proxy
        const proxiedData = data.split('https://www.profitablecpmratenetwork.com').join('/api/users');
        return res.send(proxiedData);
      } catch (e) { return res.status(500).send(''); }
    }
  }

  return res.status(404).json({ error: 'Route not handled' });
}
