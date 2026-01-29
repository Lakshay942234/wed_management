import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function GuestHotelPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    // Fetch family data with hotel info
    const family = session.user.familyId
        ? await prisma.family.findUnique({
            where: { id: session.user.familyId },
            include: {
                hotel: true,
            },
        })
        : null;

    return (
        <div className="page has-bottom-nav" style={{ background: "var(--color-bg-primary)" }}>
            {/* Header */}
            <div className="page-header" style={{ paddingBottom: "1rem" }}>
                <h1 className="page-title" style={{ fontSize: "1.5rem" }}>
                    🏨 Your Hotel
                </h1>
            </div>

            <div className="container" style={{ maxWidth: "600px" }}>
                {family?.hotel ? (
                    <>
                        {/* Hotel Card */}
                        <div className="card" style={{ marginBottom: "1rem" }}>
                            <h2 style={{
                                fontSize: "1.5rem",
                                fontFamily: "var(--font-playfair), Georgia, serif",
                                marginBottom: "1rem",
                                color: "#B76E79"
                            }}>
                                {family.hotel.name}
                            </h2>

                            {/* Address */}
                            <div style={{ marginBottom: "1.5rem" }}>
                                <div style={{
                                    fontSize: "0.75rem",
                                    color: "#9CA3AF",
                                    textTransform: "uppercase",
                                    marginBottom: "0.25rem"
                                }}>
                                    Address
                                </div>
                                <p style={{ fontSize: "1rem", lineHeight: "1.5" }}>
                                    {family.hotel.address}
                                </p>
                            </div>

                            {/* Contact */}
                            <div style={{ marginBottom: "1.5rem" }}>
                                <div style={{
                                    fontSize: "0.75rem",
                                    color: "#9CA3AF",
                                    textTransform: "uppercase",
                                    marginBottom: "0.25rem"
                                }}>
                                    Contact
                                </div>
                                <a
                                    href={`tel:${family.hotel.phone}`}
                                    className="btn btn-secondary"
                                    style={{
                                        display: "inline-flex",
                                        gap: "0.5rem",
                                        alignItems: "center"
                                    }}
                                >
                                    📞 {family.hotel.phone}
                                </a>
                            </div>

                            {/* Notes */}
                            {family.hotel.notes && (
                                <div>
                                    <div style={{
                                        fontSize: "0.75rem",
                                        color: "#9CA3AF",
                                        textTransform: "uppercase",
                                        marginBottom: "0.25rem"
                                    }}>
                                        Notes
                                    </div>
                                    <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                                        {family.hotel.notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Map Link */}
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(family.hotel.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{
                                width: "100%",
                                marginBottom: "1rem",
                                gap: "0.5rem"
                            }}
                        >
                            🗺️ Open in Google Maps
                        </a>

                        {/* Check-in info */}
                        <div className="card" style={{
                            background: "linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 100%)"
                        }}>
                            <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
                                ℹ️ Check-in Information
                            </h3>
                            <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                                Rooms are booked under the wedding party name.
                                Please mention your name at reception for a smooth check-in.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏨</div>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                            Hotel Not Assigned Yet
                        </h2>
                        <p style={{ color: "#6B7280" }}>
                            Your hotel information will be updated soon.
                            Please check back later.
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="nav-bottom">
                <Link href="/guest" className="nav-item">
                    <span>🏠</span>
                    <span>Home</span>
                </Link>
                <Link href="/guest/schedule" className="nav-item">
                    <span>📅</span>
                    <span>Schedule</span>
                </Link>
                <Link href="/guest/hotel" className="nav-item active">
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
