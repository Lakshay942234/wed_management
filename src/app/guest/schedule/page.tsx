import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function GuestSchedulePage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    // Fetch all events
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
            year: "numeric",
        });
    };

    const getDateLabel = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 0) return "Today";
        if (diff === 1) return "Tomorrow";
        return formatDate(date);
    };

    return (
        <div className="page has-bottom-nav" style={{ background: "var(--color-bg-primary)" }}>
            {/* Header */}
            <div className="page-header" style={{ paddingBottom: "1rem" }}>
                <h1 className="page-title" style={{ fontSize: "1.5rem" }}>
                    📅 Event Schedule
                </h1>
                <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    13 - 15 April 2026
                </p>
            </div>

            <div className="container" style={{ maxWidth: "600px" }}>
                {Object.keys(eventsByDate).length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                            Schedule Coming Soon
                        </h2>
                        <p style={{ color: "#6B7280" }}>
                            The event schedule will be published shortly.
                        </p>
                    </div>
                ) : (
                    Object.entries(eventsByDate).map(([dateKey, dayEvents]) => (
                        <div key={dateKey} style={{ marginBottom: "1.5rem" }}>
                            {/* Date Header */}
                            <div style={{
                                position: "sticky",
                                top: "0",
                                background: "var(--color-bg-primary)",
                                padding: "0.75rem 0",
                                zIndex: 10
                            }}>
                                <h2 style={{
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                    color: "#B76E79",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem"
                                }}>
                                    <span style={{
                                        background: "linear-gradient(135deg, #B76E79 0%, #C4938B 100%)",
                                        color: "white",
                                        padding: "0.25rem 0.75rem",
                                        borderRadius: "999px",
                                        fontSize: "0.75rem"
                                    }}>
                                        {getDateLabel(dateKey)}
                                    </span>
                                </h2>
                            </div>

                            {/* Events for this day */}
                            <div className="card">
                                {dayEvents.map((event, index) => (
                                    <div
                                        key={event.id}
                                        className="event-item"
                                        style={{
                                            borderBottom: index < dayEvents.length - 1 ? "1px solid #F3F4F6" : "none"
                                        }}
                                    >
                                        <div className="event-time">
                                            {event.startTime}
                                            {event.endTime && (
                                                <span style={{
                                                    display: "block",
                                                    fontSize: "0.75rem",
                                                    color: "#9CA3AF"
                                                }}>
                                                    to {event.endTime}
                                                </span>
                                            )}
                                        </div>
                                        <div className="event-details">
                                            <div className="event-name">{event.name}</div>
                                            <div className="event-venue">
                                                📍 {event.venue}
                                            </div>
                                            {event.notes && (
                                                <div style={{
                                                    fontSize: "0.8rem",
                                                    color: "#6B7280",
                                                    marginTop: "0.25rem",
                                                    fontStyle: "italic"
                                                }}>
                                                    {event.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="nav-bottom">
                <Link href="/guest" className="nav-item">
                    <span>🏠</span>
                    <span>Home</span>
                </Link>
                <Link href="/guest/schedule" className="nav-item active">
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
