import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// PUT update coordinator
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

        const coordinator = await prisma.coordinator.update({
            where: { id },
            data: {
                name: data.name,
                phone: data.phone,
                area: data.area,
                type: data.type,
            },
        });

        return NextResponse.json(coordinator);
    } catch (error) {
        console.error("Error updating coordinator:", error);
        return NextResponse.json({ error: "Failed to update coordinator" }, { status: 500 });
    }
}

// DELETE coordinator
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
        await prisma.coordinator.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting coordinator:", error);
        return NextResponse.json({ error: "Failed to delete coordinator" }, { status: 500 });
    }
}
