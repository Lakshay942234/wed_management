import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== "SUPERADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        let csv = "";

        switch (type) {
            case "guests": {
                const families = await prisma.family.findMany({
                    include: {
                        members: true,
                        hotel: true,
                        coordinator: true,
                    },
                });

                csv = "Family Name,Relationship,Member Names,Member Phones,Hotel,Arrival Date,Arrival Mode,Arrival Details,Departure Date,Departure Mode,Departure Details,Coordinator,Food Before Sunset,Food Restrictions,Room Requirements,Transport Needs,Special Notes\n";

                for (const family of families) {
                    const members = family.members.map(m => m.name).join("; ");
                    const phones = family.members.map(m => m.phone).join("; ");
                    const row = [
                        family.name,
                        family.relationship,
                        members,
                        phones,
                        family.hotel?.name || "",
                        family.arrivalDate?.toISOString().split("T")[0] || "",
                        family.arrivalMode || "",
                        family.arrivalDetails || "",
                        family.departureDate?.toISOString().split("T")[0] || "",
                        family.departureMode || "",
                        family.departureDetails || "",
                        family.coordinator?.name || "",
                        family.foodBeforeSunset ? "Yes" : "No",
                        family.foodRestrictions || "",
                        family.roomRequirements || "",
                        family.transportNeeds || "",
                        family.specialNotes || "",
                    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
                    csv += row + "\n";
                }
                break;
            }

            case "hotels": {
                const hotels = await prisma.hotel.findMany();
                csv = "Name,Address,Phone,Notes\n";
                for (const hotel of hotels) {
                    const row = [hotel.name, hotel.address, hotel.phone, hotel.notes || ""]
                        .map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
                    csv += row + "\n";
                }
                break;
            }

            case "events": {
                const events = await prisma.event.findMany({ orderBy: [{ date: "asc" }, { order: "asc" }] });
                csv = "Name,Date,Start Time,End Time,Venue,Notes\n";
                for (const event of events) {
                    const row = [
                        event.name,
                        event.date.toISOString().split("T")[0],
                        event.startTime,
                        event.endTime || "",
                        event.venue,
                        event.notes || "",
                    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
                    csv += row + "\n";
                }
                break;
            }

            case "coordinators": {
                const coordinators = await prisma.coordinator.findMany();
                csv = "Name,Phone,Type,Area\n";
                for (const coord of coordinators) {
                    const row = [coord.name, coord.phone, coord.type, coord.area]
                        .map(v => `"${String(v).replace(/"/g, '""')}"`).join(",");
                    csv += row + "\n";
                }
                break;
            }

            default:
                return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
        }

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="wedding-${type}.csv"`,
            },
        });
    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
