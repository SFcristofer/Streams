import { useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { supabase } from '../src/lib/supabase';

// Cargado dinámico para evitar el error de Hydration Mismatch
const AuthUI = dynamic(
  () => import('@supabase/auth-ui-react').then((mod) => mod.Auth),
  { ssr: false }
);

const ThemeSupa = dynamic(
  () => import('@supabase/auth-ui-shared').then((mod) => mod.ThemeSupa),
  { ssr: false }
);

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Escuchamos los cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Redirigir al home en cuanto se detecte la sesión activa
        router.push('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Head>
        <title>Acceso Elite | ChillStream</title>
      </Head>
      <Navbar />

      <main className="flex items-center justify-center p-6 pt-32 pb-20">
        <div className="w-full max-w-[450px] p-10 bg-white/[0.02] border border-white/5 rounded-[32px] backdrop-blur-3xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">Identifícate</h1>
              <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Red Elite de Streaming</p>
            </div>

            <AuthUI
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#0070f3',
                      brandAccent: '#0058c1',
                      brandButtonText: 'white',
                      defaultButtonBackground: '#111',
                      defaultButtonBackgroundHover: '#222',
                      inputBackground: '#000',
                      inputBorder: '#222',
                      inputPlaceholder: '#444',
                      inputText: 'white',
                    },
                    radii: {
                      borderRadiusButton: '14px',
                      buttonPadding: '14px',
                      inputPadding: '14px',
                    }
                  },
                },
              }}
              providers={['google', 'discord']}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Correo Electrónico',
                    password_label: 'Contraseña',
                    button_label: 'ENTRAR A LA SALA',
                  },
                  sign_up: {
                    email_label: 'Correo Electrónico',
                    password_label: 'Crea tu Contraseña',
                    button_label: 'CREAR MI PERFIL ELITE',
                  }
                }
              }}
              theme="dark"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
