"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";

export default function Hero() {
    const { theme } = useTheme();
    const dark = theme === "dark";

    return (
        <section style={{
            minHeight: "100svh",
            background: dark ? "#000000" : "#edeaf0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "50px 24px 0",
            position: "relative",
            overflow: "hidden",
            transition: "background 0.4s ease",
        }}>
            <h1 style={{
                fontFamily: "var(--font-syne)",
                fontSize: "65px",
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: "24px",
                position: "relative", zIndex: 2,
            }}>
        <span style={{
            background: "linear-gradient(90deg, #d946ef, #8b5cf6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
        }}>
          Welcome to your app
        </span>
                <br />
                <span style={{ color: dark ? "white" : "#1a1a2e" }}>
          Event-Sync
        </span>
            </h1>

            <p style={{
                fontSize: "16px", fontWeight: 400,
                color: dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.55)",
                maxWidth: "500px",
                lineHeight: 1.75,
                marginBottom: "44px",
                position: "relative", zIndex: 2,
                transition: "color 0.3s",
            }}>
                Navigate sessions, ask questions in real time.<br />
                Meet our speakers from around the world.
            </p>

            <div style={{
                display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center",
                position: "relative", zIndex: 2, marginBottom: "80px",
            }}>
                <Link href="/events" style={{
                    padding: "12px 28px",
                    backdropFilter:"blur(1px)",
                    background: dark ? "black" : "",
                    color: dark ? "rgba(247,210,253,0.96)" : "rgba(59,14,67,0.96)",
                    border: `2px solid ${dark ? "rgba(209,0,255,0.96)" : "rgba(65,40,73,0.96)"}`,
                    borderRadius: "50px",
                    fontWeight: 500, fontSize: "15px",
                    textDecoration: "none",
                    transition: "all 0.25s",
                }}
                >
                    View events
                </Link>
                <Link href="/events/mock/sessions" style={{
                    padding: "12px 28px",
                    background: dark ? "#000000": "rgba(0,0,0,0.5)",
                    color: dark ? "white" : "#ffffff",
                    border: `2px solid ${dark ? "rgba(255,255,255,0.35)" : "rgba(220,192,228,0.25)"}`,
                    borderRadius: "50px",
                    fontWeight: 500, fontSize: "15px",
                    textDecoration: "none",
                    transition: "all 0.25s",
                }}
                      onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = dark ?"#06b6d4" : "#590095";
                          el.style.color = dark ?"#06b6d4" : "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.borderColor = dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)";
                          el.style.color = dark ? "white" : "";
                      }}
                >
                    Full schedules
                </Link>
            </div>

            {/* Looper BG image */}
            <div style={{
                position: "absolute",
                bottom: 0, left: 1, right: 0, top : 50,
                height: "100%",
                zIndex: 1,
                opacity: dark ? 1 : 0.9,
                transition: "opacity 0.4s ease",
                mixBlendMode: dark ? "normal" : "multiply",
            }}>
                <Image
                    src="/Looper BG.png"
                    alt=""
                    fill
                    style={{ objectFit: "cover", objectPosition: "bottom center" }}
                    priority
                />
            </div>
        </section>
    );
}