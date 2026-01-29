"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GuestLoginPage() {
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/guest-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phone.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed. Please try again.");
                setLoading(false);
                return;
            }

            // Redirect to guest dashboard
            router.push("/guest");
        } catch {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="page" style={{
            background: "linear-gradient(180deg, #FFFBF5 0%, #FFF8F0 100%)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem"
        }}>
            <div className="card" style={{
                width: "100%",
                maxWidth: "400px",
                padding: "2rem"
            }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>💍</div>
                    <h1 style={{
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontSize: "1.75rem",
                        color: "#B76E79",
                        marginBottom: "0.5rem"
                    }}>
                        Guest Login
                    </h1>
                    <p style={{ color: "#6B7280", fontSize: "0.875rem" }}>
                        Enter your phone number to access your details
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            style={{ fontSize: "1.125rem" }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            background: "#FEE2E2",
                            color: "#991B1B",
                            padding: "0.75rem 1rem",
                            borderRadius: "0.5rem",
                            marginBottom: "1rem",
                            fontSize: "0.875rem"
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: "100%", marginBottom: "1rem" }}
                    >
                        {loading ? (
                            <span className="spinner" style={{ width: "20px", height: "20px" }} />
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>

                {/* Back link */}
                <div style={{ textAlign: "center" }}>
                    <Link href="/" style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                        ← Back to Home
                    </Link>
                </div>
            </div>

            {/* Help text */}
            <p style={{
                marginTop: "1.5rem",
                fontSize: "0.75rem",
                color: "#9CA3AF",
                textAlign: "center",
                maxWidth: "300px"
            }}>
                Use the phone number you registered with. Contact your host if you have trouble logging in.
            </p>
        </div>
    );
}
