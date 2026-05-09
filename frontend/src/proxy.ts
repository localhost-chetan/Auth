import { NextResponse, type NextProxy } from "next/server";

export const proxy: NextProxy = (request) => {
    const accessToken = request.cookies.get("access_token")?.value;

    const { pathname } = request.nextUrl

    if (pathname.startsWith("/dashboard")) {
        if (!accessToken) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } else if (pathname === "/login" || pathname === "/verify-email" || pathname === "/forgot-password" || pathname.startsWith("/reset-password")) {
        if (accessToken) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
    * Match all request paths except for the ones starting with:
    * - api (API routes)
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - favicon.ico, sitemap.xml, robots.txt (metadata files)
    */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ]
}