import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function GuestDashboard() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    // Fetch family data with all related info
    const family = session.user.familyId
        ? await prisma.family.findUnique({
            where: { id: session.user.familyId },
            include: {
                hotel: true,
                coordinator: true,
                members: true,
            },
        })
        : null;

    // Fetch events
    const events = await prisma.event.findMany({
        orderBy: [{ date: "asc" }, { order: "asc" }],
    });

    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
        const dateKey = event.date.toISOString().split("T")[0];
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
    }, {} as Record<string, typeof events>);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
        });
    };

    return (
        <div className="page has-bottom-nav" style={{ background: "var(--color-bg-primary)" }}>
            {/* Header */}
            <div className="page-header" style={{ paddingBottom: "1rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>💍</div>
                <h1 className="page-title" style={{ fontSize: "1.5rem" }}>
                    Welcome, {session.user.name}
                </h1>
                <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    13 - 15 April 2026
                </p>
            </div>

            <div className="container" style={{ maxWidth: "600px" }}>
                {/* Hotel Info Card */}
                {family?.hotel && (
                    <div className="info-card card-hover" style={{ marginBottom: "1rem" }}>
                        <div className="info-card-title">🏨 Your Hotel</div>
                        <div className="info-card-content" style={{ fontWeight: "600" }}>
                            {family.hotel.name}
                        </div>
                        <div style={{
                            marginTop: "0.5rem",
                            fontSize: "0.875rem",
                            color: "#6B7280",
                            lineHeight: "1.5"
                        }}>
                            <p>{family.hotel.address}</p>
                            <p style={{ marginTop: "0.25rem" }}>
                                📞 <a href={`tel:${family.hotel.phone}`} style={{ color: "inherit" }}>
                                    {family.hotel.phone}
                                </a>
                            </p>
                        </div>
                    </div>
                )}

                {/* Coordinator Card */}
                {family?.coordinator && (
                    <div className="info-card card-hover" style={{ marginBottom: "1rem" }}>
                        <div className="info-card-title">
                            {family.coordinator.type === "AIRPORT" ? "✈️" : "🏨"} Your Coordinator
                        </div>
                        <div className="info-card-content" style={{ fontWeight: "600" }}>
                            {family.coordinator.name}
                        </div>
                        <div style={{
                            marginTop: "0.5rem",
                            fontSize: "0.875rem",
                            color: "#6B7280"
                        }}>
                            <p>{family.coordinator.area}</p>
                            <p style={{ marginTop: "0.25rem" }}>
                                📞 <a href={`tel:${family.coordinator.phone}`} style={{ color: "inherit" }}>
                                    {family.coordinator.phone}
                                </a>
                            </p>
                        </div>
                    </div>
                )}

                {/* Arrival/Departure Info */}
                {(family?.arrivalDate || family?.departureDate) && (
                    <div className="info-card card-hover" style={{ marginBottom: "1rem" }}>
                        <div className="info-card-title">🚗 Your Travel</div>
                        {family?.arrivalDate && (
                            <div style={{ marginBottom: "0.75rem" }}>
                                <div style={{ fontSize: "0.75rem", color: "#9CA3AF", textTransform: "uppercase" }}>
                                    Arrival
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {formatDate(family.arrivalDate)}
                                </div>
                                <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                                    {family.arrivalMode} • {family.arrivalDetails}
                                </div>
                            </div>
                        )}
                        {family?.departureDate && (
                            <div>
                                <div style={{ fontSize: "0.75rem", color: "#9CA3AF", textTransform: "uppercase" }}>
                                    Departure
                                </div>
                                <div style={{ fontWeight: "600" }}>
                                    {formatDate(family.departureDate)}
                                </div>
                                <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                                    {family.departureMode} • {family.departureDetails}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Special Requirements */}
                {(family?.foodRestrictions || family?.roomRequirements || family?.transportNeeds || family?.specialNotes) && (
                    <div className="info-card card-hover" style={{ marginBottom: "1rem" }}>
                        <div className="info-card-title">📝 Your Preferences</div>
                        {family?.foodBeforeSunset && (
                            <div className="badge badge-info" style={{ marginBottom: "0.5rem" }}>
                                🌅 Food before sunset
                            </div>
                        )}
                        {family?.foodRestrictions && (
                            <p style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                                <strong>Food:</strong> {family.foodRestrictions}
                            </p>
                        )}
                        {family?.roomRequirements && (
                            <p style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                                <strong>Room:</strong> {family.roomRequirements}
                            </p>
                        )}
                        {family?.transportNeeds && (
                            <p style={{ fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                                <strong>Transport:</strong> {family.transportNeeds}
                            </p>
                        )}
                        {family?.specialNotes && (
                            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                                {family.specialNotes}
                            </p>
                        )}
                    </div>
                )}

                {/* Family Members */}
                {family?.members && family.members.length > 1 && (
                    <div className="info-card card-hover" style={{ marginBottom: "1rem" }}>
                        <div className="info-card-title">👨‍👩‍👧‍👦 Your Family</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                            {family.members.map((member) => (
                                <span key={member.id} className="badge badge-success">
                                    {member.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Event Schedule Preview */}
                <div className="card" style={{ marginBottom: "1rem" }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem"
                    }}>
                        <h2 style={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#B76E79",
                            margin: 0
                        }}>
                            📅 Event Schedule
                        </h2>
                        <Link
                            href="/guest/schedule"
                            style={{ fontSize: "0.875rem", color: "#6B7280" }}
                        >
                            View All →
                        </Link>
                    </div>

                    {Object.keys(eventsByDate).length === 0 ? (
                        <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>
                            Schedule coming soon...
                        </p>
                    ) : (
                        Object.entries(eventsByDate).slice(0, 1).map(([dateKey, dayEvents]) => (
                            <div key={dateKey}>
                                <div style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color: "#6B7280",
                                    marginBottom: "0.5rem"
                                }}>
                                    {formatDate(new Date(dateKey))}
                                </div>
                                {dayEvents.slice(0, 3).map((event) => (
                                    <div key={event.id} className="event-item" style={{
                                        padding: "0.5rem 0",
                                        borderBottom: "1px solid #F3F4F6"
                                    }}>
                                        <div className="event-time" style={{ minWidth: "60px" }}>
                                            {event.startTime}
                                        </div>
                                        <div className="event-details">
                                            <div className="event-name">{event.name}</div>
                                            <div className="event-venue">{event.venue}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>

                {/* Help Section */}
                <div className="card" style={{
                    background: "linear-gradient(135deg, #FEF3C7 0%, #FEF9C3 100%)",
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🆘</div>
                    <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Need Help?</h3>
                    <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                        Contact your coordinator or the event organizers for any assistance.
                    </p>
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="nav-bottom">
                <Link href="/guest" className="nav-item active">
                    <span>🏠</span>
                    <span>Home</span>
                </Link>
                <Link href="/guest/schedule" className="nav-item">
                    <span>📅</span>
                    <span>Schedule</span>
                </Link>
                <Link href="/guest/hotel" className="nav-item">
                    <span>🏨</span>
                    <span>Hotel</span>
                </Link>
                <Link href="/guest/contacts" className="nav-item">
                    <span>📞</span>
                    <span>Contacts</span>
                </Link>
            </nav>
        </div>
    );
}
