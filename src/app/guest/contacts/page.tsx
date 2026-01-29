import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function GuestContactsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    // Fetch family's assigned coordinator
    const family = session.user.familyId
        ? await prisma.family.findUnique({
            where: { id: session.user.familyId },
            include: {
                coordinator: true,
            },
        })
        : null;

    // Fetch all coordinators for reference
    const allCoordinators = await prisma.coordinator.findMany({
        orderBy: { type: "asc" },
    });

    const airportCoordinators = allCoordinators.filter(c => c.type === "AIRPORT");
    const hotelCoordinators = allCoordinators.filter(c => c.type === "HOTEL");

    return (
        <div className="page has-bottom-nav" style={{ background: "var(--color-bg-primary)" }}>
            {/* Header */}
            <div className="page-header" style={{ paddingBottom: "1rem" }}>
                <h1 className="page-title" style={{ fontSize: "1.5rem" }}>
                    📞 Contacts
                </h1>
                <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>
                    Your coordinators and help contacts
                </p>
            </div>

            <div className="container" style={{ maxWidth: "600px" }}>
                {/* Your Assigned Coordinator */}
                {family?.coordinator && (
                    <div className="info-card" style={{
                        marginBottom: "1.5rem",
                        borderLeftColor: "#10B981"
                    }}>
                        <div className="info-card-title" style={{ color: "#10B981" }}>
                            ⭐ Your Assigned Coordinator
                        </div>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div>
                                <div style={{ fontWeight: "600", fontSize: "1.125rem" }}>
                                    {family.coordinator.name}
                                </div>
                                <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                                    {family.coordinator.area}
                                </div>
                            </div>
                            <a
                                href={`tel:${family.coordinator.phone}`}
                                className="btn btn-primary"
                                style={{ padding: "0.5rem 1rem" }}
                            >
                                📞 Call
                            </a>
                        </div>
                    </div>
                )}

                {/* Airport Coordinators */}
                {airportCoordinators.length > 0 && (
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h2 style={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#6B7280",
                            marginBottom: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            ✈️ Airport Coordinators
                        </h2>
                        <div className="card">
                            {airportCoordinators.map((coordinator, index) => (
                                <div
                                    key={coordinator.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "0.75rem 0",
                                        borderBottom: index < airportCoordinators.length - 1 ? "1px solid #F3F4F6" : "none"
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: "500" }}>{coordinator.name}</div>
                                        <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                                            {coordinator.area}
                                        </div>
                                    </div>
                                    <a
                                        href={`tel:${coordinator.phone}`}
                                        style={{
                                            color: "#B76E79",
                                            fontWeight: "500",
                                            fontSize: "0.875rem"
                                        }}
                                    >
                                        {coordinator.phone}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hotel Coordinators */}
                {hotelCoordinators.length > 0 && (
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h2 style={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#6B7280",
                            marginBottom: "0.75rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            🏨 Hotel Coordinators
                        </h2>
                        <div className="card">
                            {hotelCoordinators.map((coordinator, index) => (
                                <div
                                    key={coordinator.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "0.75rem 0",
                                        borderBottom: index < hotelCoordinators.length - 1 ? "1px solid #F3F4F6" : "none"
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: "500" }}>{coordinator.name}</div>
                                        <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                                            {coordinator.area}
                                        </div>
                                    </div>
                                    <a
                                        href={`tel:${coordinator.phone}`}
                                        style={{
                                            color: "#B76E79",
                                            fontWeight: "500",
                                            fontSize: "0.875rem"
                                        }}
                                    >
                                        {coordinator.phone}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No coordinators message */}
                {allCoordinators.length === 0 && !family?.coordinator && (
                    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📞</div>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                            Contacts Coming Soon
                        </h2>
                        <p style={{ color: "#6B7280" }}>
                            Coordinator contacts will be shared shortly.
                        </p>
                    </div>
                )}

                {/* Emergency Info */}
                <div className="card" style={{
                    background: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)",
                    marginTop: "1rem"
                }}>
                    <h3 style={{ fontSize: "1rem", marginBottom: "0.5rem", color: "#991B1B" }}>
                        🚨 Emergency
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "#991B1B" }}>
                        In case of any emergency, please contact your assigned coordinator
                        or dial the local emergency services.
                    </p>
                </div>
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
                <Link href="/guest/hotel" className="nav-item">
                    <span>🏨</span>
                    <span>Hotel</span>
                </Link>
                <Link href="/guest/contacts" className="nav-item active">
                    <span>📞</span>
                    <span>Contacts</span>
                </Link>
            </nav>
        </div>
    );
}
