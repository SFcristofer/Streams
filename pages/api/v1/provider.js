export default async function handler(req, res) {
  const { key, v } = req.query;
  const randomMarker = 'ctx_' + Math.random().toString(36).substring(7);
  
  if (!key) {
    try {
      const response = await fetch('https://pl29013553.profitablecpmratenetwork.com/d9776db8a2d68a75a0f93175459f95a7/invoke.js');
      let data = await response.text();
      
      // OFUSCACIÓN DE FIRMA: Reemplazamos el ID conocido por uno aleatorio en el script
      const targetId = 'container-d9776db8a2d68a75a0f93175459f95a7';
      data = data.split(targetId).join(randomMarker);
      
      res.setHeader('Content-Type', 'application/javascript');
      // Añadimos el ID aleatorio en un comentario para que el frontend sepa cuál usar
      return res.send(`/* marker:${randomMarker} */\n${data}`);
    } catch (e) {
      return res.status(500).send('');
    }
  }

  const targetUrl = `https://www.profitablecpmratenetwork.com/dnhcmvse?key=${key}`;
  try {
    const response = await fetch(targetUrl);
    let data = await response.text();
    // Limpieza básica de scripts de tracking conocidos en el HTML del anuncio
    data = data.replace(/track/g, 'tr_ck'); 
    res.setHeader('Content-Type', 'text/html');
    res.send(data);
  } catch (e) {
    res.status(500).send('');
  }
}
