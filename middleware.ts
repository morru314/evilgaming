import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Proteger rutas de administración
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Verificar si hay una cookie de autenticación
    const authToken = request.cookies.get("supabase-auth-token")?.value;

    if (!authToken) {
      return NextResponse.redirect(new URL("/auth/server-auth", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};