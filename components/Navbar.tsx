"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
                style={{ padding: scrolled ? "20px 24px" : "0px 0px", transition: "padding 0.4s ease" }}
        >
            <nav
                className="pointer-events-auto w-full"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: scrolled ? "14px 20px" : "20px 20px",
                    borderRadius: scrolled ? "45px" : "10px",
                    background: scrolled ? "rgba(255,255,255,0.88)" : "transparent",
                    backdropFilter: scrolled ? "blur(16px)" : "none",
                    border: scrolled ? "0.5px solid rgba(83,74,183,0.15)" : "none",
                    boxShadow: scrolled ? "0 4px 24px rgba(83,74,183,0.08)" : "none",
                    transition: "all 0.45s cubic-bezier(.4,0,.2,1)",
                }}
            >
                <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                        fontFamily: "var(--font-syne)",
                        fontWeight: 800, fontSize: "20px",
                        color: scrolled ? "#3C3489" : "#ffffff",
                        transition: "color 0.4s",
                    }}>
            EventSync
          </span>
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                    {["Home", "Events", "Speakers", "Sessions", "Rooms"].map((item) => (
                        <Link
                            key={item}
                            href={`/${item.toLowerCase()}`}
                            style={{
                                fontSize: "16px",
                                fontWeight: 400,
                                color: scrolled ? "#6b6b8a" : "rgba(255,255,255,0.85)",
                                textDecoration: "none",
                                transition: "color 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                (e.target as HTMLElement).style.color = scrolled ? "#534AB7" : "#ffffff";
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.color = scrolled ? "#6b6b8a" : "rgba(255,255,255,0.85)";
                            }}
                        >
                            {item}
                        </Link>
                    ))}
                </div>
                <div>
                    <Link
                        href="/admin"
                        style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            padding: "8px 20px",
                            borderRadius: "50px",
                            textDecoration: "none",
                            background: scrolled ? "#534AB7" : "rgba(255,255,255,0.15)",
                            color: "#ffffff",
                            border: scrolled ? "none" : "1px solid rgba(255,255,255,0.3)",
                            transition: "all 0.3s",
                        }}
                    >
                        Admin
                    </Link>
                </div>
            </nav>
        </header>
    );
}
