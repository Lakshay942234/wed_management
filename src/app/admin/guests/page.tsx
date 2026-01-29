"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Family {
    id: string;
    name: string;
    relationship: string;
    hotel?: { id: string; name: string } | null;
    members: { id: string; name: string; phone: string }[];
    arrivalDate?: string | null;
    departureDate?: string | null;
}

export default function AdminGuestsPage() {
    const router = useRouter();
    const [families, setFamilies] = useState<Family[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ hotel: "", arrival: "", departure: "" });
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchFamilies();
    }, []);

    const fetchFamilies = async () => {
        try {
            const res = await fetch("/api/families");
            if (res.ok) {
                const data = await res.json();
                setFamilies(data);
            }
        } catch (error) {
            console.error("Error fetching families:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredFamilies = families.filter((family) => {
        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            const matchesName = family.name.toLowerCase().includes(searchLower);
            const matchesMember = family.members.some(
                (m) => m.name.toLowerCase().includes(searchLower) || m.phone.includes(search)
            );
            if (!matchesName && !matchesMember) return false;
        }

        // Hotel filter
        if (filter.hotel && family.hotel?.id !== filter.hotel) return false;

        return true;
    });

    if (loading) {
        return (
            <div className="page" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh"
            }}>
                <div className="spinner" style={{ width: "40px", height: "40px" }} />
            </div>
        );
    }

    return (
        <div className="page" style={{ background: "var(--color-bg-primary)" }}>
            {/* Header */}
            <div style={{
                background: "linear-gradient(135deg, #B76E79 0%, #C4938B 100%)",
                padding: "1.5rem",
                color: "white"
            }}>
                <div className="container">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <Link href="/admin" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>
                                ← Back to Dashboard
                            </Link>
                            <h1 style={{
                                fontFamily: "var(--font-playfair), Georgia, serif",
                                fontSize: "1.5rem",
                                marginTop: "0.5rem"
                            }}>
                                👥 Manage Guests
                            </h1>
                        </div>
                        <Link
                            href="/admin/guests/new"
                            className="btn"
                            style={{
                                background: "white",
                                color: "#B76E79"
                            }}
                        >
                            + Add Guest
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: "1.5rem", paddingBottom: "2rem" }}>
                {/* Search and Filters */}
                <div className="card" style={{ marginBottom: "1.5rem" }}>
                    <div style={{ marginBottom: "1rem" }}>
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        fontSize: "0.875rem"
                    }}>
                        <span style={{ color: "#6B7280" }}>
                            {filteredFamilies.length} families • {filteredFamilies.reduce((acc, f) => acc + f.members.length, 0)} guests
                        </span>
                    </div>
                </div>

                {/* Families List */}
                {filteredFamilies.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👥</div>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                            No Guests Found
                        </h2>
                        <p style={{ color: "#6B7280", marginBottom: "1rem" }}>
                            {search ? "Try a different search term" : "Start by adding your first guest"}
                        </p>
                        {!search && (
                            <Link href="/admin/guests/new" className="btn btn-primary">
                                + Add First Guest
                            </Link>
                        )}
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {filteredFamilies.map((family) => (
                            <div key={family.id} className="card card-hover">
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "0.75rem"
                                }}>
                                    <div>
                                        <h3 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                                            {family.name}
                                        </h3>
                                        <span className="badge badge-info">{family.relationship}</span>
                                    </div>
                                    <Link
                                        href={`/admin/guests/${family.id}`}
                                        className="btn btn-secondary"
                                        style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                                    >
                                        Edit
                                    </Link>
                                </div>

                                {/* Members */}
                                <div style={{ marginBottom: "0.75rem" }}>
                                    <div style={{
                                        fontSize: "0.75rem",
                                        color: "#9CA3AF",
                                        marginBottom: "0.25rem",
                                        textTransform: "uppercase"
                                    }}>
                                        Members ({family.members.length})
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                        {family.members.map((member) => (
                                            <span key={member.id} className="badge badge-success">
                                                {member.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Details */}
                                <div style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "1rem",
                                    fontSize: "0.875rem",
                                    color: "#6B7280"
                                }}>
                                    {family.hotel && (
                                        <span>🏨 {family.hotel.name}</span>
                                    )}
                                    {family.arrivalDate && (
                                        <span>📅 Arr: {new Date(family.arrivalDate).toLocaleDateString()}</span>
                                    )}
                                    {family.departureDate && (
                                        <span>📅 Dep: {new Date(family.departureDate).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
