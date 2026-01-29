import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "wedding-2026-secret-key-for-jwt-auth-min-32-chars"
);

// Routes that don't require authentication
const publicRoutes = ["/", "/login", "/admin/login"];

// Routes that require specific roles
const roleRoutes: Record<string, string[]> = {
    "/guest": ["GUEST", "ADMIN", "SUPERADMIN"],
    "/admin": ["ADMIN", "SUPERADMIN"],
    "/superadmin": ["SUPERADMIN"],
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Allow static files and API routes for login
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/auth") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Get token from cookie
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
        // Redirect to appropriate login page
        if (pathname.startsWith("/admin") || pathname.startsWith("/superadmin")) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        // Verify token
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const user = payload.user as { role: string };

        // Check role-based access
        for (const [routePrefix, allowedRoles] of Object.entries(roleRoutes)) {
            if (pathname.startsWith(routePrefix)) {
                if (!allowedRoles.includes(user.role)) {
                    // Redirect based on their actual role
                    if (user.role === "GUEST") {
                        return NextResponse.redirect(new URL("/guest", request.url));
                    } else if (user.role === "ADMIN") {
                        return NextResponse.redirect(new URL("/admin", request.url));
                    } else {
                        return NextResponse.redirect(new URL("/superadmin", request.url));
                    }
                }
                break;
            }
        }

        return NextResponse.next();
    } catch {
        // Invalid token - clear and redirect to login
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("auth-token");
        return response;
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
