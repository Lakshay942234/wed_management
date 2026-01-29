import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET single family
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const family = await prisma.family.findUnique({
            where: { id },
            include: {
                members: true,
                hotel: true,
                coordinator: true,
            },
        });

        if (!family) {
            return NextResponse.json({ error: "Family not found" }, { status: 404 });
        }

        return NextResponse.json(family);
    } catch (error) {
        console.error("Error fetching family:", error);
        return NextResponse.json({ error: "Failed to fetch family" }, { status: 500 });
    }
}

// PUT update family
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

        // Update family
        const family = await prisma.family.update({
            where: { id },
            data: {
                name: data.familyName,
                relationship: data.relationship,
                hotelId: data.hotelId || null,
                coordinatorId: data.coordinatorId || null,
                arrivalDate: data.arrivalDate ? new Date(data.arrivalDate) : null,
                arrivalMode: data.arrivalMode || null,
                arrivalDetails: data.arrivalDetails || null,
                departureDate: data.departureDate ? new Date(data.departureDate) : null,
                departureMode: data.departureMode || null,
                departureDetails: data.departureDetails || null,
                foodBeforeSunset: data.foodBeforeSunset || false,
                foodRestrictions: data.foodRestrictions || null,
                roomRequirements: data.roomRequirements || null,
                transportNeeds: data.transportNeeds || null,
                specialNotes: data.specialNotes || null,
            },
        });

        // Handle members - update, create, or delete
        if (data.members) {
            const existingMembers = await prisma.user.findMany({
                where: { familyId: id },
            });

            const existingPhones = new Set(existingMembers.map(m => m.phone));
            const newPhones = new Set(data.members.map((m: { phone: string }) => m.phone));

            // Delete removed members
            for (const member of existingMembers) {
                if (!newPhones.has(member.phone)) {
                    await prisma.user.delete({ where: { id: member.id } });
                }
            }

            // Add/update members
            for (const member of data.members) {
                if (existingPhones.has(member.phone)) {
                    // Update existing
                    await prisma.user.update({
                        where: { phone: member.phone },
                        data: { name: member.name },
                    });
                } else {
                    // Check if phone exists in other family
                    const existingUser = await prisma.user.findUnique({
                        where: { phone: member.phone },
                    });

                    if (existingUser) {
                        // Move to this family
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: { familyId: id, name: member.name },
                        });
                    } else {
                        // Create new
                        await prisma.user.create({
                            data: {
                                name: member.name,
                                phone: member.phone,
                                role: "GUEST",
                                familyId: id,
                            },
                        });
                    }
                }
            }
        }

        return NextResponse.json(family);
    } catch (error) {
        console.error("Error updating family:", error);
        return NextResponse.json({ error: "Failed to update family" }, { status: 500 });
    }
}

// DELETE family
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

        // Delete members first
        await prisma.user.deleteMany({ where: { familyId: id } });
        // Delete family
        await prisma.family.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting family:", error);
        return NextResponse.json({ error: "Failed to delete family" }, { status: 500 });
    }
}
