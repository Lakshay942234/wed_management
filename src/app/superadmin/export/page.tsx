"use client";

import { useState } from "react";
import Link from "next/link";

export default function ExportDataPage() {
    const [exporting, setExporting] = useState<string | null>(null);

    const exportData = async (type: string) => {
        setExporting(type);
        try {
            const res = await fetch(`/api/export?type=${type}`);
            if (!res.ok) throw new Error("Export failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `wedding-${type}-${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            alert("Export failed. Please try again.");
        }
        setExporting(null);
    };

    return (
        <div className="page" style={{ background: "var(--color-bg-primary)" }}>
            <div style={{ background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)", padding: "1.5rem", color: "white" }}>
                <div className="container">
                    <Link href="/superadmin" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>← Back</Link>
                    <h1 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "1.5rem", marginTop: "0.5rem" }}>
                        📊 Export Data
                    </h1>
                </div>
            </div>

            <div className="container" style={{ marginTop: "1.5rem", paddingBottom: "2rem", maxWidth: "600px" }}>
                <div className="card" style={{ marginBottom: "1rem" }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>📋 Guest & Family Data</h2>
                    <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1rem" }}>
                        Export all guest information including family details, hotel assignments, travel info, and special requirements.
                    </p>
                    <button
                        onClick={() => exportData("guests")}
                        disabled={exporting !== null}
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                    >
                        {exporting === "guests" ? "Exporting..." : "Export Guests (CSV)"}
                    </button>
                </div>

                <div className="card" style={{ marginBottom: "1rem" }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>🏨 Hotels Data</h2>
                    <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1rem" }}>
                        Export hotel information with addresses and contact details.
                    </p>
                    <button
                        onClick={() => exportData("hotels")}
                        disabled={exporting !== null}
                        className="btn btn-secondary"
                        style={{ width: "100%" }}
                    >
                        {exporting === "hotels" ? "Exporting..." : "Export Hotels (CSV)"}
                    </button>
                </div>

                <div className="card" style={{ marginBottom: "1rem" }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>📅 Event Schedule</h2>
                    <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1rem" }}>
                        Export the wedding event schedule with dates, times, and venues.
                    </p>
                    <button
                        onClick={() => exportData("events")}
                        disabled={exporting !== null}
                        className="btn btn-secondary"
                        style={{ width: "100%" }}
                    >
                        {exporting === "events" ? "Exporting..." : "Export Events (CSV)"}
                    </button>
                </div>

                <div className="card" style={{ marginBottom: "1rem" }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>📞 Coordinators</h2>
                    <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1rem" }}>
                        Export coordinator contacts and assignments.
                    </p>
                    <button
                        onClick={() => exportData("coordinators")}
                        disabled={exporting !== null}
                        className="btn btn-secondary"
                        style={{ width: "100%" }}
                    >
                        {exporting === "coordinators" ? "Exporting..." : "Export Coordinators (CSV)"}
                    </button>
                </div>

                <div className="card" style={{ background: "#FEF3C7" }}>
                    <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>⚠️ Data Privacy</h2>
                    <p style={{ fontSize: "0.875rem", color: "#92400E" }}>
                        Exported files contain personal information. Handle with care and delete after use.
                    </p>
                </div>
            </div>
        </div>
    );
}
