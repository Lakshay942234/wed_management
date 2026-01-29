import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession, hashPassword } from "@/lib/auth";

// GET all admins
export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== "SUPERADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const admins = await prisma.user.findMany({
            where: { role: { in: ["ADMIN", "SUPERADMIN"] } },
            select: {
                id: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(admins);
    } catch (error) {
        console.error("Error fetching admins:", error);
        return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
    }
}

// POST create admin
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== "SUPERADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        // Check if phone exists
        const existing = await prisma.user.findUnique({
            where: { phone: data.phone },
        });
        if (existing) {
            return NextResponse.json({ error: "Phone number already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password);

        const admin = await prisma.user.create({
            data: {
                name: data.name,
                phone: data.phone,
                password: hashedPassword,
                role: data.role,
            },
        });

        return NextResponse.json({ id: admin.id, name: admin.name, role: admin.role });
    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json({ error: "Failed to create admin" }, { status: 500 });
    }
}
