import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createToken, setAuthCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { phone, password } = await request.json();

        if (!phone || !password) {
            return NextResponse.json(
                { error: "Phone number and password are required" },
                { status: 400 }
            );
        }

        // Find user by phone number
        const user = await prisma.user.findUnique({
            where: { phone: phone.trim() },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Only admins and superadmins can use this login
        if (user.role === "GUEST") {
            return NextResponse.json(
                { error: "Please use guest login" },
                { status: 401 }
            );
        }

        // Verify password
        if (!user.password) {
            return NextResponse.json(
                { error: "Account not configured. Contact super admin." },
                { status: 401 }
            );
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = await createToken({
            id: user.id,
            phone: user.phone,
            name: user.name,
            role: user.role as "GUEST" | "ADMIN" | "SUPERADMIN",
            familyId: user.familyId,
        });

        // Set auth cookie
        await setAuthCookie(token);

        return NextResponse.json({
            success: true,
            role: user.role,
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Admin login error:", error);
        return NextResponse.json(
            { error: "An error occurred during login" },
            { status: 500 }
        );
    }
}
