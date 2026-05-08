import Link from "next/link";

const stats = [
    { value: "12+", label: "Active events" },
    { value: "340", label: "Sessions" },
    { value: "2.4k", label: "Participants" },
];

export default function Hero() {
    return (
        <section style={{
            minHeight: "100svh",
            background: "linear-gradient(135deg, #26215C 0%,#861d9e  55%, #534AB7 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "120px 24px 80px",
            position: "relative",
            overflow: "hidden",
        }}>
            <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse 60% 50% at 70% 40%, rgba(29,158,117,0.18) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            <h1 style={{
                fontFamily: "var(--font-syne)",
                fontSize: "clamp(36px, 6vw, 60px)",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.1,
                maxWidth: "680px",
                marginBottom: "20px",
                position: "relative",
            }}>
                Welcome,{" "}
                <span style={{ color: "#afafef" }}>this is some event stuff</span>
            </h1>

            <p style={{
                fontSize: "17px", fontWeight: 300,
                color: "rgba(255,255,255,0.65)",
                maxWidth: "460px",
                lineHeight: 1.75,
                marginBottom: "40px",
                position: "relative",
            }}>
                Navigate sessions, ask questions in real time. Meet our speakers from les quatre coins du monde.
            </p>

            <div style={{
                display: "flex", gap: "30px", flexWrap: "wrap", justifyContent: "center",
                position: "relative",
            }}>
                <Link href="/events" style={{
                    padding: "13px 28px",
                    background: "#e2e5f4", color: "#3C3489",
                    borderRadius: "50px",
                    fontWeight: 500, fontSize: "15px",
                    textDecoration: "none",
                    transition: "all 0.25s",
                }}>
                    Browse events
                </Link>
                <Link href="/admin" style={{
                    padding: "13px 28px",
                    background: "rgba(255,255,255,0.1)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: "50px",
                    fontWeight: 500, fontSize: "15px",
                    textDecoration: "none",
                    transition: "all 0.25s",
                }}>
                    Admin dashboard
                </Link>
            </div>
        </section>
    );
}
