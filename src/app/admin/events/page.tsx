"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Event {
    id: string;
    name: string;
    date: string;
    startTime: string;
    endTime?: string;
    venue: string;
    notes?: string;
    order: number;
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "", date: "", startTime: "", endTime: "", venue: "", notes: "", order: 0
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const res = await fetch("/api/events");
        if (res.ok) setEvents(await res.json());
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editId ? `/api/events/${editId}` : "/api/events";
        const method = editId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            fetchEvents();
            setShowForm(false);
            setEditId(null);
            setFormData({ name: "", date: "", startTime: "", endTime: "", venue: "", notes: "", order: 0 });
        }
    };

    const startEdit = (event: Event) => {
        setFormData({
            name: event.name,
            date: new Date(event.date).toISOString().split('T')[0],
            startTime: event.startTime,
            endTime: event.endTime || "",
            venue: event.venue,
            notes: event.notes || "",
            order: event.order
        });
        setEditId(event.id);
        setShowForm(true);
    };

    const deleteEvent = async (id: string) => {
        if (!confirm("Delete this event?")) return;
        const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
        if (res.ok) fetchEvents();
    };

    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
        const dateKey = new Date(event.date).toISOString().split("T")[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(event);
        return acc;
    }, {} as Record<string, Event[]>);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
        });
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
                                📅 Event Schedule
                            </h1>
                        </div>
                        <button onClick={() => { setShowForm(true); setEditId(null); setFormData({ name: "", date: "2026-04-13", startTime: "", endTime: "", venue: "", notes: "", order: 0 }); }}
                            className="btn" style={{ background: "white", color: "#B76E79" }}>+ Add Event</button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: "1.5rem", paddingBottom: "2rem", maxWidth: "800px" }}>
                {showForm && (
                    <div className="card" style={{ marginBottom: "1.5rem" }}>
                        <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", color: "#B76E79" }}>
                            {editId ? "Edit Event" : "Add New Event"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Event Name *</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Sangeet Ceremony" required />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
                                <div>
                                    <label>Date *</label>
                                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                                </div>
                                <div>
                                    <label>Start Time *</label>
                                    <input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required />
                                </div>
                                <div>
                                    <label>End Time</label>
                                    <input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ marginBottom: "1rem" }}>
                                <label>Venue *</label>
                                <input type="text" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                    placeholder="e.g., Grand Ballroom, Hotel XYZ" required />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
                                <div>
                                    <label>Notes</label>
                                    <input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="e.g., Dress code: Traditional" />
                                </div>
                                <div>
                                    <label>Order</label>
                                    <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button type="submit" className="btn btn-primary">Save</button>
                                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="btn btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {events.length === 0 ? (
                    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
                        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
                        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No Events Yet</h2>
                        <p style={{ color: "#6B7280" }}>Add your wedding schedule.</p>
                    </div>
                ) : (
                    Object.entries(eventsByDate).map(([dateKey, dayEvents]) => (
                        <div key={dateKey} style={{ marginBottom: "1.5rem" }}>
                            <h2 style={{
                                fontSize: "1rem",
                                fontWeight: "600",
                                color: "#B76E79",
                                marginBottom: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem"
                            }}>
                                <span style={{
                                    background: "linear-gradient(135deg, #B76E79 0%, #C4938B 100%)",
                                    color: "white",
                                    padding: "0.25rem 0.75rem",
                                    borderRadius: "999px",
                                    fontSize: "0.875rem"
                                }}>
                                    {formatDate(dateKey)}
                                </span>
                            </h2>
                            <div className="card">
                                {dayEvents.map((event, index) => (
                                    <div key={event.id} style={{
                                        padding: "0.75rem 0",
                                        borderBottom: index < dayEvents.length - 1 ? "1px solid #F3F4F6" : "none"
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div style={{ display: "flex", gap: "1rem" }}>
                                                <div style={{ minWidth: "60px", fontWeight: "600", color: "#B76E79" }}>
                                                    {event.startTime}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: "600" }}>{event.name}</div>
                                                    <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>📍 {event.venue}</div>
                                                    {event.notes && <div style={{ fontSize: "0.8rem", color: "#9CA3AF", fontStyle: "italic" }}>{event.notes}</div>}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: "0.25rem" }}>
                                                <button onClick={() => startEdit(event)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}>✏️</button>
                                                <button onClick={() => deleteEvent(event.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}>🗑️</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
