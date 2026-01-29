import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// PUT update hotel
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await request.json();

        const hotel = await prisma.hotel.update({
            where: { id },
            data: {
                name: data.name,
                address: data.address,
                phone: data.phone,
                notes: data.notes || null,
            },
        });

        return NextResponse.json(hotel);
    } catch (error) {
        console.error("Error updating hotel:", error);
        return NextResponse.json({ error: "Failed to update hotel" }, { status: 500 });
    }
}

// DELETE hotel
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== "SUPERADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await prisma.hotel.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting hotel:", error);
        return NextResponse.json({ error: "Failed to delete hotel" }, { status: 500 });
    }
}
