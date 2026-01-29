import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET all families
export async function GET() {
    try {
        const session = await getSession();
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const families = await prisma.family.findMany({
            include: {
                members: true,
                hotel: true,
                coordinator: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(families);
    } catch (error) {
        console.error("Error fetching families:", error);
        return NextResponse.json({ error: "Failed to fetch families" }, { status: 500 });
    }
}

// POST create new family with members
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        // Create family
        const family = await prisma.family.create({
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

        // Create members (users with GUEST role)
        if (data.members && data.members.length > 0) {
            for (const member of data.members) {
                // Check if phone already exists
                const existingUser = await prisma.user.findUnique({
                    where: { phone: member.phone },
                });

                if (existingUser) {
                    // Update existing user to link to this family
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: { familyId: family.id, name: member.name },
                    });
                } else {
                    // Create new user
                    await prisma.user.create({
                        data: {
                            name: member.name,
                            phone: member.phone,
                            role: "GUEST",
                            familyId: family.id,
                        },
                    });
                }
            }
        }

        return NextResponse.json(family);
    } catch (error) {
        console.error("Error creating family:", error);
        return NextResponse.json({ error: "Failed to create family" }, { status: 500 });
    }
}
