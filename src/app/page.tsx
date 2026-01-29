import Link from "next/link";

export default function HomePage() {
    return (
        <div className="page" style={{
            background: "linear-gradient(180deg, #FFFBF5 0%, #FFF8F0 50%, #F8E8E8 100%)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center"
        }}>
            {/* Decorative element */}
            <div style={{
                fontSize: "3rem",
                marginBottom: "1rem"
            }}>
                💍
            </div>

            {/* Wedding title */}
            <h1 style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "2.5rem",
                background: "linear-gradient(135deg, #B76E79 0%, #C4938B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.5rem"
            }}>
                Wedding Celebration
            </h1>

            {/* Date */}
            <p style={{
                fontSize: "1.25rem",
                color: "#6B7280",
                marginBottom: "2rem"
            }}>
                13 - 15 April 2026
            </p>

            {/* Welcome message */}
            <p style={{
                maxWidth: "400px",
                color: "#6B7280",
                marginBottom: "3rem",
                lineHeight: "1.6"
            }}>
                Welcome to our wedding guest portal. Login to view your accommodation details,
                event schedule, and travel information.
            </p>

            {/* Login button */}
            <Link
                href="/login"
                className="btn btn-primary"
                style={{
                    padding: "1rem 3rem",
                    fontSize: "1.125rem",
                    marginBottom: "1rem"
                }}
            >
                Guest Login
            </Link>

            {/* Admin link */}
            <Link
                href="/admin/login"
                style={{
                    fontSize: "0.875rem",
                    color: "#9CA3AF"
                }}
            >
                Administrator Access
            </Link>

            {/* Decorative footer */}
            <div style={{
                position: "absolute",
                bottom: "2rem",
                fontSize: "0.75rem",
                color: "#9CA3AF"
            }}>
                Made with ❤️ for our special day
            </div>
        </div>
    );
}
