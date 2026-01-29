"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Coordinator {
    id: string;
    name: string;
    phone: string;
    area: string;
    type: string;
}

export default function AdminCoordinatorsPage() {
    const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", phone: "", area: "", type: "HOTEL" });

    useEffect(() => {
        fetchCoordinators();
    }, []);

    const fetchCoordinators = async () => {
        const res = await fetch("/api/coordinators");
        if (res.ok) setCoordinators(await res.json());
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editId ? `/api/coordinators/${editId}` : "/api/coordinators";
        const method = editId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            fetchCoordinators();
            setShowForm(false);
            setEditId(null);
            setFormData({ name: "", phone: "", area: "", type: "HOTEL" });
        }
    };

    const startEdit = (coord: Coordinator) => {
        setFormData({ name: coord.name, phone: coord.phone, area: coord.area, type: coord.type });
        setEditId(coord.id);
        setShowForm(true);
    };

    const airportCoords = coordinators.filter(c => c.type === "AIRPORT");
    const hotelCoords = coordinators.filter(c => c.type === "HOTEL");

    if (loading) {
        return (
            <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                <div className="spinner" style={{ width: "40px", height: "40px" }} />
            </div>
        );
    }

    return (
        <div className="page" style={{ background: "var(--color-bg-primary)" }}>
            <div style={{ background: "linear-gradient(135deg, #B76E79 0%, #C4938B 100%)", padding: "1.5rem", color: "white" }}>
                <div className="container">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <Link href="/admin" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>← Back</Link>
                            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", marginTop: "0.5rem" }}>
                                📞 Manage Coordinators
                            </h1>
                        </div>
                        <button onClick={() => { setShowForm(true); setEditId(null); setFormData({ name: "", phone: "", area: "", type: "HOTEL" }); }}
                            className="btn" style={{ background: "white", color: "#B76E79" }}>+ Add</button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: "1.5rem", paddingBottom: "2rem", maxWidth: "800px" }}>
                {showForm && (
                    <div className="card" style={{ marginBottom: "1.5rem" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#B76E79" }}>
                            {editId ? "Edit Coordinator" : "Add New Coordinator"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Name *</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Phone *</label>
                                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Type *</label>
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required>
                                    <option value="AIRPORT">✈️ Airport Coordinator</option>
                                    <option value="HOTEL">🏨 Hotel Coordinator</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Area of Responsibility *</label>
                                <input type="text" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                    placeholder="e.g., Delhi Airport, Hotel Grand" required />
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="btn btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {coordinators.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📞</div>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No Coordinators Yet</h2>
                        <p style={{ color: "#6B7280" }}>Add coordinators to help guests.</p>
                    </div>
                ) : (
                    <>
                        {airportCoords.length > 0 && (
                            <div style={{ marginBottom: "1.5rem" }}>
                                <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#6B7280", marginBottom: "0.75rem" }}>
                                    ✈️ Airport Coordinators ({airportCoords.length})
                                </h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    {airportCoords.map((coord) => (
                                        <div key={coord.id} className="card card-hover">
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div>
                                                    <h3 style={{ fontWeight: "600" }}>{coord.name}</h3>
                                                    <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>{coord.area}</p>
                                                    <p style={{ fontSize: "0.875rem", color: "#B76E79" }}>📞 {coord.phone}</p>
                                                </div>
                                                <button onClick={() => startEdit(coord)} className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Edit</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {hotelCoords.length > 0 && (
                            <div>
                                <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#6B7280", marginBottom: "0.75rem" }}>
                                    🏨 Hotel Coordinators ({hotelCoords.length})
                                </h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    {hotelCoords.map((coord) => (
                                        <div key={coord.id} className="card card-hover">
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div>
                                                    <h3 style={{ fontWeight: "600" }}>{coord.name}</h3>
                                                    <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>{coord.area}</p>
                                                    <p style={{ fontSize: "0.875rem", color: "#B76E79" }}>📞 {coord.phone}</p>
                                                </div>
                                                <button onClick={() => startEdit(coord)} className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Edit</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
