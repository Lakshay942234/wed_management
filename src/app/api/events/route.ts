import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET all events
export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: [{ date: "asc" }, { order: "asc" }],
        });
        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

// POST create event
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        const event = await prisma.event.create({
            data: {
                name: data.name,
                date: new Date(data.date),
                startTime: data.startTime,
                endTime: data.endTime || null,
                venue: data.venue,
                notes: data.notes || null,
                order: data.order || 0,
            },
        });

        return NextResponse.json(event);
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}
