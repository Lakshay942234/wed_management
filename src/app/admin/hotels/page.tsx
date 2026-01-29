"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Hotel {
    id: string;
    name: string;
    address: string;
    phone: string;
    notes?: string;
}

export default function AdminHotelsPage() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", address: "", phone: "", notes: "" });

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        const res = await fetch("/api/hotels");
        if (res.ok) setHotels(await res.json());
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editId ? `/api/hotels/${editId}` : "/api/hotels";
        const method = editId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            fetchHotels();
            setShowForm(false);
            setEditId(null);
            setFormData({ name: "", address: "", phone: "", notes: "" });
        }
    };

    const startEdit = (hotel: Hotel) => {
        setFormData({ name: hotel.name, address: hotel.address, phone: hotel.phone, notes: hotel.notes || "" });
        setEditId(hotel.id);
        setShowForm(true);
    };

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
                                🏨 Manage Hotels
                            </h1>
                        </div>
                        <button onClick={() => { setShowForm(true); setEditId(null); setFormData({ name: "", address: "", phone: "", notes: "" }); }}
                            className="btn" style={{ background: "white", color: "#B76E79" }}>+ Add Hotel</button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: "1.5rem", paddingBottom: "2rem", maxWidth: "800px" }}>
                {showForm && (
                    <div className="card" style={{ marginBottom: "1.5rem" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#B76E79" }}>
                            {editId ? "Edit Hotel" : "Add New Hotel"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Hotel Name *</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Address *</label>
                                <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required rows={2} />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Phone *</label>
                                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Notes</label>
                                <input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Optional notes" />
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="btn btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {hotels.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏨</div>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No Hotels Yet</h2>
                        <p style={{ color: "#6B7280" }}>Add hotels to assign guests.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {hotels.map((hotel) => (
                            <div key={hotel.id} className="card card-hover">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <h3 style={{ fontWeight: "600", marginBottom: "0.25rem" }}>{hotel.name}</h3>
                                        <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "0.25rem" }}>{hotel.address}</p>
                                        <p style={{ fontSize: "0.875rem", color: "#B76E79" }}>📞 {hotel.phone}</p>
                                    </div>
                                    <button onClick={() => startEdit(hotel)} className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Edit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
