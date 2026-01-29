import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json(
                { error: "Phone number is required" },
                { status: 400 }
            );
        }

        // Find user by phone number
        const user = await prisma.user.findUnique({
            where: { phone: phone.trim() },
            include: { family: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Phone number not found. Please contact your host." },
                { status: 401 }
            );
        }

        // Guests can only log in with phone (no password required)
        if (user.role !== "GUEST") {
            return NextResponse.json(
                { error: "Please use admin login for administrator access." },
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
            user: {
                id: user.id,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Guest login error:", error);
        return NextResponse.json(
            { error: "An error occurred during login" },
            { status: 500 }
        );
    }
}
