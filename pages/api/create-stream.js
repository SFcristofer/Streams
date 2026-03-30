import { Streamer } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { streamerName } = req.body;
  const accountId = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!apiToken || !accountId) {
    return res.status(500).json({ message: 'Error: Faltan credenciales en el servidor' });
  }

  try {
    // 1. Pedir a Cloudflare un nuevo Live Input
    const cfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meta: { name: streamerName },
          recording: { mode: 'off' }
        }),
      }
    );

    const data = await cfResponse.json();

    if (!data.success) {
      throw new Error(data.errors[0].message);
    }

    const { uid, rtmps } = data.result;

    // 2. GUARDAR EN LA BASE DE DATOS LOCAL
    // Si el usuario ya existe, actualizamos su ID de Cloudflare
    await Streamer.upsert({
      username: streamerName.toLowerCase(),
      cloudflare_uid: uid,
      stream_key: rtmps.streamKey
    });

    res.status(200).json({
      uid: uid,
      rtmpsUrl: rtmps.url,
      streamKey: rtmps.streamKey
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
