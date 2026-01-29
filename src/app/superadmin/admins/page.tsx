"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Admin {
    id: string;
    name: string;
    phone: string;
    role: string;
    createdAt: string;
}

export default function ManageAdminsPage() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", phone: "", password: "", role: "ADMIN" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        const res = await fetch("/api/admins");
        if (res.ok) setAdmins(await res.json());
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const res = await fetch("/api/admins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            fetchAdmins();
            setShowForm(false);
            setFormData({ name: "", phone: "", password: "", role: "ADMIN" });
        } else {
            const data = await res.json();
            alert(data.error || "Failed to create admin");
        }
        setSaving(false);
    };

    const deleteAdmin = async (id: string) => {
        if (!confirm("Delete this admin account?")) return;
        const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
        if (res.ok) fetchAdmins();
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
            <div style={{ background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)", padding: "1.5rem", color: "white" }}>
                <div className="container">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <Link href="/superadmin" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>← Back</Link>
                            <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", marginTop: "0.5rem" }}>
                                👤 Manage Administrators
                            </h1>
                        </div>
                        <button onClick={() => setShowForm(true)} className="btn" style={{ background: "white", color: "#374151" }}>
                            + Add Admin
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: "1.5rem", paddingBottom: "2rem", maxWidth: "800px" }}>
                {showForm && (
                    <div className="card" style={{ marginBottom: "1.5rem" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>
                            Create Admin Account
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
                                <label>Password *</label>
                                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Role *</label>
                                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="ADMIN">Admin</option>
                                    <option value="SUPERADMIN">Super Admin</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Creating..." : "Create Admin"}</button>
                                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {admins.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👤</div>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No Admins Yet</h2>
                        <p style={{ color: "#6B7280" }}>Create admin accounts to manage guests.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Created</th>
                                    <th>Actions</th>
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
                                        <td>
                                            <button onClick={() => deleteAdmin(admin.id)} style={{ color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem" }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
