import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function AdminDashboard() {
    const session = await getSession();

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
        redirect("/admin/login");
    }

    // Fetch stats
    const [
        guestCount,
        familyCount,
        hotelCount,
        coordinatorCount,
        eventCount,
    ] = await Promise.all([
        prisma.user.count({ where: { role: "GUEST" } }),
        prisma.family.count(),
        prisma.hotel.count(),
        prisma.coordinator.count(),
        prisma.event.count(),
    ]);

    // Get recent families
    const recentFamilies = await prisma.family.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
            hotel: true,
            members: true,
        },
    });

    return (
        <div className="page" style={{
            background: "var(--color-bg-primary)",
            paddingBottom: "2rem"
        }}>
            {/* Header */}
            <div style={{
                background: "linear-gradient(135deg, #B76E79 0%, #C4938B 100%)",
                padding: "1.5rem",
                color: "white"
            }}>
                <div className="container" style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div>
                        <h1 style={{
                            fontFamily: "var(--font-playfair), Georgia, serif",
                            fontSize: "1.5rem",
                            marginBottom: "0.25rem"
                        }}>
                            Admin Dashboard
                        </h1>
                        <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>
                            Welcome, {session.user.name}
                        </p>
                    </div>
                    <form action="/api/auth/logout" method="POST">
                        <button
                            type="submit"
                            style={{
                                background: "rgba(255,255,255,0.2)",
                                border: "none",
                                color: "white",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.5rem",
                                cursor: "pointer",
                                fontSize: "0.875rem"
                            }}
                        >
                            Logout
                        </button>
                    </form>
                </div>
            </div>

            <div className="container" style={{ marginTop: "1.5rem" }}>
                {/* Stats Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "1rem",
                    marginBottom: "2rem"
                }}>
                    <div className="card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", fontWeight: "700", color: "#B76E79" }}>
                            {guestCount}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>Guests</div>
                    </div>
                    <div className="card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", fontWeight: "700", color: "#B76E79" }}>
                            {familyCount}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>Families</div>
                    </div>
                    <div className="card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", fontWeight: "700", color: "#B76E79" }}>
                            {hotelCount}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>Hotels</div>
                    </div>
                    <div className="card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "2rem", fontWeight: "700", color: "#B76E79" }}>
                            {eventCount}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>Events</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    color: "#6B7280"
                }}>
                    Quick Actions
                </h2>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1rem",
                    marginBottom: "2rem"
                }}>
                    <Link href="/admin/guests" className="card card-hover" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        textDecoration: "none",
                        color: "inherit"
                    }}>
                        <span style={{ fontSize: "1.5rem" }}>👥</span>
                        <div>
                            <div style={{ fontWeight: "600" }}>Manage Guests</div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Add, edit, assign hotels</div>
                        </div>
                    </Link>

                    <Link href="/admin/hotels" className="card card-hover" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        textDecoration: "none",
                        color: "inherit"
                    }}>
                        <span style={{ fontSize: "1.5rem" }}>🏨</span>
                        <div>
                            <div style={{ fontWeight: "600" }}>Manage Hotels</div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Add, edit hotels</div>
                        </div>
                    </Link>

                    <Link href="/admin/coordinators" className="card card-hover" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        textDecoration: "none",
                        color: "inherit"
                    }}>
                        <span style={{ fontSize: "1.5rem" }}>📞</span>
                        <div>
                            <div style={{ fontWeight: "600" }}>Coordinators</div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage coordinators</div>
                        </div>
                    </Link>

                    <Link href="/admin/events" className="card card-hover" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        textDecoration: "none",
                        color: "inherit"
                    }}>
                        <span style={{ fontSize: "1.5rem" }}>📅</span>
                        <div>
                            <div style={{ fontWeight: "600" }}>Event Schedule</div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Manage events</div>
                        </div>
                    </Link>
                </div>

                {/* Recent Families */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem"
                }}>
                    <h2 style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#6B7280"
                    }}>
                        Recent Families
                    </h2>
                    <Link href="/admin/guests" style={{ fontSize: "0.875rem" }}>
                        View All →
                    </Link>
                </div>

                {recentFamilies.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
                        <p style={{ color: "#6B7280" }}>No families added yet.</p>
                        <Link href="/admin/guests/new" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                            + Add First Guest
                        </Link>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Family</th>
                                    <th className="hide-mobile">Members</th>
                                    <th className="hide-mobile">Hotel</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentFamilies.map((family) => (
                                    <tr key={family.id}>
                                        <td>
                                            <div style={{ fontWeight: "500" }}>{family.name}</div>
                                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                                                {family.relationship}
                                            </div>
                                        </td>
                                        <td className="hide-mobile">
                                            <span className="badge badge-info">
                                                {family.members.length}
                                            </span>
                                        </td>
                                        <td className="hide-mobile">
                                            {family.hotel?.name || "-"}
                                        </td>
                                        <td>
                                            <Link
                                                href={`/admin/guests/${family.id}`}
                                                style={{ color: "#B76E79", fontSize: "0.875rem" }}
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Super Admin Link */}
                {session.user.role === "SUPERADMIN" && (
                    <div style={{ marginTop: "2rem" }}>
                        <Link
                            href="/superadmin"
                            className="btn btn-secondary"
                            style={{ width: "100%" }}
                        >
                            🔐 Super Admin Panel
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
