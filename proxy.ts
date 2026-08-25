import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';

import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/notes', '/profile'];
const publicRoutes = ['/sign-in', '/sign-up'];

type ParsedCookie = ReturnType<typeof parseSetCookie>;

function setResponseCookies(
  response: NextResponse,
  parsedCookies: ParsedCookie[]
) {
  parsedCookies.forEach((cookie) => {
    if (!cookie.name || !cookie.value) return;

    const {
      name,
      value,
      expires,
      maxAge,
      domain,
      path,
      httpOnly,
      secure,
      sameSite,
      priority,
      partitioned,
    } = cookie;

    response.cookies.set(name, value, {
      expires,
      maxAge,
      domain,
      path,
      httpOnly,
      secure,
      sameSite,
      priority,
      partitioned,
    });
  });
}

export async function proxy(request: NextRequest) {
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
  let refreshedCookies: ParsedCookie[] = [];

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      const setCookieHeader = sessionResponse.headers['set-cookie'];

      const cookieStrings = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : setCookieHeader
          ? [setCookieHeader]
          : [];

      refreshedCookies = cookieStrings.map((cookieString) =>
        parseSetCookie(cookieString)
      );

      const newAccessToken = refreshedCookies.find(
        (cookie) => cookie.name === 'accessToken' && Boolean(cookie.value)
      );

      isAuthenticated = Boolean(newAccessToken);
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';

    const response = NextResponse.redirect(url);

    setResponseCookies(response, refreshedCookies);

    return response;
  }

  if (isPublicRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/';

    const response = NextResponse.redirect(url);

    setResponseCookies(response, refreshedCookies);

    return response;
  }

  const response = NextResponse.next();

  setResponseCookies(response, refreshedCookies);

  return response;
}

export const config = {
  matcher: ['/notes/:path*', '/profile/:path*', '/sign-in', '/sign-up'],
};