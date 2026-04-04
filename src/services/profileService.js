import { supabase } from '../lib/supabase';

export const profileService = {
  // Obtener mi perfil completo (con rol)
  async getMyProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // (Solo Admins) Obtener lista de todos los streamers
  async getAllStreamers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'streamer');

    if (error) throw error;
    return data;
  },

  // Verificar si soy Premium (Sincronizado con Stripe)
  async checkPremiumStatus() {
    const profile = await this.getMyProfile();
    return profile?.is_premium || false;
  },

  // Convertirse en Streamer (Proceso Automático Estilo Twitch)
  async becomeStreamer() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Debes iniciar sesión');

    const response = await fetch('/api/v1/become-streamer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'No se pudo completar el registro');
    }

    return await response.json();
  },

  // Actualizar el username del usuario
  async updateUsername(newUsername) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No hay sesión activa');

    // 1. Verificar si el username ya está en uso
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', newUsername)
      .maybeSingle();

    if (existing) throw new Error('Este nombre de usuario ya está en uso');

    // 2. Actualizar o insertar el perfil
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        username: newUsername,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return { success: true };
  },

  // Actualizar perfil completo incluyendo redes sociales
  async updateFullProfile(updates) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No hay sesión activa');

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.full_name,
        bio: updates.bio,
        avatar_url: updates.avatar_url,
        twitter_url: updates.twitter_url,
        instagram_url: updates.instagram_url,
        discord_url: updates.discord_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (error) throw error;
    return { success: true };
  },

  // Actualizar información del stream (Título/Categoría)
  async updateStreamInfo(streamId, updates) {
    const { error } = await supabase
      .from('streams')
      .update({
        title: updates.title,
        category: updates.category
      })
      .eq('id', streamId);

    if (error) throw error;
    return { success: true };
  },

  // Ejecutar donación real de Chill Flow
  async sendDonation(streamerUsername, amount) {
    const { error } = await supabase.rpc('donate_flow', {
      streamer_username: streamerUsername,
      amount_to_send: amount
    });

    if (error) throw error;
    return { success: true };
  }
};
