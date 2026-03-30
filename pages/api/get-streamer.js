import { Streamer } from '../../lib/db';

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Falta el nombre de usuario' });
  }

  try {
    const streamer = await Streamer.findOne({
      where: { username: username.toLowerCase() }
    });

    if (!streamer) {
      return res.status(404).json({ message: 'Streamer no encontrado' });
    }

    res.status(200).json(streamer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
