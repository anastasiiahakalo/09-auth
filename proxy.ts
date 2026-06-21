import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/notes', '/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

const parseCookie = (cookie: string) => {
  const [nameValue, ...options] = cookie.split(';');
  const [name, value] = nameValue.split('=');

  const cookieOptions: {
    path?: string;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  } = {};

  options.forEach((option) => {
    const [key, optionValue] = option.trim().split('=');
    const lowerKey = key.toLowerCase();

    if (lowerKey === 'path') cookieOptions.path = optionValue;
    if (lowerKey === 'max-age') cookieOptions.maxAge = Number(optionValue);
    if (lowerKey === 'httponly') cookieOptions.httpOnly = true;
    if (lowerKey === 'secure') cookieOptions.secure = true;
    if (lowerKey === 'samesite') {
      const sameSite = optionValue?.toLowerCase();

      if (
        sameSite === 'strict' ||
        sameSite === 'lax' ||
        sameSite === 'none'
      ) {
        cookieOptions.sameSite = sameSite;
      }
    }
  });

  return {
    name,
    value,
    options: cookieOptions,
  };
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);

  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      const setCookie = sessionResponse.headers['set-cookie'];

      if (setCookie) {
        const cookiesToSet = Array.isArray(setCookie) ? setCookie : [setCookie];

        cookiesToSet.forEach((cookie) => {
          const parsedCookie = parseCookie(cookie);

          response.cookies.set(
            parsedCookie.name,
            parsedCookie.value,
            parsedCookie.options
          );
        });
      }

      isAuthenticated = Boolean(sessionResponse.data);
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  if (isPublicRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};