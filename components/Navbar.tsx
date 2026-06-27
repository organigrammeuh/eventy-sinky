"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Events", href: "/events" },
    { label: "Sessions", href: "/sessions" },
    { label: "Speakers", href: "/speakers" },
    { label: "Rooms", href: "/rooms" },
    { label: "Favorites", href: "/favorites" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const sync = () =>
            setDark(document.documentElement.classList.contains("dark"));
        sync();
        const obs = new MutationObserver(sync);
        obs.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => obs.disconnect();
    }, []);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
            style={{
                padding: scrolled ? "20px 24px" : "0",
                transition: "padding 0.4s ease",
            }}
        >
            <nav
                className="pointer-events-auto w-full flex items-center justify-between"
                style={{
                    padding: scrolled ? "10px 20px" : "10px",
                    borderRadius: scrolled ? "45px" : "0px",
                    background: dark ? "color-mix(in oklab, var(--card) 92%, transparent)" : "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(16px)" ,
                    border: dark ? "0.5px solid var(--card-border)" : "0.5px solid rgba(83,74,183,0.15)",
                    boxShadow: scrolled
                        ? dark ? "0 4px 24px rgba(0,0,0,0.3)" : "0 4px 24px rgba(83,74,183,0.08)"
                        : "none",
                    transition: "all 0.45s cubic-bezier(.4,0,.2,1)",
                }}
            >
                <Link href="/" className="no-underline flex items-center gap-2">
          <span
              className="font-[family-name:var(--font-syne)] font-extrabold text-xl transition-colors duration-300"
              style={{ color: "var(--primary)" }}
          >
            EventSync
          </span>
                </Link>

                <div className="flex items-center gap-6">
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-normal no-underline transition-colors duration-300 hover:opacity-100"
                            style={{ color: "var(--muted-foreground)" }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <Link
                    href="/admin"
                    className="text-sm font-semibold px-5 py-2 rounded-full no-underline transition-all duration-300"
                    style={{
                        background: "var(--primary)",
                        color: "#fff",
                        border: "1px solid rgba(255,255,255,0.3)",
                    }}
                >
                    Admin
                </Link>
            </nav>
        </header>
    );
}