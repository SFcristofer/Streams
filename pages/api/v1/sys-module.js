export default async function handler(req, res) {
  const { key, v } = req.query;
  
  // URL para el banner superior (el script de invoke.js)
  if (!key) {
    const target = 'https://pl29013553.profitablecpmratenetwork.com/d9776db8a2d68a75a0f93175459f95a7/invoke.js';
    try {
      const response = await fetch(target);
      const data = await response.text();
      res.setHeader('Content-Type', 'application/javascript');
      res.setHeader('Cache-Control', 'no-store');
      return res.send(data);
    } catch (e) {
      return res.status(500).send('');
    }
  }

  // URL para el banner inferior (Direct Link)
  const targetUrl = `https://www.profitablecpmratenetwork.com/dnhcmvse?key=${key}`;
  try {
    const response = await fetch(targetUrl);
    const data = await response.text();
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'no-store');
    res.send(data);
  } catch (e) {
    res.status(500).send('');
  }
}
