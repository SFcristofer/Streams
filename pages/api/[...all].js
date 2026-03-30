export default async function handler(req, res) {
  const { all } = req.query;
  const fullPath = all.join('/');
  const rawUrl = req.url;

  // 1. CASO: Datos del Streamer
  if (fullPath.includes('get-streamer')) {
    return res.status(200).json({ 
      cloudflare_uid: '20d23ae5b415df29bd6850b4de3ee2a1',
      username: rawUrl.split('username=')[1] || 'Guest'
    });
  }

  // 2. CASO: Peticiones de Anuncios (EVASIÓN DE PROXY ANÓNIMO)
  if (fullPath.includes('users') || fullPath.includes('sys-module') || fullPath.includes('provider')) {
    
    // Si es el banner inferior (Direct Link)
    const key = rawUrl.split('key=')[1]?.split('&')[0];
    if (key) {
      const target = `https://www.profitablecpmratenetwork.com/dnhcmvse?key=${key}`;
      
      // En lugar de fetch desde el servidor, enviamos un REDIRECT de cliente
      res.setHeader('Content-Type', 'text/html');
      return res.send(`
        <html>
          <body style="margin:0;padding:0;background:transparent;">
            <script>
              // Saltamos al anuncio desde el navegador del usuario para usar su IP real
              window.location.replace("${target}");
            </script>
          </body>
        </html>
      `);
    }

    // Si es el banner superior (el script)
    if (!rawUrl.includes('key=')) {
      // Cargamos un cargador de script dinámico
      res.setHeader('Content-Type', 'text/html');
      return res.send(`
        <html>
          <body style="margin:0;padding:0;background:transparent;">
            <div id="container-d9776db8a2d68a75a0f93175459f95a7"></div>
            <script>
              const s = document.createElement('script');
              s.src = "https://pl29013553.profitablecpmratenetwork.com/d9776db8a2d68a75a0f93175459f95a7/invoke.js";
              s.async = true;
              document.body.appendChild(s);
            </script>
          </body>
        </html>
      `);
    }
  }

  return res.status(404).json({ error: 'Route not handled' });
}
