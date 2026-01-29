import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function SuperAdminDashboard() {
    const session = await getSession();

    if (!session || session.user.role !== "SUPERADMIN") {
        redirect("/admin/login");
    }

    // Fetch comprehensive stats
    const [
        totalGuests,
        totalFamilies,
        totalHotels,
        totalCoordinators,
        totalEvents,
        totalAdmins,
        familiesWithHotel,
        familiesWithArrival,
    ] = await Promise.all([
        prisma.user.count({ where: { role: "GUEST" } }),
        prisma.family.count(),
        prisma.hotel.count(),
        prisma.coordinator.count(),
        prisma.event.count(),
        prisma.user.count({ where: { role: { in: ["ADMIN", "SUPERADMIN"] } } }),
        prisma.family.count({ where: { hotelId: { not: null } } }),
        prisma.family.count({ where: { arrivalDate: { not: null } } }),
    ]);

    // Get admin users
    const admins = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "SUPERADMIN"] } },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="page" style={{ background: "var(--color-bg-primary)", paddingBottom: "2rem" }}>
            {/* Header */}
            <div style={{
                background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
                padding: "1.5rem",
                color: "white"
            }}>
                <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <span style={{ fontSize: "0.75rem", background: "#EF4444", padding: "0.125rem 0.5rem", borderRadius: "999px" }}>SUPER ADMIN</span>
                        </div>
                        <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem" }}>
                            System Control Panel
                        </h1>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Link href="/admin" className="btn" style={{ background: "rgba(255,255,255,0.2)", color: "white", padding: "0.5rem 1rem" }}>
                            Admin Panel
                        </Link>
                        <form action="/api/auth/logout" method="POST">
                            <button type="submit" style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "0.5rem 1rem", borderRadius: "0.5rem", cursor: "pointer" }}>
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: "1.5rem" }}>
                {/* Stats Overview */}
                <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#6B7280", marginBottom: "1rem" }}>System Overview</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    <div className="card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#B76E79" }}>{totalGuests}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Total Guests</div>
                    </div>
                    <div className="card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#B76E79" }}>{totalFamilies}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Families</div>
                    </div>
                    <div className="card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#10B981" }}>{familiesWithHotel}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>With Hotel</div>
                    </div>
                    <div className="card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#F59E0B" }}>{familiesWithArrival}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>With Arrival</div>
                    </div>
                    <div className="card" style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.75rem", fontWeight: "700", color: "#6366F1" }}>{totalAdmins}</div>
                        <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Admins</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#6B7280", marginBottom: "1rem" }}>Quick Actions</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                    <Link href="/superadmin/admins" className="card card-hover" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontSize: "1.5rem" }}>👤</span>
                        <div>
                            <div style={{ fontWeight: "600" }}>Manage Admins</div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Add/edit admin accounts</div>
                        </div>
                    </Link>

                    <Link href="/superadmin/export" className="card card-hover" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontSize: "1.5rem" }}>📊</span>
                        <div>
                            <div style={{ fontWeight: "600" }}>Export Data</div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>Download CSV/Excel</div>
                        </div>
                    </Link>

                    <Link href="/admin/guests" className="card card-hover" style={{ display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", color: "inherit" }}>
                        <span style={{ fontSize: "1.5rem" }}>👥</span>
                        <div>
                            <div style={{ fontWeight: "600" }}>All Guests</div>
                            <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>View/manage guests</div>
                        </div>
                    </Link>
                </div>

                {/* Admins List */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#6B7280" }}>Administrator Accounts</h2>
                    <Link href="/superadmin/admins" style={{ fontSize: "0.875rem" }}>Manage →</Link>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.id}>
                                    <td style={{ fontWeight: "500" }}>{admin.name}</td>
                                    <td>{admin.phone}</td>
                                    <td>
                                        <span className={`badge ${admin.role === "SUPERADMIN" ? "badge-warning" : "badge-info"}`}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                                        {new Date(admin.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Data Integrity */}
                <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#6B7280", marginTop: "2rem", marginBottom: "1rem" }}>Data Status</h2>
                <div className="card">
                    <div style={{ display: "grid", gap: "0.75rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>Families with hotel assigned</span>
                            <span style={{ fontWeight: "600" }}>{familiesWithHotel}/{totalFamilies} ({totalFamilies > 0 ? Math.round(familiesWithHotel / totalFamilies * 100) : 0}%)</span>
                        </div>
                        <div style={{ height: "8px", background: "#E5E7EB", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${totalFamilies > 0 ? (familiesWithHotel / totalFamilies * 100) : 0}%`, background: "#10B981", borderRadius: "999px" }} />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                            <span>Families with arrival info</span>
                            <span style={{ fontWeight: "600" }}>{familiesWithArrival}/{totalFamilies} ({totalFamilies > 0 ? Math.round(familiesWithArrival / totalFamilies * 100) : 0}%)</span>
                        </div>
                        <div style={{ height: "8px", background: "#E5E7EB", borderRadius: "999px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${totalFamilies > 0 ? (familiesWithArrival / totalFamilies * 100) : 0}%`, background: "#F59E0B", borderRadius: "999px" }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
