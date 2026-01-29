"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Hotel { id: string; name: string; }
interface Coordinator { id: string; name: string; type: string; }
interface Member { id?: string; name: string; phone: string; }
interface Family {
    id: string;
    name: string;
    relationship: string;
    hotelId?: string;
    coordinatorId?: string;
    arrivalDate?: string;
    arrivalMode?: string;
    arrivalDetails?: string;
    departureDate?: string;
    departureMode?: string;
    departureDetails?: string;
    foodBeforeSunset: boolean;
    foodRestrictions?: string;
    roomRequirements?: string;
    transportNeeds?: string;
    specialNotes?: string;
    members: Member[];
}

export default function EditGuestPage() {
    const router = useRouter();
    const params = useParams();
    const familyId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [coordinators, setCoordinators] = useState<Coordinator[]>([]);

    const [formData, setFormData] = useState({
        familyName: "",
        relationship: "",
        hotelId: "",
        coordinatorId: "",
        arrivalDate: "",
        arrivalMode: "",
        arrivalDetails: "",
        departureDate: "",
        departureMode: "",
        departureDetails: "",
        foodBeforeSunset: false,
        foodRestrictions: "",
        roomRequirements: "",
        transportNeeds: "",
        specialNotes: "",
    });

    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        Promise.all([
            fetch("/api/hotels").then(r => r.json()),
            fetch("/api/coordinators").then(r => r.json()),
            fetch(`/api/families/${familyId}`).then(r => r.json()),
        ]).then(([hotelsData, coordinatorsData, familyData]) => {
            setHotels(hotelsData);
            setCoordinators(coordinatorsData);

            setFormData({
                familyName: familyData.name,
                relationship: familyData.relationship,
                hotelId: familyData.hotelId || "",
                coordinatorId: familyData.coordinatorId || "",
                arrivalDate: familyData.arrivalDate ? new Date(familyData.arrivalDate).toISOString().split('T')[0] : "",
                arrivalMode: familyData.arrivalMode || "",
                arrivalDetails: familyData.arrivalDetails || "",
                departureDate: familyData.departureDate ? new Date(familyData.departureDate).toISOString().split('T')[0] : "",
                departureMode: familyData.departureMode || "",
                departureDetails: familyData.departureDetails || "",
                foodBeforeSunset: familyData.foodBeforeSunset,
                foodRestrictions: familyData.foodRestrictions || "",
                roomRequirements: familyData.roomRequirements || "",
                transportNeeds: familyData.transportNeeds || "",
                specialNotes: familyData.specialNotes || "",
            });

            setMembers(familyData.members.map((m: Member) => ({ id: m.id, name: m.name, phone: m.phone })));
            setLoading(false);
        });
    }, [familyId]);

    const addMember = () => setMembers([...members, { name: "", phone: "" }]);
    const removeMember = (index: number) => { if (members.length > 1) setMembers(members.filter((_, i) => i !== index)); };
    const updateMember = (index: number, field: keyof Member, value: string) => {
        const updated = [...members];
        updated[index] = { ...updated[index], [field]: value };
        setMembers(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const res = await fetch(`/api/families/${familyId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, members: members.filter(m => m.name && m.phone) }),
        });

        if (res.ok) router.push("/admin/guests");
        else { alert("Failed to save"); setSaving(false); }
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
                    <Link href="/admin/guests" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>← Back</Link>
                    <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", marginTop: "0.5rem" }}>
                        Edit: {formData.familyName}
                    </h1>
                </div>
            </div>

            <div className="container" style={{ marginTop: "1.5rem", paddingBottom: "2rem", maxWidth: "600px" }}>
                <form onSubmit={handleSubmit}>
                    {/* Family Info */}
                    <div className="card" style={{ marginBottom: "1rem" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#B76E79" }}>Family Information</h2>
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Family Name *</label>
                            <input type="text" value={formData.familyName} onChange={(e) => setFormData({ ...formData, familyName: e.target.value })} required />
                        </div>
                        <div>
                            <label>Relationship *</label>
                            <select value={formData.relationship} onChange={(e) => setFormData({ ...formData, relationship: e.target.value })} required>
                                <option value="">Select</option>
                                <option value="Friend">Friend</option>
                                <option value="Cousin">Cousin</option>
                                <option value="Uncle/Aunt">Uncle/Aunt</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Grandparent">Grandparent</option>
                                <option value="In-law">In-law</option>
                                <option value="Colleague">Colleague</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Members */}
                    <div className="card" style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#B76E79" }}>Family Members</h2>
                            <button type="button" onClick={addMember} className="btn btn-secondary" style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem" }}>+ Add</button>
                        </div>
                        {members.map((member, index) => (
                            <div key={index} style={{ padding: "1rem", background: "#F9FAFB", borderRadius: "0.5rem", marginBottom: "0.75rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                    <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Member {index + 1}</span>
                                    {members.length > 1 && (
                                        <button type="button" onClick={() => removeMember(index)} style={{ color: "#EF4444", fontSize: "0.75rem", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                                    )}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                    <input type="text" placeholder="Name" value={member.name} onChange={(e) => updateMember(index, "name", e.target.value)} required />
                                    <input type="tel" placeholder="Phone" value={member.phone} onChange={(e) => updateMember(index, "phone", e.target.value)} required />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Accommodation */}
                    <div className="card" style={{ marginBottom: "1rem" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#B76E79" }}>Accommodation</h2>
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Hotel</label>
                            <select value={formData.hotelId} onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}>
                                <option value="">Select hotel</option>
                                {hotels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Coordinator</label>
                            <select value={formData.coordinatorId} onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value })}>
                                <option value="">Select coordinator</option>
                                {coordinators.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Travel */}
                    <div className="card" style={{ marginBottom: "1rem" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#B76E79" }}>Travel Information</h2>
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Arrival Date</label>
                            <input type="date" value={formData.arrivalDate} onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.5rem", marginBottom: "1rem" }}>
                            <div>
                                <label>Mode</label>
                                <select value={formData.arrivalMode} onChange={(e) => setFormData({ ...formData, arrivalMode: e.target.value })}>
                                    <option value="">Select</option>
                                    <option value="FLIGHT">Flight</option>
                                    <option value="TRAIN">Train</option>
                                    <option value="CAR">Car</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div>
                                <label>Details</label>
                                <input type="text" placeholder="Flight/Train number" value={formData.arrivalDetails} onChange={(e) => setFormData({ ...formData, arrivalDetails: e.target.value })} />
                            </div>
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Departure Date</label>
                            <input type="date" value={formData.departureDate} onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.5rem" }}>
                            <div>
                                <label>Mode</label>
                                <select value={formData.departureMode} onChange={(e) => setFormData({ ...formData, departureMode: e.target.value })}>
                                    <option value="">Select</option>
                                    <option value="FLIGHT">Flight</option>
                                    <option value="TRAIN">Train</option>
                                    <option value="CAR">Car</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div>
                                <label>Details</label>
                                <input type="text" placeholder="Flight/Train number" value={formData.departureDetails} onChange={(e) => setFormData({ ...formData, departureDetails: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* Special Requirements */}
                    <div className="card" style={{ marginBottom: "1rem" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#B76E79" }}>Special Requirements</h2>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", marginBottom: "1rem" }}>
                            <input type="checkbox" checked={formData.foodBeforeSunset} onChange={(e) => setFormData({ ...formData, foodBeforeSunset: e.target.checked })} style={{ width: "auto", minHeight: "auto" }} />
                            Food before sunset
                        </label>
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Food Restrictions</label>
                            <input type="text" value={formData.foodRestrictions} onChange={(e) => setFormData({ ...formData, foodRestrictions: e.target.value })} />
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Room Requirements</label>
                            <input type="text" value={formData.roomRequirements} onChange={(e) => setFormData({ ...formData, roomRequirements: e.target.value })} />
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <label>Transport Needs</label>
                            <input type="text" value={formData.transportNeeds} onChange={(e) => setFormData({ ...formData, transportNeeds: e.target.value })} />
                        </div>
                        <div>
                            <label>Notes</label>
                            <textarea value={formData.specialNotes} onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })} rows={2} />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: "100%" }}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
