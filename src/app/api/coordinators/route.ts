import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET all coordinators
export async function GET() {
    try {
        const coordinators = await prisma.coordinator.findMany({
            orderBy: [{ type: "asc" }, { name: "asc" }],
        });
        return NextResponse.json(coordinators);
    } catch (error) {
        console.error("Error fetching coordinators:", error);
        return NextResponse.json({ error: "Failed to fetch coordinators" }, { status: 500 });
    }
}

// POST create coordinator
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        const coordinator = await prisma.coordinator.create({
            data: {
                name: data.name,
                phone: data.phone,
                area: data.area,
                type: data.type, // AIRPORT or HOTEL
            },
        });

        return NextResponse.json(coordinator);
    } catch (error) {
        console.error("Error creating coordinator:", error);
        return NextResponse.json({ error: "Failed to create coordinator" }, { status: 500 });
    }
}
