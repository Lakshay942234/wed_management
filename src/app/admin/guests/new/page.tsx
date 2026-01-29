"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Hotel {
    id: string;
    name: string;
}

interface Coordinator {
    id: string;
    name: string;
    type: string;
}

interface Member {
    id?: string;
    name: string;
    phone: string;
    isNew?: boolean;
}

export default function NewGuestPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

    const [members, setMembers] = useState<Member[]>([
        { name: "", phone: "", isNew: true }
    ]);

    useEffect(() => {
        // Fetch hotels and coordinators
        Promise.all([
            fetch("/api/hotels").then(r => r.json()),
            fetch("/api/coordinators").then(r => r.json()),
        ]).then(([hotelsData, coordinatorsData]) => {
            setHotels(hotelsData);
            setCoordinators(coordinatorsData);
        });
    }, []);

    const addMember = () => {
        setMembers([...members, { name: "", phone: "", isNew: true }]);
    };

    const removeMember = (index: number) => {
        if (members.length > 1) {
            setMembers(members.filter((_, i) => i !== index));
        }
    };

    const updateMember = (index: number, field: keyof Member, value: string) => {
        const updated = [...members];
        updated[index] = { ...updated[index], [field]: value };
        setMembers(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/families", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    members: members.filter(m => m.name && m.phone),
                }),
            });

            if (res.ok) {
                router.push("/admin/guests");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create guest");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page" style={{ background: "var(--color-bg-primary)" }}>
            {/* Header */}
            <div style={{
                background: "linear-gradient(135deg, #B76E79 0%, #C4938B 100%)",
                padding: "1.5rem",
                color: "white"
            }}>
                <div className="container">
                    <Link href="/admin/guests" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>
                        ← Back to Guests
                    </Link>
                    <h1 style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: "1.5rem",
                        marginTop: "0.5rem"
                    }}>
                        Add New Guest/Family
                    </h1>
                </div>
            </div>

            <div className="container" style={{ marginTop: "1.5rem", paddingBottom: "2rem", maxWidth: "600px" }}>
                <form onSubmit={handleSubmit}>
                    {/* Family Info */}
                    <div className="card" style={{ marginBottom: "1rem" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#B76E79" }}>
                            Family Information
                        </h2>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Family Name *</label>
                            <input
                                type="text"
                                placeholder="e.g., Sharma Family"
                                value={formData.familyName}
                                onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Relationship *</label>
                            <select
                                value={formData.relationship}
                                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                                required
                            >
                                <option value="">Select relationship</option>
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
                            <h2 style={{ fontSize: "1rem", fontWeight: "600", color: "#B76E79" }}>
                                Family Members
                            </h2>
                            <button
                                type="button"
                                onClick={addMember}
                                className="btn btn-secondary"
                                style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem" }}
                            >
                                + Add Member
                            </button>
                        </div>

                        {members.map((member, index) => (
                            <div key={index} style={{
                                padding: "1rem",
                                background: "#F9FAFB",
                                borderRadius: "0.5rem",
                                marginBottom: "0.75rem"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                    <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>Member {index + 1}</span>
                                    {members.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMember(index)}
                                            style={{ color: "#EF4444", fontSize: "0.75rem", background: "none", border: "none", cursor: "pointer" }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={member.name}
                                        onChange={(e) => updateMember(index, "name", e.target.value)}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone"
                                        value={member.phone}
                                        onChange={(e) => updateMember(index, "phone", e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Hotel & Coordinator */}
                    <div className="card" style={{ marginBottom: "1rem" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#B76E79" }}>
                            Accommodation
                        </h2>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Hotel</label>
                            <select
                                value={formData.hotelId}
                                onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
                            >
                                <option value="">Select hotel</option>
                                {hotels.map((hotel) => (
                                    <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Assigned Coordinator</label>
                            <select
                                value={formData.coordinatorId}
                                onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value })}
                            >
                                <option value="">Select coordinator</option>
                                {coordinators.map((coord) => (
                                    <option key={coord.id} value={coord.id}>
                                        {coord.name} ({coord.type})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Travel Info */}
                    <div className="card" style={{ marginBottom: "1rem" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#B76E79" }}>
                            Travel Information
                        </h2>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Arrival Date</label>
                            <input
                                type="date"
                                value={formData.arrivalDate}
                                onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.5rem", marginBottom: "1rem" }}>
                            <div>
                                <label>Mode</label>
                                <select
                                    value={formData.arrivalMode}
                                    onChange={(e) => setFormData({ ...formData, arrivalMode: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    <option value="FLIGHT">Flight</option>
                                    <option value="TRAIN">Train</option>
                                    <option value="CAR">Car</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div>
                                <label>Details</label>
                                <input
                                    type="text"
                                    placeholder="Flight/Train number, time"
                                    value={formData.arrivalDetails}
                                    onChange={(e) => setFormData({ ...formData, arrivalDetails: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Departure Date</label>
                            <input
                                type="date"
                                value={formData.departureDate}
                                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0.5rem" }}>
                            <div>
                                <label>Mode</label>
                                <select
                                    value={formData.departureMode}
                                    onChange={(e) => setFormData({ ...formData, departureMode: e.target.value })}
                                >
                                    <option value="">Select</option>
                                    <option value="FLIGHT">Flight</option>
                                    <option value="TRAIN">Train</option>
                                    <option value="CAR">Car</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div>
                                <label>Details</label>
                                <input
                                    type="text"
                                    placeholder="Flight/Train number, time"
                                    value={formData.departureDetails}
                                    onChange={(e) => setFormData({ ...formData, departureDetails: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Special Requirements */}
                    <div className="card" style={{ marginBottom: "1rem" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#B76E79" }}>
                            Special Requirements
                        </h2>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={formData.foodBeforeSunset}
                                    onChange={(e) => setFormData({ ...formData, foodBeforeSunset: e.target.checked })}
                                    style={{ width: "auto", minHeight: "auto" }}
                                />
                                Food before sunset (Jain/Dietary)
                            </label>
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Food Restrictions</label>
                            <input
                                type="text"
                                placeholder="e.g., Vegetarian, No onion/garlic"
                                value={formData.foodRestrictions}
                                onChange={(e) => setFormData({ ...formData, foodRestrictions: e.target.value })}
                            />
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Room Requirements</label>
                            <input
                                type="text"
                                placeholder="e.g., Ground floor, Extra bed needed"
                                value={formData.roomRequirements}
                                onChange={(e) => setFormData({ ...formData, roomRequirements: e.target.value })}
                            />
                        </div>

                        <div style={{ marginBottom: "1rem" }}>
                            <label>Transport Needs</label>
                            <input
                                type="text"
                                placeholder="e.g., Wheelchair accessible"
                                value={formData.transportNeeds}
                                onChange={(e) => setFormData({ ...formData, transportNeeds: e.target.value })}
                            />
                        </div>

                        <div>
                            <label>Special Notes</label>
                            <textarea
                                placeholder="Any other notes..."
                                value={formData.specialNotes}
                                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                                rows={3}
                                style={{ resize: "vertical" }}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: "100%" }}
                    >
                        {loading ? "Saving..." : "Save Guest/Family"}
                    </button>
                </form>
            </div>
        </div>
    );
}
