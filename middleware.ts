import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "mirea_session";
const ADMIN_USER_TYPES = new Set(["moderator", "admin", "superadmin"]);

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionId = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!sessionId) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const sessionUrl = new URL("/api/auth/session", request.url);
    const response = await fetch(sessionUrl, {
      method: "GET",
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    const payload = (await response.json()) as {
      user?: { userType?: string; role?: string } | null;
    };

    if (!payload.user) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }

    const userType = payload.user.userType ?? "user";
    const legacyLeaderAccess = payload.user.role === "LEADER";
    if (!ADMIN_USER_TYPES.has(userType) && !legacyLeaderAccess) {
      return NextResponse.redirect(new URL("/app", request.url));
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
