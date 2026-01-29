import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET all hotels
export async function GET() {
    try {
        const hotels = await prisma.hotel.findMany({
            orderBy: { name: "asc" },
        });
        return NextResponse.json(hotels);
    } catch (error) {
        console.error("Error fetching hotels:", error);
        return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 });
    }
}

// POST create hotel
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        const hotel = await prisma.hotel.create({
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
                notes: data.notes || null,
            },
        });

        return NextResponse.json(hotel);
    } catch (error) {
        console.error("Error creating hotel:", error);
        return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 });
    }
}
