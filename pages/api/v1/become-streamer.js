import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // 1. Obtener el token de la cabecera
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Falta token de sesión' });
  }

  const token = authHeader.replace('Bearer ', '');

  // 2. Crear cliente Supabase con el token del usuario para validar
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { headers: { Authorization: `Bearer ${token}` } }
    }
  );

  // 3. Validar usuario real
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }

  try {
    // 4. Obtener el perfil del usuario para sacar su username
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    if (!profile?.username) {
      return res.status(400).json({ error: 'Debes elegir un Username primero en el Dashboard.' });
    }

    // 5. Llamada a la Pentium para registrarlo como streamer
    const PENTIUM_IP = '192.168.100.24';
    const pentiumResponse = await fetch(`http://${PENTIUM_IP}:5000/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-System-Key': 'chill_secret_token_2026'
      },
      body: JSON.stringify({ username: profile.username })
    });

    if (!pentiumResponse.ok) {
      const errorData = await pentiumResponse.json();
      throw new Error(errorData.error || 'Error en el servidor de video');
    }

    const { key: streamKey } = await pentiumResponse.json();

    // 6. Actualizar el perfil en Supabase (Rol y Llave)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'streamer' })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // 7. Crear o actualizar la entrada en la tabla 'streams'
    const { error: streamError } = await supabase
      .from('streams')
      .upsert([{
        streamer_id: user.id,
        stream_key: streamKey,
        title: `El stream de ${profile.username}`,
        category: 'Charlando'
      }], { onConflict: 'streamer_id' });

    if (streamError) throw streamError;

    return res.status(200).json({ 
      success: true, 
      stream_key: streamKey 
    });

  } catch (error) {
    console.error('Error al convertirse en streamer:', error);
    return res.status(500).json({ error: error.message });
  }
}
