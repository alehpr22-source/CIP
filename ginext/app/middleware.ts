import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(
  request: NextRequest
) {

  const response = NextResponse.next({
    request,
  });

  // ==========================================
  // SUPABASE SERVER CLIENT
  // ==========================================

  const supabase = createServerClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {
      cookies: {

        get(name: string) {

          return request.cookies.get(name)
            ?.value;
        },

        set(
          name: string,
          value: string,
          options
        ) {

          response.cookies.set({
            name,
            value,
            ...options,
          });
        },

        remove(
          name: string,
          options
        ) {

          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // ==========================================
  // OBTENER USUARIO
  // ==========================================

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ==========================================
  // RUTAS
  // ==========================================

  const pathname =
    request.nextUrl.pathname;

  const authRoutes = [
    '/login',
    '/register',
  ];

  const protectedRoutes = [
    '/dashboard',
    '/admin',
  ];

  // ==========================================
  // SI ESTÁ LOGUEADO Y QUIERE LOGIN
  // ==========================================

  if (
    user &&
    authRoutes.includes(pathname)
  ) {

    return NextResponse.redirect(
      new URL(
        '/dashboard',
        request.url
      )
    );
  }

  // ==========================================
  // SI NO ESTÁ LOGUEADO
  // ==========================================

  const isProtectedRoute =
    protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

  if (
    !user &&
    isProtectedRoute
  ) {

    return NextResponse.redirect(
      new URL(
        '/login',
        request.url
      )
    );
  }

  return response;
}

// ==========================================
// MATCHER
// ==========================================

export const config = {

  matcher: [

    /*
     * Match all request paths except:
     * - _next/static
     * - _next/image
     * - favicon.ico
     */

    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
