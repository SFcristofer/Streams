import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function proxy(req) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 1. Proteger el PANEL DE ADMIN
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', req.url));

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // 2. Proteger el PANEL DE STREAMER y DASHBOARD DE USUARIO
  if (req.nextUrl.pathname.startsWith('/empezar') || req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

// Rutas donde el proxy debe actuar
export const config = {
  matcher: ['/admin/:path*', '/empezar'],
};
