import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "wedding-2026-secret-key-for-jwt-auth-min-32-chars"
);

export type UserRole = "GUEST" | "ADMIN" | "SUPERADMIN";

export interface SessionUser {
    id: string;
    phone: string;
    name: string;
    role: UserRole;
    familyId?: string | null;
}

export interface Session {
    user: SessionUser;
    expires: Date;
}

// Hash password for admin accounts
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

// Verify password
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// Create JWT token
export async function createToken(user: SessionUser): Promise<string> {
    const token = await new SignJWT({ user })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(JWT_SECRET);

    return token;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<SessionUser | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.user as SessionUser;
    } catch {
        return null;
    }
}

// Get session from cookies
export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    const user = await verifyToken(token);
    if (!user) return null;

    return {
        user,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
    });
}

// Clear auth cookie
export async function clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
}

// Check if user has required role
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
        GUEST: 1,
        ADMIN: 2,
        SUPERADMIN: 3,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
